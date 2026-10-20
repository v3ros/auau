'use client'

import { AlarmClock, Globe, Plus, Timer, Watch } from 'lucide-react'
import { HomeIndicator, StatusBar } from '@/components/phone/chrome'
import { useStory } from '@/lib/story/store'

const CITIES = [
  { city: '서울', diff: '오늘, +0시간', offset: 0 },
  { city: '도쿄', diff: '오늘, +0시간', offset: 0 },
  { city: '밴쿠버', diff: '오늘, -17시간', offset: -17 },
  { city: '런던', diff: '오늘, -9시간', offset: -9 },
]

function shift(clock: string, offset: number) {
  const [h, m] = clock.split(':').map(Number)
  const hh = (((h + offset) % 24) + 24) % 24
  return `${hh < 12 ? '오전' : '오후'} ${hh % 12 === 0 ? 12 : hh % 12}:${String(m).padStart(2, '0')}`
}

export function ClockApp() {
  const { clock } = useStory()
  return (
    <div className="flex h-full flex-col bg-black text-white">
      <StatusBar tone="light" />
      <div className="flex justify-between px-4 py-2 text-[17px] text-[#ff9f0a]" aria-hidden>
        <span>편집</span>
        <Plus className="size-6" />
      </div>
      <h1 className="px-4 pb-2 text-[34px] font-bold">세계 시계</h1>
      <ul className="min-h-0 flex-1 overflow-y-auto px-4">
        {CITIES.map((c) => {
          const [ampm, time] = shift(clock, c.offset).split(' ')
          return (
            <li key={c.city} className="flex items-end justify-between border-b border-white/15 py-3">
              <span>
                <span className="block text-[13px] text-white/50">{c.diff}</span>
                <span className="block text-[24px]">{c.city}</span>
              </span>
              <span className="text-[50px] font-light leading-none tabular-nums">
                <span className="mr-1 text-[22px]">{ampm}</span>
                {time}
              </span>
            </li>
          )
        })}
      </ul>
      <nav aria-hidden className="grid grid-cols-4 border-t border-white/10 py-2 text-center text-[10px] text-white/45">
        <span className="flex flex-col items-center gap-0.5 text-[#ff9f0a]">
          <Globe className="size-6" />
          세계 시계
        </span>
        <span className="flex flex-col items-center gap-0.5">
          <AlarmClock className="size-6" />
          알람
        </span>
        <span className="flex flex-col items-center gap-0.5">
          <Watch className="size-6" />
          스톱워치
        </span>
        <span className="flex flex-col items-center gap-0.5">
          <Timer className="size-6" />
          타이머
        </span>
      </nav>
      <HomeIndicator tone="light" className="bg-black" />
    </div>
  )
}
