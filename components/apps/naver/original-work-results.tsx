import { ExternalLink } from 'lucide-react'

const ORIGINAL_URL = 'https://posty.pe/psrvogbuc'

export function OriginalWorkResults() {
  return (
    <div className="flex flex-col gap-2 bg-[#f3f4f6] pb-4 pt-2">
      <section className="bg-white px-4 py-4">
        <p className="text-[12px] font-semibold text-[#03c75a]">웹사이트</p>
        <a
          href={ORIGINAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block active:opacity-70"
        >
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-[#1f1f1f] text-[11px] font-bold text-white" aria-hidden>
              P
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] text-black/80">포스타입</span>
              <span className="block truncate text-[12px] text-black/40">posty.pe › psrvogbuc</span>
            </span>
          </span>
          <span className="mt-2 flex items-center gap-1 text-[18px] font-semibold text-[#2b45ba] underline-offset-2">
            나의 무심한 다정에게
            <ExternalLink className="size-4 shrink-0" aria-hidden />
          </span>
          <span className="mt-1 block text-[14px] leading-relaxed text-black/60">
            {'배경 원작 「나의 무심한 다정에게」 연재 페이지입니다. 링크를 누르면 원작 홈페이지로 이동합니다.'}
          </span>
        </a>
      </section>
      <section className="bg-white px-4 py-3">
        <p className="text-[13px] text-black/45">{"'배경 원작' 관련 다른 검색결과가 없습니다."}</p>
      </section>
    </div>
  )
}
