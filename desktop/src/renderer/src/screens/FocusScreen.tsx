import React, { useEffect } from 'react'
import { Zap, Pause, Play, Check, Square, ArrowLeft, Tag } from 'lucide-react'
import { Task } from '../types/task'

interface FocusScreenProps {
  activeTask: Task | undefined
  formatTime: (secs: number) => string
  onTogglePlayPause: () => void
  onToggleComplete: () => void
  onStop: () => void
  onExitFocus: () => void
}

export const FocusScreen: React.FC<FocusScreenProps> = ({
  activeTask,
  formatTime,
  onTogglePlayPause,
  onToggleComplete,
  onStop,
  onExitFocus
}) => {
  // Listen for shortcuts: Escape to exit, Cmd/Ctrl + P to pause/resume, Cmd/Ctrl + S to stop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey

      if (isCmdOrCtrl && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        onTogglePlayPause()
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault()
        onStop()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onExitFocus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onTogglePlayPause, onStop, onExitFocus])

  if (!activeTask) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-neutral-950 text-neutral-50 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full bg-neutral-900 flex items-center justify-center border border-white/10">
            <Zap className="size-5 text-[oklch(0.488_0.243_264.376)]" />
          </div>
          <p className="text-sm text-[#a1a1a1]">No active focus session.</p>
          <button
            onClick={onExitFocus}
            className="border border-white/10 hover:bg-neutral-800 text-neutral-300 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Workspace</span>
          </button>
        </div>
      </div>
    )
  }

  const ringPerimeter = 2 * Math.PI * 54
  const estimatedSeconds = activeTask.estimatedHours * 3600
  const progressPercent = Math.min(activeTask.loggedTime / estimatedSeconds, 1)
  const offset = ringPerimeter * (1 - progressPercent)

  const isPaused = activeTask.status !== 'In Progress'

  return (
    <div className="h-screen w-screen bg-neutral-950 text-neutral-50 flex flex-col font-sans select-none overflow-hidden relative">
      {/* Top Header Bar */}
      <header className="flex px-12 py-8 justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-[linear-gradient(135deg,oklch(0.488_0.243_264.376),oklch(0.627_0.265_303.9))] shadow-lg shadow-primary/20 rounded-2xl flex justify-center items-center">
            <Zap className="size-5 text-neutral-900" />
          </div>
          <div className="flex flex-col">
            <span className="leading-none font-semibold text-lg">Fexo</span>
            <span className="text-[#a1a1a1] text-[10px] tracking-wider uppercase mt-0.5">
              Productivity OS
            </span>
          </div>
        </div>
        <button
          onClick={onExitFocus}
          className="border border-white/10 hover:bg-neutral-800 text-[#a1a1a1] hover:text-white px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Exit Focus</span>
        </button>
      </header>

      {/* Main Focus Dial & Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 pb-20 gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[oklch(0.488_0.243_264.376)] font-semibold uppercase text-xs tracking-widest">
            Focus Mode
          </span>
          <h1 className="font-bold text-5xl leading-tight text-neutral-50 tracking-tight text-center max-w-2xl">
            {activeTask.title}
          </h1>
          <div className="bg-neutral-900 border border-white/10 rounded-full flex px-3.5 py-1.5 items-center gap-2 mt-1">
            <Tag className="size-3 text-[oklch(0.488_0.243_264.376)]" />
            <span className="text-[#a1a1a1] text-xs font-medium">{activeTask.category}</span>
          </div>
        </div>

        {/* Dynamic Concentric Dial */}
        <div className="relative size-60">
          <svg className="size-60 -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="54" fill="none" stroke="oklch(0.205 0 0)" strokeWidth="5" />
            <circle
              cx="64"
              cy="64"
              r="54"
              fill="none"
              stroke="url(#focusTimerGrad)"
              strokeWidth="5"
              strokeDasharray={String(ringPerimeter)}
              strokeDashoffset={String(offset)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <defs>
            <linearGradient id="focusTimerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(0.488 0.243 264.376)" />
              <stop offset="100%" stopColor="oklch(0.627 0.265 303.9)" />
            </linearGradient>
          </defs>
          <div className="flex absolute inset-0 flex-col justify-center items-center gap-1">
            <span className="tabular-nums font-mono font-bold text-neutral-50 text-4xl tracking-widest">
              {formatTime(activeTask.loggedTime)}
            </span>
            <span className="text-neutral-500 uppercase text-[10px] tracking-widest mt-1">
              Elapsed
            </span>
          </div>
        </div>

        {/* Controls Layout */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onTogglePlayPause}
              className="border border-white/10 hover:bg-neutral-800 text-neutral-300 font-semibold px-6 py-2.5 rounded-full text-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            <button
              onClick={onToggleComplete}
              className="bg-[oklch(0.696_0.17_162.48)] text-neutral-950 font-semibold hover:opacity-90 transition-opacity px-8 py-2.5 rounded-full text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <Check className="size-4" />
              <span>Complete</span>
            </button>
            <button
              onClick={onStop}
              className="border border-white/10 hover:bg-neutral-800 text-[oklch(0.704_0.191_22.216)] hover:bg-[oklch(0.704_0.191_22.216)]/10 font-semibold px-6 py-2.5 rounded-full text-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Square className="size-4" />
              <span>Stop</span>
            </button>
          </div>

          <p className="text-neutral-400 text-sm italic">{"Stay focused. You're doing great 🚀"}</p>
        </div>
      </main>

      {/* Keyboard Shortcuts Pills Overlay */}
      <footer className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 shrink-0 z-10 pointer-events-none">
        <div className="bg-neutral-900/40 border border-white/5 backdrop-blur-sm rounded-full flex px-3 py-1.5 items-center gap-1 text-[10px] text-[#a1a1a1]">
          <kbd className="bg-neutral-800 text-neutral-300 rounded px-1.5 py-0.5">⌘P</kbd>
          <span>Pause</span>
        </div>
        <div className="bg-neutral-900/40 border border-white/5 backdrop-blur-sm rounded-full flex px-3 py-1.5 items-center gap-1 text-[10px] text-[#a1a1a1]">
          <kbd className="bg-neutral-800 text-neutral-300 rounded px-1.5 py-0.5">⌘S</kbd>
          <span>Stop</span>
        </div>
        <div className="bg-neutral-900/40 border border-white/5 backdrop-blur-sm rounded-full flex px-3 py-1.5 items-center gap-1 text-[10px] text-[#a1a1a1]">
          <kbd className="bg-neutral-800 text-neutral-300 rounded px-1.5 py-0.5">Esc</kbd>
          <span>Exit</span>
        </div>
      </footer>
    </div>
  )
}
