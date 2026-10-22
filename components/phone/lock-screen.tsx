'use client'

import { useRef, useEffect, useState } from 'react'
import { withBasePath } from '@/lib/base-path'
import { Camera, Flashlight, Lock } from 'lucide-react'
import { useStory } from '@/lib/story/store'
import { HomeIndicator, StatusBar } from './chrome'
import { cn } from '@/lib/utils'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function LockScreen() {
  const { openPasscode } = useStory()
  const startY = useRef<number | null>(null)

  const [formattedDate, setFormattedDate] = useState('')
  const [realTimeClock, setRealTimeClock] = useState('')
  const [isLeaving, setIsLeaving] = useState(false)
  const [wallpaperUrl, setWallpaperUrl] = useState<string>(withBasePath('/images/wallpaper.jpg'))

  useEffect(() => {
    const fetchWallpaper = async () => {
      const { data } = await supabase
        .from('app_config')
        .select('value')
        .eq('key', 'wallpaper_url')
        .single()
      if (data?.value) {
        setWallpaperUrl(data.value)
      }
    }

    fetchWallpaper()

    const channel = supabase
      .channel('public:app_config_lock')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'app_config', filter: 'key=eq.wallpaper_url' },
        (payload) => {
          if (payload.new?.value) {
            setWallpaperUrl(payload.new.value)
          }
        }
      )
      .subscribe()

    const updateDateTime = () => {
      const now = new Date()

      // 1. Format Tanggal (English)
      const dateString = now.toLocaleDateString('en-US', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
      setFormattedDate(dateString)

      // 2. Format Jam Real-Time WIB (24 Jam)
      const timeString = now.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).replace('.', ':')

      setRealTimeClock(timeString)
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    
    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [])

  const handleUnlock = () => {
    if (isLeaving) return
    setIsLeaving(true)
    setTimeout(() => {
      openPasscode()
    }, 300)
  }

  return (
    <div
      className={cn(
        "absolute inset-0 flex touch-none select-none flex-col bg-cover bg-center text-white transition-all duration-300 ease-out",
        isLeaving ? "opacity-0 scale-105" : "opacity-100 scale-100"
      )}
      style={{ backgroundImage: `url(${wallpaperUrl})` }}
      onPointerDown={(e) => (startY.current = e.clientY)}
      onPointerUp={(e) => {
        if (startY.current !== null && startY.current - e.clientY > 60) {
          handleUnlock()
        }
        startY.current = null
      }}
    >
      {/* Lapisan Gelap Transparan (Overlay) agar sama dengan Home Screen */}
      <div className="absolute inset-0 bg-black/5 backdrop-brightness-90 pointer-events-none" />

      <div className="relative z-10 flex h-full flex-col">
        <StatusBar tone="light" />
        <div className="flex flex-col items-center">
          <Lock className="size-[18px]" strokeWidth={2.5} aria-hidden />
          
          {/* TANGGAL */}
          <p className="mt-2 text-[20px] font-semibold text-white/90">
            {formattedDate || 'Tuesday, October 20'}
          </p>
          
          {/* JAM REAL-TIME WIB */}
          <p
            className="-mt-1 text-[104px] font-semibold leading-[1.05] tracking-[-0.03em] tabular-nums text-white/90"
            style={{ fontFamily: 'ui-rounded, "SF Pro Rounded", -apple-system, var(--font-noto), sans-serif' }}
          >
            {realTimeClock || '16:13'}
          </p>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-end justify-between px-12 pb-5">
          <span className="flex size-[50px] items-center justify-center rounded-full bg-black/25 backdrop-blur-xl" aria-hidden>
            <Flashlight className="size-[22px]" />
          </span>
          <span className="flex size-[50px] items-center justify-center rounded-full bg-black/25 backdrop-blur-xl" aria-hidden>
            <Camera className="size-[22px]" />
          </span>
        </div>
        
        <p className="pb-2 text-center text-[13px] font-medium text-white/80">
          Swipe up to unlock
        </p>
        
        <HomeIndicator tone="light" onActivate={handleUnlock} label="Unlock" />
      </div>
    </div>
  )
}