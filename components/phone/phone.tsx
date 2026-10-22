'use client'

import { StoryProvider, useStory, type AppId } from '@/lib/story/store'
import { KakaoApp } from '@/components/apps/kakao/kakao-app'
import { MessagesApp } from '@/components/apps/messages-app'
import { PhoneApp } from '@/components/apps/phone-app'
import { PhotosApp } from '@/components/apps/photos-app'
import { SettingsApp } from '@/components/apps/settings-app'
import { SafariApp } from '@/components/apps/safari-app'
import { AnyAiApp } from '@/components/apps/anyai-app'
import { NotesApp } from '@/components/apps/notes-app'
import { CameraApp } from '@/components/apps/camera-app'
import { VoiceMemosApp } from '@/components/apps/voice-memos-app'
import { CalendarApp } from '@/components/apps/calendar-app'
import { ClockApp } from '@/components/apps/clock-app'
import { CalculatorApp } from '@/components/apps/calculator-app' // <-- Tambahkan ini
import { LockScreen } from './lock-screen'
import { Passcode } from './passcode'
import { HomeScreen } from './home-screen'
import { NotificationBanner } from './notification-banner'
import { IncomingCall } from './incoming-call'
import { OutgoingCall } from './outgoing-call'
import { TopNav } from './top-nav'
import { BackNavProvider } from '@/lib/story/back-nav'
import { WeatherApp } from '@/components/apps/weather-app'

const APPS: Record<AppId, () => React.ReactNode> = {
  kakao: () => <KakaoApp />,
  messages: () => <MessagesApp />,
  phone: () => <PhoneApp />,
  photos: () => <PhotosApp />,
  settings: () => <SettingsApp />,
  safari: () => <SafariApp />,
  anyai: () => <AnyAiApp />,
  notes: () => <NotesApp />,
  camera: () => <CameraApp />,
  voicememos: () => <VoiceMemosApp />,
  calendar: () => <CalendarApp />,
  clock: () => <ClockApp />,
  calculator: () => <CalculatorApp />, // <-- Daftarkan di sini
  weather: WeatherApp,
}

function Screens() {
  const { screen } = useStory()
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {screen.kind === 'lock' && <LockScreen />}
      {screen.kind === 'passcode' && <Passcode />}
      {screen.kind === 'home' && <HomeScreen />}
      {screen.kind === 'app' && (
        <div key={screen.app} className="animate-screen-in absolute inset-0">
          {APPS[screen.app]()}
        </div>
      )}
      <TopNav />
      <NotificationBanner />
      <IncomingCall />
      <OutgoingCall />
    </div>
  )
}

export function Phone() {
  return (
    <StoryProvider>
      <div className="relative h-dvh w-full overflow-hidden bg-black sm:h-[min(844px,calc(100dvh-2rem))] sm:w-[390px] sm:rounded-[48px] sm:shadow-[0_0_0_10px_#0b0b0c,0_0_0_12px_#3a3a3c,0_30px_80px_rgba(0,0,0,0.6)]">
        <BackNavProvider>
          <Screens />
        </BackNavProvider>
      </div>
    </StoryProvider>
  )
}