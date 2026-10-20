export const NOW_ISO = '2025-11-19T18:57:00+09:00'
export const NOW = new Date(NOW_ISO)
const TZ = 'Asia/Seoul'

/** "2025-11-03 03:20" (KST) -> ISO string with +09:00 offset */
export function kst(dateTime: string): string {
  const [date, time] = dateTime.split(' ')
  return `${date}T${time}:00+09:00`
}

function parts(d: Date) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
  const p = Object.fromEntries(fmt.formatToParts(d).map((x) => [x.type, x.value]))
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    hour: Number(p.hour),
    minute: Number(p.minute),
  }
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function weekday(d: Date): string {
  const { year, month, day } = parts(d)
  return WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()]
}

export function dayKey(iso: string): string {
  const { year, month, day } = parts(new Date(iso))
  return `${year}-${month}-${day}`
}

/** 4:08 PM */
export function formatTime(iso: string): string {
  const { hour, minute } = parts(new Date(iso))
  const ampm = hour < 12 ? 'AM' : 'PM'
  const h = hour % 12 === 0 ? 12 : hour % 12
  return `${h}:${String(minute).padStart(2, '0')} ${ampm}`
}

/** 18:57 */
export function formatClock(iso: string): string {
  const { hour, minute } = parts(new Date(iso))
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

/** Tuesday, Nov 2, 2025 */
export function formatFullDate(iso: string): string {
  const d = new Date(iso)
  const { year, month, day } = parts(d)
  const monthName = MONTHS_SHORT[month - 1]
  return `${weekday(d)}, ${monthName} ${day}, ${year}`
}

function dayDiffFromNow(iso: string): number {
  const a = parts(new Date(iso))
  const b = parts(NOW)
  const ua = Date.UTC(a.year, a.month - 1, a.day)
  const ub = Date.UTC(b.year, b.month - 1, b.day)
  return Math.round((ub - ua) / 86400000)
}

/** Date format for Chat List */
export function formatListDate(iso: string): string {
  const diff = dayDiffFromNow(iso)
  if (diff === 0) return formatTime(iso)
  if (diff === 1) return 'Yesterday'
  const { year, month, day } = parts(new Date(iso))
  const monthName = MONTHS_SHORT[month - 1]
  if (year === parts(NOW).year) return `${monthName} ${day}`
  return `${monthName} ${day}, ${year}`
}

/** Date format for iOS Messages/Calls list */
export function formatIosListDate(iso: string): string {
  const diff = dayDiffFromNow(iso)
  if (diff === 0) return formatTime(iso)
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return weekday(new Date(iso))
  const { year, month, day } = parts(new Date(iso))
  return `${month}/${day}/${String(year).slice(2)}`
}

/** iOS Message thread stamp: "Nov 11 (Tue) 8:40 AM" */
export function formatIosStamp(iso: string): string {
  const d = new Date(iso)
  const diff = dayDiffFromNow(iso)
  const time = formatTime(iso)
  if (diff === 0) return `Today ${time}`
  if (diff === 1) return `Yesterday ${time}`
  const { year, month, day } = parts(d)
  const monthName = MONTHS_SHORT[month - 1]
  const wd = weekday(d).slice(0, 3)
  const prefix = year === parts(NOW).year ? '' : `${year} `
  return `${prefix}${monthName} ${day} (${wd}) ${time}`
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return `${m}m ${String(s).padStart(2, '0')}s`
}

export function toTime(iso: string): number {
  return new Date(iso).getTime()
}