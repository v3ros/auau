'use client'

import { withBasePath } from '@/lib/base-path'
import { useState } from 'react'
import {
  Battery,
  Bell,
  Bluetooth,
  ChevronLeft,
  ChevronRight,
  Hand,
  Image as ImageIcon,
  Info,
  Lock,
  Moon,
  Plane,
  RotateCcw,
  Settings,
  Sun,
  Volume2,
  Wifi,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppShell, Avatar } from '@/components/phone/chrome'
import { useBackHandler } from '@/lib/story/back-nav'
import { OWNER } from '@/lib/story/contacts'
import { useStory } from '@/lib/story/store'

type Toggles = Record<'airplane' | 'wifi' | 'bluetooth' | 'silent' | 'dnd' | 'sleep' | 'notifPreview' | 'autoBright', boolean>

type PageId = 'wifi' | 'bluetooth' | 'notifications' | 'sound' | 'focus' | 'general' | 'display' | 'wallpaper' | 'battery' | 'privacy' | 'about'

const ITEMS: { id: PageId | 'airplane'; label: string; Icon: LucideIcon; color: string }[] = [
  { id: 'airplane', label: '에어플레인 모드', Icon: Plane, color: '#ff9500' },
  { id: 'wifi', label: 'Wi-Fi', Icon: Wifi, color: '#007aff' },
  { id: 'bluetooth', label: 'Bluetooth', Icon: Bluetooth, color: '#007aff' },
  { id: 'notifications', label: '알림', Icon: Bell, color: '#ff3b30' },
  { id: 'sound', label: '사운드 및 햅틱', Icon: Volume2, color: '#ff2d55' },
  { id: 'focus', label: '집중 모드', Icon: Moon, color: '#5856d6' },
  { id: 'general', label: '일반', Icon: Settings, color: '#8e8e93' },
  { id: 'display', label: '디스플레이 및 밝기', Icon: Sun, color: '#007aff' },
  { id: 'wallpaper', label: '배경화면', Icon: ImageIcon, color: '#34aadc' },
  { id: 'battery', label: '배터리', Icon: Battery, color: '#34c759' },
  { id: 'privacy', label: '개인정보 보호 및 보안', Icon: Hand, color: '#007aff' },
]

export function SettingsApp() {
  const { lock, resetStory } = useStory()
  const [page, setPage] = useState<PageId | null>(null)
  const [toggles, setToggles] = useState<Toggles>({
    airplane: false,
    wifi: true,
    bluetooth: true,
    silent: false,
    dnd: false,
    sleep: false,
    notifPreview: true,
    autoBright: true,
  })
  const flip = (k: keyof Toggles) => setToggles((t) => ({ ...t, [k]: !t[k] }))
  useBackHandler(!!page, () => setPage(null))

  if (page) {
    const item = ITEMS.find((i) => i.id === page)
    return (
      <SubPage title={page === 'about' ? '이 웹사이트 정보' : item!.label} onBack={() => setPage(null)}>
        <PageBody page={page} toggles={toggles} flip={flip} />
      </SubPage>
    )
  }

  const value = (id: PageId | 'airplane') =>
    id === 'wifi' ? (toggles.wifi && !toggles.airplane ? '영원피아노_5G' : '끔') : id === 'bluetooth' ? (toggles.bluetooth ? '켬' : '끔') : undefined

  return (
    <AppShell
      className="bg-[#f2f2f7]"
      header={
        <header className="shrink-0 px-4 pb-2">
          <h2 className="text-[32px] font-bold">설정</h2>
        </header>
      }
    >
      <div className="flex flex-col gap-6 px-4 pb-6">
        <section className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-3">
          <Avatar initial="원" color="#9aa3ad" size={56} src={OWNER.photo} />
          <div>
            <p className="text-[19px] font-semibold">{OWNER.deviceName}</p>
            <p className="text-[13px] text-black/45">Apple 계정, iCloud 등</p>
          </div>
        </section>

        <Group>
          {ITEMS.map((item) =>
            item.id === 'airplane' ? (
              <Row key={item.id} Icon={item.Icon} color={item.color} label={item.label}>
                <Toggle label={item.label} on={toggles.airplane} onChange={() => flip('airplane')} />
              </Row>
            ) : (
              <Row
                key={item.id}
                Icon={item.Icon}
                color={item.color}
                label={item.label}
                value={value(item.id)}
                onClick={() => setPage(item.id as PageId)}
              />
            ),
          )}
        </Group>

        <Group>
          <Row Icon={Info} color="#8e8e93" label="이 웹사이트 정보" onClick={() => setPage('about')} />
          <Row Icon={RotateCcw} color="#ff9500" label="스토리 다시 시작" onClick={resetStory} />
          <Row Icon={Lock} color="#1c1c1e" label="잠금화면으로" onClick={lock} />
        </Group>
      </div>
    </AppShell>
  )
}

function SubPage({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <AppShell
      className="animate-push-in bg-[#f2f2f7]"
      header={
        <header className="relative flex h-11 shrink-0 items-center justify-center px-1">
          <button type="button" onClick={onBack} className="absolute left-1 flex items-center text-[17px] text-[#007aff]">
            <ChevronLeft className="size-7" />
            설정
          </button>
          <h2 className="max-w-[55%] truncate text-[17px] font-semibold">{title}</h2>
        </header>
      }
    >
      <div className="flex flex-col gap-6 px-4 pb-6 pt-3">{children}</div>
    </AppShell>
  )
}

