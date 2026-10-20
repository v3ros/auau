import Image from 'next/image'
import { withBasePath } from '@/lib/base-path'

export function Sticker({ kind }: { kind: 'pout' | 'teary' }) {
  return (
    <Image
      src={withBasePath('/images/stickers/bunny-cry.png')}
      alt={kind === 'pout' ? '우는 토끼 이모티콘' : '눈물 흘리는 토끼 이모티콘'}
      width={112}
      height={112}
      className="size-28 select-none object-contain"
      draggable={false}
    />
  )
}
