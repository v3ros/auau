'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { PhoneOff, Mic, MicOff, Grid3x3, Volume2, Plus, Video, UserRound } from 'lucide-react'
import { withBasePath } from '@/lib/base-path'
import { contacts, type ContactId } from '@/lib/story/contacts'
import { playSound, primeSound, stopSound } from '@/lib/sound'

type CallState = 'dialing' | 'connected'
type ActiveCall = { contactId: ContactId; state: CallState } | null

let active: ActiveCall = null
const listeners = new Set<() => void>()

function setActive(next: ActiveCall) {
  active = next
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// The dialing tone is ~8s; if it can't play or never reports "ended", still pick up.
const MAX_DIAL_MS = 10_000
let connectTimer: number | undefined

export function isOutgoingCallActive() {
  return active !== null
}

function hangUp() {
  window.clearTimeout(connectTimer)
  connectTimer = undefined
  stopSound('dialing')
  stopSound('yhOutgoing')
  setActive(null)
}

/** Must be called from a tap handler so mobile browsers allow the dialing tone to play. */
export function startOutgoingCall(contactId: ContactId) {
  window.clearTimeout(connectTimer)
  setActive({ contactId, state: 'dialing' })
  // Unlock the answer audio inside this tap; it starts later from a non-gesture callback.
  primeSound('yhOutgoing')

  const connect = () => {
    window.clearTimeout(connectTimer)
    connectTimer = undefined
    if (active?.contactId !== contactId || active.state !== 'dialing') return
    stopSound('dialing')
    setActive({ contactId, state: 'connected' })
    playSound('yhOutgoing')
  }

  playSound('dialing', { onEnded: connect })
  connectTimer = window.setTimeout(connect, MAX_DIAL_MS)
}

function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function OutgoingCall() {
  const call = useSyncExternalStore(subscribe, () => active, () => null)
  if (!call) return null
  return <OutgoingCallScreen key={call.contactId} contactId={call.contactId} state={call.state} />
}

function OutgoingCallScreen({ contactId, state }: { contactId: ContactId; state: CallState }) {
  const contact = contacts[contactId]
  const [seconds, setSeconds] = useState(0)
  const [muted, setMuted] = useState(false)
  const [speaker, setSpeaker] = useState(false)

  useEffect(() => {
    if (state !== 'connected') return
    const interval = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(interval)
  }, [state])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={state === 'dialing' ? `${contact.name}에게 전화 거는 중` : `${contact.name}와 통화 중`}
      className="animate-screen-in absolute inset-0 z-50 flex flex-col overflow-hidden bg-[#1c1c1e] text-white"
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-8 pb-4 pt-10">
        <img
          src={contact.photo || withBasePath('/placeholder.svg')}
          alt={`${contact.name} 프로필 사진`}
          className="h-24 w-24 shrink-0 rounded-full object-cover ring-2 ring-white/30"
        />
        <h2 className="mt-3 text-balance text-center text-[30px] font-normal tracking-tight">{contact.name}</h2>
        <p className="mt-1 text-[15px] text-white/70" aria-live="polite">
          {state === 'dialing' ? '전화 거는 중...' : formatDuration(seconds)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-8 px-10 pb-10">
        <div className="grid w-full grid-cols-3 gap-x-6 gap-y-5">
          <Control text="소리 끔" active={muted} onClick={() => setMuted((v) => !v)}>
            {muted ? <MicOff className="h-7 w-7" aria-hidden="true" /> : <Mic className="h-7 w-7" aria-hidden="true" />}
          </Control>
          <Control text="키패드">
            <Grid3x3 className="h-7 w-7" aria-hidden="true" />
          </Control>
          <Control text="스피커" active={speaker} onClick={() => setSpeaker((v) => !v)}>
            <Volume2 className="h-7 w-7" aria-hidden="true" />
          </Control>
          <Control text="통화 추가">
            <Plus className="h-7 w-7" aria-hidden="true" />
          </Control>
          <Control text="FaceTime">
            <Video className="h-7 w-7" aria-hidden="true" />
          </Control>
          <Control text="연락처">
            <UserRound className="h-7 w-7" aria-hidden="true" />
          </Control>
        </div>
        <button
          type="button"
          onClick={hangUp}
          aria-label="통화 종료"
          className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-[#ff3b30] shadow-lg active:opacity-80"
        >
          <PhoneOff className="h-8 w-8" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

function Control({
  text,
  active,
  onClick,
  children,
}: {
  text: string
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={onClick ? !!active : undefined} className="flex flex-col items-center gap-2">
      <span
        className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
          active ? 'bg-white text-black' : 'bg-white/20 text-white'
        }`}
      >
        {children}
      </span>
      <span className="text-[13px] text-white/90">{text}</span>
    </button>
  )
}
