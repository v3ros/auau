import { PhoneLoader } from '@/components/phone/phone-loader'

export default function Page() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#1c1c1e] sm:p-4">
      <h1 className="sr-only">김원필의 iphone</h1>
      <PhoneLoader />
    </main>
  )
}
