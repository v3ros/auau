'use client'

import dynamic from 'next/dynamic'

const Phone = dynamic(() => import('./phone').then((m) => m.Phone), {
  ssr: false,
  loading: () => <PhoneFrameSkeleton />,
})

function PhoneFrameSkeleton() {
  return (
    <div className="h-dvh w-full bg-black sm:h-[min(844px,calc(100dvh-2rem))] sm:w-[390px] sm:rounded-[48px]" />
  )
}

export function PhoneLoader() {
  return <Phone />
}
