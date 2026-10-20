'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { playSound, unlockSounds } from '@/lib/sound'
import {
  AFTER_CALL_BANNER_MESSAGES,
  AFTER_CALL_ROOM_MESSAGES,
} from './events'
import {
  kakaoRooms,
  type KakaoMessage,
  type KakaoRoom,
  type KakaoRoomId,
} from './kakao'
import { toTime } from './time'

export type AppId =
  | 'kakao'
  | 'messages'
  | 'phone'
  | 'photos'
  | 'settings'
  | 'safari'
  | 'anyai'
  | 'notes'
  | 'camera'
  | 'voicememos'
  | 'calendar'
  | 'clock'

export type Screen =
  | { kind: 'lock' }
  | { kind: 'passcode' }
  | { kind: 'home' }
  | { kind: 'app'; app: AppId }

type StoryProgress = {
  yhCallEnded: boolean
  addedMessages: KakaoMessage[]
  readMessageIds: string[]
  readRooms: KakaoRoomId[]
  cameraUsed: boolean
}

const BANNER_GAP_MS = 1800
const ROOM_GAP_MS = 1500

export type Banner = {
  key: string
  roomId: KakaoRoomId
  sender: string
  lines: string[]
  time: string
}

const STORAGE_KEY = 'wonpil-phone-story-v1'

const INITIAL: StoryProgress = {
  yhCallEnded: false,
  addedMessages: [],
  readMessageIds: [],
  readRooms: [],
  cameraUsed: false,
}

function loadProgress(): StoryProgress {
  if (typeof window === 'undefined') return INITIAL

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL

    const parsed = JSON.parse(raw) as Partial<StoryProgress>

    if (
      !Array.isArray(parsed.addedMessages) ||
      !Array.isArray(parsed.readMessageIds)
    ) {
      return INITIAL
    }

    return {
      ...INITIAL,
      ...parsed,
      readRooms: Array.isArray(parsed.readRooms)
        ? parsed.readRooms
        : [],
    }
  } catch {
    return INITIAL
  }
}

export function sortMessages(messages: KakaoMessage[]) {
  return [...messages].sort(
    (a, b) => toTime(a.at) - toTime(b.at) || a.seq - b.seq,
  )
}

type StoryContext = {
  screen: Screen
  unlock: () => void
  openPasscode: () => void
  lock: () => void
  goHome: () => void
  openApp: (app: AppId) => void
  kakaoRoomId: KakaoRoomId | null
  openKakaoRoom: (id: KakaoRoomId) => void
  closeKakaoRoom: () => void
  rooms: KakaoRoom[]
  unreadByRoom: Partial<Record<KakaoRoomId, number>>
  totalUnread: number
  markRoomRead: (id: KakaoRoomId) => void
  onYhRoomShown: () => void
  clock: string
  yhCallEnded: boolean
  endYhCall: () => void
  banner: Banner | null
  dismissBanner: () => void
  openBanner: (banner: Banner) => void
  showCustomBanner: (banner: Banner) => void
  resetStory: () => void
  cameraUsed: boolean
  markCameraUsed: () => void
}

const Ctx = createContext<StoryContext | null>(null)

