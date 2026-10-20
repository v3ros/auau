'use client'

import { useState } from 'react'
import { ArrowUp, ChevronDown, Copy, Mic, Plus, RefreshCw, Search, SquarePen, ThumbsDown, ThumbsUp, Volume2 } from 'lucide-react'
import { HomeIndicator, StatusBar } from '@/components/phone/chrome'
import { AppGlyph } from '@/components/phone/app-icons'
import { useBackHandler } from '@/lib/story/back-nav'
import { aiChats, type AiBlock } from '@/lib/story/anyai'

export function AnyAiApp() {
  const [chatId, setChatId] = useState(aiChats[0].id)
  const [listOpen, setListOpen] = useState(false)
  const chat = aiChats.find((c) => c.id === chatId) ?? aiChats[0]
  useBackHandler(listOpen, () => setListOpen(false))

  return (
    <div className="relative flex h-full flex-col bg-white text-[#0d0d0d]">
      <StatusBar />
      <header className="flex h-12 shrink-0 items-center justify-between px-3">
        <button
          type="button"
          onClick={() => setListOpen(true)}
          aria-label="대화 목록 열기"
          className="flex size-9 flex-col items-start justify-center gap-[5px] pl-1.5"
        >
          <span className="h-[2px] w-[18px] rounded-full bg-current" />
          <span className="h-[2px] w-[12px] rounded-full bg-current" />
        </button>
        <h2 className="flex items-center gap-1 text-[17px] font-semibold">
          any ai
          <ChevronDown className="size-4 text-black/40" aria-hidden />
        </h2>
        <SquarePen className="size-[22px]" strokeWidth={1.8} aria-hidden />
      </header>
      <div key={chat.id} className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-2">
        {chat.turns.map((turn) => (
          <section key={turn.id} className="flex flex-col gap-5 py-3">
            <p className="ml-auto max-w-[80%] whitespace-pre-wrap rounded-[22px] bg-[#f1f1f1] px-4 py-2.5 text-[15.5px] leading-snug">
              {turn.question}
            </p>
            <div className="flex gap-2.5">
              <span className="mt-0.5 size-7 shrink-0 overflow-hidden rounded-full" aria-hidden>
                <AppGlyph kind="anyai" />
              </span>
              <div className="min-w-0 flex-1">
                <Answer blocks={turn.answer} />
                <div className="mt-3 flex items-center gap-4 text-black/45" aria-hidden>
                  <Copy className="size-[17px]" />
                  <ThumbsUp className="size-[17px]" />
                  <ThumbsDown className="size-[17px]" />
                  <Volume2 className="size-[17px]" />
                  <RefreshCw className="size-[17px]" />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
      <div className="shrink-0 px-3 pb-1 pt-1">
        <div className="flex items-center gap-2 rounded-[28px] border border-black/10 bg-white px-2.5 py-2 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/10" aria-hidden>
            <Plus className="size-5" strokeWidth={1.8} />
          </span>
          <input
            disabled
            aria-label="메시지 입력 (사용할 수 없음)"
            placeholder="무엇이든 물어보세요"
            className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-black/40 disabled:cursor-default"
          />
          <Mic className="size-5 shrink-0 text-black/60" aria-hidden />
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black/15 text-white" aria-hidden>
            <ArrowUp className="size-5" strokeWidth={2.4} />
          </span>
        </div>
        <p className="pt-2 text-center text-[11px] text-black/40">any ai는 실수를 할 수 있습니다. 중요한 정보는 확인하세요.</p>
      </div>
      <HomeIndicator />

      {listOpen && (
        <ChatList
          activeId={chat.id}
          onClose={() => setListOpen(false)}
          onSelect={(id) => {
            setChatId(id)
            setListOpen(false)
          }}
        />
      )}
    </div>
  )
}

function ChatList({ activeId, onSelect, onClose }: { activeId: string; onSelect: (id: string) => void; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex">
      <nav aria-label="대화 목록" className="flex h-full w-[82%] flex-col bg-[#f9f9f9] pt-12 shadow-xl">
        <div className="flex items-center gap-2 px-4 pb-3">
          <div className="flex flex-1 items-center gap-2 rounded-[10px] bg-black/[0.06] px-3 py-2 text-[15px] text-black/40" aria-hidden>
            <Search className="size-4" />
            검색
          </div>
          <SquarePen className="size-[22px] text-black/70" strokeWidth={1.8} aria-hidden />
        </div>
        <p className="px-4 pb-1 pt-3 text-[12.5px] font-semibold text-black/45">최근 대화</p>
        <ul className="flex flex-col px-2">
          {aiChats.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                aria-current={c.id === activeId ? 'true' : undefined}
                className={`w-full truncate rounded-[10px] px-3 py-2.5 text-left text-[15px] ${
                  c.id === activeId ? 'bg-black/[0.07] font-medium' : 'active:bg-black/5'
                }`}
              >
                {c.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <button type="button" aria-label="대화 목록 닫기" onClick={onClose} className="flex-1 bg-black/30" />
    </div>
  )
}

function Answer({ blocks }: { blocks: AiBlock[] }) {
  return (
    <div className="flex flex-col gap-2 text-[15.5px] leading-[1.65]">
      {blocks.map((b, i) =>
        b.type === 'h' ? (
          <h3 key={i} className="mt-2 font-semibold">
            {b.text}
          </h3>
        ) : b.type === 'draft' ? (
          <div key={i} className="my-1 whitespace-pre-wrap rounded-[14px] border border-black/10 bg-[#f7f7f8] px-3.5 py-3 text-[14px] leading-[1.7]">
            {b.text}
          </div>
        ) : (
          <p key={i}>{b.text}</p>
        ),
      )}
    </div>
  )
}
