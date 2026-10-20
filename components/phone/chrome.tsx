'use client'

import { cn } from '@/lib/utils'
import { useStory } from '@/lib/story/store'
import { useEffect, useState } from 'react'

function SignalBars() {
  return (
    <span className="flex h-[11px] items-end gap-[1.5px]" aria-hidden>
      {[4, 6, 8.5, 11].map((h) => (
        <span key={h} className="w-[3px] rounded-[1px] bg-current" style={{ height: h }} />
      ))}
    </span>
  )
}

function WifiGlyph() {
  return (
    <svg viewBox="0 0 16 12" className="h-[11px] w-[15px] fill-current" aria-hidden>
      <path d="M8 2.3c2.3 0 4.4.9 6 2.4l1.2-1.3A10.3 10.3 0 0 0 8 .5 10.3 10.3 0 0 0 .8 3.4L2 4.7a8.5 8.5 0 0 1 6-2.4Z" />
      <path d="M8 5.8c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.7 6.7 0 0 0 8 4a6.7 6.7 0 0 0-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3Z" />
      <path d="M8 9.3c.4 0 .8.1 1 .4L8 11.5 7 9.7c.3-.3.6-.4 1-.4Zm0-1.8c-.9 0-1.7.3-2.3.9L8 11.5l2.3-3.1A3.3 3.3 0 0 0 8 7.5Z" />
    </svg>
  )
}

/** Indikator Baterai iOS yang Lebih Akurat & Mirip Asli */
function BatteryGlyph({ percentage = 85 }: { percentage?: number }) {
  return (
    <div className="flex items-center gap-[4px]" aria-hidden>
      {/* Persentase Teks di Luar (Gaya iOS) */}
      <span className="text-[12px] font-semibold tracking-tight">{percentage}%</span>
      
      {/* Bodi Baterai */}
      <span className="flex items-center">
        <span className="relative flex h-[11.5px] w-[22px] rounded-[3.5px] border border-current p-[1.5px]">
          {/* Level Isi Baterai */}
          <span 
            className="h-full rounded-[1.5px] bg-current transition-all"
            style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }} 
          />
        </span>
        {/* Tip/Nipple Baterai Kanan */}
        <span className="h-[4px] w-[1.5px] rounded-r-[1px] bg-current opacity-60" />
      </span>
    </div>
  )
}

export function StatusBar({ tone = 'dark', className }: { tone?: 'dark' | 'light'; className?: string }) {
  const [realTimeClock, setRealTimeClock] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // Mengambil Jam WIB (Asia/Jakarta)
      const timeString = now.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace('.', ':')

      setRealTimeClock(timeString)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={cn(
        'relative flex h-[50px] shrink-0 items-center justify-between px-7 pt-1.5 text-[15px] font-semibold',
        tone === 'dark' ? 'text-black' : 'text-white',
        className,
      )}
    >
      {/* Jam Real-time Jakarta */}
      <span className="w-14 text-center tabular-nums tracking-tight font-bold">
        {realTimeClock || '16:41'}
      </span>

      {/* Dynamic Island / Notch */}
      <span
        className="absolute left-1/2 top-[11px] hidden h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-black sm:block"
        aria-hidden
      />

      {/* Ikon Sinyal, Wi-Fi & Baterai iOS */}
      <span className="flex items-center gap-[7px]" aria-label="Signal, Wi-Fi, Battery 85%">
        <SignalBars />
        <WifiGlyph />
        <BatteryGlyph percentage={12} />
      </span>
    </div>
  )
}

export function HomeIndicator({
  tone = 'dark',
  onActivate,
  label = 'Home',
  className,
}: {
  tone?: 'dark' | 'light'
  onActivate?: () => void
  label?: string
  className?: string
}) {
  const { goHome } = useStory()
  return (
    <button
      type="button"
      onClick={onActivate ?? goHome}
      aria-label={label}
      className={cn('flex h-[26px] w-full shrink-0 items-center justify-center', className)}
    >
      <span className={cn('h-[5px] w-[136px] rounded-full', tone === 'dark' ? 'bg-black' : 'bg-white')} />
    </button>
  )
}

/** App Shell Skeleton: Status bar + Header + Scroll Body + Footer + Home Indicator */
export function AppShell({
  header,
  footer,
  children,
  className,
  bodyClassName,
  bodyRef,
}: {
  header?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
  bodyRef?: React.Ref<HTMLDivElement>
}) {
  return (
    <div className={cn('flex h-full w-full flex-col bg-white text-black', className)}>
      <StatusBar />
      {header}
      <div ref={bodyRef} className={cn('no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain', bodyClassName)}>
        {children}
      </div>
      {footer}
      <HomeIndicator />
    </div>
  )
}

export function Avatar({
  initial,
  color,
  size = 40,
  shape = 'circle',
  src,
}: {
  initial: string
  color: string
  size?: number
  shape?: 'circle' | 'squircle'
  src?: string
}) {
  const radius = shape === 'circle' ? 'rounded-full' : 'rounded-[38%]'
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        aria-hidden
        className={cn('shrink-0 bg-[#e5e8eb] object-cover', radius)}
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      aria-hidden
      className={cn('flex shrink-0 items-center justify-center font-medium text-white', radius)}
      style={{
        width: size,
        height: size,
        background: shape === 'circle' ? 'linear-gradient(#a8aeba, #858b97)' : color,
        fontSize: size * 0.4,
      }}
    >
      {initial || (
        <svg viewBox="0 0 24 24" className="size-3/5 fill-white/90">
          <circle cx="12" cy="8" r="4.2" />
          <path d="M3.5 21c.8-4.4 4.3-7 8.5-7s7.7 2.6 8.5 7z" />
        </svg>
      )}
    </span>
  )
}