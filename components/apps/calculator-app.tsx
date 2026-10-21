'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Trash2, RotateCcw } from 'lucide-react'
import { HomeIndicator, StatusBar } from '@/components/phone/chrome'

type HistoryItem = {
  expression: string
  result: string
}

export function CalculatorApp() {
  const [display, setDisplay] = useState('0')
  const [equation, setEquation] = useState('')
  const [isScientific, setIsScientific] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [isRad, setIsRad] = useState(true)

  const handleNumber = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num)
    } else {
      setDisplay(display + num)
    }
  }

  const handleOperator = (op: string) => {
    setEquation(`${display} ${op} `)
    setDisplay('0')
  }

  const handleClear = () => {
    setDisplay('0')
    setEquation('')
  }

  const handleToggleSign = () => {
    if (display !== '0') {
      setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev))
    }
  }

  const handlePercent = () => {
    try {
      const val = parseFloat(display) / 100
      setDisplay(val.toString())
    } catch {
      setDisplay('Error')
    }
  }

  const handleCalculate = () => {
    try {
      let fullExpr = equation + display
      let evalExpr = fullExpr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')

      // Evaluasi dasar
      const res = Function(`'use strict'; return (${evalExpr})`)()
      const formattedRes = Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(8)).toString()

      setHistory([{ expression: fullExpr, result: formattedRes }, ...history])
      setDisplay(formattedRes)
      setEquation('')
    } catch {
      setDisplay('Error')
    }
  }

  const handleScientific = (func: string) => {
    try {
      const val = parseFloat(display)
      let res = 0

      const angle = isRad ? val : (val * Math.PI) / 180

      switch (func) {
        case 'sin': res = Math.sin(angle); break
        case 'cos': res = Math.cos(angle); break
        case 'tan': res = Math.tan(angle); break
        case 'sqrt': res = Math.sqrt(val); break
        case 'log': res = Math.log10(val); break
        case 'ln': res = Math.log(val); break
        case 'pow2': res = Math.pow(val, 2); break
        case 'pow3': res = Math.pow(val, 3); break
        case 'factorial':
          res = 1
          for (let i = 2; i <= val; i++) res *= i
          break
        case 'pi': setDisplay(Math.PI.toString()); return
        case 'e': setDisplay(Math.E.toString()); return
        default: return
      }

      const formattedRes = parseFloat(res.toFixed(8)).toString()
      setHistory([{ expression: `${func}(${display})`, result: formattedRes }, ...history])
      setDisplay(formattedRes)
    } catch {
      setDisplay('Error')
    }
  }

  return (
    <div className="relative flex h-full flex-col bg-black text-white overflow-hidden">
      <StatusBar tone="light" />

      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 pt-2 pb-1">
        <button
          type="button"
          onClick={() => setIsScientific(!isScientific)}
          className="rounded-full bg-zinc-800 px-3 py-1 text-[12px] font-medium text-orange-400 active:scale-95 transition-transform"
        >
          {isScientific ? 'Mode Standar' : 'Mode Saintifik'}
        </button>

        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 text-zinc-400 hover:text-white active:scale-90 transition-transform"
          title="Riwayat Perhitungan"
        >
          <History className="size-5" />
        </button>
      </div>

      {/* Area Layar Display */}
      <div className="flex-1 flex flex-col justify-end px-6 pb-4 text-right">
        <p className="text-[16px] text-zinc-400 min-h-[24px] font-mono">{equation}</p>
        <h1 className="text-[52px] font-light tracking-tight truncate leading-none mt-1">
          {display}
        </h1>
      </div>

      {/* Panel Tombol Kalkulator */}
      <div className="p-4 bg-black grid gap-3">
        {/* Tombol Fitur Saintifik (Jika Mode Kompleks Aktif) */}
        {isScientific && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-4 gap-2 pb-2 border-b border-zinc-800 text-[13px]"
          >
            <button onClick={() => setIsRad(!isRad)} className="btn-sci">{isRad ? 'RAD' : 'DEG'}</button>
            <button onClick={() => handleScientific('sin')} className="btn-sci">sin</button>
            <button onClick={() => handleScientific('cos')} className="btn-sci">cos</button>
            <button onClick={() => handleScientific('tan')} className="btn-sci">tan</button>
            
            <button onClick={() => handleScientific('pow2')} className="btn-sci">x²</button>
            <button onClick={() => handleScientific('pow3')} className="btn-sci">x³</button>
            <button onClick={() => handleScientific('sqrt')} className="btn-sci">√x</button>
            <button onClick={() => handleScientific('factorial')} className="btn-sci">x!</button>

            <button onClick={() => handleScientific('log')} className="btn-sci">log</button>
            <button onClick={() => handleScientific('ln')} className="btn-sci">ln</button>
            <button onClick={() => handleScientific('pi')} className="btn-sci">π</button>
            <button onClick={() => handleScientific('e')} className="btn-sci">e</button>
          </motion.div>
        )}

        {/* Tombol Standar iOS */}
        <div className="grid grid-cols-4 gap-3 text-[24px]">
          <button onClick={handleClear} className="btn-dark-gray">{display !== '0' ? 'C' : 'AC'}</button>
          <button onClick={handleToggleSign} className="btn-dark-gray">±</button>
          <button onClick={handlePercent} className="btn-dark-gray">%</button>
          <button onClick={() => handleOperator('÷')} className="btn-orange">÷</button>

          <button onClick={() => handleNumber('7')} className="btn-number">7</button>
          <button onClick={() => handleNumber('8')} className="btn-number">8</button>
          <button onClick={() => handleNumber('9')} className="btn-number">9</button>
          <button onClick={() => handleOperator('×')} className="btn-orange">×</button>

          <button onClick={() => handleNumber('4')} className="btn-number">4</button>
          <button onClick={() => handleNumber('5')} className="btn-number">5</button>
          <button onClick={() => handleNumber('6')} className="btn-number">6</button>
          <button onClick={() => handleOperator('-')} className="btn-orange">-</button>

          <button onClick={() => handleNumber('1')} className="btn-number">1</button>
          <button onClick={() => handleNumber('2')} className="btn-number">2</button>
          <button onClick={() => handleNumber('3')} className="btn-number">3</button>
          <button onClick={() => handleOperator('+')} className="btn-orange">+</button>

          <button onClick={() => handleNumber('0')} className="btn-number col-span-2 text-left pl-7">0</button>
          <button onClick={() => handleNumber('.')} className="btn-number">.</button>
          <button onClick={handleCalculate} className="btn-orange">=</button>
        </div>
      </div>

      {/* Drawer Riwayat Perhitungan */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute inset-0 z-30 bg-zinc-900/95 backdrop-blur flex flex-col p-5"
          >
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-[18px] font-semibold">Riwayat Hitungan</h3>
              <div className="flex gap-3">
                <button 
                  onClick={() => setHistory([])} 
                  className="text-red-400 p-1 hover:opacity-80"
                  title="Hapus Semua"
                >
                  <Trash2 className="size-5" />
                </button>
                <button 
                  onClick={() => setShowHistory(false)} 
                  className="text-orange-400 font-semibold"
                >
                  Selesai
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pt-3 space-y-3 no-scrollbar">
              {history.length === 0 ? (
                <p className="text-center text-zinc-500 text-[14px] pt-10">Belum ada riwayat hitungan.</p>
              ) : (
                history.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setDisplay(item.result)
                      setShowHistory(false)
                    }}
                    className="flex flex-col items-end p-2.5 rounded-lg hover:bg-zinc-800/60 cursor-pointer active:scale-98 transition-all"
                  >
                    <span className="text-zinc-400 text-[14px]">{item.expression}</span>
                    <span className="text-[22px] font-semibold text-orange-400">= {item.result}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HomeIndicator tone="light" />

      {/* Tailwind Custom Styles Inline */}
      <style jsx>{`
        .btn-number {
          @apply bg-zinc-800 text-white rounded-full aspect-square flex items-center justify-center font-normal active:bg-zinc-700 transition-colors;
        }
        .btn-dark-gray {
          @apply bg-zinc-400 text-black rounded-full aspect-square flex items-center justify-center font-medium active:bg-zinc-300 transition-colors;
        }
        .btn-orange {
          @apply bg-orange-500 text-white rounded-full aspect-square flex items-center justify-center font-medium active:bg-orange-600 transition-colors;
        }
        .btn-sci {
          @apply bg-zinc-800/80 text-zinc-200 rounded-lg py-2 flex items-center justify-center active:bg-zinc-700 transition-colors font-mono;
        }
      `}</style>
    </div>
  )
}