function PageBody({ page, toggles, flip }: { page: PageId; toggles: Toggles; flip: (k: keyof Toggles) => void }) {
  switch (page) {
    case 'wifi':
      return (
        <>
          <Group>
            <Row label="Wi-Fi">
              <Toggle label="Wi-Fi" on={toggles.wifi} onChange={() => flip('wifi')} />
            </Row>
            {toggles.wifi && <Row label="영원피아노_5G" value="연결됨" />}
          </Group>
          <Note>이 화면의 토글은 웹사이트 안에서만 표시가 바뀌며 실제 기기 설정에는 접근하지 않습니다.</Note>
        </>
      )
    case 'bluetooth':
      return (
        <Group>
          <Row label="Bluetooth">
            <Toggle label="Bluetooth" on={toggles.bluetooth} onChange={() => flip('bluetooth')} />
          </Row>
        </Group>
      )
    case 'notifications':
      return (
        <>
          <Group>
            <Row label="미리보기 표시">
              <Toggle label="미리보기 표시" on={toggles.notifPreview} onChange={() => flip('notifPreview')} />
            </Row>
          </Group>
          <Group>
            <Row label="카카오톡" value="배너" />
            <Row label="메시지" value="배너" />
            <Row label="전화" value="배너" />
          </Group>
        </>
      )
    case 'sound':
      return (
        <Group>
          <Row label="무음 모드">
            <Toggle label="무음 모드" on={toggles.silent} onChange={() => flip('silent')} />
          </Row>
          <Row label="벨소리" value="오프닝" />
        </Group>
      )
    case 'focus':
      return (
        <Group>
          <Row label="방해 금지 모드">
            <Toggle label="방해 금지 모드" on={toggles.dnd} onChange={() => flip('dnd')} />
          </Row>
          <Row label="수면">
            <Toggle label="수면" on={toggles.sleep} onChange={() => flip('sleep')} />
          </Row>
        </Group>
      )
    case 'general':
      return (
        <Group>
          <Row label="이름" value={OWNER.deviceName} />
          <Row label="소프트웨어 버전" value="26.1" />
          <Row label="사용 가능 용량" value="41.2GB" />
        </Group>
      )
    case 'display':
      return (
        <Group>
          <Row label="모드" value="라이트" />
          <Row label="자동 밝기">
            <Toggle label="자동 밝기" on={toggles.autoBright} onChange={() => flip('autoBright')} />
          </Row>
        </Group>
      )
    case 'wallpaper':
      return (
        <div className="mx-auto aspect-[9/19] w-32 overflow-hidden rounded-2xl bg-cover bg-center shadow" style={{ backgroundImage: `url(${withBasePath('/images/wallpaper.jpg')})` }} role="img" aria-label="현재 배경화면" />
      )
    case 'battery':
      return (
        <Group>
          <Row label="배터리 잔량" value="85%" />
          <Row label="배터리 성능 상태" value="최대 용량 92%" />
        </Group>
      )
    case 'privacy':
      return (
        <>
          <Group>
            <Row label="위치 서비스" value="끔" />
            <Row label="카메라" value="접근 없음" />
            <Row label="연락처" value="접근 없음" />
          </Group>
          <Note>이 웹사이트는 위치, 카메라, 연락처 등 어떤 권한도 요청하지 않습니다.</Note>
        </>
      )
    case 'about':
      return (
        <section className="rounded-[20px] bg-white px-4 py-4 text-[15px] leading-relaxed">
          <p>{"이 웹사이트는 '영필' 씨피의 가상의 핸드폰 구성입니다."}</p>
          <p className="mt-2">{"'나의 무심한 다정에게' 포스타입 작품 스토리를 기반으로 구성되었습니다."}</p>
        </section>
      )
  }
}

function Group({ children }: { children: React.ReactNode }) {
  return <ul className="overflow-hidden rounded-[20px] bg-white">{children}</ul>
}

function Row({
  label,
  Icon,
  color,
  value,
  onClick,
  children,
}: {
  label: string
  Icon?: LucideIcon
  color?: string
  value?: string
  onClick?: () => void
  children?: React.ReactNode
}) {
  const inner = (
    <>
      {Icon && (
        <span className="flex size-7 shrink-0 items-center justify-center rounded-[7px]" style={{ backgroundColor: color }}>
          <Icon className="size-4 text-white" aria-hidden />
        </span>
      )}
      <span className="flex min-h-11 min-w-0 flex-1 items-center gap-2 border-b border-black/10 py-2 pr-4 group-last:border-b-0">
        <span className="flex-1 truncate text-[16px]">{label}</span>
        {value && <span className="max-w-[50%] truncate text-[16px] text-black/45">{value}</span>}
        {children}
        {onClick && <ChevronRight className="size-4 shrink-0 text-black/25" aria-hidden />}
      </span>
    </>
  )
  return (
    <li className="group">
      {onClick ? (
        <button type="button" onClick={onClick} className="flex w-full items-center gap-3 pl-4 text-left active:bg-black/5">
          {inner}
        </button>
      ) : (
        <div className="flex items-center gap-3 pl-4">{inner}</div>
      )}
    </li>
  )
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={cn('relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors', on ? 'bg-[#34c759]' : 'bg-black/10')}
    >
      <span
        className={cn(
          'absolute top-[2px] size-[27px] rounded-full bg-white shadow transition-transform',
          on ? 'translate-x-[22px]' : 'translate-x-[2px]',
        )}
      />
    </button>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="-mt-4 px-4 text-[13px] text-black/45">{children}</p>
}
