'use client'

import { Plus, Search } from 'lucide-react'
import { useState, useEffect } from 'react'

export function CalendarApp() {
  const [currentDate, setCurrentDate] = useState({
    year: new Date().getFullYear(),
    monthIndex: new Date().getMonth(),
    today: new Date().getDate(),
    monthName: new Date().toLocaleDateString('en-US', { month: 'long' }),
  })

  useEffect(() => {
    const now = new Date()
    setCurrentDate({
      year: now.getFullYear(),
      monthIndex: now.getMonth(),
      today: now.getDate(),
      monthName: now.toLocaleDateString('en-US', { month: 'long' }),
    })
  }, [])

  const { year, monthIndex, today, monthName } = currentDate

  const firstDay = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay()
  const days = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ]

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="flex h-full flex-col bg-white text-black">
      {/* Header Atas (Tanpa tombol panah kembali, hanya Tahun & Aksi Kanan) */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 text-[#ff3b30]">
        <span className="text-[17px] font-semibold">{year}</span>
        <div className="flex gap-4">
          <Search className="size-5" />
          <Plus className="size-5" />
        </div>
      </div>

      {/* Judul Bulan */}
      <div className="px-4 py-2">
        <h1 className="text-3xl font-bold">{monthName}</h1>
      </div>

      {/* Grid Nama Hari */}
      <div className="grid grid-cols-7 border-b border-gray-200 px-2 py-2 text-center text-xs font-semibold text-gray-400">
        {weekDays.map((day, index) => (
          <span key={index}>{day}</span>
        ))}
      </div>

      {/* Tanggal-tanggal */}
      <div className="grid grid-cols-7 px-2 py-2 text-center text-sm">
        {cells.map((d, i) => (
          <div key={i} className="flex h-10 items-center justify-center">
            {d && (
              <span
                className={`flex size-8 items-center justify-center rounded-full ${
                  d === today ? 'bg-[#ff3b30] font-bold text-white' : 'text-black'
                }`}
              >
                {d}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* List Event / Agenda Contoh */}
      <div className="mt-4 flex-1 border-t border-gray-200 px-4 pt-4">
        <div className="flex items-center gap-3 py-2">
          <div className="h-10 w-1 rounded-full bg-blue-500" />
          <div>
            <p className="text-sm font-semibold">Supplementary Class</p>
            <p className="text-xs text-gray-400">14:00</p>
          </div>
        </div>
        <div className="flex items-center gap-3 py-2">
          <div className="h-10 w-1 rounded-full bg-purple-500" />
          <div>
            <p className="text-sm font-semibold">Finish Work / Clock Out</p>
            <p className="text-xs text-gray-400">19:00</p>
          </div>
        </div>
      </div>

      {/* Navigasi Bawah */}
      <div className="flex items-center justify-between border-t border-gray-200 px-8 py-3 text-xs text-[#ff3b30]">
        <span>Today</span>
        <span className="font-semibold text-black">Calendars</span>
        <span>Inbox</span>
      </div>
    </div>
  )
}