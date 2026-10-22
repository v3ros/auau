'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  Trash2, 
  List, 
  Map, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudDrizzle, 
  CloudLightning,
  ChevronLeft
} from 'lucide-react'
import { HomeIndicator, StatusBar } from '@/components/phone/chrome'

type HourlyData = {
  time: string
  temp: number
  pop: number
  code: number
}

type CityWeather = {
  id: string
  name: string
  state?: string
  temp: number
  condition: string
  high: number
  low: number
  lat: number
  lon: number
  hourly: HourlyData[]
}

const DEFAULT_CITIES = [
  { name: 'Jakarta', state: 'DKI JAKARTA', lat: -6.2146, lon: 106.8451 },
  { name: 'Surabaya', state: 'JAWA TIMUR', lat: -7.2575, lon: 112.7521 },
]

export function WeatherApp() {
  const [cities, setCities] = useState<CityWeather[]>([])
  const [activeCityIndex, setActiveCityIndex] = useState(0)
  const [showCityList, setShowCityList] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{ name: string; country?: string; admin1?: string; latitude: number; longitude: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedCities = localStorage.getItem('saved_weather_cities_v2')
    if (savedCities) {
      try {
        const parsed = JSON.parse(savedCities)
        if (parsed && parsed.length > 0) {
          setCities(parsed)
          setLoading(false)
          return
        }
      } catch (e) {
        console.error('Failed to parse saved cities', e)
      }
    }
    fetchAllDefaultCities()
  }, [])

  useEffect(() => {
    if (cities.length > 0) {
      localStorage.setItem('saved_weather_cities_v2', JSON.stringify(cities))
    }
  }, [cities])

  const fetchCityData = async (cityName: string, stateName: string, lat: number, lon: number): Promise<CityWeather | null> => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code,precipitation_probability&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      )
      const data = await res.json()

      if (!data || !data.current) return null

      const currentHour = new Date().getHours()
      const hourly: HourlyData[] = []
      
      for (let i = currentHour; i < currentHour + 12; i++) {
        if (data.hourly && data.hourly.time[i]) {
          const timeStr = i === currentHour ? 'Now' : `${i % 12 === 0 ? 12 : i % 12}${i >= 12 ? 'PM' : 'AM'}`
          hourly.push({
            time: timeStr,
            temp: Math.round(data.hourly.temperature_2m[i]),
            pop: data.hourly.precipitation_probability ? data.hourly.precipitation_probability[i] : 0,
            code: data.hourly.weather_code[i],
          })
        }
      }

      return {
        id: `${cityName}-${lat}-${lon}`,
        name: cityName,
        state: stateName,
        temp: Math.round(data.current.temperature_2m),
        condition: getWeatherCondition(data.current.weather_code),
        high: data.daily ? Math.round(data.daily.temperature_2m_max[0]) : Math.round(data.current.temperature_2m) + 3,
        low: data.daily ? Math.round(data.daily.temperature_2m_min[0]) : Math.round(data.current.temperature_2m) - 4,
        lat,
        lon,
        hourly,
      }
    } catch (err) {
      console.error('Error fetching weather data:', err)
      return null
    }
  }

  const fetchAllDefaultCities = async () => {
    setLoading(true)
    const list: CityWeather[] = []

    for (const c of DEFAULT_CITIES) {
      const cityData = await fetchCityData(c.name, c.state, c.lat, c.lon)
      if (cityData) list.push(cityData)
    }

    setCities(list)
    setLoading(false)
  }

  const getWeatherCondition = (code: number) => {
    if (code === 0) return 'Sunny'
    if (code >= 1 && code <= 3) return 'Partly Cloudy'
    if (code >= 51 && code <= 55) return 'Drizzle'
    if (code >= 61 && code <= 67) return 'Rain'
    if (code >= 80 && code <= 82) return 'Showers'
    if (code >= 95) return 'Thunderstorm'
    return 'Cloudy'
  }

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="size-5 text-yellow-300" />
    if (code >= 1 && code <= 3) return <Cloud className="size-5 text-gray-200" />
    if (code >= 51 && code <= 55) return <CloudDrizzle className="size-5 text-blue-300" />
    if (code >= 61 && code <= 82) return <CloudRain className="size-5 text-blue-400" />
    if (code >= 95) return <CloudLightning className="size-5 text-amber-300" />
    return <Cloud className="size-5 text-gray-300" />
  }

  const handleSearchCity = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`)
      const data = await res.json()
      if (data && data.results) {
        setSearchResults(data.results)
      } else {
        setSearchResults([])
      }
    } catch (err) {
      console.error('Error searching city:', err)
    }
  }

  const handleAddCity = async (item: { name: string; country?: string; admin1?: string; latitude: number; longitude: number }) => {
    const stateName = item.admin1 ? item.admin1.toUpperCase() : item.country ? item.country.toUpperCase() : ''
    const newCity = await fetchCityData(item.name, stateName, item.latitude, item.longitude)

    if (newCity) {
      setCities((prev) => {
        if (prev.some((c) => c.name === item.name)) return prev
        return [...prev, newCity]
      })
      setActiveCityIndex(cities.length)
      setShowCityList(false)
      setSearchQuery('')
      setSearchResults([])
    }
  }

  const handleDeleteCity = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const updated = cities.filter((c) => c.id !== id)
    setCities(updated)
    if (activeCityIndex >= updated.length) {
      setActiveCityIndex(Math.max(0, updated.length - 1))
    }
    if (updated.length === 0) {
      localStorage.removeItem('saved_weather_cities_v2')
    }
  }

  const activeCity = cities[activeCityIndex] || cities[0]

  return (
    <div className="flex h-full flex-col bg-[#111827] text-white relative overflow-hidden select-none">
      {/* Background Gradient iOS Style */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #1f2937 0%, #111827 100%)'
        }}
      />

      <StatusBar tone="light" />

      {!showCityList ? (
        <div className="flex-1 flex flex-col pt-2 pb-4 px-5 relative z-10 overflow-y-auto no-scrollbar space-y-4">
          {loading || !activeCity ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-white/60 animate-pulse">Loading real-time weather...</p>
            </div>
          ) : (
            <>
              {/* Header Teks Utama iOS */}
              <div className="flex flex-col items-center text-center pt-2">
                <h2 className="text-3xl font-medium tracking-tight drop-shadow">{activeCity.name}</h2>
                {activeCity.state && (
                  <p className="text-[11px] font-semibold text-white/50 tracking-widest mt-0.5 uppercase">
                    {activeCity.state}
                  </p>
                )}
                <h1 className="text-[80px] font-extralight leading-none tracking-tighter my-1 drop-shadow-md">
                  {activeCity.temp}°
                </h1>
                <p className="text-base font-medium text-white/90">{activeCity.condition}</p>
                <p className="text-xs font-semibold text-white/60 mt-1">
                  H:{activeCity.high}°  L:{activeCity.low}°
                </p>
              </div>

              {/* Card 1: Summary Text (Asli iOS) */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-4 shadow-sm">
                <p className="text-xs text-white/90 leading-relaxed font-normal">
                  {activeCity.condition} conditions will continue throughout the day. Highs expected around {activeCity.high}°.
                </p>
              </div>

              {/* Card 2: Hourly Forecast */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-4 shadow-sm">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-3 border-b border-white/10 pb-2">
                  <ClockIcon className="size-3.5" />
                  <span>HOURLY FORECAST</span>
                </div>

                <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
                  {activeCity.hourly && activeCity.hourly.map((h, i) => (
                    <div key={i} className="flex flex-col items-center shrink-0 min-w-[38px]">
                      <span className="text-xs font-medium text-white/80">{h.time}</span>
                      <div className="my-2 flex flex-col items-center h-6 justify-center">
                        {getWeatherIcon(h.code)}
                        {h.pop > 0 && (
                          <span className="text-[9px] font-bold text-sky-300 leading-none mt-0.5">
                            {h.pop}%
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-semibold">{h.temp}°</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* LIST DAFTAR KOTA (SEARCH & CITY LIST) */
        <div className="flex-1 flex flex-col pt-3 px-4 relative z-10 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-2">
            <button 
              type="button" 
              onClick={() => setShowCityList(false)}
              className="flex items-center gap-1 text-sm text-blue-400 font-medium cursor-pointer"
            >
              <ChevronLeft className="size-4" /> Back
            </button>
            <h1 className="text-lg font-bold">Weather List</h1>
            <div className="w-12" />
          </div>

          <div className="relative my-2">
            <Search className="absolute left-3 top-2.5 size-4 text-white/40" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchCity(e.target.value)}
              placeholder="Search city (e.g. Surabaya)..."
              className="w-full rounded-xl bg-white/10 pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/40 outline-none border border-white/10"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mb-4 rounded-xl bg-slate-800 border border-white/10 overflow-hidden shadow-xl">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddCity(item)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 border-b border-white/5 flex justify-between items-center cursor-pointer"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-white/50">{item.admin1 ? `${item.admin1}, ` : ''}{item.country}</p>
                  </div>
                  <Plus className="size-4 text-blue-400" />
                </button>
              ))}
            </div>
          )}

          <div className="space-y-3 mt-2 pb-6">
            {cities.map((c, idx) => (
              <div 
                key={c.id}
                onClick={() => {
                  setActiveCityIndex(idx)
                  setShowCityList(false)
                }}
                className={`p-4 rounded-2xl bg-gradient-to-r from-blue-600/80 to-indigo-700/80 border border-white/20 shadow-md flex justify-between items-center cursor-pointer transition-all active:scale-98 ${
                  activeCityIndex === idx ? 'ring-2 ring-blue-400' : ''
                }`}
              >
                <div>
                  <h3 className="text-xl font-bold">{c.name}</h3>
                  <p className="text-xs text-white/70">{c.condition}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-light">{c.temp}°</span>
                  <button 
                    type="button" 
                    onClick={(e) => handleDeleteCity(e, c.id)}
                    className="text-white/50 hover:text-red-300 p-1"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* iOS BOTTOM NAVIGATION BAR */}
      {!showCityList && (
        <div className="border-t border-white/10 bg-slate-900/80 backdrop-blur-xl px-5 py-3 flex items-center justify-between relative z-20 text-white/70">
          <button type="button" className="p-1 hover:text-white cursor-pointer">
            <Map className="size-5" />
          </button>

          <div className="flex items-center gap-1.5">
            {cities.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveCityIndex(idx)}
                className={`size-1.5 rounded-full transition-all cursor-pointer ${
                  activeCityIndex === idx ? 'bg-white w-2' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          <button 
            type="button" 
            onClick={() => setShowCityList(true)}
            className="p-1 hover:text-white cursor-pointer"
          >
            <List className="size-5" />
          </button>
        </div>
      )}

      <HomeIndicator tone="light" />
    </div>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}