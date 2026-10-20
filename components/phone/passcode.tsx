'use client'

import { withBasePath } from '@/lib/base-path'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useStory } from '@/lib/story/store'
import { HomeIndicator, StatusBar } from './chrome'

const PASSCODE = '0000'
const KEYS: { digit: string; letters: string }[] = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
]

export function Passcode() {
  const { unlock, lock } = useStory()
  const [code, setCode] = useState('')
  const [shake, setShake] = useState(false)

  const press = useCallback(
    (d: string) => {
      if (shake) return
      setCode((prev) => {
        if (prev.length >= 4) return prev
        const next = prev + d
        if (next.length === 4) {
          if (next === PASSCODE) {
            window.setTimeout(unlock, 150)
          } else {
            window.setTimeout(() => setShake(true), 120)
            window.setTimeout(() => {
              setShake(false)
              setCode('')
            }, 560)
          }
        }
        return next
      })
    },
    [shake, unlock],
  )

  const erase = useCallback(() => setCode((p) => p.slice(0, -1)), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) press(e.key)
      else if (e.key === 'Backspace') erase()
      else if (e.key === 'Escape') lock()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [press, erase, lock])

  return (
    <div
      className="absolute inset-0 flex flex-col bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${withBasePath('/images/wallpaper.jpg')})` }}
    >
      <div className="absolute inset-0 bg-black/45 backdrop-blur-xl" aria-hidden />
      <div className="relative flex h-full flex-col">
        <StatusBar tone="light" />
        <div className="flex flex-1 flex-col items-center justify-center gap-[clamp(12px,4dvh,40px)]">
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg">Enter Passcode</p>
            <div
              className={cn('flex gap-5', shake && 'animate-shake')}
              role="status"
              aria-label={`${code.length}자리 입력됨`}
            >
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn('size-3 rounded-full border border-white', i < code.length && 'bg-white')}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-6 gap-y-[clamp(8px,2dvh,16px)]">
            {KEYS.map((k) => (
              <KeyButton key={k.digit} digit={k.digit} letters={k.letters} onPress={press} />
            ))}
            <span />
            <KeyButton digit="0" letters="" onPress={press} />
            <span />
          </div>
        </div>
        <div className="flex justify-between px-10 pb-2 text-base">
          <button type="button" onClick={lock} className="px-2 py-1">
            Cancel
          </button>
          <button type="button" onClick={erase} disabled={code.length === 0} className="px-2 py-1 disabled:opacity-40">
            Delete
          </button>
        </div>
        <HomeIndicator tone="light" onActivate={lock} label="잠금화면으로" />
      </div>
    </div>
  )
}

function KeyButton({ digit, letters, onPress }: { digit: string; letters: string; onPress: (d: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onPress(digit)}
      className="flex size-[clamp(56px,9dvh,76px)] flex-col items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-colors active:bg-white/50"
    >
      <span className="text-[clamp(24px,4dvh,34px)] leading-none">{digit}</span>
      {letters && <span className="text-[9px] font-semibold tracking-[0.2em]">{letters}</span>}
    </button>
  )
}
