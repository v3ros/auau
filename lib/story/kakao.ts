import type { ContactId } from './contacts'
import { kst } from './time'

export type KakaoReply = { to: string; text: string }

export type KakaoCard = {
  title: string
  body: string
  button: string
  footer?: string
}

export type KakaoContent =
  | { type: 'text'; text: string; reply?: KakaoReply }
  | { type: 'sticker'; sticker: 'pout' | 'teary' }
  | { type: 'location'; title: string }
  | { type: 'card'; card: KakaoCard }

export type KakaoRoomId = 'natasya' | 'alex' | 'angel'

export type KakaoMessage = {
  id: string
  roomId: KakaoRoomId
  from: 'me' | 'them'
  at: string
  /** Sequence number for messages at the same timestamp */
  seq: number
  content: KakaoContent
}

export type KakaoRoom = {
  id: KakaoRoomId
  contactId: ContactId
  messages: KakaoMessage[]
  initialUnread?: number
}

type Entry = [
  string,
  'me' | 'them',
  | string
  | { sticker: 'pout' | 'teary' }
  | { location: string }
  | { text: string; reply: KakaoReply }
  | { card: KakaoCard },
]

function toContent(c: Entry[2]): KakaoContent {
  if (typeof c === 'string') return { type: 'text', text: c }
  if ('sticker' in c) return { type: 'sticker', sticker: c.sticker }
  if ('location' in c) return { type: 'location', title: c.location }
  if ('card' in c) return { type: 'card', card: c.card }
  return { type: 'text', text: c.text, reply: c.reply }
}

function room(id: KakaoRoomId, contactId: ContactId, entries: Entry[], initialUnread?: number): KakaoRoom {
  return {
    id,
    contactId,
    initialUnread,
    messages: entries.map(([at, from, c], i) => ({
      id: `${id}-${i}`,
      roomId: id,
      from,
      at: kst(at),
      seq: 0,
      content: toContent(c),
    })),
  }
}

const ME = 'me' as const
const T = 'them' as const

export const kakaoRooms: KakaoRoom[] = [
  room('natasya', 'natasya', [
    ['2026-10-20 19:29', ME, 'halloo sysyy'],
    ['2026-10-20 19:30', T, 'hiii'],
    ['2026-10-20 19:30', T, 'by the waaay good morniiing'],
    ['2026-10-20 19:30', T, 'semangat kuliahnya hari iniii averroes, semoga kamu langsung paham semua materinya dalam 1 kedipan'],
    ['2026-10-20 19:31', T, 'have a great great great daaay ahead'],
    ['2026-10-20 19:31', ME, 'good morningg sysyyy'],
    ['2026-10-20 19:33', ME, { text: 'thank youuu natasya sysy angel, kamu juga yaa semoga kerjaan hari ini bener-bener lancarr dan mudah-semudahnya sampai kamu pulang nantiii', reply: { to: 'natasya', text: 'semangat kuliahnya hari iniii averroes, semoga kamu langsung paham semua materinya dalam 1 kedipan' } }],
  ]),
  room('alex', 'alex', [
    ['2026-10-20 10:00', T, 'Hey, are you free later?'],
  ]),
  room('angel', 'angel', [
    ['2026-10-20 12:00', T, 'Don’t forget our project review!'],
  ]),
]

export const kakaoFriendOrder: KakaoRoomId[] = ['natasya', 'alex', 'angel']