'use client'

import { useEffect, useRef, useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Clock, Copy, Lock, RotateCw, Search, Share, X } from 'lucide-react'
import { HomeIndicator, StatusBar } from '@/components/phone/chrome'
import { recentSearches } from '@/lib/story/search'
import { useBackHandler } from '@/lib/story/back-nav'
import { withBasePath } from '@/lib/base-path'
import { KinPost } from './naver/kin-post'
import { DepressionResults } from './naver/depression-results'
import { FlightResults } from './naver/flight-results'
import { OriginalWorkResults } from './naver/original-work-results'
import { HansungResults } from './naver/hansung-results'
import { ChatGptResults } from './naver/chatgpt-results'
import { useStory } from '@/lib/story/store'

type View = { kind: 'portal' } | { kind: 'search' } | { kind: 'preview'; query: string }

const MENU = ['메일', '카페', '블로그', '쇼핑', '뉴스', '지도', '증권', '웹툰']

export function SafariApp() {
  const [stack, setStack] = useState<View[]>([{ kind: 'portal' }])
  const view = stack[stack.length - 1]
  const push = (v: View) => setStack((s) => [...s, v])
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s))
  useBackHandler(stack.length > 1, back)

  const address =
    view.kind === 'preview' ? `m.search.naver.com` : 'm.naver.com'

  return (
    <div className="flex h-full flex-col bg-white text-black">
      <StatusBar />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
        {view.kind === 'portal' && <Portal onSearch={() => push({ kind: 'search' })} />}
        {view.kind === 'search' && (
          <SearchPanel onCancel={back} onSubmit={(q) => push({ kind: 'preview', query: q })} />
        )}
        {view.kind === 'preview' && <Preview query={view.query} onSearch={() => push({ kind: 'search' })} />}
      </div>
      <div className="shrink-0 border-t border-black/[0.06] bg-[#f9f9f9]/95 px-3 pb-0 pt-2 backdrop-blur">
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[15px] shadow-[0_1px_6px_rgba(0,0,0,0.12)]">
          <span className="text-[13px] font-semibold" aria-hidden>
            가가
          </span>
          <span className="flex flex-1 items-center justify-center gap-1">
            <Lock className="size-3 text-black/50" aria-hidden />
            {address}
          </span>
          <RotateCw className="size-4" aria-hidden />
        </div>
        <nav aria-label="Safari 도구" className="flex items-center justify-between px-3 py-2 text-[#007aff]">
          <button type="button" onClick={back} disabled={stack.length === 1} aria-label="뒤로" className="p-1 disabled:text-black/20">
            <ChevronLeft className="size-6" />
          </button>
          <span aria-hidden className="p-1 text-black/20">
            <ChevronRight className="size-6" />
          </span>
          <span aria-hidden className="p-1 text-black/20">
            <Share className="size-5" />
          </span>
          <span aria-hidden className="p-1 text-black/20">
            <BookOpen className="size-5" />
          </span>
          <span aria-hidden className="p-1 text-black/20">
            <Copy className="size-5" />
          </span>
        </nav>
      </div>
      <HomeIndicator className="bg-[#f7f7f7]" />
    </div>
  )
}

function NaverN({ className = 'size-7' }: { className?: string }) {
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-[7px] bg-[#03c75a] ${className}`} aria-hidden>
      <svg viewBox="0 0 20 20" className="size-[55%] fill-white">
        <path d="M13.6 10.7 6.1 0H0v20h6.4V9.3L13.9 20H20V0h-6.4z" />
      </svg>
    </span>
  )
}

const MENU_COLORS: Record<string, string> = {
  메일: '#03c75a',
  카페: '#03c75a',
  블로그: '#03c75a',
  쇼핑: '#00b843',
  뉴스: '#2d7cf6',
  지도: '#00c4b4',
  증권: '#f04f4f',
  웹툰: '#00dc64',
}

const FEED_TABS = ['홈', '쇼핑', '뉴스', '경제', '엔터', '스포츠', '웹툰']