export function StoryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [screen, setScreen] = useState<Screen>({ kind: 'lock' })
  const [kakaoRoomId, setKakaoRoomId] =
    useState<KakaoRoomId | null>(null)
  const [progress, setProgress] =
    useState<StoryProgress>(loadProgress)
  const [banner, setBanner] = useState<Banner | null>(null)

  const progressRef = useRef(progress)
  progressRef.current = progress

  const timers = useRef<number[]>([])
  const viewRef = useRef({ screen, kakaoRoomId })
  viewRef.current = { screen, kakaoRoomId }

  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(progress),
      )
    } catch {
      // Progress remains in memory if storage is unavailable.
    }
  }, [progress])

  useEffect(() => {
    window.addEventListener('pointerdown', unlockSounds, {
      once: true,
    })
    window.addEventListener('keydown', unlockSounds, {
      once: true,
    })

    return () => {
      window.removeEventListener('pointerdown', unlockSounds)
      window.removeEventListener('keydown', unlockSounds)
    }
  }, [])

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) =>
        window.clearTimeout(timer),
      )
    }
  }, [])

  const deliverSequentially = useCallback(
    (
      messages: KakaoMessage[],
      gapMs: number,
      firstDelayMs: number,
    ) => {
      const pending = messages.filter(
        (message) =>
          !progressRef.current.addedMessages.some(
            (existing) => existing.id === message.id,
          ),
      )

      pending.forEach((message, index) => {
        timers.current.push(
          window.setTimeout(() => {
            const current = progressRef.current

            if (
              current.addedMessages.some(
                (existing) => existing.id === message.id,
              )
            ) {
              return
            }

            const next = {
              ...current,
              addedMessages: [
                ...current.addedMessages,
                message,
              ],
            }

            progressRef.current = next
            setProgress(next)
            playSound('kakao')

            const {
              screen: currentScreen,
              kakaoRoomId: openRoom,
            } = viewRef.current

            const viewingRoom =
              currentScreen.kind === 'app' &&
              currentScreen.app === 'kakao' &&
              openRoom === message.roomId

            if (
              !viewingRoom &&
              message.content.type === 'text'
            ) {
              setBanner({
                key: message.id,
                roomId: message.roomId,
                sender: 'New Message',
                lines: [message.content.text],
                time: '18:58',
              })
            }
          }, firstDelayMs + index * gapMs),
        )
      })
    },
    [],
  )

  const endYhCall = useCallback(() => {
    if (progressRef.current.yhCallEnded) return

    const next = {
      ...progressRef.current,
      yhCallEnded: true,
    }

    progressRef.current = next
    setProgress(next)

    deliverSequentially(
      AFTER_CALL_BANNER_MESSAGES,
      BANNER_GAP_MS,
      1000,
    )
  }, [deliverSequentially])

  useEffect(() => {
    const current = progressRef.current
    if (!current.yhCallEnded) return

    deliverSequentially(
      AFTER_CALL_BANNER_MESSAGES,
      BANNER_GAP_MS,
      1500,
    )

    const roomBatchStarted =
      AFTER_CALL_ROOM_MESSAGES.some((message) =>
        current.addedMessages.some(
          (existing) => existing.id === message.id,
        ),
      )

    if (roomBatchStarted) {
      deliverSequentially(
        AFTER_CALL_ROOM_MESSAGES,
        ROOM_GAP_MS,
        1500,
      )
    }
  }, [
    deliverSequentially,
    progress.yhCallEnded,
    progress.addedMessages,
  ])

  const onYhRoomShown = useCallback(() => {
    const current = progressRef.current

    const bannerBatchDone =
      AFTER_CALL_BANNER_MESSAGES.every((message) =>
        current.addedMessages.some(
          (existing) => existing.id === message.id,
        ),
      )

    const roomBatchStarted =
      AFTER_CALL_ROOM_MESSAGES.some((message) =>
        current.addedMessages.some(
          (existing) => existing.id === message.id,
        ),
      )

    if (
      current.yhCallEnded &&
      bannerBatchDone &&
      !roomBatchStarted
    ) {
      deliverSequentially(
        AFTER_CALL_ROOM_MESSAGES,
        ROOM_GAP_MS,
        1500,
      )
    }
  }, [deliverSequentially])

  const markRoomRead = useCallback(
    (id: KakaoRoomId) => {
      const current = progressRef.current

      const unreadIds = current.addedMessages
        .filter(
          (message) =>
            message.roomId === id &&
            !current.readMessageIds.includes(message.id),
        )
        .map((message) => message.id)

      const staticUnread =
        Boolean(
          kakaoRooms.find((room) => room.id === id)
            ?.initialUnread,
        ) && !current.readRooms.includes(id)

      if (unreadIds.length === 0 && !staticUnread) return

      const next = {
        ...current,
        readMessageIds: [
          ...current.readMessageIds,
          ...unreadIds,
        ],
        readRooms: staticUnread
          ? [...current.readRooms, id]
          : current.readRooms,
      }

      progressRef.current = next
      setProgress(next)
    },
    [],
  )

  const rooms = useMemo(() => {
    return kakaoRooms
      .map((room) => ({
        ...room,
        messages: sortMessages([
          ...room.messages,
          ...progress.addedMessages.filter(
            (message) => message.roomId === room.id,
          ),
        ]),
      }))
      .sort((a, b) => {
        const lastA = a.messages[a.messages.length - 1]
        const lastB = b.messages[b.messages.length - 1]

        if (!lastA) return 1
        if (!lastB) return -1

        return (
          toTime(lastB.at) - toTime(lastA.at) ||
          lastB.seq - lastA.seq
        )
      })
  }, [progress.addedMessages])

  const unreadByRoom = useMemo(() => {
    const result: Partial<Record<KakaoRoomId, number>> = {}

    for (const room of kakaoRooms) {
      if (
        room.initialUnread &&
        !progress.readRooms.includes(room.id)
      ) {
        result[room.id] = room.initialUnread
      }
    }

    for (const message of progress.addedMessages) {
      if (
        !progress.readMessageIds.includes(message.id)
      ) {
        result[message.roomId] =
          (result[message.roomId] ?? 0) + 1
      }
    }

    return result
  }, [progress])

  const totalUnread = Object.values(unreadByRoom).reduce(
    (sum, count) => sum + (count ?? 0),
    0,
  )

  const showCustomBanner = useCallback((customBanner: Banner) => {
    setBanner(customBanner)
  }, [])

  const value: StoryContext = {
    screen,
    unlock: () => {
      setScreen({ kind: 'home' })

      // Memicu banner sapaan pagi tepat 1 kali saat pertama kali unlock ke Home
      try {
        if (!window.sessionStorage.getItem('morning_greeting_triggered')) {
          window.sessionStorage.setItem('morning_greeting_triggered', 'true')
          window.setTimeout(() => {
            setBanner({
              key: 'morning-greeting-home',
              roomId: 'natasya',
              sender: 'Sysyyy',
              lines: ['Hiii Sysyyy, Good Morninggg'],
              time: 'Just now',
            })
          }, 600)
        }
      } catch {
        // Fallback jika sessionStorage bermasalah
      }
    },
    openPasscode: () => setScreen({ kind: 'passcode' }),
    lock: () => {
      setBanner(null)
      setKakaoRoomId(null)
      setScreen({ kind: 'lock' })
    },
    goHome: () => setScreen({ kind: 'home' }),
    openApp: (app) => setScreen({ kind: 'app', app }),
    kakaoRoomId,
    openKakaoRoom: (id) => {
      setKakaoRoomId(id)
      setScreen({ kind: 'app', app: 'kakao' })
    },
    closeKakaoRoom: () => setKakaoRoomId(null),
    rooms,
    unreadByRoom,
    totalUnread,
    markRoomRead,
    onYhRoomShown,
    clock: progress.yhCallEnded ? '18:58' : '18:57',
    yhCallEnded: progress.yhCallEnded,
    endYhCall,
    banner,
    dismissBanner: () => setBanner(null),
    openBanner: (currentBanner) => {
      setBanner(null)
      setKakaoRoomId(currentBanner.roomId)
      setScreen({ kind: 'app', app: 'kakao' })
    },
    showCustomBanner,
    resetStory: () => {
      timers.current.forEach((timer) =>
        window.clearTimeout(timer),
      )
      timers.current = []
      progressRef.current = INITIAL
      setProgress(INITIAL)
      setBanner(null)
      setKakaoRoomId(null)
      setScreen({ kind: 'lock' })
    },
    cameraUsed: progress.cameraUsed,
    markCameraUsed: () => {
      if (progressRef.current.cameraUsed) return

      const next = {
        ...progressRef.current,
        cameraUsed: true,
      }

      progressRef.current = next
      setProgress(next)
    },
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStory() {
  const context = useContext(Ctx)

  if (!context) {
    throw new Error(
      'useStory must be used within StoryProvider',
    )
  }

  return context
}