'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react'

type BackStack = { current: Array<() => void> }

const BackNavContext = createContext<BackStack | null>(null)

export function BackNavProvider({ children }: { children: React.ReactNode }) {
  const stack = useRef<Array<() => void>>([])
  const value = useMemo(() => stack, [])
  return <BackNavContext.Provider value={value}>{children}</BackNavContext.Provider>
}

/** 앱 내부 하위 화면(대화방, 상세 페이지 등)이 열려 있을 때 상단 뒤로가기 버튼이 처리할 동작을 등록한다. */
export function useBackHandler(active: boolean, handler: () => void) {
  const stack = useContext(BackNavContext)
  const latest = useRef(handler)
  useEffect(() => {
    latest.current = handler
  })
  useEffect(() => {
    if (!active || !stack) return
    const entry = () => latest.current()
    stack.current.push(entry)
    return () => {
      stack.current = stack.current.filter((e) => e !== entry)
    }
  }, [active, stack])
}

/** 등록된 가장 최근 하위 화면을 닫는다. 처리할 화면이 없으면 false. */
export function usePopBack() {
  const stack = useContext(BackNavContext)
  return useCallback(() => {
    const top = stack?.current[stack.current.length - 1]
    if (!top) return false
    top()
    return true
  }, [stack])
}
