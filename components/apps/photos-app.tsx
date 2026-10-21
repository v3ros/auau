'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useBackHandler } from '@/lib/story/back-nav'
import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Heart,
  Info,
  Plus,
  Search,
  Share,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { HomeIndicator, StatusBar } from '@/components/phone/chrome'
import { supabase } from '@/lib/supabase'

type PhotoItem = {
  id: string
  src: string
  alt: string
  type?: 'image' | 'video'
  at: string
}

function formatPhotoDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso))
  } catch {
    return 'Hari ini'
  }
}

function formatPhotoTime(iso: string) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

// Fungsi pembantu untuk kompres & resize gambar otomatis agar database tidak cepat penuh
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 1080 // Batas maksimal lebar gambar
        let width = img.width
        let height = img.height

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width)
          width = MAX_WIDTH
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        // Ekspor ke format JPEG dengan kualitas 75% (ukuran file turun drastis, kualitas tetap tajam)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75)
        resolve(compressedBase64)
      }

      img.onerror = (error) => reject(error)
    }

    reader.onerror = (error) => reject(error)
  })
}

export function PhotosApp() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [loading, setLoading] = useState(true)
  
  useBackHandler(openIndex !== null, () => setOpenIndex(null))

  const gridRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchPhotos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('user_photos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      const formatted = data.map((item: any) => ({
        id: item.id,
        src: item.src,
        alt: item.alt || 'Photo',
        type: item.type || 'image',
        at: item.created_at || new Date().toISOString(),
      }))
      setPhotos(formatted)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPhotos()
  }, [])

  useLayoutEffect(() => {
    const el = gridRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [photos])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    try {
      // 1. Kompres gambar sebelum di-upload
      const compressedBase64 = await compressImage(file)
      const altText = file.name || 'Uploaded Photo'

      // 2. Kirim hasil kompresi ke Supabase
      const { data, error } = await supabase
        .from('user_photos')
        .insert([{ src: compressedBase64, alt: altText }])
        .select()
        .single()

      if (!error && data) {
        const newPhoto: PhotoItem = {
          id: data.id,
          src: data.src,
          alt: data.alt,
          type: 'image',
          at: data.created_at || new Date().toISOString(),
        }
        setPhotos((prev) => [newPhoto, ...prev])
      } else {
        console.error('Error insert foto:', error)
        alert('Gagal mengunggah foto ke database.')
      }
    } catch (err) {
      console.error('Gagal memproses gambar:', err)
      alert('Gagal mengompres gambar.')
    }
  }

  const handleDeletePhoto = async (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id))
    setOpenIndex(null)

    await supabase.from('user_photos').delete().eq('id', id)
  }

  return (
    <div className="relative flex h-full flex-col bg-white text-black">
      <StatusBar />

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

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
              {loading ? 'Loading gallery...' : `Personal Collection · ${photos.length} Photos`}
            </p>
          </div>

          <span className="flex items-center gap-2" aria-hidden>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex size-9 items-center justify-center rounded-full bg-[#007aff] text-white active:scale-95 transition-transform shadow-sm"
              title="Upload Foto"
            >
              <Plus className="size-5" />
            </button>

            <span className="flex size-9 items-center justify-center rounded-full bg-black/[0.06]">
              <Search className="size-[18px]" />
            </span>
          </span>
        </header>

        {loading ? (
          <p className="mt-10 text-center text-xs text-gray-400">Loading gallery...</p>
        ) : photos.length === 0 ? (
          <p className="mt-10 text-center text-xs text-gray-400">No photos yet. Click the (+) button above to upload!</p>
        ) : (
          <ul className="grid grid-cols-3 gap-[2px]">
            {photos.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  aria-label={`View photo from ${formatPhotoDate(p.at)}`}
                  className="block aspect-square w-full overflow-hidden bg-[#eee] active:opacity-80 relative"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.src}
                    alt={p.alt}
                    className="size-full object-cover"
                    loading="lazy"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

        {!loading && photos.length > 0 && (
          <p className="py-6 text-center text-[13px] text-black/45">
            {`${photos.length} Photos`}
          </p>
        )}
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

      {openIndex !== null && photos[openIndex] && (
        <Viewer
          photo={photos[openIndex]}
          photos={photos}
          index={openIndex}
          onChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          onDelete={() => handleDeletePhoto(photos[openIndex].id)}
        />
      )}
    </div>
  )
}

function Viewer({
  photo,
  photos,
  index,
  onChange,
  onClose,
  onDelete,
}: {
  photo: PhotoItem
  photos: PhotoItem[]
  index: number
  onChange: (i: number) => void
  onClose: () => void
  onDelete: () => void
}) {
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

  if (!photo) return null

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photo.id}
          src={photo.src}
          alt={photo.alt}
          draggable={false}
          className="animate-screen-in max-h-full max-w-full select-none object-contain"
        />

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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt=""
                  className="size-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>

        <div
          className="flex items-center justify-between px-6 pb-1 pt-1 text-[#007aff]"
          aria-hidden
        >
          <Share className="size-6 cursor-pointer" strokeWidth={1.7} />
          <Heart className="size-6 cursor-pointer" strokeWidth={1.7} />
          <Info className="size-6 cursor-pointer" strokeWidth={1.7} />
          <button 
            type="button" 
            onClick={onDelete} 
            className="text-red-500 hover:opacity-85 transition-opacity"
            title="Hapus Foto"
          >
            <Trash2 className="size-6" strokeWidth={1.7} />
          </button>
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