'use client'

import { Plus, Search, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type CalendarEvent = {
  id: string
  title: string
  event_date: string // Format: YYYY-MM-DD
  color: string
}

const COLOR_OPTIONS = [
  { name: 'Red', value: '#ff3b30' },
  { name: 'Purple', value: '#af52de' },
  { name: 'Blue', value: '#007aff' },
  { name: 'Green', value: '#34c759' },
  { name: 'Orange', value: '#ff9500' },
]

export function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Form State
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])
  const [newColor, setNewColor] = useState('#ff3b30')

  const year = currentDate.getFullYear()
  const monthIndex = currentDate.getMonth()
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' })
  const todayString = new Date().toISOString().split('T')[0]

  const fetchEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('event_date', { ascending: true })

    if (!error && data) {
      setEvents(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const { data, error } = await supabase
      .from('calendar_events')
      .insert([{ title: newTitle, event_date: newDate, color: newColor }])
      .select()
      .single()

    if (!error && data) {
      setEvents((prev) => [...prev, data])
      
      // Pindahkan tampilan kalender langsung ke bulan & tahun event yang baru dibuat
      const [eventYear, eventMonth] = newDate.split('-').map(Number)
      if (eventYear && eventMonth) {
        setCurrentDate(new Date(eventYear, eventMonth - 1, 1))
      }

      setNewTitle('')
      setIsAddOpen(false)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    setEvents(events.filter((ev) => ev.id !== id))
    await supabase.from('calendar_events').delete().eq('id', id)
  }

  const firstDay = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  // Filter events berdasarkan pencarian atau bulan & tahun yang sedang ditampilkan
  const filteredEvents = events.filter((ev) => {
    if (searchQuery.trim()) {
      return ev.title.toLowerCase().includes(searchQuery.toLowerCase())
    }
    const [evYear, evMonth] = ev.event_date.split('-').map(Number)
    return evYear === year && evMonth === monthIndex + 1
  })

  return (
    <div className="flex h-full flex-col bg-white text-black relative">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 text-[#ff3b30]">
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-semibold">{year}</span>
          <div className="flex items-center gap-1 ml-2">
            <button 
              type="button"
              onClick={() => setCurrentDate(new Date(year, monthIndex - 1, 1))} 
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button 
              type="button"
              onClick={() => setCurrentDate(new Date(year, monthIndex + 1, 1))} 
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="size-5" />
          </button>
          <button 
            type="button"
            onClick={() => {
              setNewDate(`${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`)
              setIsAddOpen(true)
            }}
          >
            <Plus className="size-5" />
          </button>
        </div>
      </div>

      {/* Hidden Search Input */}
      {isSearchOpen && (
        <div className="px-4 pb-2">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full rounded-lg bg-gray-100 px-3 py-1.5 text-sm outline-none"
            autoFocus
          />
        </div>
      )}

      {/* Month Title */}
      <div className="px-4 py-1">
        <h1 className="text-3xl font-bold">{monthName}</h1>
      </div>

      {/* Week Days Grid */}
      <div className="grid grid-cols-7 border-b border-gray-200 px-2 py-2 text-center text-xs font-semibold text-gray-400">
        {weekDays.map((day, index) => (
          <span key={index}>{day}</span>
        ))}
      </div>

      {/* Calendar Dates Grid */}
      <div className="grid grid-cols-7 px-2 py-1 text-center text-sm">
        {cells.map((d, i) => {
          const dateStr = d ? `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` : ''
          const hasEvent = events.some((ev) => ev.event_date === dateStr)
          const isToday = dateStr === todayString

          return (
            <div key={i} className="flex flex-col h-10 items-center justify-center">
              {d && (
                <>
                  <span
                    className={`flex size-7 items-center justify-center rounded-full text-xs ${
                      isToday ? 'bg-[#ff3b30] font-bold text-white' : 'text-black'
                    }`}
                  >
                    {d}
                  </span>
                  {hasEvent && <span className="size-1 rounded-full bg-[#ff3b30] mt-0.5" />}
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Event List */}
      <div className="mt-2 flex-1 border-t border-gray-200 px-4 pt-3 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 mb-2">
          {searchQuery ? 'Search Results' : `${monthName} ${year} Events`}
        </p>
        {loading ? (
          <p className="text-xs text-gray-400 text-center mt-4">Loading events...</p>
        ) : filteredEvents.length === 0 ? (
          <p className="text-xs text-gray-400 text-center mt-4">No events for this month.</p>
        ) : (
          <div className="space-y-2">
            {filteredEvents.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-1 rounded-full" style={{ backgroundColor: ev.color }} />
                  <div>
                    <p className="text-sm font-semibold">{ev.title}</p>
                    <p className="text-xs text-gray-400">{ev.event_date}</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => handleDeleteEvent(ev.id)} 
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between border-t border-gray-200 px-8 py-3 text-xs text-[#ff3b30]">
        <button type="button" onClick={() => setCurrentDate(new Date())}>Today</button>
        <span className="font-semibold text-black">Calendars</span>
        <span>Inbox</span>
      </div>

      {/* Add Event Modal */}
      {isAddOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="w-full bg-white rounded-t-2xl p-5 animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">New Event</h2>
              <button type="button" onClick={() => setIsAddOpen(false)}>
                <X className="size-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Event Title</label>
                <input 
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Meeting / Exam"
                  className="w-full rounded-lg bg-gray-100 px-3 py-2 text-sm outline-none border border-gray-200"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Date</label>
                <input 
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-lg bg-gray-100 px-3 py-2 text-sm outline-none border border-gray-200"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Tag Color</label>
                <div className="flex gap-3 mt-1">
                  {COLOR_OPTIONS.map((col) => (
                    <button
                      key={col.value}
                      type="button"
                      onClick={() => setNewColor(col.value)}
                      className={`size-6 rounded-full transition-all ${
                        newColor === col.value 
                          ? 'ring-2 ring-gray-400 ring-offset-2' 
                          : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: col.value }}
                    />
                  ))}
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#ff3b30] text-white py-2.5 rounded-xl font-semibold text-sm mt-4 hover:opacity-90 active:scale-95"
              >
                Save Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}