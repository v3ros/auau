import { withBasePath } from '@/lib/base-path'

export type MediaItem = { 
  id: string; 
  src: string; 
  at: string; 
  alt: string;
  type?: 'image' | 'video'; // Tambahkan tipe opsional
}

export const photos: MediaItem[] = [
  { id: 'p1', src: withBasePath('/images/photos/1.jpeg'), at: '2025-09-14T23:41:00+09:00', alt: '누워서 찍은 검은 셔츠 셀카', type: 'image' },
  { id: 'p2', src: withBasePath('/images/photos/2.jpeg'), at: '2025-09-14T23:42:00+09:00', alt: '가까이 찍은 흐릿한 셀카', type: 'image' },
  { id: 'p3', src: withBasePath('/images/photos/3.jpeg'), at: '2025-10-03T14:20:00+09:00', alt: '검은 니트를 입고 아래에서 찍은 셀카', type: 'image' },
  { id: 'p4', src: withBasePath('/images/photos/4.jpeg'), at: '2025-10-11T16:05:00+09:00', alt: '골목길 꽃나무 옆에서 찍은 셀카', type: 'image' },
  { id: 'p5', src: withBasePath('/images/photos/5.jpeg'), at: '2025-10-26T16:48:00+09:00', alt: '베네치아 운하 다리 위에서 눈을 감은 사진', type: 'image' },
  { id: 'p6', src: withBasePath('/images/photos/6.jpeg'), at: '2025-11-08T09:12:00+09:00', alt: '이불을 덮고 브이를 한 아침 셀카', type: 'image' },
  { id: 'p7', src: withBasePath('/images/photos/7.jpeg'), at: '2025-11-16T19:30:00+09:00', alt: '검은 재킷을 입고 브이를 한 셀카', type: 'image' },
  
  // P8 diubah menjadi video MP4
  { 
    id: 'p8', 
    src: withBasePath('/images/photos/p8.mp4'), 
    at: '2025-11-18T22:14:00+09:00', 
    alt: '어두운 배경에서 손을 뻗은 채 찍힌 영상', 
    type: 'video' 
  },
  
  // { id: 'p9', src: withBasePath('/images/photos/9.jpeg'), at: '2025-11-21T21:03:00+09:00', alt: '밤에 벤치에 앉아 브이를 한 흰 티셔츠 사진', type: 'image' },
  // { id: 'p10', src: withBasePath('/images/photos/10.jpeg'), at: '2025-11-24T08:47:00+09:00', alt: '검은 패딩을 입고 엘리베이터에서 찍은 셀카', type: 'image' },
]