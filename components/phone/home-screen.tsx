'use client'

import { useRef, useState, useEffect } from 'react'
import { withBasePath } from '@/lib/base-path'
import { cn } from '@/lib/utils'
import { useStory, type AppId } from '@/lib/story/store'
import { AppGlyph, type IconKind } from './app-icons'
import { HomeIndicator, StatusBar } from './chrome'
import { CalendarWidget, WeatherWidget } from './widgets'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type HomeApp = {
  kind: IconKind | 'calculator'
  label: string
  app?: AppId
  href?: string
}

const PAGE_ONE: HomeApp[] = [
  { kind: 'settings', app: 'settings', label: '' },
  { kind: 'kakao', app: 'kakao', label: '' },
  { kind: 'anyai', app: 'anyai', label: '' },
  { kind: 'photos', app: 'photos', label: '' },
  { kind: 'notes', app: 'notes', label: '' },
  { kind: 'calendar', app: 'calendar', label: '' },
  { kind: 'clock', app: 'clock', label: '' },
  { kind: 'calculator', app: 'calculator' as AppId, label: '' },
  { kind: 'voicememos', app: 'voicememos', label: ' ' },
  {
    kind: 'youtube',
    href: 'https://www.youtube.com/',
    label: '',
  },
]

const PAGE_TWO: HomeApp[] = []

const DOCK: HomeApp[] = [
  { kind: 'messages', app: 'messages', label: 'Messages' },
  { kind: 'camera', app: 'camera', label: 'Camera' },
  { kind: 'phone', app: 'phone', label: 'Phone' },
  { kind: 'safari', app: 'safari', label: 'Safari' },
]

function XIcon() {
  return (
    <span className="relative flex size-full items-center justify-center overflow-hidden rounded-[18px] bg-white/20 border border-white/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]">
      <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none z-10" />
      <svg
        viewBox="0 0 24 24"
        className="size-[58%] text-white z-0 drop-shadow"
        fill="currentColor"
        role="img"
        aria-label="X"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.967 6.817H1.681l7.73-8.835L1.255 2.25h6.826l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </span>
  )
}

function CalculatorIcon() {
  return (
    <span className="relative flex size-full items-center justify-center overflow-hidden rounded-[18px] bg-white/20 border border-white/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]">
      <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none z-10" />
      <div className="grid grid-cols-2 gap-1 p-2 size-[72%] rounded-[18%] bg-white/10 border border-white/20 z-0">
        <span className="flex items-center justify-center rounded-md bg-orange-500/80 text-white font-bold text-[11px]">
          +
        </span>
        <span className="flex items-center justify-center rounded-md bg-white/20 text-white font-bold text-[11px]">
          -
        </span>
        <span className="flex items-center justify-center rounded-md bg-white/20 text-white font-bold text-[11px]">
          ×
        </span>
        <span className="flex items-center justify-center rounded-md bg-orange-500/80 text-white font-bold text-[11px]">
          =
        </span>
      </div>
    </span>
  )
}

