import type { ContactId } from './contacts'
import { formatClock, kst } from './time'

export type SmsMessage = {
  id: string
  from: 'me' | 'them'
  at: string
  text: string
}

export type SmsThread = {
  id: string
  contactId: ContactId
  /** 발신 전용 알림 스레드 (답장 불가) */
  notificationOnly?: boolean
  messages: SmsMessage[]
}

type Entry = [string, 'me' | 'them', string]

function thread(
  id: string,
  contactId: ContactId,
  entries: Entry[],
  notificationOnly = false,
): SmsThread {
  return {
    id,
    contactId,
    notificationOnly,
    messages: entries.map(([at, from, text], i) => ({ id: `${id}-${i}`, from, at: kst(at), text })),
  }
}

const ME = 'me' as const
const T = 'them' as const

export type CardTransaction = { at: string; merchant: string; amount: number }

/** 현대카드 가상 승인 내역. 누적액은 아래 거래를 시간순으로 더해 계산한다. */
export const cardTransactions: CardTransaction[] = [
  { at: '2025-11-01 10:12', merchant: 'GS25 영원점', amount: 4800 },
  { at: '2025-11-01 19:40', merchant: '한식당 소담', amount: 32000 },
  { at: '2025-11-02 09:30', merchant: '하모니 피아노조율', amount: 150000 },
  { at: '2025-11-03 13:20', merchant: '다이소', amount: 18500 },
  { at: '2025-11-04 09:00', merchant: 'SKT 통신요금', amount: 89000 },
  { at: '2025-11-04 12:30', merchant: '김밥천국', amount: 8500 },
  { at: '2025-11-05 15:10', merchant: '알파문구', amount: 42000 },
  { at: '2025-11-06 11:05', merchant: 'anybook', amount: 126000 },
  { at: '2025-11-06 20:15', merchant: '현대백화점', amount: 168000 },
  { at: '2025-11-07 08:40', merchant: '스타벅스', amount: 6300 },
  { at: '2025-11-09 15:30', merchant: '롯데백화점', amount: 176000 },
  { at: '2025-11-09 21:10', merchant: 'CU 영원점', amount: 7200 },
  { at: '2025-11-10 17:40', merchant: '배달의민족', amount: 23900 },
  { at: '2025-11-11 11:00', merchant: '쿠팡', amount: 39800 },
  { at: '2025-11-11 19:30', merchant: '코스트코', amount: 121600 },
  { at: '2025-11-12 19:20', merchant: '이마트', amount: 86400 },
  { at: '2025-11-13 10:00', merchant: '코웨이 정기결제', amount: 49900 },
  { at: '2025-11-13 18:00', merchant: '교보문고', amount: 54000 },
  { at: '2025-11-14 12:40', merchant: '현대백화점', amount: 189000 },
  { at: '2025-11-15 14:30', merchant: '올리브영', amount: 47300 },
  { at: '2025-11-15 19:50', merchant: '고기굽는집', amount: 96000 },
  { at: '2025-11-16 15:20', merchant: '현대백화점', amount: 142000 },
  { at: '2025-11-16 18:50', merchant: '레스토랑 온', amount: 128000 },
  { at: '2025-11-17 10:05', merchant: '쿠팡', amount: 68900 },
  { at: '2025-11-17 21:30', merchant: '무신사', amount: 112000 },
  { at: '2025-11-18 14:10', merchant: '카페 모음', amount: 36500 },
  { at: '2025-11-18 21:00', merchant: '카카오T 택시', amount: 14600 },
  { at: '2025-11-19 12:10', merchant: 'GS25 영원점', amount: 5600 },
]

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`

function cardEntries(): Entry[] {
  let total = 0
  return [...cardTransactions]
    .sort((a, b) => kst(a.at).localeCompare(kst(b.at)))
    .map((t) => {
      total += t.amount
      const [date] = t.at.split(' ')
      const [, m, d] = date.split('-')
      const text = `[Web발신]\n현대카드 승인\n김*필\n${won(t.amount)} 일시불\n${m}/${d} ${formatClock(kst(t.at))}\n${t.merchant}\n누적 ${won(total)}`
      return [t.at, T, text] as Entry
    })
}

export const cardTotal = cardTransactions.reduce((sum, t) => sum + t.amount, 0)

export const smsThreads: SmsThread[] = [
  thread('seunga', 'seungaMom', [
    ['2025-10-27 18:10', T, '선생님 안녕하세요. 승아 엄마예요. 이번 주 발표회 곡 악보 받아왔는데 집에서 연습시킬 때 참고할 부분 있을까요?'],
    ['2025-10-27 18:32', ME, '어머님 안녕하세요! 승아가 앞부분은 아주 잘하고 있어요. 중간 셈여림 표시만 한 번씩 같이 봐주시면 충분해요 :)'],
    ['2025-10-27 18:35', T, '네 감사합니다 선생님^^'],
    ['2025-11-11 08:40', T, '선생님 안녕하세요. 승아가 어제 저녁부터 감기 기운이 있어서 오늘 레슨은 쉬어야 할 것 같아요. 죄송합니다.'],
    ['2025-11-11 09:05', ME, '어머님 안녕하세요. 연락 주셔서 감사합니다. 승아 푹 쉬고 얼른 낫기를 바랄게요!'],
    ['2025-11-11 09:06', ME, '보강은 다음 주 월요일(17일) 오후 4시나 수요일(19일) 오후 5시에 가능해요. 편하신 시간 알려주세요.'],
    ['2025-11-11 12:20', T, '월요일 4시로 부탁드려요. 배려해주셔서 감사합니다.'],
    ['2025-11-11 12:31', ME, '네 17일 월요일 오후 4시로 잡아둘게요. 승아 몸조리 잘하라고 전해주세요 :)'],
    ['2025-11-16 20:10', T, '선생님 승아 다 나았어요. 내일 4시에 보낼게요!'],
    ['2025-11-16 20:24', ME, '다행이에요! 내일 뵐게요 어머님 :)'],
  ]),

  thread('yuchan', 'yuchanMom', [
    ['2025-11-06 21:15', T, '선생님 늦은 시간에 죄송해요. 유찬이가 요즘 양손으로 치는 걸 어려워하는데 집에서 어떻게 도와주면 좋을까요?'],
    ['2025-11-06 21:40', ME, '어머님 안녕하세요! 유찬이 요즘 오른손 멜로디는 정말 안정적으로 잘 쳐요.'],
    ['2025-11-06 21:41', ME, '양손은 처음엔 다 어려워해요. 집에서는 왼손만 따로 세 번, 그다음 아주 천천히 양손으로 한 번 정도면 충분해요.'],
    ['2025-11-06 21:45', T, '아 그렇군요. 메트로놈도 쓰는 게 좋을까요?'],
    ['2025-11-06 21:52', ME, '아직은 괜찮아요! 다음 달쯤 템포 잡을 때 같이 알려드릴게요.'],
    ['2025-11-14 19:05', T, '선생님 바이엘 하권 다 끝나가는데 다음 교재 미리 사둬야 할까요?'],
    ['2025-11-14 19:30', ME, '유찬이 진도가 정말 빨라졌어요! 이번 주에 처음으로 양손 끝까지 안 멈추고 쳤어요 :)'],
    ['2025-11-14 19:31', ME, '다음 교재는 체르니 100이에요. 학원에서 준비해둘 테니 따로 안 사셔도 돼요.'],
    ['2025-11-14 19:33', T, '와 집에서도 칭찬 많이 해줄게요. 감사합니다 선생님!'],
  ]),

  thread('card', 'hyundai', cardEntries(), true),

  thread('jihoo', 'jihoo', [
    ['2025-11-05 19:12', T, '선생님 저 지후에요'],
    ['2025-11-05 19:12', T, '엄마폰으로 보내요'],
    ['2025-11-05 19:20', ME, '지후구나! 무슨 일이야?'],
    ['2025-11-05 19:21', T, '내일 보드게임 또 해도 돼요?'],
    ['2025-11-05 19:25', ME, '레슨 열심히 하면 끝나고 한 판 하자!'],
    ['2025-11-05 19:25', T, '네!!!'],
    ['2025-11-12 20:03', T, '선생님 저 오늘 집에서 다섯번 쳤어요'],
    ['2025-11-12 20:03', T, '근데 왼손이 자꾸 틀려요'],
    ['2025-11-12 20:10', ME, '다섯 번이나 연습했어? 지후 정말 열심히 했네 😊'],
    ['2025-11-12 20:10', ME, '왼손은 천천히 해도 괜찮아. 다음 시간에 선생님이랑 같이 해보자!'],
    ['2025-11-12 20:11', T, '그럼 스티커 두개에요?'],
    ['2025-11-12 20:13', ME, '그럼! 스티커 두 개 줄게'],
    ['2025-11-18 18:30', T, '선생님 새 보드게임 왔어요?'],
    ['2025-11-18 18:31', T, '형아가 왔다고 했어요'],
    ['2025-11-18 18:40', ME, '응 오늘 도착했어! 다음 레슨 끝나고 같이 해보자'],
    ['2025-11-18 18:41', T, '와 진짜 조아요'],
  ]),

  thread(
    'cj',
    'cj',
    [
      ['2025-11-08 11:42', T, '[CJ대한통운] 고객님의 상품이 배송 완료되었습니다.\n상품명: anybook 악보제본집\n배송장소: 영원피아노 출입문 앞'],
      ['2025-11-12 15:18', T, '[CJ대한통운] 고객님의 상품이 배송 완료되었습니다.\n상품명: 비타민씨 영양제\n배송장소: 영원피아노 출입문 앞'],
      ['2025-11-18 14:55', T, '[CJ대한통운] 고객님의 상품이 배송 완료되었습니다.\n상품명: 어린이용보드게임세트\n배송장소: 영원피아노 출입문 앞'],
    ],
    true,
  ),
]