function Portal({ onSearch }: { onSearch: () => void }) {
  return (
    <div className="pb-6">
      <div className="bg-white px-4 pb-4 pt-3">
        <button
          type="button"
          onClick={onSearch}
          className="flex w-full items-center gap-2.5 rounded-[12px] border-[2px] border-[#03c75a] py-2 pl-2 pr-3 text-left shadow-[0_2px_8px_rgba(3,199,90,0.12)]"
        >
          <NaverN />
          <span className="flex-1 text-[16px] text-black/35">검색어를 입력해 주세요.</span>
          <Search className="size-[22px] text-[#03c75a]" strokeWidth={2.4} aria-hidden />
        </button>
        <ul className="mt-5 grid grid-cols-4 gap-y-4 text-center text-[12px] text-[#404040]">
          {MENU.map((m) => (
            <li key={m} className="flex flex-col items-center gap-1.5">
              <span
                className="flex size-[46px] items-center justify-center rounded-[16px] text-[15px] font-extrabold text-white"
                style={{ backgroundColor: MENU_COLORS[m] }}
                aria-hidden
              >
                {m.slice(0, 1)}
              </span>
              {m}
            </li>
          ))}
        </ul>
      </div>
      <div className="h-2 bg-[#f1f3f5]" />
      <nav aria-hidden className="no-scrollbar flex gap-5 overflow-x-auto border-b border-black/[0.06] px-4 text-[15px] text-[#777]">
        {FEED_TABS.map((t, i) => (
          <span key={t} className={i === 0 ? 'shrink-0 border-b-2 border-black py-2.5 font-bold text-black' : 'shrink-0 py-2.5'}>
            {t}
          </span>
        ))}
      </nav>
      <section className="mx-4 mt-4 rounded-[14px] border border-black/[0.06] px-4 py-4">
        <p className="text-[13px] text-[#777]">서울시 성동구</p>
        <div className="mt-1 flex items-end justify-between">
          <p className="text-[32px] font-semibold leading-none tracking-tight">8°</p>
          <p className="text-right text-[13px] leading-snug text-[#555]">
            맑음 · 어제보다 2° 낮아요
            <br />
            미세먼지 좋음 · 초미세먼지 보통
          </p>
        </div>
      </section>
      <section className="mx-4 mt-3 overflow-hidden rounded-[14px] border border-black/[0.06]" aria-labelledby="portal-news">
        <p className="px-4 pt-3 text-[13px] font-bold text-[#2d7cf6]">뉴스</p>
        <img
          src={withBasePath('/images/naver/concert-news.png')}
          alt="콘서트장을 가득 채운 관객과 무대 조명"
          className="mt-2 aspect-[16/9] w-full object-cover"
        />
        <div className="px-4 py-3">
          <h2 id="portal-news" className="text-[16px] font-bold leading-snug">
            {"한국 대표 밴드 '데이식스', 이번 콘서트도 전석 매진..."}
          </h2>
          <p className="mt-1 text-[12.5px] text-black/45">스타뉴스 · 32분 전</p>
        </div>
      </section>
    </div>
  )
}

function SearchPanel({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="pb-6">
      <form
        className="flex items-center gap-2 border-b border-black/10 px-3 py-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (query.trim()) onSubmit(query.trim())
        }}
      >
        <label className="flex flex-1 items-center gap-2 rounded-full border-2 border-[#03c75a] px-3 py-2">
          <span className="sr-only">검색어</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault()
            }}
            enterKeyHint="search"
            placeholder="검색어를 입력해 주세요."
            className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-black/30"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="검색어 지우기">
              <X className="size-4 text-black/40" />
            </button>
          )}
        </label>
        <button type="button" onClick={onCancel} className="text-[15px] text-black/60">
          취소
        </button>
      </form>
      <p className="px-4 pb-1 pt-4 text-[13px] font-semibold text-black/50">최근 검색어</p>
      <ul>
        {recentSearches.map((q) => (
          <li key={q}>
            <button
              type="button"
              onClick={() => onSubmit(q)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[15px] active:bg-black/5"
            >
              <Clock className="size-4 shrink-0 text-black/30" aria-hidden />
              <span className="min-w-0 flex-1 truncate">{q}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Preview({ query, onSearch }: { query: string; onSearch: () => void }) {
  const { openApp } = useStory()
  const normalized = query.replace(/\s+/g, '').toLowerCase()
  return (
    <div className="pb-6">
      <div className="flex items-center gap-2 border-b border-black/10 px-3 py-2">
        <NaverN className="size-6" />
        <button
          type="button"
          onClick={onSearch}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-[12px] border-2 border-[#03c75a] px-3 py-2 text-left text-[15px]"
        >
          <span className="min-w-0 flex-1 truncate">{query}</span>
          <Search className="size-4 shrink-0 text-[#03c75a]" aria-hidden />
        </button>
      </div>
      <div className="flex gap-4 border-b border-black/10 px-4 py-2 text-[14px] text-black/40" aria-hidden>
        <span className="border-b-2 border-black pb-1 font-semibold text-black">통합</span>
        <span>이미지</span>
        <span>VIEW</span>
        <span>지식iN</span>
      </div>
      {query === '개짜증나게 연락하는 남자 차단법' ? (
        <KinPost />
      ) : query === '갑자기 우울할때' ? (
        <DepressionResults />
      ) : query === '캐나다에서 한국 비행시간' ? (
        <FlightResults />
      ) : query === '배경 원작' ? (
        <OriginalWorkResults />
      ) : normalized === '강남한성초밥영업시간' || normalized === '한성초밥영업시간' || normalized === '강남한성초밥' ? (
        <HansungResults />
      ) : ['챗지피티', '쳇지피티', 'chatgpt', '챗gpt'].includes(normalized) ? (
        <ChatGptResults onOpenAnyAi={() => openApp('anyai')} />
      ) : (
        <NoResults query={query} />
      )}
    </div>
  )
}

function NoResults({ query }: { query: string }) {
  return (
      <div className="px-5 pt-10">
        <p className="text-[16px] font-semibold leading-snug">
          <span className="text-[#03c75a]">{`'${query}'`}</span>에 대한 검색결과가 없습니다.
        </p>
        <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[13.5px] text-[#666]">
          <li>단어의 철자가 정확한지 확인해 보세요.</li>
          <li>검색어의 단어 수를 줄이거나, 보다 일반적인 검색어로 다시 검색해 보세요.</li>
          <li>두 단어 이상의 검색어인 경우, 띄어쓰기를 확인해 보세요.</li>
        </ul>
      </div>
  )
}
