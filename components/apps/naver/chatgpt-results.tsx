import { AppGlyph } from '@/components/phone/app-icons'

export function ChatGptResults({ onOpenAnyAi }: { onOpenAnyAi: () => void }) {
  return (
    <div className="bg-[#f1f3f5] pb-4">
      <section className="bg-white px-4 py-4" aria-labelledby="anyai-result">
        <p className="text-[12px] text-black/45">사이트</p>
        <button type="button" onClick={onOpenAnyAi} className="mt-2 flex w-full items-center gap-3 text-left">
          <span className="size-11 shrink-0">
            <AppGlyph kind="anyai" />
          </span>
          <span className="min-w-0 flex-1">
            <span id="anyai-result" className="block text-[18px] font-bold text-[#0068c3] underline-offset-2 active:underline">
              any ai
            </span>
            <span className="block truncate text-[13px] text-[#00a33b]">https://anyai.chat</span>
          </span>
        </button>
        <p className="mt-2 text-[13.5px] leading-snug text-black/60">
          무엇이든 물어보세요. any ai가 대화로 답하고, 글쓰기·요약·번역·아이디어까지 함께 도와드립니다.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {['새 채팅 시작', '로그인', '이용 가이드'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={onOpenAnyAi}
              className="rounded-full border border-black/10 px-3 py-1.5 text-[13px] text-black/70 active:bg-black/5"
            >
              {t}
            </button>
          ))}
        </div>
      </section>
      <section className="mt-2 bg-white px-4 py-4">
        <h2 className="text-[17px] font-bold">관련 검색어</h2>
        <ul className="mt-2 flex flex-wrap gap-2 text-[13px] text-black/70">
          {['any ai 사용법', 'any ai 무료', 'AI 챗봇 추천', '챗지피티 대체'].map((t) => (
            <li key={t} className="rounded-full bg-[#f1f3f5] px-3 py-1.5">
              {t}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
