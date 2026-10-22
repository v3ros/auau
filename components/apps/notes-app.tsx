'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, Search, SquarePen, Trash2, Bookmark, X } from 'lucide-react'
import { HomeIndicator, StatusBar } from '@/components/phone/chrome'
import { useBackHandler } from '@/lib/story/back-nav'
import { supabase } from '@/lib/supabase'

type Note = {
  id: string
  title: string
  content: string
  color: string
  created_at: string
}

// Pilihan warna bookmark untuk menandai pembuat/kategori
const COLOR_OPTIONS = [
  { name: 'Kuning (Default)', value: '#e5a500' },
  { name: 'Biru', value: '#007aff' },
  { name: 'Merah', value: '#ff3b30' },
  { name: 'Hijau', value: '#34c759' },
  { name: 'Ungu', value: '#af52de' },
  { name: 'Oranye', value: '#ff9500' },
]

// Helper Format Tanggal WIB
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
  const [searchQuery, setSearchQuery] = useState('')
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
    const defaultColor = '#e5a500'
    const { data, error } = await supabase
      .from('notes')
      .insert([{ title: 'Catatan Baru', content: '', color: defaultColor }])
      .select()
      .single()

    if (!error && data) {
      setNotes([data, ...notes])
      setOpenId(data.id)
    }
  }

  const handleUpdate = async (id: string, title: string, content: string, color: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, title, content, color } : n)))

    await supabase
      .from('notes')
      .update({ title, content, color })
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
          onUpdate={(title, content, color) => handleUpdate(activeNote.id, title, content, color)}
          onDelete={() => handleDelete(activeNote.id)}
        />
      ) : (
        <NoteList 
          notes={notes} 
          loading={loading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
  searchQuery,
  onSearchChange,
  onOpen, 
  onCreate 
}: { 
  notes: Note[]
  loading: boolean
  searchQuery: string
  onSearchChange: (q: string) => void
  onOpen: (id: string) => void
  onCreate: () => void 
}) {
  // Filter catatan hanya berdasarkan judul note saja
  const filteredNotes = notes.filter((n) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return n.title.toLowerCase().includes(q)
  })

  return (
    <>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <h1 className="pt-10 text-[32px] font-bold tracking-tight">Notes</h1>
        
        {/* Search Bar Fungsional */}
        <div className="mt-2 flex items-center gap-2 rounded-[10px] bg-black/[0.06] px-2.5 py-1.5 text-[16px]">
          <Search className="size-4 shrink-0 text-black/40" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Notes"
            className="w-full bg-transparent text-[16px] text-black outline-none placeholder:text-black/40"
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => onSearchChange('')}
              className="flex size-4 items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40"
            >
              <X className="size-3" />
            </button>
          )}
        </div>

        {loading ? (
          <p className="mt-10 text-center text-xs text-gray-400">Memuat catatan...</p>
        ) : notes.length === 0 ? (
          <p className="mt-10 text-center text-xs text-gray-400">Belum ada catatan. Klik ikon pensil di bawah untuk membuat baru!</p>
        ) : filteredNotes.length === 0 ? (
          <p className="mt-10 text-center text-xs text-gray-400">Tidak ada catatan dengan judul "{searchQuery}"</p>
        ) : (
          <ul className="mt-5 overflow-hidden rounded-[12px] bg-white">
            {filteredNotes.map((n, i) => {
              const preview = n.content.split('\n').filter(Boolean)[0] ?? ''
              const bookmarkColor = n.color || '#e5a500'

              return (
                <li key={n.id} className={i > 0 ? 'ml-4 border-t border-black/10' : undefined}>
                  <button 
                    type="button" 
                    onClick={() => onOpen(n.id)} 
                    className="flex w-full items-center justify-between py-2.5 pr-4 text-left active:bg-black/5 [&:not(:first-child)]:pl-0"
                  >
                    <span className={i === 0 ? 'block flex-1 min-w-0 px-4' : 'block flex-1 min-w-0'}>
                      <span className="block truncate text-[16px] font-semibold">{n.title || 'Tanpa Judul'}</span>
                      <span className="mt-0.5 flex gap-2 text-[14px] text-black/45">
                        <span className="shrink-0">{formatWIB(n.created_at)}</span>
                        <span className="truncate">{preview}</span>
                      </span>
                    </span>

                    <div className="ml-2 shrink-0 pr-1">
                      <Bookmark 
                        className="size-5 fill-current transition-colors" 
                        style={{ color: bookmarkColor }} 
                      />
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between bg-[#f2f2f7] px-5 py-2">
        <span className="w-6" />
        <span className="text-[12px] text-black/60">{`${filteredNotes.length} Notes`}</span>
        <button type="button" onClick={onCreate} className="transition-all hover:opacity-80 active:scale-95">
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
  onUpdate: (title: string, content: string, color: string) => void
  onDelete: () => void
}) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [color, setColor] = useState(note.color || '#e5a500')

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    onUpdate(newTitle, content, color)
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    onUpdate(title, newContent, color)
  }

  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor)
    onUpdate(title, content, selectedColor)
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

      <article className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-6">
        <p className="mb-2 text-center text-[12px] text-black/40">{formatWIB(note.created_at, true)}</p>
        
        {/* Menu Pilih Warna Penanda */}
        <div className="mb-4 flex items-center justify-center gap-2.5 rounded-full bg-gray-100/80 px-3 py-1.5 self-center">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.value}
              type="button"
              title={c.name}
              onClick={() => handleColorSelect(c.value)}
              className={`size-4 rounded-full transition-all ${
                color === c.value 
                  ? 'ring-2 ring-black/70 ring-offset-2 ring-offset-gray-100' 
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>

        <input 
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Judul Catatan"
          className="mb-3 border-b border-gray-100 bg-transparent pb-2 text-[24px] font-bold outline-none"
        />

        <textarea 
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Mulai ketik catatan..."
          className="no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full flex-1 resize-none bg-transparent text-[17px] leading-relaxed outline-none"
        />
      </article>
    </div>
  )
}