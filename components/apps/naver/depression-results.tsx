import { withBasePath } from '@/lib/base-path'

type Result = { source: '카페' | '블로그' | '지식iN'; site: string; date: string; title: string; snippet: string; thumb?: string }

const RESULTS: Result[] = [
  {
    source: '블로그',
    site: '하루하루 마음일기',
    date: '3일 전',
    title: '갑자기 우울할 때, 제가 하는 5가지 방법',
    snippet: '이유 없이 갑자기 마음이 가라앉는 날이 있어요. 그럴 땐 산책을 하거나 따뜻한 차를 마셔요...',
    thumb: '/images/naver/blog-1.png',
  },
  {
    source: '카페',
    site: '마음쉼터 (회원 12만)',
    date: '2025.10.30',
    title: '요즘 이유없이 우울하고 눈물이 나요',
    snippet: '평소처럼 지내다가도 갑자기 기분이 확 다운돼요. 다들 이럴 때 어떻게 하시나요? 댓글 47',
  },
  {
    source: '지식iN',
    site: '정신건강의학과 전문의 답변',
    date: '2025.08.14',
    title: '갑자기 우울감이 몰려오는데 우울증인가요?',
    snippet: '일시적인 기분 저하와 우울증은 구분이 필요합니다. 2주 이상 지속된다면 상담을 권해드립니다.',
  },
  {
    source: '블로그',
    site: '소소한 위로',
    date: '1주 전',
    title: '우울할 때 듣기 좋은 노래 플레이리스트',
    snippet: '혼자 있는 밤, 마음을 조용히 다독여 주는 노래들을 모아봤어요. 1. 예뻤어 2. 한 페이지가 될 수 있게...',
    thumb: '/images/naver/blog-2.png',
  },
  {
    source: '카페',
    site: '20대 고민상담소',
    date: '2025.11.02',
    title: '사람 만나는 게 지치고 갑자기 우울해질 때',
    snippet: '연락 오는 것도 부담스럽고 그냥 다 내려놓고 싶을 때가 있어요. 저만 그런 거 아니죠? 댓글 89',
  },
  {
    source: '블로그',
    site: '건강한 하루',
    date: '2025.09.21',
    title: '우울증 자가진단 체크리스트 (PHQ-9)',
    snippet: '최근 2주 동안 다음 증상을 얼마나 자주 겪었는지 체크해 보세요. 점수가 높다면 전문가와...',
  },
]

const SOURCE_COLOR: Record<Result['source'], string> = { 카페: '#03c75a', 블로그: '#20c06b', 지식iN: '#1e88e5' }

export function DepressionResults() {
  return (
    <div className="bg-[#f2f4f6] pb-8">
      <section className="bg-white px-4 py-4" aria-label="도움 안내">
        <p className="text-[14px] font-semibold">마음이 힘드신가요?</p>
        <p className="mt-1 text-[13px] leading-relaxed text-black/55">
          혼자 고민하지 마세요. 정신건강 위기상담 109 · 정신건강상담 1577-0199에서 24시간 도움을 받을 수 있어요.
        </p>
      </section>
      <ul className="mt-2 flex flex-col gap-2">
        {RESULTS.map((r) => (
          <li key={r.title} className="bg-white px-4 py-4">
            <p className="flex items-center gap-1.5 text-[12.5px] text-black/45">
              <span className="font-semibold" style={{ color: SOURCE_COLOR[r.source] }}>
                {r.source}
              </span>
              <span>{r.site}</span>
              <span aria-hidden>·</span>
              <span>{r.date}</span>
            </p>
            <div className="mt-1.5 flex gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-[16px] font-semibold leading-snug text-[#1a0dab]">{r.title}</h3>
                <p className="mt-1 line-clamp-3 text-[13.5px] leading-relaxed text-black/60">{r.snippet}</p>
              </div>
              {r.thumb && (
                <img src={withBasePath(r.thumb)} alt="" className="size-[76px] shrink-0 rounded-[8px] object-cover" />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
