'use client'

import { useState } from 'react'
import { ChevronLeft, Search, SquarePen } from 'lucide-react'
import { HomeIndicator, StatusBar } from '@/components/phone/chrome'
import { useBackHandler } from '@/lib/story/back-nav'

type Note = { id: string; title: string; date: string; body: string }

const NOTES: Note[] = [
  {
    id: 'n1',
    title: 'Road to Mythical Glory Draft Pick',
    date: '5:42 PM',
    body: 'Road to Mythical Glory Draft Pick\n\nPriority picks for current meta:\n- Jungler: Ling, Fanny, Hayabusa (secure purple buff early!)\n- Gold Lane: Brody, Claude, Moskov\n- Mid Lane: Valentina, Novaria, Faramis\n- Exp Lane: Yu Zhong, Cici, Arlott\n- Roam: Tigreal, Mathilda, Minotaur\n\nJangan lupa ban Diggie sama Nana kalau musuh first pick!',
  },
  {
    id: 'n2',
    title: 'Hero Build & Emblem Setup',
    date: 'Yesterday',
    body: 'Hero Build & Emblem Setup\n\nAssassin Emblem:\n- Rupture (Adaptive Attack & Penetration)\n- Master Assassin (Damage bonus 1v1)\n- Lethal Ignition (Extra burn damage)\n\nBattle Spell:\n- Retribution for Jungler\n- Flicker for Marksman / Mage',
  },
  {
    id: 'n3',
    title: 'Squad & Tournament Strategy',
    date: 'Yesterday',
    body: 'Squad & Tournament Strategy\n\n1. Objective first: Turtle before 2 minutes.\n2. Do not split push when Lord is spawning in 30 seconds.\n3. Communication is key: Always spam "Launch the Attack!" or "Gather, Team!"',
  },
  {
    id: 'n4',
    title: 'MCL Schedule & Registration',
    date: '2025. 10. 14.',
    body: 'MCL Schedule & Registration\n\nSaturday Night: 20:00 WIB\nRequirements: Weekly Activity Points > 100\nSquad members must be online 15 minutes prior.',
  },
  {
    id: 'n5',
    title: 'Epic Comeback Moments',
    date: '2025. 10. 02.',
    body: 'Epic Comeback Moments\n\n1. 1v5 Savage with Ling in base defense.\n2. Base HP 1% clutch Lord steal.\n3. Win streak 10 matches in a row!',
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
          Search MLBB Notes
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
        <p className="mt-2 whitespace-pre-line text-[17px] leading-relaxed">{rest.join('\n').trimStart()}</p>
      </article>
    </div>
  )
}