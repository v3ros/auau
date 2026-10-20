'use client'

import { useEffect, useRef, useState } from 'react'
import { useStory } from '@/lib/story/store'
import { AppGlyph } from './app-icons'

export function NotificationBanner() {
  const { banner, dismissBanner, openBanner, screen } = useStory()
  const [dragY, setDragY] = useState(0)
  const startY = useRef<number | null>(null)

  useEffect(() => {
    if (!banner) return
    setDragY(0)
    const t = window.setTimeout(dismissBanner, 5000)
    return () => window.clearTimeout(t)
  }, [banner?.key, dismissBanner])

  if (!banner || screen.kind === 'lock' || screen.kind === 'passcode') return null

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-50 px-2 pt-11">
      <div
        key={banner.key}
        role="button"
        tabIndex={0}
        aria-label={`${banner.sender}: ${banner.lines.join(' ')}. Tap to open`}
        className="animate-banner-in pointer-events-auto flex touch-none select-none gap-3 rounded-[22px] bg-white/80 p-3 text-black shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-2xl"
        style={{ transform: `translateY(${Math.min(0, dragY)}px)`, transition: startY.current === null ? 'transform 0.2s' : 'none' }}
        onPointerDown={(e) => {
          startY.current = e.clientY
          ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (startY.current !== null) setDragY(e.clientY - startY.current)
        }}
        onPointerUp={(e) => {
          const dy = startY.current === null ? 0 : e.clientY - startY.current
          startY.current = null
          if (dy < -30) dismissBanner()
          else if (Math.abs(dy) < 8) openBanner(banner)
          else setDragY(0)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openBanner(banner)
          }
        }}
      >
        <span className="size-9 shrink-0 flex items-center justify-center overflow-hidden rounded-[22%] bg-black">
          {/* Mengubah ikon menjadi logo X */}
          <svg
            viewBox="0 0 24 24"
            className="size-[72%] text-white"
            fill="currentColor"
            role="img"
            aria-label="X"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.967 6.817H1.681l7.73-8.835L1.255 2.25h6.826l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-[15px] font-semibold">{banner.sender}</p>
            {/* Mengubah teks bahasa korea '카카오톡' menjadi 'Messages' atau 'Chat' */}
            <p className="shrink-0 text-xs text-black/50">
              Messages · {banner.time}
            </p>
          </div>
          {banner.lines.map((line, i) => (
            <p key={i} className="text-[15px] leading-snug">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}