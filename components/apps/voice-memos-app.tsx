'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Folder, Pause, Play, RotateCcw, RotateCw, Trash2, Waves } from 'lucide-react'
import { HomeIndicator, StatusBar } from '@/components/phone/chrome'
import { useBackHandler } from '@/lib/story/back-nav'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Memo = { 
  id: string
  title: string
  date: string
  duration: number
  src: string
  isDeleted?: boolean
  left?: string
}

type Folder = 'root' | 'all' | 'trash' | 'record'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export function VoiceMemosApp() {
  const [folder, setFolder] = useState<Folder>('root')
  useBackHandler(folder !== 'root', () => setFolder('root'))

  const [memos, setMemos] = useState<Memo[]>([])
  const [trashedMemos, setTrashedMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch dari Supabase database
  const fetchMemos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('voice_memos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      const formatted: Memo[] = data.map((item: any) => ({
        id: item.id,
        title: item.title || 'New Recording',
        date: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(item.created_at)),
        duration: item.duration || 0,
        src: item.audio_url,
      }))
      setMemos(formatted)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMemos()

    const channel = supabase
      .channel('public:voice_memos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'voice_memos' },
        () => { fetchMemos() }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="flex h-full flex-col bg-black text-white">
      <StatusBar tone="light" />
      {folder === 'root' ? (
        <FolderList 
          onOpen={setFolder} 
          allCount={memos.length} 
          trashCount={trashedMemos.length} 
        />
      ) : folder === 'all' ? (
        <FolderView 
          folder="all" 
          memos={memos} 
          setMemos={setMemos} 
          setTrashedMemos={setTrashedMemos}
          onBack={() => setFolder('root')} 
          onOpenRecord={() => setFolder('record')}
        />
      ) : folder === 'trash' ? (
        <FolderView 
          folder="trash" 
          memos={trashedMemos} 
          setMemos={setTrashedMemos} 
          onBack={() => setFolder('root')} 
        />
      ) : (
        <RecordView 
          onBack={() => setFolder('all')} 
          onSaved={() => {
            fetchMemos()
            setFolder('all')
          }} 
        />
      )}
      <HomeIndicator tone="light" className="bg-black" />
    </div>
  )
}

function FolderList({ onOpen, allCount, trashCount }: { onOpen: (f: Folder) => void; allCount: number; trashCount: number }) {
  const rows: { id: Folder; label: string; count: number; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Recordings', count: allCount, icon: <Waves className="size-[22px] text-[#0a84ff]" /> },
    { id: 'trash', label: 'Recently Deleted', count: trashCount, icon: <Trash2 className="size-[22px] text-[#0a84ff]" /> },
  ]
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4">
      <div className="flex justify-end py-2 text-[17px] text-[#0a84ff]" aria-hidden>
        Edit
      </div>
      <h1 className="pb-4 text-[34px] font-bold tracking-tight">Voice Memos</h1>
      <ul className="overflow-hidden rounded-[12px] bg-[#1c1c1e]">
        {rows.map((r, i) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => onOpen(r.id)}
              className="flex w-full items-center gap-3.5 pl-4 text-left active:bg-white/10"
            >
              <span aria-hidden>{r.icon}</span>
              <span className={`flex flex-1 items-center gap-2 py-3 pr-3 ${i > 0 ? 'border-t border-white/10' : ''}`}>
                <span className="flex-1 text-[17px]">{r.label}</span>
                <span className="text-[17px] text-white/45">{r.count}</span>
                <ChevronRight className="size-5 text-white/30" aria-hidden />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-6 flex items-center gap-2 px-1 text-[13px] text-white/40">
        <Folder className="size-4" aria-hidden />
        No Folders
      </p>
    </div>
  )
}

