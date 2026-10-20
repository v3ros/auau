'use client'

import { Navigation, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function WeatherWidget() {
  return (
    <section
      aria-label="Jakarta Weather 28° Sunny"
      className="flex aspect-square flex-col justify-between rounded-[22px] p-3.5 text-left text-white shadow-lg"
      style={{ background: 'linear-gradient(160deg, #3d7fd6 0%, #6aa8ea 100%)' }}
    >
      <div>
        <p className="flex items-center gap-1 text-sm font-semibold">
          Jakarta <Navigation className="size-3 fill-white" aria-hidden />
        </p>
        <p className="text-[44px] font-light leading-none">28°</p>
      </div>
      <div>
        <Sun className="size-5 fill-[#ffd94d] text-[#ffd94d]" aria-hidden />
        <p className="mt-1 text-sm font-medium">Sunny</p>
      </div>
    </section>
  )
}

// Inisial Hari Bahasa Inggris (Sunday, Monday, dst)
const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function CalendarWidget({ onOpen }: { onOpen?: () => void }) {
  const [currentDate, setCurrentDate] = useState({
    year: new Date().getFullYear(),
    monthIndex: new Date().getMonth(),
    today: new Date().getDate(),
    monthName: new Date().toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
  })

  useEffect(() => {
    const now = new Date()
    setCurrentDate({
      year: now.getFullYear(),
      monthIndex: now.getMonth(),
      today: now.getDate(),
      monthName: now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    })
  }, [])

  const { year, monthIndex, today, monthName } = currentDate

  // Kalkulasi jumlah hari & posisi tanggal 1 untuk bulan berjalan secara otomatis
  const firstDay = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay()
  const days = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ]

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open calendar, ${monthName} ${year}, today is ${today}`}
      className="flex aspect-square flex-col rounded-[22px] bg-white p-3 text-left text-black shadow-lg transition-transform active:scale-[0.97]"
    >
      {/* Nama Bulan Dinamis Dalam Bahasa Inggris (Contoh: NOV / OCT) */}
      <p className="text-[11px] font-bold text-[#ff3b30]">{monthName}</p>

      <div className="mt-1 grid flex-1 grid-cols-7 content-between text-center text-[9px] leading-[1.45]">
        {/* Header Nama Hari (S M T W T F S) */}
        {WEEK.map((w, i) => (
          <span key={`${w}-${i}`} className={cn('font-semibold', i === 0 ? 'text-[#ff3b30]/70' : 'text-black/45')}>
            {w}
          </span>
        ))}

        {/* Tanggal-tanggal di Kalender */}
        {cells.map((d, i) => (
          <span key={i} className="flex items-center justify-center">
            {d && (
              <span
                className={cn(
                  'flex size-[15px] items-center justify-center rounded-full font-medium',
                  d === today && 'bg-[#ff3b30] text-white',
                  d !== today && i % 7 === 0 && 'text-[#ff3b30]/80',
                )}
                aria-current={d === today ? 'date' : undefined}
              >
                {d}
              </span>
            )}
          </span>
        ))}
      </div>
    </button>
  )
}