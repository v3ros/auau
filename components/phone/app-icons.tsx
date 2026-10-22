'use client'

import { Camera, MessageCircle, Phone, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export type IconKind =
  | 'kakao'
  | 'photos'
  | 'settings'
  | 'phone'
  | 'messages'
  | 'camera'
  | 'safari'
  | 'anyai'
  | 'calendar'
  | 'clock'
  | 'notes'
  | 'voicememos'
  | 'youtube'

// Style dasar Liquid Glass transparan dengan border kaca & backdrop blur
const base =
  'relative flex size-full items-center justify-center overflow-hidden rounded-[18px] bg-white/20 border border-white/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]'

// Lapisan kilau reflektif kaca di bagian atas
function GlassSheen() {
  return (
    <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none z-10" />
  )
}

const PETALS = [
  '#f7b500',
  '#f78a1d',
  '#ef4a56',
  '#d14b9f',
  '#8e5ad8',
  '#3f88f3',
  '#2fc2d0',
  '#5ccb4e',
]

export function AppGlyph({ kind }: { kind: IconKind }) {
  switch (kind) {
    case 'kakao':
      return (
        <span className={base}>
          <GlassSheen />
          <svg viewBox="0 0 100 100" className="size-[65%] z-0" aria-hidden>
            <path
              d="M50 22c-19.9 0-36 12.6-36 28.2 0 10 6.7 18.8 16.7 23.8l-3.4 12.6c-.3 1.1.9 2 1.9 1.4l14.9-9.9c1.9.2 3.9.3 5.9.3 19.9 0 36-12.6 36-28.2S69.9 22 50 22Z"
              fill="#ffffff"
            />
            <text
              x="50"
              y="56"
              textAnchor="middle"
              fontSize="15"
              fontWeight="900"
              fill="#1c1c1e"
              fontFamily="Arial, sans-serif"
            >
              TALK
            </text>
          </svg>
        </span>
      )
    case 'photos':
      return (
        <span className={base}>
          <GlassSheen />
          <span className="relative size-[72%] z-0">
            {PETALS.map((c, i) => (
              <span
                key={c}
                className="absolute left-1/2 top-1/2 h-[46%] w-[24%] rounded-full"
                style={{
                  backgroundColor: c,
                  opacity: 0.9,
                  transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                  transformOrigin: '50% 100%',
                }}
              />
            ))}
          </span>
        </span>
      )
    case 'settings':
      return (
        <span className={base}>
          <GlassSheen />
          <span className="flex size-[70%] items-center justify-center rounded-full bg-white/10 z-0">
            <Settings className="size-[85%] text-white" strokeWidth={1.5} />
          </span>
        </span>
      )
    case 'phone':
      return (
        <span className={base}>
          <GlassSheen />
          <Phone className="size-[48%] fill-white text-white z-0" strokeWidth={0} />
        </span>
      )
    case 'messages':
      return (
        <span className={base}>
          <GlassSheen />
          <MessageCircle className="size-[55%] fill-white text-white z-0" strokeWidth={0} />
        </span>
      )
    case 'camera':
      return (
        <span className={base}>
          <GlassSheen />
          <span className="relative flex h-[42%] w-[62%] items-center justify-center rounded-[16%] bg-white/30 border border-white/30 z-0">
            <span
              className="size-[52%] rounded-full border-[2px] border-white/80 bg-black/30"
              style={{ width: '42%', height: '64%' }}
            />
            <span className="absolute right-[12%] top-[16%] size-[10%] rounded-full bg-white" />
          </span>
          <Camera className="sr-only" aria-hidden />
        </span>
      )
    case 'safari':
      return (
        <span className={base}>
          <GlassSheen />
          <span
            className="relative size-[78%] rounded-full border border-white/40 z-0 shadow-sm"
            style={{
              background:
                'radial-gradient(circle at 50% 35%, rgba(26,214,253,0.85), rgba(29,98,240,0.85) 75%)',
            }}
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-[3%] h-[8%] w-[2%] -translate-x-1/2 rounded-full bg-white/90"
                style={{
                  transform: `translateX(-50%) rotate(${i * 15}deg)`,
                  transformOrigin: '50% 590%',
                }}
              />
            ))}
            <span className="absolute inset-0 rotate-45">
              <span className="absolute left-1/2 top-[14%] h-[36%] w-[12%] -translate-x-1/2 bg-[#ff3b30] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
              <span className="absolute bottom-[14%] left-1/2 h-[36%] w-[12%] -translate-x-1/2 bg-white [clip-path:polygon(0_0,100%_0,50%_100%)]" />
            </span>
          </span>
        </span>
      )
    case 'anyai':
      return (
        <span className={base}>
          <GlassSheen />
          <svg viewBox="0 0 48 48" className="size-[58%] z-0" aria-hidden>
            <path
              d="M24 4c1.6 9.6 5.4 14.4 16 16-10.6 1.6-14.4 6.4-16 16-1.6-9.6-5.4-14.4-16-16 10.6-1.6 14.4-6.4 16-16Z"
              fill="#ffffff"
            />
            <circle cx="38" cy="38" r="4" fill="#b9c3ff" />
          </svg>
        </span>
      )
    case 'notes':
      return (
        <span className={base}>
          <GlassSheen />
          <span className="flex h-[72%] w-[68%] flex-col rounded-[14%] bg-white/20 p-2 z-0 border border-white/20">
            <span className="h-[12%] w-full bg-white/50 rounded-sm mb-2" />
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className="mb-[14%] block h-[3%] w-full rounded-full bg-white/60"
              />
            ))}
          </span>
        </span>
      )
    case 'voicememos':
      return (
        <span className={base}>
          <GlassSheen />
          <span className="flex h-[44%] w-[70%] items-center justify-between z-0">
            {[22, 48, 72, 100, 64, 86, 40, 70, 30, 54, 18].map((h, i) => (
              <span
                key={i}
                className="w-[6%] rounded-full"
                style={{
                  height: `${h}%`,
                  backgroundColor: i < 5 ? '#ff3b30' : '#ffffff',
                }}
              />
            ))}
          </span>
        </span>
      )
    case 'youtube':
      return (
        <span className={base}>
          <GlassSheen />
          <svg viewBox="0 0 28 20" className="w-[62%] z-0 drop-shadow" aria-hidden>
            <path
              d="M27.4 3.1A3.5 3.5 0 0 0 24.9.6C22.7 0 14 0 14 0S5.3 0 3.1.6A3.5 3.5 0 0 0 .6 3.1C0 5.3 0 10 0 10s0 4.7.6 6.9a3.5 3.5 0 0 0 2.5 2.5C5.3 20 14 20 14 20s8.7 0 10.9-.6a3.5 3.5 0 0 0 2.5-2.5c.6-2.2.6-6.9.6-6.9s0-4.7-.6-6.9Z"
              fill="#ff0000"
            />
            <path d="M11.2 14.3 18.4 10l-7.2-4.3v8.6Z" fill="#fff" />
          </svg>
        </span>
      )
    case 'calendar':
      return (
        <span className={base}>
          <GlassSheen />
          <span className="flex flex-col items-center justify-center size-[72%] rounded-[18%] bg-white/20 border border-white/20 z-0">
            <span className="text-[11px] font-bold uppercase leading-none text-[#ff3b30]">
              Wed
            </span>
            <span className="text-[28px] font-light leading-none tracking-tight text-white mt-1">
              19
            </span>
          </span>
        </span>
      )
    case 'clock':
      return (
        <span className={base}>
          <GlassSheen />
          <span className="relative size-[76%] rounded-full bg-white/20 border border-white/30 z-0 flex items-center justify-center">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-[4%] h-[12%] w-[6%] -translate-x-1/2 rounded-full bg-white"
                style={{
                  transform: `translateX(-50%) rotate(${i * 30}deg)`,
                  transformOrigin: '50% 320%',
                }}
              />
            ))}
            <span
              className="absolute bottom-1/2 left-1/2 h-[28%] w-[6%] origin-bottom -translate-x-1/2 rounded-full bg-white"
              style={{ transform: 'translateX(-50%) rotate(-5deg)' }}
            />
            <span
              className="absolute bottom-1/2 left-1/2 h-[38%] w-[4%] origin-bottom -translate-x-1/2 rounded-full bg-white"
              style={{ transform: 'translateX(-50%) rotate(342deg)' }}
            />
            <span className="absolute left-1/2 top-1/2 size-[10%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff9500]" />
          </span>
        </span>
      )
  }
}