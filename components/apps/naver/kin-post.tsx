'use client'

import { withBasePath } from '@/lib/base-path'
import { MessageCircle, ThumbsUp, UserRound } from 'lucide-react'

type Answer = { id: string; author: string; level: string; body: string[]; extra?: 'hospital' }

const ANSWERS: Answer[] = [
  {
    id: 'a1',
    author: 'dhdwn29',
    level: '평민',
    body: [
      '글쓴이 님이 너무 받아준 거 아니에요? 그 남자도 눈치없긴하네요.... 좋아하는 사람이랑 사귀어버리는건어때요',
      '도움 안되었나요?ㅜㅜ 죄송합니다....',
    ],
  },
  {
    id: 'a2',
    author: 'dudvlftkfkd0101',
    level: '평민',
    body: ['근데 글내용이 은근슬쩍 인기많다고 자랑하는 느낌도 있는거같아요'],
  },
  {
    id: 'a3',
    author: 'wellknown99',
    level: '수호',
    body: [
      '글쓴이님 고민이 많으셨겠어요... 그럴 때는 인간관계를 다 끊고, 상담을 받으며 나에게 집중해보는 시간을 가지는 것도 좋을 거 같아요. 인간관계가 인생에서 가장 큰 스트레스잖아요. 남겨드리는 번호로 전화주시면, 언제든지 친절하게 응대해드리겠습니다. 아래는 저희 상담병원 홈페이지입니다. 시간 날 때 방문해주세요. ^^ 채택도 부탁드립니다.',
      '02-129-0428',
    ],
    extra: 'hospital',
  },
]

export function KinPost() {
  return (
    <article className="bg-[#f2f4f6] pb-8">
      <header className="flex items-center gap-1.5 bg-white px-4 py-3">
        <span className="text-[19px] font-extrabold tracking-tight text-[#03c75a]">지식iN</span>
        <span className="text-[13px] text-black/40">· 연애, 결혼</span>
      </header>

      <section className="bg-white px-4 pb-5 pt-2" aria-labelledby="kin-title">
        <h1 id="kin-title" className="flex gap-1.5 text-[19px] font-bold leading-snug">
          <span className="text-[#03c75a]" aria-hidden>
            Q.
          </span>
          관심없는 남자 차단법뭐죠???????
        </h1>
        <p className="mt-4 whitespace-pre-line text-[15px] leading-[1.7] text-[#333]">
          관심도없는 남자한테 계속 연락오는데 어떻게 해야돼요? 진심 문자를 씹으면 전화를 하고, 전화 안받아도 굴하지 않고
          연락해요....;; 전 좋아하는 사람도 있거든요? 근데 계속 찝적거리니까 너무싫음요...ㅜㅜㅜㅜㅜㅜ 뭘 어떻게
          해야될까요.... 사실 전에도 관심없는 사람들한테 연락온적이 많은데 그럴때마다 곤란해요...
        </p>
        <div className="mt-5 flex items-center justify-between text-[12.5px] text-black/45">
          <span>
            <span className="font-medium text-black/70">kimwpil0428</span> · 2025.09.28
          </span>
          <span className="flex items-center gap-3">
            <span>조회수 1,284</span>
            <span className="flex items-center gap-1">
              <MessageCircle className="size-3.5" aria-hidden />
              {ANSWERS.length}
            </span>
          </span>
        </div>
      </section>

      <h2 className="px-4 pb-2 pt-5 text-[14px] font-bold text-black/70">
        답변 <span className="text-[#03c75a]">{ANSWERS.length}</span>
      </h2>
      <ul className="flex flex-col gap-2">
        {ANSWERS.map((a) => (
          <li key={a.id} className="bg-white px-4 py-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-[#e9edf0] text-black/35" aria-hidden>
                <UserRound className="size-5" />
              </span>
              <div className="leading-tight">
                <p className="text-[14px] font-semibold">{a.author}</p>
                <p className="text-[12px] text-black/40">{a.level} · 2025.09.28</p>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-3 text-[15px] leading-[1.7] text-[#333]">
              {a.body.map((p) => (
                <p key={p} className={p.startsWith('02-') ? 'font-semibold' : undefined}>
                  {p}
                </p>
              ))}
            </div>
            {a.extra === 'hospital' && <HospitalLink />}
            <div className="mt-4 flex items-center gap-1 text-[12.5px] text-black/40">
              <ThumbsUp className="size-3.5" aria-hidden />
              {a.id === 'a3' ? 3 : a.id === 'a1' ? 1 : 7}
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}

function HospitalLink() {
  return (
    <div className="mt-4 overflow-hidden rounded-[10px] border border-black/10">
      <img
        src={withBasePath('/images/naver/hospital.png')}
        alt="조은상담 을지병원 상담실 사진"
        className="aspect-[2/1] w-full object-cover"
      />
      <div className="px-3 py-2.5">
        <p className="text-[14px] font-semibold">조은상담 을지병원 - 마음이 편안해지는 곳</p>
        <p className="mt-0.5 line-clamp-2 text-[12.5px] text-black/50">
          심리상담 · 스트레스 클리닉 · 24시간 전화상담 02-129-0428
        </p>
        <p className="mt-1 text-[12px] text-[#03c75a]">www.joeun-eulji.co.kr</p>
      </div>
    </div>
  )
}
