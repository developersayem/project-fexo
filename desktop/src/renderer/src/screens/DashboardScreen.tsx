import React from 'react'
import {
  Clock,
  Flame,
  Pause,
  Play,
  Check,
  Plus,
  Timer,
  AppWindow,
  StickyNote,
  Tag,
  Square
} from 'lucide-react'
import { Task } from '../types/task'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Button } from '../components/ui/button'

interface DashboardContentProps {
  tasks: Task[]
  dashboardFilter: 'All' | 'In Progress' | 'Pending' | 'Completed'
  setDashboardFilter: (filter: 'All' | 'In Progress' | 'Pending' | 'Completed') => void
  searchQuery: string
  setSelectedTaskId: (id: string) => void
  setActiveTab: (
    tab: 'Dashboard' | 'Tasks' | 'Calendar' | 'Analytics' | 'Projects' | 'Settings'
  ) => void
  formatTime: (secs: number) => string
  handleTogglePlayPause: (id: string) => void
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  tasks,
  dashboardFilter,
  setDashboardFilter,
  searchQuery,
  setSelectedTaskId,
  setActiveTab,
  formatTime,
  handleTogglePlayPause
}) => {
  // Compute calculations
  const totalTasks = tasks.length
  const completedCount = tasks.filter((t) => t.status === 'Completed').length
  const remainingCount = totalTasks - completedCount
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length

  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  const ringPerimeter1 = 2 * Math.PI * 22
  const offset1 = ringPerimeter1 - (completionRate / 100) * ringPerimeter1

  const ringPerimeter2 = 2 * Math.PI * 20
  const offset2 = ringPerimeter2 - (completionRate / 100) * ringPerimeter2

  const totalSecondsLogged = tasks.reduce((acc, t) => acc + t.loggedTime, 0)
  const totalHoursWorkedStr = `${Math.floor(totalSecondsLogged / 3600)}h ${Math.round((totalSecondsLogged % 3600) / 60)}m`

  const getFilteredTasks = (): Task[] => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())

      if (dashboardFilter === 'All') {
        return matchesSearch
      } else {
        return t.status === dashboardFilter && matchesSearch
      }
    })
  }

  const filteredTasks = getFilteredTasks()

  return (
    <div className="overflow-y-auto p-8 flex-1">
      {/* Dashboard Metrics Grid */}
      <div className="grid grid-cols-4 mb-8 gap-4">
        {/* Metric Card 1: Today's Tasks */}
        <Card className="bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] p-4">
          <CardContent className="p-0 flex flex-row justify-between items-center">
            <div className="flex flex-col gap-1">
              <span className="text-[oklch(0.708_0_0)] font-medium uppercase text-xs leading-4 tracking-wide">
                {"Today's Tasks"}
              </span>
              <span className="font-bold text-neutral-50 text-2xl leading-8">
                {completedCount}/{totalTasks}
              </span>
              <span className="text-[oklch(0.708_0_0)] text-xs leading-4">
                {remainingCount} remaining
              </span>
            </div>
            <div className="relative size-14">
              <svg className="size-14 -rotate-90" viewBox="0 0 56 56">
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  fill="none"
                  stroke="oklch(0.269 0 0)"
                  strokeWidth="5"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  fill="none"
                  stroke="oklch(0.488 0.243 264.376)"
                  strokeWidth="5"
                  strokeDasharray={String(ringPerimeter1)}
                  strokeDashoffset={String(offset1)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-bold text-neutral-50 text-xs leading-4 flex absolute inset-0 justify-center items-center">
                {completionRate}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metric Card 2: Hours Worked */}
        <Card className="bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] p-4">
          <CardContent className="p-0">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <span className="text-[oklch(0.708_0_0)] font-medium uppercase text-xs leading-4 tracking-wide">
                  Hours Worked
                </span>
                <span className="font-bold text-neutral-50 text-2xl leading-8">
                  {totalHoursWorkedStr}
                </span>
                <span className="text-[oklch(0.708_0_0)] text-xs leading-4">of 8h goal</span>
              </div>
              <div className="size-10 bg-[oklch(0.488_0.243_264.376/15%)] rounded-xl flex justify-center items-center">
                <Clock className="size-5 text-[oklch(0.488_0.243_264.376)]" />
              </div>
            </div>
            <div className="bg-[oklch(0.269_0_0)] rounded-full mt-3 h-1.5 overflow-hidden">
              <div
                className="bg-[oklch(0.488_0.243_264.376)] rounded-full h-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.round((totalSecondsLogged / 28800) * 100))}%`
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Metric Card 3: Completion Rate */}
        <Card className="bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] p-4">
          <CardContent className="p-0 flex flex-row justify-between items-center">
            <div className="flex flex-col gap-1">
              <span className="text-[oklch(0.708_0_0)] font-medium uppercase text-xs leading-4 tracking-wide">
                Completion Rate
              </span>
              <span className="font-bold text-neutral-50 text-2xl leading-8">
                {completionRate}%
              </span>
              <span className="text-[oklch(0.696_0.17_162.48)] text-xs leading-4">
                +5% vs yesterday
              </span>
            </div>
            <div className="relative size-14">
              <svg className="size-14 -rotate-90" viewBox="0 0 56 56">
                <circle
                  cx="28"
                  cy="28"
                  r="20"
                  fill="none"
                  stroke="oklch(0.269 0 0)"
                  strokeWidth="6"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="20"
                  fill="none"
                  stroke="oklch(0.488 0.243 264.376)"
                  strokeWidth="6"
                  strokeDasharray={String(ringPerimeter2)}
                  strokeDashoffset={String(offset2)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-bold text-neutral-50 text-[10px] flex absolute inset-0 justify-center items-center">
                {completionRate}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metric Card 4: Current Streak */}
        <Card className="bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] p-4">
          <CardContent className="p-0">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <span className="text-[oklch(0.708_0_0)] font-medium uppercase text-xs leading-4 tracking-wide">
                  Current Streak
                </span>
                <span className="font-bold text-neutral-50 text-2xl leading-8">7 days</span>
                <span className="text-[oklch(0.708_0_0)] text-xs leading-4">
                  Personal best: 21d
                </span>
              </div>
              <div className="size-10 bg-[oklch(0.645_0.246_16.439/15%)] rounded-xl flex justify-center items-center">
                <Flame className="size-5 text-[oklch(0.645_0.246_16.439)]" />
              </div>
            </div>
            <div className="flex mt-3 gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((val) => (
                <div
                  key={val}
                  className="bg-[oklch(0.645_0.246_16.439)] rounded-full flex-1 h-1.5"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Tasks list */}
      <Card className="bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] p-6">
        <CardHeader className="p-0 mb-4 flex flex-row justify-between items-center">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-neutral-50 text-base leading-6">{"Today's Tasks"}</h2>
            <p className="text-[oklch(0.708_0_0)] text-xs leading-4">
              {totalTasks} tasks · {inProgressCount} in progress
            </p>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-2">
            {(['All', 'In Progress', 'Pending', 'Completed'] as const).map((chip) => {
              const isChipActive = dashboardFilter === chip
              return (
                <div
                  key={chip}
                  onClick={() => setDashboardFilter(chip)}
                  className={`cursor-pointer rounded-full flex px-3 py-1.5 items-center gap-1.5 border border-solid transition-colors ${
                    isChipActive
                      ? 'bg-[oklch(0.488_0.243_264.376/20%)] border-[oklch(0.488_0.243_264.376/40%)] text-[oklch(0.488_0.243_264.376)]'
                      : 'bg-[oklch(0.269_0_0)] border-transparent text-[oklch(0.708_0_0)] hover:bg-neutral-800/60'
                  }`}
                >
                  <span className="text-xs leading-4">{chip}</span>
                </div>
              )
            })}
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col gap-2">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => {
              const isInProgress = task.status === 'In Progress'
              const isCompleted = task.status === 'Completed'

              return (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTaskId(task.id)
                    setActiveTab('Tasks')
                  }}
                  className={`bg-[oklch(0.145_0_0)] border-[oklch(1_0_0/10%)] rounded-xl border-1 border-solid flex items-center overflow-hidden transition-all cursor-pointer ${
                    isCompleted ? 'opacity-65' : ''
                  }`}
                >
                  <div
                    style={{ backgroundColor: task.priorityColor }}
                    className="flex-shrink-0 self-stretch w-1"
                  />
                  <div className="flex px-4 py-3 items-center flex-1 gap-4">
                    <div className="min-w-0 flex flex-col flex-1 gap-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          style={{ color: task.priorityColor }}
                          className="font-semibold uppercase text-xs leading-4 tracking-wide"
                        >
                          {task.priority}
                        </span>
                        <span className="bg-[oklch(0.269_0_0)] text-[oklch(0.708_0_0)] rounded-full text-xs leading-4 px-2 py-0.5">
                          {task.category}
                        </span>
                      </div>
                      <span
                        className={`font-semibold text-neutral-50 text-sm leading-5 ${
                          isCompleted ? 'line-through text-neutral-500' : ''
                        }`}
                      >
                        {task.title}
                      </span>
                      <div className="flex mt-1 items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3 text-[oklch(0.708_0_0)]" />
                          <span className="text-[oklch(0.708_0_0)] text-xs leading-4">
                            {task.estimatedTime} est.
                          </span>
                        </div>
                        {task.loggedTime > 0 && (
                          <div className="flex items-center gap-1">
                            <Timer className="size-3 text-[oklch(0.488_0.243_264.376)]" />
                            <span className="text-[oklch(0.488_0.243_264.376)] font-mono text-xs leading-4">
                              {formatTime(task.loggedTime)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-full px-3 py-1 border border-solid border-neutral-800 ${
                          isCompleted
                            ? 'bg-[oklch(0.696_0.17_162.48/15%)] text-[oklch(0.696_0.17_162.48)]'
                            : isInProgress
                              ? 'bg-[oklch(0.488_0.243_264.376/15%)] text-[oklch(0.488_0.243_264.376)]'
                              : 'bg-[oklch(0.269_0_0)] text-[oklch(0.708_0_0)]'
                        }`}
                      >
                        <span className="font-medium text-xs leading-4">{task.status}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTogglePlayPause(task.id)
                        }}
                        className={`size-8 rounded-full flex justify-center items-center transition-colors border-none cursor-pointer ${
                          isInProgress
                            ? 'bg-[oklch(0.488_0.243_264.376)] text-white hover:opacity-95'
                            : 'bg-[oklch(0.269_0_0)] hover:bg-neutral-800 text-[oklch(0.708_0_0)]'
                        }`}
                      >
                        {isInProgress ? (
                          <Pause className="size-3.5" />
                        ) : isCompleted ? (
                          <Check className="size-3.5 text-[oklch(0.696_0.17_162.48)]" />
                        ) : (
                          <Play className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-[oklch(0.708_0_0)] text-sm">
              No tasks found in this section.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface DashboardSidebarProps {
  tasks: Task[]
  activeTask: Task | undefined
  widgetVisible: boolean
  setWidgetVisible: (visible: boolean) => void
  setActiveTab: (
    tab: 'Dashboard' | 'Tasks' | 'Calendar' | 'Analytics' | 'Projects' | 'Settings'
  ) => void
  setNewTaskListTitle: (title: string) => void
  quickNote: string
  setQuickNote: (note: string) => void
  formatTime: (secs: number) => string
  handleTogglePlayPause: (id: string) => void
  handleToggleComplete: (id: string) => void
  handleStopTask: (id: string) => void
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  tasks,
  activeTask,
  widgetVisible,
  setWidgetVisible,
  setActiveTab,
  setNewTaskListTitle,
  quickNote,
  setQuickNote,
  formatTime,
  handleTogglePlayPause,
  handleToggleComplete,
  handleStopTask
}) => {
  const ringPerimeter3 = 2 * Math.PI * 54
  const offset3 = activeTask
    ? ringPerimeter3 -
      (Math.min(activeTask.loggedTime, activeTask.estimatedHours * 3600) /
        (activeTask.estimatedHours * 3600)) *
        ringPerimeter3
    : ringPerimeter3

  return (
    <div className="min-h-screen bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] flex-shrink-0 border-t-0 border-r-0 border-b-0 border-l border-solid flex p-6 flex-col gap-4 w-75">
      {/* Running Task timer dial card */}
      <Card className="bg-[oklch(0.145_0_0)] border-[oklch(1_0_0/10%)] p-4">
        <CardHeader className="p-0 mb-4 flex flex-row justify-between items-center">
          <span className="text-[oklch(0.708_0_0)] font-semibold uppercase text-xs leading-4 tracking-wide">
            Running Task
          </span>
          <div className="flex items-center gap-1">
            <div
              className={`size-2 rounded-full ${activeTask ? 'bg-[oklch(0.696_0.17_162.48)] animate-pulse' : 'bg-neutral-600'}`}
            />
            <span
              className={`text-xs leading-4 ${activeTask ? 'text-[oklch(0.696_0.17_162.48)]' : 'text-neutral-500'}`}
            >
              {activeTask ? 'Live' : 'Paused'}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <span className="font-bold text-neutral-50 text-base leading-6 text-center">
                {activeTask ? activeTask.title : 'No active task'}
              </span>
              <div className="bg-[oklch(0.269_0_0)] rounded-full flex px-3 py-1 items-center gap-1.5">
                <Tag className="size-3 text-[oklch(0.488_0.243_264.376)]" />
                <span className="text-[oklch(0.708_0_0)] text-xs leading-4">
                  {activeTask ? activeTask.category : 'General'}
                </span>
              </div>
            </div>

            {/* Circular Dial */}
            <div className="relative size-32">
              <svg className="size-32 -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  fill="none"
                  stroke="oklch(0.269 0 0)"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  fill="none"
                  stroke="url(#timerGrad)"
                  strokeWidth="8"
                  strokeDasharray={String(ringPerimeter3)}
                  strokeDashoffset={String(offset3)}
                  strokeLinecap="round"
                />
              </svg>
              <defs>
                <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="oklch(0.488 0.243 264.376)" />
                  <stop offset="100%" stopColor="oklch(0.627 0.265 303.9)" />
                </linearGradient>
              </defs>
              <div className="flex absolute inset-0 flex-col justify-center items-center gap-0.5">
                <span className="tabular-nums font-mono font-bold text-neutral-50 text-xl leading-7">
                  {activeTask ? formatTime(activeTask.loggedTime) : '00:00:00'}
                </span>
                <span className="text-[oklch(0.708_0_0)] uppercase text-[10px] tracking-widest">
                  Elapsed
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full">
              {activeTask ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => handleTogglePlayPause(activeTask.id)}
                    className="flex-1 text-xs gap-1.5 py-1.5 rounded-full"
                  >
                    <Pause className="size-3" />
                    Pause
                  </Button>
                  <Button
                    onClick={() => handleToggleComplete(activeTask.id)}
                    className="flex-1 bg-[oklch(0.696_0.17_162.48)] text-white text-xs gap-1.5 py-1.5 rounded-full"
                  >
                    <Check className="size-3" />
                    Complete
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleStopTask(activeTask.id)}
                    className="flex-1 text-[oklch(0.704_0.191_22.216)] bg-[oklch(0.704_0.191_22.216/15%)] hover:bg-[oklch(0.704_0.191_22.216/25%)] text-xs gap-1.5 py-1.5 rounded-full"
                  >
                    <Square className="size-3" />
                    Stop
                  </Button>
                </>
              ) : (
                <div className="text-center text-xs text-neutral-500 py-1 w-full font-medium">
                  Start a task timer in dashboard to track work.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card className="bg-[oklch(0.145_0_0)] border-[oklch(1_0_0/10%)] p-4">
        <CardHeader className="p-0 mb-3">
          <span className="text-[oklch(0.708_0_0)] font-semibold uppercase text-xs leading-4 tracking-wide">
            Quick Actions
          </span>
        </CardHeader>
        <CardContent className="p-0 flex flex-col gap-2">
          <button
            onClick={() => {
              setActiveTab('Tasks')
              setNewTaskListTitle('Review requirements')
            }}
            className="w-full bg-[oklch(0.269_0_0)] hover:bg-neutral-800 cursor-pointer rounded-xl flex px-3 py-2.5 justify-between items-center transition-colors border-none text-left"
          >
            <div className="flex items-center gap-2">
              <div className="size-7 bg-[oklch(0.488_0.243_264.376/20%)] rounded-lg flex justify-center items-center">
                <Plus className="size-3.5 text-[oklch(0.488_0.243_264.376)]" />
              </div>
              <span className="font-medium text-neutral-50 text-sm leading-5">New Task</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="bg-[oklch(0.205_0_0)] text-[oklch(0.708_0_0)] rounded-sm text-[10px] px-1.5 py-0.5">
                ⌘
              </kbd>
              <kbd className="bg-[oklch(0.205_0_0)] text-[oklch(0.708_0_0)] rounded-sm text-[10px] px-1.5 py-0.5">
                N
              </kbd>
            </div>
          </button>

          <button
            onClick={() => {
              const firstPending = tasks.find((t) => t.status === 'Pending')
              if (firstPending) handleTogglePlayPause(firstPending.id)
            }}
            className="w-full bg-[oklch(0.269_0_0)] hover:bg-neutral-800 cursor-pointer rounded-xl flex px-3 py-2.5 justify-between items-center transition-colors border-none text-left"
          >
            <div className="flex items-center gap-2">
              <div className="size-7 bg-[oklch(0.696_0.17_162.48/20%)] rounded-lg flex justify-center items-center">
                <Timer className="size-3.5 text-[oklch(0.696_0.17_162.48)]" />
              </div>
              <span className="font-medium text-neutral-50 text-sm leading-5">Start Timer</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="bg-[oklch(0.205_0_0)] text-[oklch(0.708_0_0)] rounded-sm text-[10px] px-1.5 py-0.5">
                ⌘
              </kbd>
              <kbd className="bg-[oklch(0.205_0_0)] text-[oklch(0.708_0_0)] rounded-sm text-[10px] px-1.5 py-0.5">
                T
              </kbd>
            </div>
          </button>

          <button
            onClick={() => setWidgetVisible(!widgetVisible)}
            className="w-full bg-[oklch(0.269_0_0)] hover:bg-neutral-800 cursor-pointer rounded-xl flex px-3 py-2.5 justify-between items-center transition-colors border-none text-left"
          >
            <div className="flex items-center gap-2">
              <div className="size-7 bg-[oklch(0.627_0.265_303.9/20%)] rounded-lg flex justify-center items-center">
                <AppWindow className="size-3.5 text-[oklch(0.627_0.265_303.9)]" />
              </div>
              <span className="font-medium text-neutral-50 text-sm leading-5">
                {widgetVisible ? 'Hide Widget' : 'Show Widget'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="bg-[oklch(0.205_0_0)] text-[oklch(0.708_0_0)] rounded-sm text-[10px] px-1.5 py-0.5">
                ⌘
              </kbd>
              <kbd className="bg-[oklch(0.205_0_0)] text-[oklch(0.708_0_0)] rounded-sm text-[10px] px-1.5 py-0.5">
                ⇧
              </kbd>
              <kbd className="bg-[oklch(0.205_0_0)] text-[oklch(0.708_0_0)] rounded-sm text-[10px] px-1.5 py-0.5">
                M
              </kbd>
            </div>
          </button>
        </CardContent>
      </Card>

      {/* Notes Area */}
      <Card className="bg-[oklch(0.145_0_0)] border-[oklch(1_0_0/10%)] p-4 flex-1 flex flex-col">
        <CardHeader className="p-0 mb-3 flex flex-row justify-between items-center">
          <span className="text-[oklch(0.708_0_0)] font-semibold uppercase text-xs leading-4 tracking-wide">
            Notes
          </span>
          <StickyNote className="size-3.5 text-[oklch(0.708_0_0)]" />
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <textarea
            className="bg-[oklch(0.205_0_0)] border border-neutral-800 text-neutral-100 placeholder-[oklch(0.708_0_0/50%)] resize-none rounded-xl text-sm leading-5 p-3 w-full h-full min-h-[100px] focus:outline-none focus:border-neutral-700"
            placeholder="Jot down a quick note..."
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
