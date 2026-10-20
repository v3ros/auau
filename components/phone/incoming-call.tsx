'use client'

import { withBasePath } from '@/lib/base-path'
import { useEffect, useState } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Grid3x3, Volume2, Plus, Video, UserRound } from 'lucide-react'
import { contacts } from '@/lib/story/contacts'
import { useStory } from '@/lib/story/store'
import { playSound, stopSound } from '@/lib/sound'
import { isOutgoingCallActive } from './outgoing-call'

const RING_DELAY_MS = 30_000

type CallState = 'idle' | 'ringing' | 'connected'

function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function IncomingCall() {
  return null
  const [state, setState] = useState<CallState>('idle')
  const [seconds, setSeconds] = useState(0)
  const [muted, setMuted] = useState(false)
  const [speaker, setSpeaker] = useState(false)
  const caller = contacts.natasya
  const { yhCallEnded, endYhCall } = useStory()

  useEffect(() => {
    if (yhCallEnded) return
    let timer = 0
    // Don't interrupt a call the user placed; ring once it has ended.
    const ring = () => {
      if (isOutgoingCallActive()) timer = window.setTimeout(ring, 1000)
      else setState('ringing')
    }
    timer = window.setTimeout(ring, RING_DELAY_MS)
    return () => window.clearTimeout(timer)
    // The call should ring only once per session, so a later yhCallEnded change must not reschedule it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (state !== 'ringing') return
    playSound('ringtone', { loop: true })
    return () => stopSound('ringtone')
  }, [state])

  useEffect(() => {
    if (state !== 'connected') return
    return () => stopSound('yhCall')
  }, [state])

  useEffect(() => {
    if (state !== 'ringing' || typeof navigator.vibrate !== 'function') return
    const buzz = () => navigator.vibrate([400, 200, 400, 1000])
    buzz()
    const interval = window.setInterval(buzz, 2000)
    return () => {
      window.clearInterval(interval)
      navigator.vibrate(0)
    }
  }, [state])

  useEffect(() => {
    if (state !== 'connected') return
    const interval = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(interval)
  }, [state])

  if (state === 'idle') return null

  const decline = () => {
    stopSound('ringtone')
    setState('idle')
  }

  const answer = () => {
    stopSound('ringtone')
    // Must start inside the tap handler so mobile browsers allow playback.
    playSound('yhCall')
    setState('connected')
  }

  const endCall = () => {
    stopSound('ringtone')
    stopSound('yhCall')
    setState('idle')
    endYhCall()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={state === 'ringing' ? `Incoming call from ${caller.name}` : `In call with ${caller.name}`}
      className="animate-screen-in absolute inset-0 z-50 flex flex-col overflow-hidden bg-[#1c1c1e] text-white"
    >

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-8 pb-4 pt-10">
        <p className="text-[15px] text-white/70">{state === 'ringing' ? 'Mobile' : formatDuration(seconds)}</p>
        <h2 className="mt-2 text-balance text-center text-[30px] font-normal tracking-tight">{caller.name}</h2>
        {state === 'ringing' && (
          <div className="animate-ring-buzz relative mt-10 flex h-32 w-32 shrink-0 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/15" />
            <img
              src={caller.photo || withBasePath('/placeholder.svg')}
              alt={`${caller.name} profile picture`}
              className="relative h-32 w-32 rounded-full object-cover ring-2 ring-white/30"
            />
          </div>
        )}
      </div>

      {state === 'ringing' ? (
        <div className="relative flex shrink-0 items-end justify-between px-14 pb-14">
          <CallButton label="Decline" onClick={decline} className="bg-[#ff3b30]">
            <PhoneOff className="h-8 w-8" aria-hidden="true" />
          </CallButton>
          <CallButton label="Accept" onClick={answer} className="animate-bounce bg-[#34c759]">
            <Phone className="h-8 w-8" aria-hidden="true" />
          </CallButton>
        </div>
      ) : (
        <div className="relative flex shrink-0 flex-col items-center gap-8 px-10 pb-10">
          <div className="grid w-full grid-cols-3 gap-x-6 gap-y-5">
            <Control text="Mute" active={muted} onClick={() => setMuted((v) => !v)}>
              {muted ? <MicOff className="h-7 w-7" aria-hidden="true" /> : <Mic className="h-7 w-7" aria-hidden="true" />}
            </Control>
            <Control text="Keypad">
              <Grid3x3 className="h-7 w-7" aria-hidden="true" />
            </Control>
            <Control text="Speaker" active={speaker} onClick={() => setSpeaker((v) => !v)}>
              <Volume2 className="h-7 w-7" aria-hidden="true" />
            </Control>
            <Control text="Add call">
              <Plus className="h-7 w-7" aria-hidden="true" />
            </Control>
            <Control text="FaceTime">
              <Video className="h-7 w-7" aria-hidden="true" />
            </Control>
            <Control text="Contacts">
              <UserRound className="h-7 w-7" aria-hidden="true" />
            </Control>
          </div>
          <CallButton label="End call" onClick={endCall} className="bg-[#ff3b30]" hideText>
            <PhoneOff className="h-8 w-8" aria-hidden="true" />
          </CallButton>
        </div>
      )}
    </div>
  )
}

function CallButton({
  label,
  onClick,
  className,
  hideText,
  children,
}: {
  label: string
  onClick: () => void
  className: string
  hideText?: boolean
  children: React.ReactNode
}) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="flex flex-col items-center gap-2">
      <span className={`flex h-[74px] w-[74px] items-center justify-center rounded-full shadow-lg active:opacity-80 ${className}`}>
        {children}
      </span>
      {!hideText && <span className="text-[14px] text-white/90">{label}</span>}
    </button>
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
        className={`flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
          active ? 'bg-white text-black' : 'bg-white/20 text-white'
        }`}
      >
        {children}
      </span>
      <span className="text-[13px] text-white/90">{text}</span>
    </button>
  )
}