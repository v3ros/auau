'use client'

import { useState } from 'react'
import { ChevronLeft, Info, PhoneOutgoing } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppShell, Avatar } from '@/components/phone/chrome'
import { contacts } from '@/lib/story/contacts'
import { useBackHandler } from '@/lib/story/back-nav'
import { startOutgoingCall } from '@/components/phone/outgoing-call'
import { calls, callTypeLabel, type CallRecord } from '@/lib/story/calls'
import { formatDuration, formatFullDate, formatIosListDate, formatTime } from '@/lib/story/time'

export function PhoneApp() {
  const [filter, setFilter] = useState<'all' | 'missed'>('all')
  const [selected, setSelected] = useState<CallRecord | null>(null)
  useBackHandler(!!selected, () => setSelected(null))

  if (selected) return <CallDetail call={selected} onBack={() => setSelected(null)} />

  const list = filter === 'all' ? calls : calls.filter((c) => c.type === 'missed')

  return (
    <AppShell
      header={
        <header className="shrink-0 px-4 pb-2">
          <div className="mx-auto flex w-44 rounded-lg bg-black/5 p-0.5 text-[13px] font-medium" role="tablist">
            {(['all', 'missed'] as const).map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn('flex-1 rounded-md py-1', filter === f && 'bg-white shadow-sm')}
              >
                {f === 'all' ? '전체' : '부재중'}
              </button>
            ))}
          </div>
          <h2 className="mt-2 text-[32px] font-bold">최근 통화</h2>
        </header>
      }
    >
      <ul className="pb-4">
        {list.map((call) => {
          const c = contacts[call.contactId]
          return (
            <li key={call.id}>
              <button
                type="button"
                onClick={() => (call.contactId === 'natasya' ? startOutgoingCall('natasya') : setSelected(call))}
                className="flex w-full items-center gap-2 pl-4 text-left active:bg-black/5"
              >
                <span className="w-4 shrink-0">
                  {call.type === 'outgoing' && <PhoneOutgoing className="size-3.5 text-black/40" aria-label="발신" />}
                </span>
                <span className="flex min-w-0 flex-1 items-center gap-2 border-b border-black/10 py-2 pr-4">
                  <span className="min-w-0 flex-1">
                    <span className={cn('block truncate text-[16px] font-semibold', call.type === 'missed' && 'text-[#ff3b30]')}>
                      {c.name}
                    </span>
                    <span className="block text-[13px] text-black/45">
                      {c.label ?? '휴대전화'}
                      {call.type === 'missed' && ' · 부재중'}
                    </span>
                  </span>
                  <span className="shrink-0 text-[14px] text-black/45">{formatIosListDate(call.at)}</span>
                  <Info className="size-5 shrink-0 text-[#007aff]" aria-hidden />
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </AppShell>
  )
}

function CallDetail({ call, onBack }: { call: CallRecord; onBack: () => void }) {
  const c = contacts[call.contactId]
  return (
    <AppShell
      className="animate-push-in bg-[#f2f2f7]"
      header={
        <header className="flex h-11 shrink-0 items-center px-1">
          <button type="button" onClick={onBack} className="flex items-center text-[17px] text-[#007aff]">
            <ChevronLeft className="size-7" />
            최근 통화
          </button>
        </header>
      }
    >
      <div className="flex flex-col items-center px-4 pb-6">
        <Avatar initial={c.initial} color="#a7adb7" size={88} src={c.photo} />
        <h2 className="mt-3 text-[26px] font-semibold">{c.name}</h2>
        <section className="mt-6 w-full rounded-xl bg-white px-4 py-3">
          <p className="text-[15px] font-semibold">{formatFullDate(call.at)}</p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[15px]">
            <dt className="text-black/45">시각</dt>
            <dd>{formatTime(call.at)}</dd>
            <dt className="text-black/45">종류</dt>
            <dd className={cn(call.type === 'missed' && 'text-[#ff3b30]')}>{callTypeLabel[call.type]}</dd>
            <dt className="text-black/45">통화 시간</dt>
            <dd>{call.type === 'missed' ? '연결되지 않음' : formatDuration(call.duration)}</dd>
          </dl>
        </section>
        <section className="mt-3 w-full rounded-xl bg-white px-4 py-3">
          <p className="text-[13px] text-black/45">{c.label ?? '휴대전화'}</p>
          <p className="text-[15px] text-black/35">번호 비공개</p>
        </section>
      </div>
    </AppShell>
  )
}