export function HomeScreen() {
  const { openApp, lock } = useStory()
  const [page, setPage] = useState(0)
  const [isLocking, setIsLocking] = useState(false)
  const [wallpaperUrl, setWallpaperUrl] = useState<string>(withBasePath('/images/wallpaper.jpg'))
  const pagerRef = useRef<HTMLDivElement>(null)

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
      .channel('public:app_config')
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

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const launch = (app: AppId) => {
    const validApps = ['photos', 'calendar', 'kakao', 'camera', 'notes', 'weather', 'calculator', 'settings']
    if (validApps.includes(app as string)) {
      openApp(app)
    }
  }

  const goToPage = (i: number) => {
    const el = pagerRef.current
    el?.scrollTo({
      left: i * el.clientWidth,
      behavior: 'smooth',
    })
  }

  const handleDoubleTapLock = () => {
    if (isLocking) return
    setIsLocking(true)
    setTimeout(() => {
      if (typeof lock === 'function') {
        lock()
      }
    }, 200)
  }

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col bg-cover bg-center text-white select-none transition-opacity duration-200 ease-out",
        isLocking ? "opacity-0" : "opacity-100"
      )}
      style={{
        backgroundImage: `url(${wallpaperUrl})`,
      }}
      onDoubleClick={handleDoubleTapLock}
    >
      <div className="absolute inset-0 bg-black/1 backdrop-brightness-90 pointer-events-none" />

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <StatusBar tone="light" />

        <div
          ref={pagerRef}
          onScroll={(e) => {
            const el = e.currentTarget
            if (el.clientWidth > 0) {
              setPage(Math.round(el.scrollLeft / el.clientWidth))
            }
          }}
          className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
        >
          <section
            aria-label="Home Screen Page 1"
            className="flex w-full shrink-0 snap-start flex-col px-6 pt-1"
          >
            <div className="grid grid-cols-2 gap-5">
              <WeatherWidget onOpen={() => openApp('weather' as AppId)} />
              <CalendarWidget onOpen={() => openApp('calendar')} />
            </div>

            <AppGrid
              apps={PAGE_ONE}
              onLaunch={launch}
              className="mt-5"
            />
          </section>

          <section
            aria-label="Home Screen Page 2"
            className="flex w-full shrink-0 snap-start flex-col px-6 pt-1"
          >
            <AppGrid apps={PAGE_TWO} onLaunch={launch} />
          </section>
        </div>

        <div className="flex shrink-0 justify-center py-2">
          <div
            className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-xl"
            role="tablist"
            aria-label="Home Screen Page Indicator"
          >
            {[0, 1].map((i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={page === i}
                aria-label={`Page ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation()
                  goToPage(i)
                }}
                className={cn(
                  'size-[7px] rounded-full transition-colors',
                  page === i ? 'bg-white' : 'bg-white/45',
                )}
              />
            ))}
          </div>
        </div>

        <nav
          aria-label="Dock"
          className="mx-3 grid grid-cols-4 gap-5 rounded-[34px] bg-white/20 px-4 py-3.5 backdrop-blur-2xl"
        >
          {DOCK.map((d) => (
            <button
              key={d.kind}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (d.app) launch(d.app)
              }}
              aria-label={d.label}
              className="mx-auto block aspect-square w-full max-w-[64px] active:opacity-70"
            >
              <AppGlyph kind={d.kind as IconKind} />
            </button>
          ))}
        </nav>

        <HomeIndicator
          tone="light"
          onActivate={() => goToPage(0)}
          label="Home"
        />
      </div>
    </div>
  )
}

function AppGrid({
  apps,
  onLaunch,
  className,
}: {
  apps: HomeApp[]
  onLaunch: (app: AppId) => void
  className?: string
}) {
  return (
    <div className={cn('grid grid-cols-4 gap-x-5 gap-y-4', className)}>
      {apps.map((a) => {
        const content = (
          <>
            <span className="relative block aspect-square w-full max-w-[64px]">
              {a.kind === 'kakao' ? (
                <XIcon />
              ) : a.kind === 'calculator' ? (
                <CalculatorIcon />
              ) : (
                <AppGlyph kind={a.kind as IconKind} />
              )}
            </span>

            {a.label.trim() !== '' && (
              <span className="max-w-full truncate text-[11.5px] font-medium [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
                {a.label}
              </span>
            )}
          </>
        )

        const cls =
          'flex flex-col items-center gap-[5px] active:opacity-70'

        return (
          <button
            key={a.kind}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (a.app) {
                onLaunch(a.app)
              } else if (a.href) {
                window.open(a.href, '_blank', 'noopener,noreferrer')
              }
            }}
            className={cls}
            aria-label={a.label.trim() || a.app || a.kind}
          >
            {content}
          </button>
        )
      })}
    </div>
  )
}