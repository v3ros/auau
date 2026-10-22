'use client'

import { useState, useEffect } from 'react'
import { Sun } from 'lucide-react'

// Style dasar Liquid Glass untuk Widget
const widgetGlassBase =
  'relative flex aspect-square w-full flex-col justify-between overflow-hidden rounded-[26px] bg-white/20 border border-white/40 p-3.5 text-white backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.25)]'

function GlassSheen() {
  return (
    <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none z-10" />
  )
}

export function WeatherWidget({ onOpen }: { onOpen?: () => void }) {
  const [temp, setTemp] = useState<number | null>(null)
  const [condition, setCondition] = useState('Loading...')

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-6.2146&longitude=106.8451&current=temperature_2m,weather_code')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.current) {
          setTemp(Math.round(data.current.temperature_2m))
          const code = data.current.weather_code
          if (code === 0) setCondition('Sunny')
          else if (code >= 1 && code <= 3) setCondition('Partly Cloudy')
          else if (code >= 51 && code <= 67) setCondition('Rainy')
          else setCondition('Cloudy')
        }
      })
      .catch(() => {
        setTemp(28)
        setCondition('Sunny')
      })
  }, [])

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`${widgetGlassBase} text-left transition-all active:scale-95 cursor-pointer`}
    >
      <GlassSheen />

      <div className="z-0">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold drop-shadow">Jakarta</span>
        </div>
        <span className="text-[34px] font-light leading-none tracking-tight drop-shadow">
          {temp !== null ? `${temp}°` : '...'}
        </span>
      </div>

      <div className="z-0 flex items-center gap-1.5 text-[12px] font-medium drop-shadow">
        <Sun className="size-4 text-yellow-300 fill-yellow-300/40" />
        <span>{condition}</span>
      </div>
    </button>
  )
}

export function CalendarWidget({ onOpen }: { onOpen?: () => void }) {
  const now = new Date()
  const month = now
    .toLocaleDateString('en-US', { month: 'short' })
    .toUpperCase()
  const today = now.getDate()

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  
  const firstDayIndex = new Date(now.getFullYear(), now.getMonth(), 1).getDay()
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

  const daysGrid = [
    ...Array(firstDayIndex).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`${widgetGlassBase} text-left transition-all active:scale-95 cursor-pointer`}
    >
      <GlassSheen />

      <div className="z-0 flex items-center justify-between border-b border-white/20 pb-1">
        <span className="text-[11px] font-bold text-red-400 drop-shadow">{month}</span>
      </div>

      <div className="z-0 grid grid-cols-7 text-center text-[9px] font-bold text-white/70">
        {daysOfWeek.map((day, i) => (
          <span key={i}>{day}</span>
        ))}
      </div>

      <div className="z-0 grid grid-cols-7 gap-y-0.5 text-center text-[10px] font-medium">
        {daysGrid.slice(0, 28).map((day, i) => (
          <span key={i} className="flex h-3.5 items-center justify-center">
            {day && (
              <span
                className={`flex size-3.5 items-center justify-center rounded-full ${
                  day === today
                    ? 'bg-red-500 font-bold text-white shadow-sm'
                    : 'text-white/90 drop-shadow-sm'
                }`}
              >
                {day}
              </span>
            )}
          </span>
        ))}
      </div>
    </button>
  )
}