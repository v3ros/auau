'use client'

import { ChevronLeft, House } from 'lucide-react'
import { useStory } from '@/lib/story/store'
import { usePopBack } from '@/lib/story/back-nav'

export function TopNav() {
  const { screen, kakaoRoomId, closeKakaoRoom, goHome } = useStory()
  const popBack = usePopBack()

  if (screen.kind !== 'app') return null

  const back = () => {
    if (popBack()) return
    if (screen.app === 'kakao' && kakaoRoomId) return closeKakaoRoom()
    goHome()
  }

  const btn =
    'relative flex h-full w-11 items-center justify-center text-white/90 transition-colors active:bg-white/15 after:absolute after:-inset-y-[5px] after:inset-x-0 after:content-[""] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60'

  return (
    <nav
      aria-label="화면 이동"
      className="absolute left-1/2 top-[11px] z-40 flex h-[34px] -translate-x-1/2 items-center overflow-hidden rounded-full bg-black shadow-[0_0_0_0.5px_rgba(255,255,255,0.18)]"
    >
      <button type="button" onClick={back} aria-label="뒤로가기" className={btn}>
        <ChevronLeft className="size-[18px]" strokeWidth={2.4} aria-hidden />
      </button>
      <span className="h-4 w-px bg-white/20" aria-hidden />
      <button type="button" onClick={goHome} aria-label="홈 화면으로" className={btn}>
        <House className="size-[15px]" strokeWidth={2.2} aria-hidden />
      </button>
    </nav>
  )
}
