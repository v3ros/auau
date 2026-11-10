'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useStory, type Screen } from '@/lib/story/store'
import { LockScreen } from './lock-screen'
import { Passcode } from './passcode'
import { HomeScreen } from './home-screen'
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
import { CalculatorApp } from '@/components/apps/calculator-app'
import { WeatherApp } from '@/components/apps/weather-app'
import { TopNav } from './top-nav'
import { NotificationBanner } from './notification-banner'
import { IncomingCall } from './incoming-call'
import { OutgoingCall } from './outgoing-call'

const APPS: Record<string, () => React.ReactNode> = {
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
  calculator: () => <CalculatorApp />,
  weather: () => <WeatherApp />,
}

function renderScreenContent(screen: Screen) {
  if (screen.kind === 'lock') return <LockScreen />
  if (screen.kind === 'passcode') return <Passcode />
  if (screen.kind === 'home') return <HomeScreen />
  if (screen.kind === 'app') {
    const AppComp = APPS[screen.app]
    return AppComp ? <AppComp /> : <HomeScreen />
  }
  return <HomeScreen />
}

export function ScreenTransitionContainer() {
  const { screen } = useStory()
  
  // Two-layer state management
  const [currentScreen, setCurrentScreen] = useState<Screen>(screen)
  const [prevScreen, setPrevScreen] = useState<Screen | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const transactionIdRef = useRef(0)
  const cleanupTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (
      currentScreen.kind === screen.kind &&
      (currentScreen.kind !== 'app' || (screen.kind === 'app' && currentScreen.app === screen.app))
    ) {
      return
    }

    const txId = ++transactionIdRef.current
    setIsTransitioning(true)
    setPrevScreen(currentScreen)
    setCurrentScreen(screen)

    if (cleanupTimerRef.current) {
      window.clearTimeout(cleanupTimerRef.current)
    }

    // Fallback timer sinkron dengan durasi CSS (380ms)
    cleanupTimerRef.current = window.setTimeout(() => {
      if (transactionIdRef.current === txId) {
        setPrevScreen(null)
        setIsTransitioning(false)
      }
    }, 400)

    return () => {
      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current)
      }
    }
  }, [screen])

  return (
    <div className="relative h-full w-full overflow-hidden bg-transparent">
      {/* 1. Previous / Outgoing Screen Layer */}
      {prevScreen && (
        <div 
          key={`prev-${prevScreen.kind}-${prevScreen.kind === 'app' ? prevScreen.app : ''}`}
          className="absolute inset-0 z-10 pointer-events-none ios-screen-exit"
          aria-hidden="true"
          {...({ inert: true } as any)}
        >
          {renderScreenContent(prevScreen)}
        </div>
      )}

      {/* 2. Current / Incoming Screen Layer */}
      <div 
        key={`curr-${currentScreen.kind}-${currentScreen.kind === 'app' ? currentScreen.app : ''}`}
        className={`absolute inset-0 z-20 pointer-events-auto ${isTransitioning ? 'ios-screen-enter' : ''}`}
      >
        {renderScreenContent(currentScreen)}
      </div>

      {/* System Overlays */}
      <TopNav />
      <NotificationBanner />
      <IncomingCall />
      <OutgoingCall />
    </div>
  )
}