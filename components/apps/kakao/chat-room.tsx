'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { ChevronLeft, Hash, Menu, Plus, Search, Smile, MapPin } from 'lucide-react'
import { Avatar, HomeIndicator, StatusBar } from '@/components/phone/chrome'
import { contacts } from '@/lib/story/contacts'
import type { KakaoMessage, KakaoRoomId } from '@/lib/story/kakao'
import { useStory } from '@/lib/story/store'
import { dayKey, formatFullDate, formatTime } from '@/lib/story/time'
import { Sticker } from './sticker'

const ROOM_BG = '#000000'

export function ChatRoom({ roomId }: { roomId: KakaoRoomId }) {
  const { rooms, closeKakaoRoom, markRoomRead, onYhRoomShown, totalUnread, unreadByRoom } = useStory()
  const room = rooms.find((r) => r.id === roomId)!
  const contact = contacts[room.contactId]
  const scrollRef = useRef<HTMLDivElement>(null)
  const count = room.messages.length
  const otherUnread = totalUnread - (unreadByRoom[roomId] ?? 0)

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [count])

  useEffect(() => {
    markRoomRead(roomId)
  }, [roomId, count, markRoomRead])

  useEffect(() => {
    if (roomId === 'natasya') onYhRoomShown()
  }, [roomId, onYhRoomShown])

  return (
    <div className="animate-push-in flex h-full flex-col text-white" style={{ backgroundColor: ROOM_BG }}>
      <StatusBar />
      <header className="relative flex h-12 shrink-0 items-center border-b border-[#2f3336]/40 px-1.5">
        <button type="button" onClick={closeKakaoRoom} aria-label="Back to chat list" className="flex items-center p-1.5 text-white">
          <ChevronLeft className="size-7" strokeWidth={1.8} />
          {otherUnread > 0 && <span className="text-[15px] font-medium">{otherUnread}</span>}
        </button>
        <h2 className="absolute left-1/2 max-w-[55%] -translate-x-1/2 truncate text-[17px] font-semibold text-white">{contact.name}</h2>
        <span className="ml-auto flex items-center gap-4 pr-3 text-white" aria-hidden>
          <Search className="size-[22px]" strokeWidth={1.8} />
          <Menu className="size-[22px]" strokeWidth={1.8} />
        </span>
      </header>
      <div ref={scrollRef} className="no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-2.5 pb-3">
        <MessageList messages={room.messages} contactName={contact.name} initial={contact.initial} color={contact.color} photo={contact.photo} />
      </div>
      <div className="flex shrink-0 items-center gap-2 border-t border-[#2f3336] bg-[#16181c] px-2.5 py-2" aria-hidden>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#202327]">
          <Plus className="size-5 text-white/70" strokeWidth={1.8} />
        </span>
        <span className="flex h-9 min-w-0 flex-1 items-center justify-end rounded-full bg-[#202327] px-3">
          <Smile className="size-[22px] text-white/70" strokeWidth={1.6} />
        </span>
        <Hash className="size-6 shrink-0 text-white/70" strokeWidth={1.7} />
      </div>
      <HomeIndicator className="bg-[#16181c]" />
    </div>
  )
}

function MessageList({
  messages,
  contactName,
  initial,
  color,
  photo,
}: {
  messages: KakaoMessage[]
  contactName: string
  initial: string
  color: string
  photo?: string
}) {
  return (
    <ol className="flex flex-col">
      {messages.map((m, i) => {
        const prev = messages[i - 1]
        const next = messages[i + 1]
        const newDay = !prev || dayKey(prev.at) !== dayKey(m.at)
        const startsGroup = newDay || prev.from !== m.from || formatTime(prev.at) !== formatTime(m.at)
        const endsGroup = !next || next.from !== m.from || formatTime(next.at) !== formatTime(m.at) || dayKey(next.at) !== dayKey(m.at)
        const time = endsGroup ? <time className="shrink-0 pb-[1px] text-[10.5px] text-white/40">{formatTime(m.at)}</time> : null
        return (
          <li key={m.id} className="flex flex-col">
            {newDay && (
              <p className="mx-auto my-4 rounded-full border border-[#2f3336] bg-[#202327] px-3.5 py-[5px] text-[11.5px] text-white/70">{formatFullDate(m.at)}</p>
            )}
            {m.from === 'me' ? (
              <div className={`flex items-end justify-end gap-[5px] pr-1.5 ${startsGroup ? 'mt-2.5' : 'mt-[5px]'}`}>
                {time}
                <Bubble message={m} mine tail={startsGroup} />
              </div>
            ) : (
              <div className={`flex gap-2 ${startsGroup ? 'mt-2.5' : 'mt-[5px]'}`}>
                <span className="w-10 shrink-0">
                  {startsGroup && <Avatar initial={initial} color={color} size={40} shape="squircle" src={photo} />}
                </span>
                <div className="min-w-0 flex-1 pl-1.5">
                  {startsGroup && <p className="mb-[5px] text-[12.5px] text-white/60">{contactName}</p>}
                  <div className="flex items-end gap-[5px]">
                    <Bubble message={m} tail={startsGroup} />
                    {time}
                  </div>
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}

function Bubble({ message, mine = false, tail }: { message: KakaoMessage; mine?: boolean; tail: boolean }) {
  const c = message.content
  if (c.type === 'sticker') return <Sticker kind={c.sticker} />
  if (c.type === 'location') {
    return (
      <div className="w-52 overflow-hidden rounded-[20px] border border-[#2f3336] bg-[#16181c] text-white">
        <div className="flex h-24 items-center justify-center bg-[#202327]">
          <MapPin className="size-8 fill-[#1d9bf0] text-white" aria-hidden />
        </div>
        <div className="px-3 py-2.5">
          <p className="text-[14px] font-semibold">{c.title}</p>
          <p className="text-[12px] text-white/45">Shared location</p>
        </div>
      </div>
    )
  }
  if (c.type === 'card') {
    const { title, body, button, footer } = c.card
    return (
      <div className="w-[236px] overflow-hidden rounded-[20px] border border-[#2f3336] bg-[#16181c] text-white">
        <p className="bg-[#202327] px-3.5 py-2.5 text-[14px] font-semibold leading-snug">{title}</p>
        <p className="whitespace-pre-wrap break-words px-3.5 pb-3 pt-2.5 text-[13.5px] leading-[1.5] text-white/90">{body}</p>
        <div className="px-3 pb-3">
          <span className="block rounded-full bg-[#1d9bf0] py-2 text-center text-[13.5px] font-medium text-white">{button}</span>
          {footer && <p className="mt-2 text-[11px] leading-snug text-white/40">{footer}</p>}
        </div>
      </div>
    )
  }

  const bg = mine ? '#1d9bf0' : '#202327'

  return (
    <div
      className="relative max-w-[232px] whitespace-pre-wrap break-words rounded-[20px] px-[14px] py-[10px] text-[14.5px] leading-[1.4] text-white"
      style={{ backgroundColor: bg }}
    >
      {c.reply && (
        <span className="mb-1.5 block border-b border-white/20 pb-1.5 opacity-80">
          <span className="block text-[12px] font-semibold">{`Replying to ${c.reply.to}`}</span>
          <span className="block truncate text-[12px]">{c.reply.text}</span>
        </span>
      )}
      {c.text}
    </div>
  )
}