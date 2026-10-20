'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useBackHandler } from '@/lib/story/back-nav'
import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Heart,
  Info,
  Search,
  Share,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { HomeIndicator, StatusBar } from '@/components/phone/chrome'
import { photos } from '@/lib/story/photos'

function formatPhotoDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    month: 'long',
    day: 'numeric',
  }).format(new Date(iso))
}

function formatPhotoTime(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso))
}

export function PhotosApp() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  useBackHandler(openIndex !== null, () => setOpenIndex(null))

  const gridRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = gridRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  return (
    <div className="relative flex h-full flex-col bg-white text-black">
      <StatusBar />

      <div
        ref={gridRef}
        className="no-scrollbar min-h-0 flex-1 overflow-y-auto"
      >
        <header className="flex items-end justify-between px-4 pb-3 pt-2">
          <div>
            <h2 className="text-[32px] font-bold leading-tight tracking-tight">
              Library
            </h2>

            <p className="text-[13px] text-black/50">
              {`September – November 2025 · ${photos.length} Photos`}
            </p>
          </div>

          <span className="flex items-center gap-2" aria-hidden>
            <span className="flex size-9 items-center justify-center rounded-full bg-black/[0.06]">
              <Search className="size-[18px]" />
            </span>

            <span className="rounded-full bg-black/[0.06] px-3.5 py-2 text-[14px] font-semibold">
              Select
            </span>
          </span>
        </header>

        <ul className="grid grid-cols-3 gap-[2px]">
          {photos.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                aria-label={`View photo from ${formatPhotoDate(p.at)}`}
                className="block aspect-square w-full overflow-hidden bg-[#eee] active:opacity-80 relative"
              >
                {p.type === 'video' ? (
                  <video
                    src={p.src}
                    className="size-full object-cover pointer-events-none"
                    muted
                    playsInline
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={p.src}
                    alt={p.alt}
                    className="size-full object-cover"
                    loading="lazy"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        <p className="py-6 text-center text-[13px] text-black/45">
          {`${photos.length} Photos`}
        </p>
      </div>

      <nav
        aria-label="Photo view options"
        className="mx-auto mb-1 flex shrink-0 rounded-full bg-black/[0.06] p-1 text-[13px] font-semibold backdrop-blur"
      >
        {['Years', 'Months', 'All Photos'].map((t) => (
          <span
            key={t}
            className={cn(
              'rounded-full px-4 py-1.5',
              t === 'All Photos' ? 'bg-white shadow-sm' : 'text-black/60',
            )}
          >
            {t}
          </span>
        ))}
      </nav>

      <HomeIndicator />

      {openIndex !== null && (
        <Viewer
          index={openIndex}
          onChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </div>
  )
}

function Viewer({
  index,
  onChange,
  onClose,
}: {
  index: number
  onChange: (i: number) => void
  onClose: () => void
}) {
  const photo = photos[index]
  const startX = useRef<number | null>(null)
  const [chrome, setChrome] = useState(true)

  const hasPrev = index > 0
  const hasNext = index < photos.length - 1

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && index > 0) onChange(index - 1)
      if (e.key === 'ArrowRight' && index < photos.length - 1) {
        onChange(index + 1)
      }
    }

    window.addEventListener('keydown', onKey)

    return () => window.removeEventListener('keydown', onKey)
  }, [index, onChange, onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo Viewer"
      className={cn(
        'animate-screen-in absolute inset-0 z-20 flex flex-col transition-colors',
        chrome ? 'bg-white text-black' : 'bg-black text-white',
      )}
    >
      <StatusBar
        tone={chrome ? 'dark' : 'light'}
        className={cn('transition-opacity', !chrome && 'opacity-0')}
      />

      <header
        className={cn(
          'flex h-12 shrink-0 items-center px-2 transition-opacity',
          !chrome && 'pointer-events-none opacity-0',
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Back to Library"
          className="flex size-10 items-center justify-center rounded-full bg-black/[0.06]"
        >
          <ChevronLeft className="size-6" />
        </button>

        <div className="flex-1 text-center leading-tight">
          <p className="text-[15px] font-semibold">
            {formatPhotoDate(photo.at)}
          </p>

          <p className="text-[12px] text-black/50">
            {formatPhotoTime(photo.at)}
          </p>
        </div>

        <span
          className="flex size-10 items-center justify-center rounded-full bg-black/[0.06]"
          aria-hidden
        >
          <Ellipsis className="size-5" />
        </span>
      </header>

      <div
        className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center overflow-hidden"
        onPointerDown={(e) => {
          startX.current = e.clientX
        }}
        onPointerUp={(e) => {
          if (startX.current === null) return

          const dx = e.clientX - startX.current
          startX.current = null

          if (dx > 50 && hasPrev) onChange(index - 1)
          else if (dx < -50 && hasNext) onChange(index + 1)
          else if (Math.abs(dx) < 6) setChrome((c) => !c)
        }}
      >
        {photo.type === 'video' ? (
          <video
            key={photo.id}
            src={photo.src}
            controls
            autoPlay
            playsInline
            className="animate-screen-in max-h-full max-w-full select-none object-contain"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={photo.id}
            src={photo.src}
            alt={photo.alt}
            draggable={false}
            className="animate-screen-in max-h-full max-w-full select-none object-contain"
          />
        )}

        {hasPrev && (
          <button
            type="button"
            onPointerUp={(e) => e.stopPropagation()}
            onClick={() => onChange(index - 1)}
            aria-label="Previous Photo"
            className={cn(
              'absolute left-2 hidden size-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur sm:flex',
              !chrome && 'sm:hidden',
            )}
          >
            <ChevronLeft className="size-5" />
          </button>
        )}

        {hasNext && (
          <button
            type="button"
            onPointerUp={(e) => e.stopPropagation()}
            onClick={() => onChange(index + 1)}
            aria-label="Next Photo"
            className={cn(
              'absolute right-2 hidden size-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur sm:flex',
              !chrome && 'sm:hidden',
            )}
          >
            <ChevronRight className="size-5" />
          </button>
        )}
      </div>

      <div
        className={cn(
          'shrink-0 transition-opacity',
          !chrome && 'pointer-events-none opacity-0',
        )}
      >
        <ul className="no-scrollbar flex justify-center gap-[2px] overflow-x-auto px-4 py-2">
          {photos.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onChange(i)}
                aria-label={`Photo ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                className={cn(
                  'block h-9 overflow-hidden transition-all relative',
                  i === index ? 'mx-1 w-7' : 'w-5 opacity-80',
                )}
              >
                {p.type === 'video' ? (
                  <video
                    src={p.src}
                    className="size-full object-cover pointer-events-none"
                    muted
                    playsInline
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={p.src}
                    alt=""
                    className="size-full object-cover"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        <div
          className="flex items-center justify-between px-6 pb-1 pt-1 text-[#007aff]"
          aria-hidden
        >
          <Share className="size-6" strokeWidth={1.7} />
          <Heart className="size-6" strokeWidth={1.7} />
          <Info className="size-6" strokeWidth={1.7} />
          <Trash2 className="size-6" strokeWidth={1.7} />
        </div>

        <HomeIndicator
          tone={chrome ? 'dark' : 'light'}
          onActivate={onClose}
          label="Close Photo"
        />
      </div>
    </div>
  )
}