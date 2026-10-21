'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, Search, SquarePen, Trash2 } from 'lucide-react'
import { HomeIndicator, StatusBar } from '@/components/phone/chrome'
import { useBackHandler } from '@/lib/story/back-nav'
import { supabase } from '@/lib/supabase'

type Note = {
  id: string
  title: string
  content: string
  created_at: string
}

// Helper Format Tanggal WIB Accurate
const formatWIB = (dateString: string, detailed = false) => {
  if (!dateString) return ''
  const utcString = dateString.endsWith('Z') || dateString.includes('+') 
    ? dateString 
    : `${dateString}Z`

  const date = new Date(utcString)

  if (detailed) {
    return date.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return date.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function NotesApp() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotes = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setNotes(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const activeNote = notes.find((n) => n.id === openId) || null
  useBackHandler(!!openId, () => setOpenId(null))

  const handleCreate = async () => {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ title: 'Catatan Baru', content: '' }])
      .select()
      .single()

    if (!error && data) {
      setNotes([data, ...notes])
      setOpenId(data.id)
    }
  }

  const handleUpdate = async (id: string, title: string, content: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, title, content } : n)))

    await supabase
      .from('notes')
      .update({ title, content })
      .eq('id', id)
  }

  const handleDelete = async (id: string) => {
    setNotes(notes.filter((n) => n.id !== id))
    if (openId === id) setOpenId(null)

    await supabase.from('notes').delete().eq('id', id)
  }

  return (
    <div className="flex h-full flex-col bg-[#f2f2f7] text-black">
      <StatusBar />
      {activeNote ? (
        <NoteDetail 
          note={activeNote} 
          onBack={() => setOpenId(null)} 
          onUpdate={(title, content) => handleUpdate(activeNote.id, title, content)}
          onDelete={() => handleDelete(activeNote.id)}
        />
      ) : (
        <NoteList 
          notes={notes} 
          loading={loading}
          onOpen={setOpenId} 
          onCreate={handleCreate}
        />
      )}
      <HomeIndicator className="bg-[#f2f2f7]" />
    </div>
  )
}

function NoteList({ 
  notes, 
  loading, 
  onOpen, 
  onCreate 
}: { 
  notes: Note[]
  loading: boolean
  onOpen: (id: string) => void
  onCreate: () => void 
}) {
  return (
    <>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <h1 className="pt-10 text-[32px] font-bold tracking-tight">Notes</h1>
        <div className="mt-2 flex items-center gap-2 rounded-[10px] bg-black/[0.06] px-2.5 py-2 text-[16px] text-black/40" aria-hidden>
          <Search className="size-4" />
          Search Notes
        </div>

        {loading ? (
          <p className="text-center text-xs text-gray-400 mt-10">Memuat catatan...</p>
        ) : notes.length === 0 ? (
          <p className="text-center text-xs text-gray-400 mt-10">Belum ada catatan. Klik ikon pensil di bawah untuk membuat baru!</p>
        ) : (
          <ul className="mt-5 overflow-hidden rounded-[12px] bg-white">
            {notes.map((n, i) => {
              const preview = n.content.split('\n').filter(Boolean)[0] ?? ''

              return (
                <li key={n.id} className={i > 0 ? 'ml-4 border-t border-black/10' : undefined}>
                  <button 
                    type="button" 
                    onClick={() => onOpen(n.id)} 
                    className="w-full py-2.5 pr-4 text-left active:bg-black/5 [&:not(:first-child)]:pl-0"
                  >
                    <span className={i === 0 ? 'block px-4' : 'block'}>
                      <span className="block truncate text-[16px] font-semibold">{n.title || 'Tanpa Judul'}</span>
                      <span className="mt-0.5 flex gap-2 text-[14px] text-black/45">
                        <span className="shrink-0">{formatWIB(n.created_at)}</span>
                        <span className="truncate">{preview}</span>
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between px-5 py-2 bg-[#f2f2f7]">
        <span className="w-6" />
        <span className="text-[12px] text-black/60">{`${notes.length} Notes`}</span>
        <button type="button" onClick={onCreate} className="hover:opacity-80 active:scale-95 transition-all">
          <SquarePen className="size-6 text-[#e5a500]" aria-hidden />
        </button>
      </div>
    </>
  )
}

function NoteDetail({ 
  note, 
  onBack, 
  onUpdate, 
  onDelete 
}: { 
  note: Note
  onBack: () => void
  onUpdate: (title: string, content: string) => void
  onDelete: () => void
}) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    onUpdate(newTitle, content)
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    onUpdate(title, newContent)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="flex items-center justify-between px-2 py-2">
        <button type="button" onClick={onBack} className="flex items-center text-[17px] text-[#e5a500]">
          <ChevronLeft className="size-7" aria-hidden />
          Notes
        </button>
        <button type="button" onClick={onDelete} className="p-2 text-red-500 hover:opacity-80">
          <Trash2 className="size-5" />
        </button>
      </div>

      <article className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-6 flex flex-col">
        <p className="text-center text-[12px] text-black/40 mb-3">{formatWIB(note.created_at, true)}</p>
        
        <input 
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Judul Catatan"
          className="text-[24px] font-bold outline-none border-b border-gray-100 pb-2 mb-3 bg-transparent"
        />

        <textarea 
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Mulai ketik catatan..."
          className="w-full flex-1 resize-none outline-none text-[17px] leading-relaxed bg-transparent"
        />
      </article>
    </div>
  )
}