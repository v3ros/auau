import { Clock, MapPin, Phone, Star } from 'lucide-react'
import { withBasePath } from '@/lib/base-path'

const HOURS = [
  ['월~금', '11:30 - 22:00'],
  ['토·일', '12:00 - 21:30'],
  ['브레이크타임', '15:00 - 17:00'],
  ['라스트오더', '21:00'],
]

const BLOGS = [
  {
    author: '먹보 직장인의 하루',
    date: '2025.11.12.',
    title: '강남역 초밥 맛집 한성초밥, 점심 특선 후기',
    body: '네타가 두툼하고 밥 온도가 딱 적당해요. 점심 특선 가격 대비 구성이 정말 좋아서 회사 동료들이랑 벌써 세 번째 방문...',
    img: '/images/naver/sushi-1.png',
  },
  {
    author: '서울 미식 기록',
    date: '2025.11.03.',
    title: '[강남] 한성초밥 오마카세 런치 솔직 리뷰',
    body: '셰프님이 하나하나 설명해 주셔서 좋았고, 광어 지느러미랑 참치 뱃살이 입에서 녹았어요. 재방문 의사 100%입니다.',
    img: '/images/naver/sushi-2.png',
  },
]

const CAFES = [
  { cafe: '강남맛집탐방', title: '한성초밥 영업시간 바뀌었나요?', body: '평일은 22시까지, 브레이크타임 15~17시예요. 저녁은 웨이팅 있으니 예약 추천합니다!', date: '2025.11.15.' },
  { cafe: '직장인 점심 모임', title: '강남역 근처 초밥집 추천 부탁드려요', body: '한성초밥 강추요. 연어랑 장어 초밥 진짜 맛있고 사장님도 친절하세요 ㅎㅎ', date: '2025.11.08.' },
  { cafe: '서울 데이트 코스', title: '기념일 저녁 한성초밥 다녀왔어요', body: '카운터석 분위기 좋고 디저트까지 서비스로 주셔서 감동이었어요. 별점 5개 드립니다.', date: '2025.10.29.' },
]

export function HansungResults() {
  return (
    <div className="bg-[#f1f3f5] pb-4">
      <section className="bg-white" aria-labelledby="hansung-title">
        <img src={withBasePath('/images/naver/hansung-map.png')} alt="한성초밥 위치 지도" className="aspect-[16/9] w-full object-cover" />
        <div className="px-4 pb-4 pt-3">
          <div className="flex items-baseline gap-1.5">
            <h2 id="hansung-title" className="text-[20px] font-bold text-[#0068c3]">
              한성초밥
            </h2>
            <span className="text-[13px] text-black/45">초밥,롤</span>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[13.5px] text-black/60">
            <span className="flex items-center gap-0.5 font-semibold text-black">
              <Star className="size-3.5 fill-[#ff5c3a] text-[#ff5c3a]" aria-hidden />
              4.8
            </span>
            <span>방문자 리뷰 1,284</span>
            <span>블로그 리뷰 562</span>
          </p>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[12px] text-black/70" aria-hidden>
            {['출발', '도착', '저장', '공유'].map((t) => (
              <span key={t} className="rounded-lg border border-black/10 py-2">
                {t}
              </span>
            ))}
          </div>
          <ul className="mt-4 flex flex-col gap-3 text-[14px]">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-black/40" aria-hidden />
              <span>
                서울 강남구 강남대로102길 30 1층
                <span className="block text-[12.5px] text-black/45">강남역 11번 출구에서 286m</span>
              </span>
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-black/40" aria-hidden />
              <span className="flex-1">
                <span className="font-semibold text-[#03c75a]">영업 중</span>
                <span className="text-black/60"> · 22:00에 영업 종료</span>
                <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[13px]">
                  {HOURS.map(([d, h]) => (
                    <div key={d} className="contents">
                      <dt className="text-black/50">{d}</dt>
                      <dd>{h}</dd>
                    </div>
                  ))}
                </dl>
              </span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-black/40" aria-hidden />
              <span>02-555-7812</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-2 bg-white px-4 py-4" aria-labelledby="hansung-blog">
        <h2 id="hansung-blog" className="text-[17px] font-bold">
          블로그
        </h2>
        <ul className="mt-2 divide-y divide-black/[0.06]">
          {BLOGS.map((b) => (
            <li key={b.title} className="flex gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-[12px] text-black/45">
                  {b.author} · {b.date}
                </p>
                <p className="mt-1 text-[15px] font-semibold leading-snug text-[#0068c3]">{b.title}</p>
                <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-black/60">{b.body}</p>
              </div>
              <img src={withBasePath(b.img)} alt="" className="size-[84px] shrink-0 rounded-lg object-cover" />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-2 bg-white px-4 py-4" aria-labelledby="hansung-cafe">
        <h2 id="hansung-cafe" className="text-[17px] font-bold">
          카페
        </h2>
        <ul className="mt-2 divide-y divide-black/[0.06]">
          {CAFES.map((c) => (
            <li key={c.title} className="py-3">
              <p className="text-[12px] text-black/45">
                {c.cafe} · {c.date}
              </p>
              <p className="mt-1 text-[15px] font-semibold leading-snug text-[#0068c3]">{c.title}</p>
              <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-black/60">{c.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
