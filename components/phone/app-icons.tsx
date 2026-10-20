'use client'

import { Camera, MessageCircle, Phone, Settings } from 'lucide-react'

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

const base = 'relative flex size-full items-center justify-center overflow-hidden rounded-[23%]'

const PETALS = ['#f7b500', '#f78a1d', '#ef4a56', '#d14b9f', '#8e5ad8', '#3f88f3', '#2fc2d0', '#5ccb4e']

export function AppGlyph({ kind }: { kind: IconKind }) {
  switch (kind) {
    case 'kakao':
      return (
        <span className={base} style={{ backgroundColor: '#fee500' }}>
          <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
            <path
              d="M50 22c-19.9 0-36 12.6-36 28.2 0 10 6.7 18.8 16.7 23.8l-3.4 12.6c-.3 1.1.9 2 1.9 1.4l14.9-9.9c1.9.2 3.9.3 5.9.3 19.9 0 36-12.6 36-28.2S69.9 22 50 22Z"
              fill="#3a1d1d"
            />
            <text x="50" y="56" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fee500" fontFamily="Arial, sans-serif">
              TALK
            </text>
          </svg>
        </span>
      )
    case 'photos':
      return (
        <span className={`${base} bg-white`}>
          <span className="relative size-[78%]">
            {PETALS.map((c, i) => (
              <span
                key={c}
                className="absolute left-1/2 top-1/2 h-[46%] w-[24%] rounded-full mix-blend-multiply"
                style={{
                  backgroundColor: c,
                  opacity: 0.88,
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
        <span className={base} style={{ background: 'linear-gradient(#c9ccd2, #8a8f98)' }}>
          <span className="flex size-[80%] items-center justify-center rounded-full" style={{ background: 'radial-gradient(#5d6169 0 38%, #2f3237 39% 100%)' }}>
            <Settings className="size-[96%] text-[#d9dbdf]" strokeWidth={1.3} />
          </span>
        </span>
      )
    case 'phone':
      return (
        <span className={base} style={{ background: 'linear-gradient(#5ff777, #0abc3a)' }}>
          <Phone className="size-[50%] fill-white text-white" strokeWidth={0} />
        </span>
      )
    case 'messages':
      return (
        <span className={base} style={{ background: 'linear-gradient(#5ff777, #0abc3a)' }}>
          <MessageCircle className="size-[62%] fill-white text-white" strokeWidth={0} />
        </span>
      )
    case 'camera':
      return (
        <span className={base} style={{ background: 'linear-gradient(#e9eaed, #a7abb2)' }}>
          <span className="relative flex h-[44%] w-[64%] items-center justify-center rounded-[18%] bg-[#2b2c2f]">
            <span className="size-[52%] rounded-full border-[3px] border-[#55575c] bg-[#1b1c1f]" style={{ width: '42%', height: '64%' }} />
            <span className="absolute right-[10%] top-[16%] size-[10%] rounded-full bg-[#f5c242]" />
          </span>
          <Camera className="sr-only" aria-hidden />
        </span>
      )
    case 'safari':
      return (
        <span className={`${base} bg-white`}>
          <span
            className="relative size-[84%] rounded-full"
            style={{ background: 'radial-gradient(circle at 50% 35%, #1ad6fd, #1d62f0 75%)' }}
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-[3%] h-[8%] w-[2%] -translate-x-1/2 rounded-full bg-white/80"
                style={{ transform: `translateX(-50%) rotate(${i * 15}deg)`, transformOrigin: '50% 590%' }}
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
        <span className={base} style={{ background: 'linear-gradient(145deg, #2b2d33, #0d0e10)' }}>
          <svg viewBox="0 0 48 48" className="size-[62%]" aria-hidden>
            <defs>
              <linearGradient id="anyai-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="1" stopColor="#b9c3ff" />
              </linearGradient>
            </defs>
            <path
              d="M24 4c1.6 9.6 5.4 14.4 16 16-10.6 1.6-14.4 6.4-16 16-1.6-9.6-5.4-14.4-16-16 10.6-1.6 14.4-6.4 16-16Z"
              fill="url(#anyai-g)"
            />
            <circle cx="38" cy="38" r="4" fill="#b9c3ff" />
          </svg>
        </span>
      )
    case 'notes':
      return (
        <span className={base} style={{ background: 'linear-gradient(145deg, #0f172a, #020617)' }}>
          <span className="flex h-full w-full items-center justify-center">
            <span className="text-[17px] font-extrabold tracking-tight text-[#ffc107]" style={{ textShadow: '0 0 8px rgba(255, 193, 7, 0.6)' }}>
              MLBB
            </span>
          </span>
        </span>
      )
    case 'voicememos':
      return (
        <span className={`${base} bg-black`}>
          <span className="flex h-[46%] w-[74%] items-center justify-between">
            {[22, 48, 72, 100, 64, 86, 40, 70, 30, 54, 18].map((h, i) => (
              <span
                key={i}
                className="w-[5%] rounded-full"
                style={{ height: `${h}%`, backgroundColor: i < 5 ? '#ff3b30' : '#ffffff' }}
              />
            ))}
          </span>
        </span>
      )
    case 'youtube':
      return (
        <span className={`${base} bg-white`}>
          <svg viewBox="0 0 28 20" className="w-[66%]" aria-hidden>
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
        <span className={`${base} flex-col bg-white`}>
          <span className="mt-[8%] text-[10px] font-semibold uppercase leading-none text-[#ff3b30]">Wed</span>
          <span className="text-[30px] font-light leading-none tracking-tight text-black">19</span>
        </span>
      )
    case 'clock':
      return (
        <span className={`${base} bg-black`}>
          <span className="relative size-[86%] rounded-full bg-white">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="absolute left-1/2 top-[4%] h-[7%] w-[3%] rounded-full bg-black"
                style={{ transform: `translateX(-50%) rotate(${i * 30}deg)`, transformOrigin: '50% 657%' }}
              />
            ))}
            <span className="absolute bottom-1/2 left-1/2 h-[26%] w-[5%] origin-bottom -translate-x-1/2 rounded-full bg-black" style={{ transform: 'translateX(-50%) rotate(-5deg)' }} />
            <span className="absolute bottom-1/2 left-1/2 h-[38%] w-[4%] origin-bottom -translate-x-1/2 rounded-full bg-black" style={{ transform: 'translateX(-50%) rotate(342deg)' }} />
            <span className="absolute left-1/2 top-1/2 size-[8%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff9500]" />
          </span>
        </span>
      )
  }
}