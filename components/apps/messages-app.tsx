'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AppShell, Avatar } from '@/components/phone/chrome'
import { contacts } from '@/lib/story/contacts'
import { useBackHandler } from '@/lib/story/back-nav'
import { smsThreads, type SmsThread } from '@/lib/story/sms'
import { formatIosListDate, formatIosStamp, toTime } from '@/lib/story/time'

const sortedThreads = [...smsThreads].sort(
  (a, b) => toTime(b.messages[b.messages.length - 1].at) - toTime(a.messages[a.messages.length - 1].at),
)

export function MessagesApp() {
  const [openId, setOpenId] = useState<string | null>(null)
  const thread = sortedThreads.find((t) => t.id === openId)
  useBackHandler(!!thread, () => setOpenId(null))
  if (thread) return <Thread thread={thread} onBack={() => setOpenId(null)} />

  return (
    <AppShell
      header={
        <header className="shrink-0 px-4 pb-2">
          <h2 className="text-[32px] font-bold">메시지</h2>
        </header>
      }
    >
      <ul className="pb-4">
        {sortedThreads.map((t) => {
          const c = contacts[t.contactId]
          const last = t.messages[t.messages.length - 1]
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setOpenId(t.id)}
                className="flex w-full items-center gap-3 pl-4 text-left active:bg-black/5"
              >
                <Avatar initial={c.initial} color="#a7adb7" size={44} src={c.photo} />
                <span className="flex min-w-0 flex-1 flex-col border-b border-black/10 py-2.5 pr-4">
                  <span className="flex items-center gap-2">
                    <span className="flex-1 truncate text-[16px] font-semibold">{c.name}</span>
                    <span className="shrink-0 text-[14px] text-black/45">{formatIosListDate(last.at)}</span>
                    <ChevronRight className="size-4 shrink-0 text-black/25" aria-hidden />
                  </span>
                  <span className="line-clamp-2 text-[14px] leading-snug text-black/50">{last.text.replace(/\n+/g, ' ')}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </AppShell>
  )
}

function Thread({ thread, onBack }: { thread: SmsThread; onBack: () => void }) {
  const c = contacts[thread.contactId]
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [])

  return (
    <AppShell
      className="animate-push-in"
      bodyRef={ref}
      bodyClassName="px-3 pb-3"
      header={
        <header className="relative flex shrink-0 flex-col items-center border-b border-black/10 bg-[#f7f7f7] pb-2">
          <button type="button" onClick={onBack} aria-label="메시지 목록으로" className="absolute left-1 top-2 flex items-center text-[#007aff]">
            <ChevronLeft className="size-8" />
          </button>
          <Avatar initial={c.initial} color="#a7adb7" size={46} src={c.photo} />
          <h2 className="mt-1 text-[12px]">{c.name}</h2>
        </header>
      }
      footer={
        <div className="shrink-0 border-t border-black/5 px-3 py-2">
          <p className="rounded-full border border-black/15 px-4 py-1.5 text-center text-[13px] text-black/40">
            {thread.notificationOnly ? '이 발신자에게는 답장할 수 없습니다' : '읽기 전용 기록입니다'}
          </p>
        </div>
      }
    >
      <ol className="flex flex-col">
        {thread.messages.map((m, i) => {
          const prev = thread.messages[i - 1]
          const showStamp = !prev || toTime(m.at) - toTime(prev.at) > 60 * 60 * 1000
          const mine = m.from === 'me'
          return (
            <li key={m.id} className="flex flex-col">
              {showStamp && <p className="mb-1 mt-4 text-center text-[11px] text-black/45">{formatIosStamp(m.at)}</p>}
              <p
                className={`mt-1 max-w-[75%] whitespace-pre-wrap break-words rounded-[18px] px-3 py-1.5 text-[15px] leading-snug ${
                  mine ? 'self-end bg-[#34c759] text-white' : 'self-start bg-[#e9e9eb] text-black'
                }`}
              >
                {m.text}
              </p>
            </li>
          )
        })}
      </ol>
    </AppShell>
  )
}
