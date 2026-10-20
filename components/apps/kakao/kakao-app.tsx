'use client'

import { useState } from 'react'
import {
  Ellipsis,
  MessageCircle,
  MessageCirclePlus,
  Music2,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  User,
  UserPlus,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppShell, Avatar } from '@/components/phone/chrome'
import { contacts, OWNER } from '@/lib/story/contacts'
import { kakaoFriendOrder, type KakaoMessage } from '@/lib/story/kakao'
import { useStory } from '@/lib/story/store'
import { formatListDate } from '@/lib/story/time'
import { ChatRoom } from './chat-room'

type Tab = 'friends' | 'chats'

export function previewText(m: KakaoMessage) {
  if (m.content.type === 'text') return m.content.text.replace(/\n+/g, ' ')
  if (m.content.type === 'sticker') return '이모티콘을 보냈습니다.'
  if (m.content.type === 'card') return m.content.card.title
  return '위치를 공유했습니다.'
}

const HEADER_ICONS: Record<Tab, LucideIcon[]> = {
  friends: [Search, UserPlus, Music2, Settings],
  chats: [Search, MessageCirclePlus, Settings],
}

export function KakaoApp() {
  const { kakaoRoomId } = useStory()
  const [tab, setTab] = useState<Tab>('chats')

  if (kakaoRoomId) return <ChatRoom key={kakaoRoomId} roomId={kakaoRoomId} />

  return (
    <AppShell
    header={
      <header className="flex h-[52px] shrink-0 items-center justify-between pl-5 pr-3">
        <h2 className="text-[22px] font-bold tracking-tight">
          {tab === 'chats' ? 'Chats' : 'Contact'}
        </h2>
        <span className="flex items-center gap-4 pr-1" aria-hidden>
          {HEADER_ICONS[tab].map((Icon, i) => (
            <Icon key={i} className="size-[23px]" strokeWidth={1.7} />
          ))}
        </span>
      </header>
      }
      footer={<KakaoTabs tab={tab} onChange={setTab} />}
    >
      {tab === 'chats' ? <ChatList /> : <FriendList />}
    </AppShell>
  )
}

function KakaoTabs({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const { totalUnread } = useStory()
  const items: { id: Tab | null; label: string; Icon: LucideIcon }[] = [
    { id: 'friends', label: 'Friends', Icon: User },
    { id: 'chats', label: 'Chats', Icon: MessageCircle },
    { id: null, label: 'Updates', Icon: Sparkles },
    { id: null, label: 'Shopping', Icon: ShoppingBag },
    { id: null, label: 'More', Icon: Ellipsis },
  ]
  return (
    <nav aria-label="카카오톡 탭" className="grid shrink-0 grid-cols-5 border-t border-black/[0.06] bg-white pt-1.5">
      {items.map(({ id, label, Icon }) => {
        const active = id === tab
        const inner = (
          <>
            <span className="relative">
              <Icon className={cn('size-[26px]', active && 'fill-black')} strokeWidth={active ? 1.6 : 1.5} aria-hidden />
              {id === 'chats' && totalUnread > 0 && (
                <span className="absolute -right-3 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#ff5b33] px-1 text-[10px] font-bold text-white">
                  {totalUnread}
                </span>
              )}
            </span>
            <span className="sr-only">{label}</span>
          </>
        )
        return id ? (
          <button
            key={label}
            type="button"
            onClick={() => onChange(id)}
            aria-current={active ? 'page' : undefined}
            className={cn('flex flex-col items-center py-2', active ? 'text-black' : 'text-[#9b9b9b]')}
          >
            {inner}
          </button>
        ) : (
          <span key={label} className="flex flex-col items-center py-2 text-[#9b9b9b]">
            {inner}
          </span>
        )
      })}
    </nav>
  )
}

function ChatList() {
  const { rooms, unreadByRoom, openKakaoRoom } = useStory()
  return (
    <ul className="pb-2 pt-1">
      {rooms.map((room) => {
        const c = contacts[room.contactId]
        const last = room.messages[room.messages.length - 1]
        const unread = unreadByRoom[room.id] ?? 0
        return (
          <li key={room.id}>
            <button
              type="button"
              onClick={() => openKakaoRoom(room.id)}
              className="flex w-full items-center gap-3 px-4 py-[9px] text-left active:bg-black/[0.04]"
            >
              <Avatar initial={c.initial} color={c.color} size={50} shape="squircle" src={c.photo} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15.5px] font-semibold">{c.name}</span>
                <span className="mt-[3px] line-clamp-2 text-[13.5px] leading-[1.35] text-[#8a8a8a]">{previewText(last)}</span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-1.5 self-start pt-0.5">
                <span className="text-[11.5px] text-[#a0a0a0]">{formatListDate(last.at)}</span>
                {unread > 0 && (
                  <span className="flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-[#ff5b33] px-1.5 text-[11.5px] font-bold text-white">
                    <span className="sr-only">읽지 않은 메시지 </span>
                    {unread}
                  </span>
                )}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function FriendList() {
  const { openKakaoRoom } = useStory()
  return (
    <div className="pb-4">
      <div className="flex items-center gap-3.5 px-4 py-2.5">
        <Avatar initial="V" color="#9aa3ad" size={60} shape="squircle" src={OWNER.photo} />
        <div className="min-w-0">
          <p className="text-[17px] font-semibold">{OWNER.friendListName}</p>
          <p className="mt-0.5 truncate text-[13px] text-[#8a8a8a]">{OWNER.status}</p>
        </div>
      </div>
      <div className="mx-4 my-2 border-t border-black/[0.06]" />
      <p className="px-4 pb-1.5 pt-1 text-[12.5px] text-[#8a8a8a]">FriendList {kakaoFriendOrder.length}</p>
      <ul>
        {kakaoFriendOrder.map((id) => {
          const c = contacts[id]
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => openKakaoRoom(id)}
                className="flex w-full items-center gap-3 px-4 py-[7px] text-left active:bg-black/[0.04]"
              >
                <Avatar initial={c.initial} color={c.color} size={44} shape="squircle" src={c.photo} />
                <span className="text-[15.5px]">{c.name}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
