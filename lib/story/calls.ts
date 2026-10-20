import type { ContactId } from './contacts'
import { kst, toTime } from './time'

export type CallType = 'incoming' | 'outgoing' | 'missed'

export type CallRecord = {
  id: string
  contactId: ContactId
  at: string
  type: CallType
  /** 초 단위. 부재중은 0 */
  duration: number
}

type Entry = [string, ContactId, CallType, number]

const entries: Entry[] = [
  ['2025-10-31 17:20', 'jihooMom', 'incoming', 95],
  ['2025-11-01 16:00', 'wa', 'incoming', 58],
  ['2025-11-03 11:40', 'seungaMom', 'incoming', 72],
  ['2025-11-04 22:30', 'yh', 'outgoing', 734],
  ['2025-11-05 18:20', 'jihooMom', 'missed', 0],
  ['2025-11-05 18:25', 'jihooMom', 'outgoing', 100],
  ['2025-11-06 13:10', 'yuchanMom', 'incoming', 200],
  ['2025-11-07 15:30', 'seungaMom', 'outgoing', 65],
  ['2025-11-10 16:09', 'yh', 'outgoing', 112],
  ['2025-11-12 17:50', 'jihooMom', 'incoming', 120],
  ['2025-11-13 14:05', 'seungaMom', 'incoming', 90],
  ['2025-11-14 12:32', 'yh', 'missed', 0],
  ['2025-11-15 10:20', 'yuchanMom', 'outgoing', 128],
  ['2025-11-16 21:10', 'yh', 'incoming', 48],
  ['2025-11-17 15:22', 'yh', 'missed', 0],
  ['2025-11-18 18:42', 'yh', 'missed', 0],
  ['2025-11-19 12:16', 'yh', 'missed', 0],
  ['2025-11-19 17:03', 'jy', 'incoming', 192],
]

export const calls: CallRecord[] = entries
  .map(([at, contactId, type, duration], i) => ({ id: `call-${i}`, contactId, at: kst(at), type, duration }))
  .sort((a, b) => toTime(b.at) - toTime(a.at))

export const callTypeLabel: Record<CallType, string> = {
  incoming: '수신 전화',
  outgoing: '발신 전화',
  missed: '부재중 전화',
}