function FolderView({ 
  folder, 
  memos, 
  setMemos, 
  setTrashedMemos, 
  onBack, 
  onOpenRecord 
}: { 
  folder: 'all' | 'trash'
  memos: Memo[]
  setMemos: React.Dispatch<React.SetStateAction<Memo[]>>
  setTrashedMemos?: React.Dispatch<React.SetStateAction<Memo[]>>
  onBack: () => void
  onOpenRecord?: () => void
}) {
  const [openId, setOpenId] = useState<string | null>(null)

  const handleDelete = async (memo: Memo) => {
    if (folder === 'all') {
      setMemos((prev) => prev.filter((m) => m.id !== memo.id))
      if (setTrashedMemos) {
        setTrashedMemos((prev) => [{ ...memo, left: '30 days left' }, ...prev])
      }
      await supabase.from('voice_memos').delete().eq('id', memo.id)
    } else {
      setMemos((prev) => prev.filter((m) => m.id !== memo.id))
    }
    if (openId === memo.id) setOpenId(null)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between px-2 py-2 text-[17px] text-[#0a84ff]">
        <button type="button" onClick={onBack} className="flex items-center">
          <ChevronLeft className="size-7" aria-hidden />
          Voice Memos
        </button>
        {folder === 'all' && onOpenRecord && (
          <button type="button" onClick={onOpenRecord} className="px-2 font-semibold">
            Record
          </button>
        )}
      </div>
      <h1 className="px-4 pb-2 text-[34px] font-bold tracking-tight">
        {folder === 'trash' ? 'Recently Deleted' : 'All Recordings'}
      </h1>
      {memos.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center pb-24 text-center">
          <p className="text-[22px] font-bold">No Recordings</p>
          <p className="mt-1 text-[15px] text-white/50">Recorded audio memos will appear here.</p>
        </div>
      ) : (
        <>
          {folder === 'trash' && (
            <p className="px-4 pb-2 text-[13px] text-white/45">Items are kept for 30 days before being deleted.</p>
          )}
          <ul className="min-h-0 flex-1 overflow-y-auto px-4">
            {memos.map((m) => (
              <MemoRow 
                key={m.id} 
                memo={m} 
                open={openId === m.id} 
                onToggle={() => setOpenId((id) => (id === m.id ? null : m.id))}
                onDelete={() => handleDelete(m)}
                isTrash={folder === 'trash'}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function MemoRow({ 
  memo, 
  open, 
  onToggle, 
  onDelete,
  isTrash 
}: { 
  memo: Memo
  open: boolean
  onToggle: () => void
  onDelete: () => void
  isTrash: boolean
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(memo.duration || 0)

  useEffect(() => {
    if (!open) audioRef.current?.pause()
  }, [open])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) a.play().catch(() => {})
    else a.pause()
  }

  const skip = (d: number) => {
    const a = audioRef.current
    if (a) a.currentTime = Math.min(Math.max(0, a.currentTime + d), a.duration || duration)
  }

  return (
    <li className="border-b border-white/10">
      <audio
        ref={audioRef}
        src={memo.src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
      />
      <button type="button" onClick={onToggle} aria-expanded={open} className="w-full py-3 text-left">
        <p className="text-[17px] font-semibold">{memo.title}</p>
        <p className="mt-0.5 flex justify-between text-[14px] text-white/45">
          <span>{memo.date}</span>
          <span>{open ? (memo.left || fmt(duration)) : fmt(duration)}</span>
        </p>
      </button>
      {open && (
        <div className="pb-4">
          <div className="relative h-1 rounded-full bg-white/20">
            <span className="absolute inset-y-0 left-0 rounded-full bg-white/80" style={{ width: `${Math.min(100, (time / (duration || 1)) * 100)}%` }} />
          </div>
          <p className="mt-1.5 flex justify-between text-[12px] tabular-nums text-white/45">
            <span>{fmt(time)}</span>
            <span>{`-${fmt(Math.max(0, duration - time))}`}</span>
          </p>
          <div className="mt-2 flex items-center justify-between">
            <button type="button" onClick={onDelete} className="text-[15px] text-red-500 hover:text-red-400">
              Delete
            </button>
            <div className="flex items-center gap-6">
              <button type="button" onClick={() => skip(-15)} aria-label="Skip backward 15 seconds">
                <RotateCcw className="size-6" />
              </button>
              <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? <Pause className="size-9 fill-white" /> : <Play className="size-9 fill-white" />}
              </button>
              <button type="button" onClick={() => skip(15)} aria-label="Skip forward 15 seconds">
                <RotateCw className="size-6" />
              </button>
            </div>
            {isTrash ? (
              <button type="button" onClick={onDelete} className="text-[15px] text-[#0a84ff]">
                Recover
              </button>
            ) : (
              <span className="w-12" aria-hidden />
            )}
          </div>
        </div>
      )}
    </li>
  )
}

function RecordView({ onBack, onSaved }: { onBack: () => void; onSaved: () => void }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [uploading, setUploading] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await uploadAndSaveAudio(audioBlob, recordingTime)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error('Microphone error:', err)
      alert('Microphone permission is required to record voice memos.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const uploadAndSaveAudio = async (blob: Blob, duration: number) => {
    setUploading(true)
    try {
      const fileName = `memo-${Date.now()}.webm`
      const { error: uploadErr } = await supabase.storage
        .from('voice_memos')
        .upload(fileName, blob, { contentType: 'audio/webm' })

      if (uploadErr) throw uploadErr

      const { data: publicUrlData } = supabase.storage
        .from('voice_memos')
        .getPublicUrl(fileName)

      const audioUrl = publicUrlData.publicUrl

      // Format nama otomatis berdasarkan tanggal dan jam real-time saat disimpan
      const now = new Date()
      const title = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(now)

      const { error: dbErr } = await supabase
        .from('voice_memos')
        .insert([{ title, duration: duration || 1, audio_url: audioUrl }])

      if (dbErr) throw dbErr

      onSaved()
    } catch (err) {
      console.error('Failed to upload memo:', err)
      alert('Failed to save recording.')
      setUploading(false)
    }
  }
  
  return (
    <div className="flex flex-1 flex-col justify-between p-6 text-center">
      <div className="flex justify-start">
        <button type="button" onClick={onBack} className="text-[#0a84ff] text-[17px]">
          Cancel
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <h2 className="text-[28px] font-bold">{uploading ? 'Saving...' : isRecording ? 'Recording...' : 'Tap to Record'}</h2>
        <div className="text-[48px] font-mono font-bold tracking-wider text-red-500">
          {fmt(recordingTime)}
        </div>
        <div className="flex h-24 items-center justify-center gap-1">
          {[40, 70, 30, 90, 50, 80, 20, 60, 40].map((h, i) => (
            <span 
              key={i} 
              className={`w-1 rounded-full bg-[#0a84ff] transition-all duration-300 ${isRecording ? 'animate-pulse' : 'opacity-30'}`}
              style={{ height: isRecording ? `${Math.max(15, Math.random() * h)}px` : '15px' }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center pb-8">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={uploading}
          className="flex size-20 items-center justify-center rounded-full border-4 border-white bg-transparent p-1 active:scale-95 transition-transform"
        >
          <span
            className={`transition-all duration-200 ${
              isRecording ? 'size-8 rounded-md bg-red-600' : 'size-full rounded-full bg-red-600'
            }`}
          />
        </button>
      </div>
    </div>
  )
}