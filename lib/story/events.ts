import type { KakaoMessage } from './kakao'
import { NOW_ISO, kst } from './time'

const AFTER_CALL_ISO = kst('2025-11-19 18:58')

function yhLines(prefix: string, startSeq: number, lines: string[]): KakaoMessage[] {
  return lines.map((text, i) => ({
    id: `${prefix}-${i + 1}`,
    roomId: 'yh',
    from: 'them',
    at: AFTER_CALL_ISO,
    seq: startSeq + i,
    content: { type: 'text', text },
  }))
}

/** 영현과의 통화를 끊은 직후 알림 배너로 연달아 도착하는 카톡. */
export const AFTER_CALL_BANNER_MESSAGES = yhLines('after-call-a', 10, [
  '김원필',
  '전화 왜 끊어',
  '나 지금 너네 학원으로 가고 있어',
  '카톡 확인해',
  '보고 있는 거 다 알아',
])

/** 위 카톡을 받은 뒤 영현 채팅방을 열면 방 안에서 이어서 도착하는 카톡. */
export const AFTER_CALL_ROOM_MESSAGES = yhLines('after-call-b', 20, ['김원필', '나 3분 안에 도착해', '너 우준영 만난 건 아니지'])

export const EVENT_YH_MESSAGES: KakaoMessage[] = [
  {
    id: 'event-yh-1',
    roomId: 'yh',
    from: 'them',
    at: NOW_ISO,
    seq: 1,
    content: { type: 'text', text: '퇴근 안했지?' },
  },
]

export const EVENT_JY_MESSAGES: KakaoMessage[] = [
  {
    id: 'event-jy-1',
    roomId: 'jy',
    from: 'them',
    at: NOW_ISO,
    seq: 2,
    content: { type: 'text', text: '원필씨' },
  },
  {
    id: 'event-jy-2',
    roomId: 'jy',
    from: 'them',
    at: NOW_ISO,
    seq: 3,
    content: { type: 'text', text: '나 학원 주차장 도착했어요~' },
  },
]
