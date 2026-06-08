import React, { useState, useEffect } from 'react'
import {
  AppWindow,
  BarChart3,
  Calendar,
  Check,
  CheckSquare,
  Clock,
  Eye,
  Flame,
  FolderOpen,
  Home,
  Minus,
  Pause,
  Play,
  Plus,
  Search,
  Settings,
  Square,
  StickyNote,
  Tag,
  Timer,
  Zap
} from 'lucide-react'
import { useAppStore } from '@renderer/store/useAppStore'
import { Button } from '@renderer/components/ui/button'
import { Card, CardContent, CardHeader } from '@renderer/components/ui/card'
import Versions from './components/Versions'

interface Task {
  id: string
  title: string
  category: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  priorityColor: string // for border/indicator line
  estimatedTime: string
  loggedTime: number // in seconds
  status: 'In Progress' | 'Pending' | 'Completed'
}

export default function App(): React.JSX.Element {
  const { theme, username, settingsLoaded, loadSettings, setTheme, setUsername, resetSettings } =
    useAppStore()

  const [storePath, setStorePath] = useState('')
  const [activeTab, setActiveTab] = useState<
    'Dashboard' | 'Tasks' | 'Calendar' | 'Analytics' | 'Projects' | 'Settings'
  >('Dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'All' | 'In Progress' | 'Pending' | 'Completed'>('All')

  // Interactive tasks list
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Fix Auth Bug',
      category: 'Backend',
      priority: 'Critical',
      priorityColor: '#ef4444',
      estimatedTime: '2h est.',
      loggedTime: 2723, // 45m 23s
      status: 'In Progress'
    },
    {
      id: '2',
      title: 'Update API Docs',
      category: 'Docs',
      priority: 'Medium',
      priorityColor: '#eab308',
      estimatedTime: '1h est.',
      loggedTime: 0,
      status: 'Pending'
    },
    {
      id: '3',
      title: 'Code Review PR #42',
      category: 'Frontend',
      priority: 'High',
      priorityColor: '#f97316',
      estimatedTime: '1.5h est.',
      loggedTime: 0,
      status: 'Pending'
    },
    {
      id: '4',
      title: 'Write Unit Tests',
      category: 'Testing',
      priority: 'Low',
      priorityColor: '#10b981',
      estimatedTime: '3h est.',
      loggedTime: 9900, // 2h 45m
      status: 'Completed'
    }
  ])

  // Widget settings
  const [widgetMinimized, setWidgetMinimized] = useState(false)
  const [widgetVisible, setWidgetVisible] = useState(true)
  const [quickNote, setQuickNote] = useState('')
  const [newTaskListTitle, setNewTaskListTitle] = useState('')

  // Hydrate store settings & path
  useEffect(() => {
    loadSettings()
    window.api.getStorePath().then((path) => {
      setStorePath(path)
    })
  }, [loadSettings])

  // Sync window HTML theme class
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // Find active task
  const activeTask = tasks.find((t) => t.status === 'In Progress')

  // Smooth timer tick
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null
    if (activeTask) {
      intervalId = setInterval(() => {
        setTasks((prevTasks) =>
          prevTasks.map((t) => {
            if (t.id === activeTask.id) {
              return { ...t, loggedTime: t.loggedTime + 1 }
            }
            return t
          })
        )
      }, 1000)
    }
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [activeTask?.id, activeTask])

  // Task operation triggers
  const handleTogglePlayPause = (taskId: string): void => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          const wasInProgress = t.status === 'In Progress'
          return {
            ...t,
            status: wasInProgress ? 'Pending' : 'In Progress'
          }
        }
        // Pause other active tasks
        if (t.status === 'In Progress') {
          return { ...t, status: 'Pending' }
        }
        return t
      })
    )
  }

  const handleToggleComplete = (taskId: string): void => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          const isCompleted = t.status === 'Completed'
          return {
            ...t,
            status: isCompleted ? 'Pending' : 'Completed'
          }
        }
        return t
      })
    )
  }

  const handleStopTask = (taskId: string): void => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          return { ...t, status: 'Pending' }
        }
        return t
      })
    )
  }

  const handleAddTask = (): void => {
    if (!newTaskListTitle.trim()) return
    const newTask: Task = {
      id: String(Date.now()),
      title: newTaskListTitle,
      category: 'Design',
      priority: 'Medium',
      priorityColor: '#eab308',
      estimatedTime: '2h est.',
      loggedTime: 0,
      status: 'Pending'
    }
    setTasks([newTask, ...tasks])
    setNewTaskListTitle('')
  }

  // Metrics calculations
  const totalTasks = tasks.length
  const completedCount = tasks.filter((t) => t.status === 'Completed').length
  const remainingCount = totalTasks - completedCount
  const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  const totalSecondsLogged = tasks.reduce((sum, t) => sum + t.loggedTime, 0)
  const totalHrs = Math.floor(totalSecondsLogged / 3600)
  const totalMins = Math.floor((totalSecondsLogged % 3600) / 60)
  const totalHoursWorkedStr = `${totalHrs}h ${totalMins}m`

  // Circular dashboard SVG configurations
  const ringPerimeter1 = 138.2
  const offset1 = ringPerimeter1 - (ringPerimeter1 * completionRate) / 100

  const ringPerimeter2 = 125.7
  const offset2 = ringPerimeter2 - (ringPerimeter2 * completionRate) / 100

  const ringPerimeter3 = 339.3
  const activeTaskPercent = activeTask ? (activeTask.loggedTime % 3600) / 3600 : 0.75
  const offset3 = ringPerimeter3 * (1 - activeTaskPercent)

  // Format Helper
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    const pad = (num: number): string => String(num).padStart(2, '0')
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
  }

  const currentDayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  const initials = username
    ? username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'AJ'

  // Filters
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())

    if (filter === 'All') return matchesSearch
    return t.status === filter && matchesSearch
  })

  if (!settingsLoaded) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-blue-500 border-white/20" />
          <span className="text-sm font-medium">Loading DevTrack Workspace...</span>
        </div>
      </div>
    )
  }

  interface SidebarTab {
    id: 'Dashboard' | 'Tasks' | 'Calendar' | 'Analytics' | 'Projects' | 'Settings'
    icon: React.ComponentType<{ className?: string }>
    label: string
  }

  const sidebarTabs: SidebarTab[] = [
    { id: 'Dashboard', icon: Home, label: 'Dashboard' },
    { id: 'Tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'Calendar', icon: Calendar, label: 'Calendar' },
    { id: 'Analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'Projects', icon: FolderOpen, label: 'Projects' },
    { id: 'Settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <div className="bg-neutral-950 text-neutral-50 w-full min-h-screen overflow-x-hidden flex flex-row">
      {/* Sidebar Navigation */}
      <div className="min-h-screen bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] flex-shrink-0 border-t-0 border-r border-b-0 border-l-0 border-solid flex flex-col w-60">
        {/* Brand Header */}
        <div className="border-[oklch(1_0_0/10%)] border-t-0 border-r-0 border-b border-l-0 border-solid flex p-6 items-center gap-2">
          <div className="size-8 bg-[oklch(0.488_0.243_264.376)] rounded-lg flex justify-center items-center">
            <Zap className="size-4 text-white" />
          </div>
          <span className="font-bold text-neutral-50 text-lg leading-7 tracking-tight">
            DevTrack
          </span>
        </div>

        {/* Sidebar Nav Actions */}
        <nav className="flex p-4 flex-col flex-1 gap-1">
          {sidebarTabs.map((tab) => {
            const IconComponent = tab.icon
            const isTabActive = activeTab === tab.id

            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer rounded-lg flex px-3 py-2 items-center gap-3 transition-colors ${
                  isTabActive
                    ? 'bg-[oklch(0.488_0.243_264.376)] text-white'
                    : 'text-[oklch(0.708_0_0)] hover:bg-neutral-800/40'
                }`}
              >
                <IconComponent className="size-4" />
                <span className="font-medium text-sm leading-5">{tab.label}</span>
              </div>
            )
          })}
        </nav>

        {/* Bottom User Info wrapper */}
        <div className="border-[oklch(1_0_0/10%)] border-t border-r-0 border-b-0 border-l-0 border-solid p-4">
          <div className="flex p-2 items-center gap-3">
            <div className="size-8 bg-[conic-gradient(from_0deg,oklch(0.488_0.243_264.376),oklch(0.627_0.265_303.9))] flex-shrink-0 font-bold rounded-full text-white text-xs leading-4 flex justify-center items-center">
              {initials}
            </div>
            <div className="min-w-0 flex flex-col">
              <span className="truncate font-semibold text-neutral-50 text-xs leading-4">
                {username}
              </span>
              <div className="flex mt-0.5 items-center gap-1">
                <div className="bg-[oklch(0.488_0.243_264.376/20%)] border-[oklch(0.488_0.243_264.376/40%)] rounded-full border-1 border-solid flex px-2 py-0.5 items-center gap-1">
                  <Zap className="size-2.5 text-[oklch(0.488_0.243_264.376)]" />
                  <span className="text-[oklch(0.488_0.243_264.376)] font-semibold text-[10px]">
                    Level 3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-screen bg-neutral-950 flex flex-col flex-1 overflow-hidden">
        {/* Main Content Header */}
        <div className="border-[oklch(1_0_0/10%)] bg-neutral-950 border-t-0 border-r-0 border-b border-l-0 border-solid flex px-8 py-6 justify-between items-center">
          <div className="flex flex-col gap-1">
            <h1 className="font-bold text-neutral-50 text-2xl leading-8">
              {'Good morning, '}
              {username.split(' ')[0]}
              {' 👋'}
            </h1>
            <p className="text-[oklch(0.708_0_0)] text-sm leading-5">{currentDayStr}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input Bar */}
            <div className="bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] rounded-full border-1 border-solid flex px-4 py-2 items-center gap-2">
              <Search className="size-4 text-[oklch(0.708_0_0)]" />
              <input
                type="text"
                placeholder="Search or create..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-neutral-200 text-sm focus:outline-none placeholder-[oklch(0.708_0_0)] w-36"
              />
              <div className="flex ml-4 items-center gap-1">
                <kbd className="bg-[oklch(0.269_0_0)] text-[oklch(0.708_0_0)] rounded-sm text-xs leading-4 px-1.5 py-0.5">
                  ⌘
                </kbd>
                <kbd className="bg-[oklch(0.269_0_0)] text-[oklch(0.708_0_0)] rounded-sm text-xs leading-4 px-1.5 py-0.5">
                  K
                </kbd>
              </div>
            </div>

            {/* Quick Add input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Quick add task..."
                value={newTaskListTitle}
                onChange={(e) => setNewTaskListTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTask()
                }}
                className="bg-[oklch(0.205_0_0)] border border-neutral-800 rounded-full px-4 py-2 text-sm text-neutral-200 focus:outline-none placeholder-neutral-500 w-36"
              />
              <Button
                onClick={handleAddTask}
                className="bg-[oklch(0.488_0.243_264.376)] font-medium rounded-full text-white text-sm leading-5 flex px-4 py-2 items-center gap-2"
              >
                <Plus className="size-4" />
                New Task
              </Button>
            </div>
          </div>
        </div>

        {/* Dynamic Panels Switcher */}
        <div className="overflow-y-auto p-8 flex-1">
          {activeTab === 'Dashboard' ? (
            <>
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
                        <span className="text-[oklch(0.708_0_0)] text-xs leading-4">
                          of 8h goal
                        </span>
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

              {/* Tasks List Card Section */}
              <Card className="bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] p-6">
                <CardHeader className="p-0 mb-4 flex flex-row justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <h2 className="font-semibold text-neutral-50 text-base leading-6">
                      {"Today's Tasks"}
                    </h2>
                    <p className="text-[oklch(0.708_0_0)] text-xs leading-4">
                      {totalTasks} tasks · {tasks.filter((t) => t.status === 'In Progress').length}{' '}
                      in progress
                    </p>
                  </div>

                  {/* Status Filter Chips */}
                  <div className="flex items-center gap-2">
                    {(['All', 'In Progress', 'Pending', 'Completed'] as const).map((chip) => {
                      const isChipActive = filter === chip
                      return (
                        <div
                          key={chip}
                          onClick={() => setFilter(chip)}
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
                          className={`bg-[oklch(0.145_0_0)] border-[oklch(1_0_0/10%)] rounded-xl border-1 border-solid flex items-center overflow-hidden transition-all ${
                            isCompleted ? 'opacity-65' : ''
                          }`}
                        >
                          {/* Priority border highlight block */}
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
                                onClick={() => handleToggleComplete(task.id)}
                                className={`cursor-pointer font-semibold text-neutral-50 text-sm leading-5 ${
                                  isCompleted ? 'line-through text-neutral-500' : ''
                                }`}
                              >
                                {task.title}
                              </span>
                              <div className="flex mt-1 items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <Clock className="size-3 text-[oklch(0.708_0_0)]" />
                                  <span className="text-[oklch(0.708_0_0)] text-xs leading-4">
                                    {task.estimatedTime}
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
                                onClick={() => handleTogglePlayPause(task.id)}
                                className={`size-8 rounded-full flex justify-center items-center transition-colors ${
                                  isInProgress
                                    ? 'bg-[oklch(0.488_0.243_264.376)] hover:opacity-95'
                                    : 'bg-[oklch(0.269_0_0)] hover:bg-neutral-800 text-[oklch(0.708_0_0)]'
                                }`}
                              >
                                {isInProgress ? (
                                  <Pause className="size-3.5 text-white" />
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
            </>
          ) : activeTab === 'Settings' ? (
            /* Settings Management tab */
            <div className="flex flex-col gap-6 max-w-2xl">
              <Card className="bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] p-6">
                <CardHeader className="p-0 mb-4">
                  <h2 className="font-semibold text-neutral-50 text-base leading-6">
                    Local System Configurations
                  </h2>
                  <p className="text-[oklch(0.708_0_0)] text-xs leading-4">
                    Configure Fexo settings saved securely to disk via Electron IPC.
                  </p>
                </CardHeader>
                <CardContent className="p-0 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[oklch(0.708_0_0)]">
                      Profile Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-[oklch(0.708_0_0)]">
                      Theme Mode
                    </label>
                    <div className="flex gap-2">
                      <Button
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        onClick={() => setTheme('dark')}
                        className="flex-1 rounded-lg"
                      >
                        🌙 Dark Theme
                      </Button>
                      <Button
                        variant={theme === 'light' ? 'default' : 'outline'}
                        onClick={() => setTheme('light')}
                        className="flex-1 rounded-lg"
                      >
                        ☀️ Light Theme
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <Button variant="secondary" onClick={resetSettings} className="rounded-lg">
                      Reset Settings File to Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] p-6">
                <CardHeader className="p-0 mb-2">
                  <h2 className="font-semibold text-neutral-50 text-base leading-6">
                    Storage Path Details
                  </h2>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                    <code className="text-xs text-blue-400 break-all font-mono">
                      {storePath || 'Resolving path...'}
                    </code>
                  </div>
                </CardContent>
              </Card>

              <div className="border-t border-neutral-800 pt-6">
                <Versions />
              </div>
            </div>
          ) : (
            /* Under Development placeholders */
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="size-12 rounded-full bg-neutral-800 flex items-center justify-center">
                <AppWindow className="size-6 text-neutral-500" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-200 text-base leading-6">
                  DevTrack {activeTab} Module
                </h3>
                <p className="text-[oklch(0.708_0_0)] text-xs leading-4 mt-1">
                  This dashboard is currently under active development.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls Panel */}
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

              {/* Conic circular dial */}
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

              {/* active task controls */}
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
                  <div className="text-center text-xs text-neutral-500 py-1 w-full">
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
            {/* Action 1: New Task */}
            <button
              onClick={() => {
                setActiveTab('Dashboard')
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

            {/* Action 2: Start Timer */}
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

            {/* Action 3: Show Widget */}
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

        {/* Sticky Notes Area */}
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

      {/* Floating Active Timer Widget */}
      {widgetVisible && (
        <div className="fixed z-50 right-6 bottom-6 transition-all duration-300">
          <div className="bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] rounded-2xl border-1 border-solid p-4 w-64 shadow-xl">
            {/* Widget control bar */}
            <div className="flex mb-3 justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-[oklch(0.269_0_0)] cursor-grab rounded-full w-8 h-1" />
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setWidgetMinimized(!widgetMinimized)}
                  className="size-5 rounded-sm flex justify-center items-center hover:bg-neutral-800 text-neutral-400"
                >
                  <Minus className="size-3" />
                </button>
                <button
                  onClick={() => setWidgetVisible(false)}
                  className="size-5 rounded-sm flex justify-center items-center hover:bg-neutral-800 text-neutral-400"
                >
                  <Eye className="size-3" />
                </button>
              </div>
            </div>

            {/* Widget content panel */}
            {!widgetMinimized ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <Tag className="size-3 text-[oklch(0.488_0.243_264.376)]" />
                    <span className="text-[oklch(0.488_0.243_264.376)] font-medium text-[10px]">
                      {activeTask ? activeTask.category : 'Workspace'}
                    </span>
                  </div>
                  <span className="font-semibold text-neutral-50 text-sm leading-5 truncate">
                    {activeTask ? activeTask.title : 'No active timer'}
                  </span>
                </div>

                <div className="tabular-nums font-mono font-bold text-center text-neutral-50 text-2xl leading-8 py-1">
                  {activeTask ? formatTime(activeTask.loggedTime) : '00:00:00'}
                </div>

                <div className="flex items-center gap-1.5">
                  {activeTask ? (
                    <>
                      <button
                        onClick={() => handleTogglePlayPause(activeTask.id)}
                        className="bg-[oklch(0.269_0_0)] hover:bg-neutral-800 font-medium rounded-full text-neutral-50 text-[10px] flex py-1.5 justify-center items-center flex-1 gap-1 border-none cursor-pointer"
                      >
                        <Pause className="size-2.5" />
                        Pause
                      </button>
                      <button
                        onClick={() => handleToggleComplete(activeTask.id)}
                        className="bg-[oklch(0.696_0.17_162.48)] hover:opacity-90 font-medium rounded-full text-white text-[10px] flex py-1.5 justify-center items-center flex-1 gap-1 border-none cursor-pointer"
                      >
                        <Check className="size-2.5" />
                        Done
                      </button>
                      <button
                        onClick={() => handleStopTask(activeTask.id)}
                        className="bg-[oklch(0.704_0.191_22.216/15%)] hover:bg-[oklch(0.704_0.191_22.216/25%)] font-medium rounded-full text-[oklch(0.704_0.191_22.216)] text-[10px] flex py-1.5 justify-center items-center flex-1 gap-1 border-none cursor-pointer"
                      >
                        <Square className="size-2.5" />
                        Stop
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-[10px] text-neutral-500 py-1 w-full">
                      Timer is idle
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-mono">
                  {activeTask ? formatTime(activeTask.loggedTime) : '00:00:00'}
                </span>
                <span className="text-[10px] text-neutral-500 truncate max-w-[120px]">
                  {activeTask ? activeTask.title : 'DevTrack'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
