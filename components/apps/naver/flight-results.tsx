import { withBasePath } from '@/lib/base-path'
import { ArrowLeftRight, CalendarDays, Plane, UserRound } from 'lucide-react'

const ROUTES = [
  { from: '밴쿠버 YVR', to: '인천 ICN', time: '약 11시간 15분', note: '직항' },
  { from: '토론토 YYZ', to: '인천 ICN', time: '약 13시간 50분', note: '직항' },
  { from: '몬트리올 YUL', to: '인천 ICN', time: '약 17시간 30분', note: '1회 경유' },
]

const FARES = [
  { airline: '대한항공', time: '13:20 → 16:35 (+1)', duration: '11시간 15분', price: '1,284,000원' },
  { airline: '에어캐나다', time: '12:05 → 15:30 (+1)', duration: '11시간 25분', price: '1,159,800원' },
  { airline: '아시아나항공', time: '14:30 → 17:50 (+1)', duration: '11시간 20분', price: '1,231,500원' },
]

export function FlightResults() {
  return (
    <div className="bg-[#f2f4f6] pb-8">
      <section className="bg-white px-4 pb-5 pt-4" aria-labelledby="flight-time">
        <p className="text-[13px] text-black/45">캐나다 → 한국 비행시간</p>
        <p id="flight-time" className="mt-1 text-[26px] font-bold tracking-tight">
          약 11~14시간
        </p>
        <p className="text-[13px] text-black/50">직항 기준 · 출발 도시에 따라 달라요</p>
        <img
          src={withBasePath('/images/naver/flight-map.png')}
          alt="캐나다에서 태평양을 건너 인천으로 이어지는 항공 경로 지도"
          className="mt-4 aspect-[16/9] w-full rounded-[10px] object-cover"
        />
        <ul className="mt-4 divide-y divide-black/[0.06]">
          {ROUTES.map((r) => (
            <li key={r.from} className="flex items-center justify-between py-2.5 text-[14px]">
              <span className="flex items-center gap-1.5">
                {r.from}
                <Plane className="size-3.5 text-[#03c75a]" aria-hidden />
                {r.to}
              </span>
              <span className="text-right">
                <span className="font-semibold">{r.time}</span>
                <span className="ml-1.5 text-[12px] text-black/40">{r.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-2 bg-white px-4 py-5" aria-labelledby="flight-booking">
        <h2 id="flight-booking" className="flex items-center gap-1.5 text-[16px] font-bold">
          <span className="text-[#03c75a]">N</span> 항공권 예매
        </h2>
        <div className="mt-3 rounded-[12px] border border-black/10">
          <div className="flex items-center justify-between px-4 py-3">
            <span>
              <span className="block text-[12px] text-black/40">출발</span>
              <span className="text-[17px] font-bold">YVR</span> <span className="text-[13px]">밴쿠버</span>
            </span>
            <ArrowLeftRight className="size-4 text-black/40" aria-hidden />
            <span className="text-right">
              <span className="block text-[12px] text-black/40">도착</span>
              <span className="text-[13px]">인천</span> <span className="text-[17px] font-bold">ICN</span>
            </span>
          </div>
          <div className="flex divide-x divide-black/10 border-t border-black/10 text-[14px]">
            <span className="flex flex-1 items-center gap-1.5 px-4 py-2.5">
              <CalendarDays className="size-4 text-black/40" aria-hidden />
              11.26(수) 편도
            </span>
            <span className="flex flex-1 items-center gap-1.5 px-4 py-2.5">
              <UserRound className="size-4 text-black/40" aria-hidden />
              성인 1 · 일반석
            </span>
          </div>
        </div>
        <button type="button" className="mt-3 w-full rounded-[10px] bg-[#03c75a] py-3 text-[15px] font-bold text-white">
          항공권 검색
        </button>
        <ul className="mt-4 flex flex-col gap-2">
          {FARES.map((f) => (
            <li key={f.airline} className="flex items-center justify-between rounded-[10px] bg-[#f7f8fa] px-3 py-3">
              <span>
                <span className="block text-[14px] font-semibold">{f.airline}</span>
                <span className="text-[12.5px] text-black/50">
                  {f.time} · {f.duration}
                </span>
              </span>
              <span className="text-[15px] font-bold text-[#f04f4f]">{f.price}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
