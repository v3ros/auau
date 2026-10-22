'use client'

import { withBasePath } from '@/lib/base-path'
import { useState, useRef, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Upload,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppShell, Avatar } from '@/components/phone/chrome'
import { useBackHandler } from '@/lib/story/back-nav'
import { OWNER } from '@/lib/story/contacts'
import { useStory } from '@/lib/story/store'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type PageId = 'wallpaper'

const ITEMS: { id: PageId; label: string; Icon: typeof ImageIcon; color: string }[] = [
  { id: 'wallpaper', label: 'Wallpaper', Icon: ImageIcon, color: '#34aadc' },
]

export function SettingsApp() {
  const [page, setPage] = useState<PageId | null>(null)
  useBackHandler(!!page, () => setPage(null))

  if (page) {
    const item = ITEMS.find((i) => i.id === page)
    return (
      <SubPage title={item!.label} onBack={() => setPage(null)}>
        <PageBody page={page} />
      </SubPage>
    )
  }

  return (
    <AppShell
      className="bg-[#f2f2f7]"
      header={
        <header className="shrink-0 px-4 pb-2">
          <h2 className="text-[32px] font-bold">Settings</h2>
        </header>
      }
    >
      <div className="flex flex-col gap-6 px-4 pb-6">
        <section className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-3">
          <Avatar initial="A" color="#9aa3ad" size={56} src={OWNER.photo} />
          <div>
            <p className="text-[19px] font-semibold">{OWNER.deviceName}</p>
            <p className="text-[13px] text-black/45">Apple Account, iCloud & More</p>
          </div>
        </section>

        <Group>
          {ITEMS.map((item) => (
            <Row
              key={item.id}
              Icon={item.Icon}
              color={item.color}
              label={item.label}
              onClick={() => setPage(item.id)}
            />
          ))}
        </Group>
      </div>
    </AppShell>
  )
}

function SubPage({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <AppShell
      className="animate-push-in bg-[#f2f2f7]"
      header={
        <header className="relative flex h-11 shrink-0 items-center justify-center px-1">
          <button type="button" onClick={onBack} className="absolute left-1 flex items-center text-[17px] text-[#007aff]">
            <ChevronLeft className="size-7" />
            Settings
          </button>
          <h2 className="max-w-[55%] truncate text-[17px] font-semibold">{title}</h2>
        </header>
      }
    >
      <div className="flex flex-col gap-6 px-4 pb-6 pt-3">{children}</div>
    </AppShell>
  )
}

function PageBody({ page }: { page: PageId }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentWallpaper, setCurrentWallpaper] = useState<string>(withBasePath('/images/wallpaper.jpg'))
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from('app_config')
        .select('value')
        .eq('key', 'wallpaper_url')
        .single()
      if (data?.value) {
        setCurrentWallpaper(data.value)
      }
    }
    fetchConfig()
  }, [])

  const handleUploadWallpaper = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const fileName = `wallpaper-${Date.now()}.${file.name.split('.').pop()}`
      
      const { error: uploadError } = await supabase.storage
        .from('wallpapers')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('wallpapers')
        .getPublicUrl(fileName)

      const newUrl = publicUrlData.publicUrl

      const { error: dbError } = await supabase
        .from('app_config')
        .update({ value: newUrl })
        .eq('key', 'wallpaper_url')

      if (dbError) throw dbError

      setCurrentWallpaper(newUrl)
      
      const wallpaperElements = document.querySelectorAll<HTMLElement>('[style*="wallpaper.jpg"], [style*="background-image"]')
      wallpaperElements.forEach((el) => {
        el.style.backgroundImage = `url("${newUrl}")`
      })

      alert('Wallpaper updated successfully for all users!')
    } catch (err) {
      console.error('Failed to upload wallpaper:', err)
      alert('Failed to upload wallpaper. Please check your Supabase storage setup.')
    } finally {
      setIsUploading(false)
    }
  }

  if (page === 'wallpaper') {
    return (
      <div className="flex flex-col items-center gap-4 pt-4">
        <div
          className="aspect-[9/19] w-36 overflow-hidden rounded-2xl bg-cover bg-center shadow-lg border border-black/10"
          style={{ backgroundImage: `url("${currentWallpaper}")` }}
          role="img"
          aria-label="Current Wallpaper"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUploadWallpaper}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 rounded-xl bg-[#007aff] px-4 py-2.5 text-[14px] font-semibold text-white shadow hover:bg-[#0051a8] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {isUploading ? 'Uploading...' : 'Choose New Wallpaper'}
        </button>
      </div>
    )
  }

  return null
}

function Group({ children }: { children: React.ReactNode }) {
  return <ul className="overflow-hidden rounded-[20px] bg-white">{children}</ul>
}

function Row({
  label,
  Icon,
  color,
  onClick,
}: {
  label: string
  Icon: typeof ImageIcon
  color: string
  onClick: () => void
}) {
  return (
    <li className="group">
      <button type="button" onClick={onClick} className="flex w-full items-center gap-3 pl-4 text-left active:bg-black/5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-[7px]" style={{ backgroundColor: color }}>
          <Icon className="size-4 text-white" aria-hidden />
        </span>
        <span className="flex min-h-11 min-w-0 flex-1 items-center gap-2 border-b border-black/10 py-2 pr-4 group-last:border-b-0">
          <span className="flex-1 truncate text-[16px]">{label}</span>
          <ChevronRight className="size-4 shrink-0 text-black/25" aria-hidden />
        </span>
      </button>
    </li>
  )
}