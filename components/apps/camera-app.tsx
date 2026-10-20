'use client'

import { useEffect, useRef } from 'react'
import { ChevronUp, RefreshCcw, Zap, ZapOff } from 'lucide-react'
import { useStory } from '@/lib/story/store'
import { withBasePath } from '@/lib/base-path'

const MODES = ['타임랩스', '슬로모', '비디오', '사진', '인물', '파노라마']

export function CameraApp() {
  const { goHome, markCameraUsed } = useStory()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    markCameraUsed()
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {
      v.muted = true
      v.play().catch(() => {})
    })
    // markCameraUsed is stable in behaviour (idempotent); run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex h-full flex-col bg-black text-white">
      <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-12">
        <span className="flex size-8 items-center justify-center rounded-full bg-white/10" aria-hidden>
          <ZapOff className="size-[18px]" />
        </span>
        <ChevronUp className="size-5 text-white/90" aria-hidden />
        <span className="flex size-8 items-center justify-center rounded-full bg-white/10" aria-hidden>
          <span className="size-[18px] rounded-full border-[1.5px] border-dashed border-white" />
        </span>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <video
          ref={videoRef}
          src={withBasePath('/videos/camera.mp4')}
          playsInline
          autoPlay
          onEnded={goHome}
          onTimeUpdate={(e) => {
            const v = e.currentTarget
            if (v.duration && v.currentTime >= v.duration - 0.2) goHome()
          }}
          className="absolute inset-0 size-full object-cover"
          aria-label="카메라 화면"
        />
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2" aria-hidden>
          {['.5', '1×', '2', '3'].map((z) => (
            <span
              key={z}
              className={
                z === '1×'
                  ? 'flex size-9 items-center justify-center rounded-full bg-black/45 text-[12px] font-semibold text-[#ffd60a]'
                  : 'flex size-7 items-center justify-center self-center rounded-full bg-black/45 text-[11px] font-semibold'
              }
            >
              {z}
            </span>
          ))}
        </div>
      </div>

      <div className="shrink-0 pb-8 pt-3">
        <ul className="flex justify-center gap-4 text-[13px] font-medium tracking-wide" aria-hidden>
          {MODES.map((m) => (
            <li key={m} className={m === '사진' ? 'text-[#ffd60a]' : 'text-white/90'}>
              {m}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-center justify-between px-9">
          <span className="size-[46px] overflow-hidden rounded-lg bg-white/15" aria-hidden />
          <button
            type="button"
            onClick={goHome}
            aria-label="카메라 닫기"
            className="flex size-[74px] items-center justify-center rounded-full border-[4px] border-white"
          >
            <span className="size-[60px] rounded-full bg-white active:scale-90 transition-transform" />
          </button>
          <span className="flex size-[46px] items-center justify-center rounded-full bg-white/15" aria-hidden>
            <RefreshCcw className="size-5" />
          </span>
        </div>
      </div>
      <Zap className="sr-only" aria-hidden />
    </div>
  )
}
