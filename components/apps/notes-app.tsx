'use client'

import { useState } from 'react'
import { ChevronLeft, Search, SquarePen } from 'lucide-react'
import { HomeIndicator, StatusBar } from '@/components/phone/chrome'
import { useBackHandler } from '@/lib/story/back-nav'

type Note = { id: string; title: string; date: string; body: string }

const NOTES: Note[] = [
  {
    id: 'n1',
    title: 'GOOD MORNING SYSYYY',
    date: '6.30 PM',
    body: 'Morning monrninggg\n\nhaiii, seharusnya sementara ini udah cukup buat pagi ini dan bisa kamu akses tanpa masalah!!!\n\nSemoga kerjaan kamu hari ini lancar teruss yaa sampai kamu pulanggg.\n\nsemangat terus sysyyy!!',
  },
]

export function NotesApp() {
  const [openId, setOpenId] = useState<string | null>(null)
  const note = NOTES.find((n) => n.id === openId)
  useBackHandler(!!note, () => setOpenId(null))

  return (
    <div className="flex h-full flex-col bg-[#f2f2f7] text-black">
      <StatusBar />
      {note ? <NoteDetail note={note} onBack={() => setOpenId(null)} /> : <NoteList onOpen={setOpenId} />}
      <HomeIndicator className="bg-[#f2f2f7]" />
    </div>
  )
}

function NoteList({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <h1 className="pt-10 text-[32px] font-bold tracking-tight">Notes</h1>
        <div className="mt-2 flex items-center gap-2 rounded-[10px] bg-black/[0.06] px-2.5 py-2 text-[16px] text-black/40" aria-hidden>
          <Search className="size-4" />
          Search Notes
        </div>
        <ul className="mt-5 overflow-hidden rounded-[12px] bg-white">
          {NOTES.map((n, i) => {
            const preview = n.body.split('\n').filter(Boolean)[1] ?? ''
            return (
              <li key={n.id} className={i > 0 ? 'ml-4 border-t border-black/10' : undefined}>
                <button type="button" onClick={() => onOpen(n.id)} className="w-full py-2.5 pr-4 text-left active:bg-black/5 [&:not(:first-child)]:pl-0">
                  <span className={i === 0 ? 'block px-4' : 'block'}>
                    <span className="block truncate text-[16px] font-semibold">{n.title}</span>
                    <span className="mt-0.5 flex gap-2 text-[14px] text-black/45">
                      <span className="shrink-0">{n.date}</span>
                      <span className="truncate">{preview}</span>
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="flex shrink-0 items-center justify-between px-5 py-2">
        <span className="w-6" />
        <span className="text-[12px] text-black/60">{`${NOTES.length} Notes`}</span>
        <SquarePen className="size-6 text-[#e5a500]" aria-hidden />
      </div>
    </>
  )
}

function NoteDetail({ note, onBack }: { note: Note; onBack: () => void }) {
  const [title, ...rest] = note.body.split('\n')
  const bodyText = rest.join('\n').trimStart()

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="flex items-center px-2 py-2">
        <button type="button" onClick={onBack} className="flex items-center text-[17px] text-[#e5a500]">
          <ChevronLeft className="size-7" aria-hidden />
          Notes
        </button>
      </div>
      <article className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-6">
        <p className="text-center text-[12px] text-black/40">{note.date}</p>
        <h1 className="mt-3 text-[24px] font-bold">{title}</h1>
        <p className="mt-2 whitespace-pre-line text-[17px] leading-relaxed">{bodyText}</p>
        
        {/* Gambar Stiker Kucing Ditampilkan di Sini */}
        <div className="mt-6 flex justify-center">
          <img 
            src="/images/stickers/cathappy.png" 
            alt="Happy Cat" 
            className="w-20 h-20 object-contain" 
          />
        </div>
      </article>
    </div>
  )
}