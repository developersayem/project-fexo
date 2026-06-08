import React, { useState, useEffect } from 'react'
import {
  AppWindow,
  BarChart3,
  Calendar,
  Check,
  CheckSquare,
  Clock,
  Flame,
  FolderOpen,
  Home,
  Lightbulb,
  ListChecks,
  Minus,
  Pause,
  PieChart as LucidePieChart,
  Play,
  Plus,
  Search,
  Settings,
  Square,
  StickyNote,
  Tag,
  Timer,
  Trash2,
  X,
  Zap
} from 'lucide-react'
import { useAppStore } from '@renderer/store/useAppStore'
import { Button } from '@renderer/components/ui/button'
import { Card, CardContent, CardHeader } from '@renderer/components/ui/card'
import Versions from './components/Versions'
import { ChartContainer, ChartTooltip } from '@renderer/components/ui/chart'
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ReferenceLine,
  XAxis,
  YAxis
} from 'recharts'

interface Task {
  id: string
  title: string
  category: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  priorityColor: string
  estimatedTime: string
  estimatedHours: number
  loggedTime: number // in seconds
  status: 'In Progress' | 'Pending' | 'Completed' | 'Overdue'
  dueDate: string
  dueDateLabel: string
  description: string
  tags: string[]
}

export default function App(): React.JSX.Element {
  const { theme, username, settingsLoaded, loadSettings, setTheme, setUsername, resetSettings } =
    useAppStore()

  const [storePath, setStorePath] = useState('')
  const [activeTab, setActiveTab] = useState<
    'Dashboard' | 'Tasks' | 'Calendar' | 'Analytics' | 'Projects' | 'Settings'
  >('Dashboard')

  // General search / filters
  const [searchQuery, setSearchQuery] = useState('')
  const [dashboardFilter, setDashboardFilter] = useState<
    'All' | 'In Progress' | 'Pending' | 'Completed'
  >('All')

  // Tasks tab filters (Today, All, In Progress, Completed, Overdue)
  const [tasksTabFilter, setTasksTabFilter] = useState<
    'Today' | 'All' | 'In Progress' | 'Completed' | 'Overdue'
  >('Today')

  // Analytics tab filters (Week, Month, Year)
  const [analyticsFilter, setAnalyticsFilter] = useState<'Week' | 'Month' | 'Year'>('Week')

  // Core Tasks state loaded with mockup baseline datasets
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Fix Auth Bug',
      category: 'Backend',
      priority: 'Critical',
      priorityColor: '#ef4444',
      estimatedTime: '3h',
      estimatedHours: 3,
      loggedTime: 2723, // 45m 23s
      status: 'In Progress',
      dueDate: 'Jun 24, 2025',
      dueDateLabel: 'Jun 24, 2025',
      description:
        'Authentication service is throwing 401 errors intermittently on token refresh. Needs immediate investigation and fix before the next deployment window.',
      tags: ['auth', 'security', 'urgent']
    },
    {
      id: '2',
      title: 'Refactor DB Schema',
      category: 'Backend',
      priority: 'High',
      priorityColor: '#f97316',
      estimatedTime: '5h',
      estimatedHours: 5,
      loggedTime: 0,
      status: 'Overdue',
      dueDate: 'Jun 22, 2025',
      dueDateLabel: 'Jun 22, 2025',
      description:
        'Database tables require partitioning and index adjustments to solve slow queries on client reports.',
      tags: ['database', 'migrations', 'refactor']
    },
    {
      id: '3',
      title: 'Update API Docs',
      category: 'Docs',
      priority: 'Medium',
      priorityColor: '#eab308',
      estimatedTime: '1h',
      estimatedHours: 1,
      loggedTime: 3600, // 1h
      status: 'Completed',
      dueDate: 'Jun 23, 2025',
      dueDateLabel: 'Jun 23, 2025',
      description:
        'Add API response codes and schemas for all core endpoints in Swagger / OpenAPI docs.',
      tags: ['docs', 'api', 'v2']
    },
    {
      id: '4',
      title: 'Code Review PR #42',
      category: 'Frontend',
      priority: 'High',
      priorityColor: '#f97316',
      estimatedTime: '2h',
      estimatedHours: 2,
      loggedTime: 0,
      status: 'Pending',
      dueDate: 'Jun 25, 2025',
      dueDateLabel: 'Jun 25, 2025',
      description:
        'Review merge request from design system updates featuring custom layouts and icons.',
      tags: ['frontend', 'pr', 'code-review']
    },
    {
      id: '5',
      title: 'Write Unit Tests',
      category: 'Testing',
      priority: 'Low',
      priorityColor: '#10b981',
      estimatedTime: '4h',
      estimatedHours: 4,
      loggedTime: 0,
      status: 'Pending',
      dueDate: 'Jun 27, 2025',
      dueDateLabel: 'Jun 27, 2025',
      description: 'Improve coverage rates for authentication and validation helper logic modules.',
      tags: ['testing', 'jest', 'unit']
    },
    {
      id: '6',
      title: 'Design System Update',
      category: 'Frontend',
      priority: 'Medium',
      priorityColor: '#eab308',
      estimatedTime: '6h',
      estimatedHours: 6,
      loggedTime: 0,
      status: 'In Progress',
      dueDate: 'Jun 26, 2025',
      dueDateLabel: 'Jun 26, 2025',
      description:
        'Refactor standard styling files to align color tokens across the desktop dashboard.',
      tags: ['design', 'style', 'tokens']
    }
  ])

  // Selected task in tasks list detail panel
  const [selectedTaskId, setSelectedTaskId] = useState<string>('1')

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
  const selectedTask = tasks.find((t) => t.id === selectedTaskId)

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
      estimatedHours: 2,
      loggedTime: 0,
      status: 'Pending',
      dueDate: 'Jun 28, 2025',
      dueDateLabel: 'Jun 28, 2025',
      description: 'Newly created task item detail content.',
      tags: ['added']
    }
    setTasks([newTask, ...tasks])
    setSelectedTaskId(newTask.id)
    setNewTaskListTitle('')
  }

  const handleDeleteTask = (taskId: string): void => {
    const updated = tasks.filter((t) => t.id !== taskId)
    setTasks(updated)
    if (selectedTaskId === taskId && updated.length > 0) {
      setSelectedTaskId(updated[0].id)
    }
  }

  // Metrics calculations
  const totalTasks = tasks.length
  const completedCount = tasks.filter((t) => t.status === 'Completed').length
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length
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

  // Filter handlers
  const getFilteredTasks = (): Task[] => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())

      if (activeTab === 'Dashboard') {
        if (dashboardFilter === 'All') return matchesSearch
        return t.status === dashboardFilter && matchesSearch
      } else {
        // Tasks Tab Filters: Today, All, In Progress, Completed, Overdue
        if (tasksTabFilter === 'All') return matchesSearch
        if (tasksTabFilter === 'Today') {
          return t.dueDate.includes('Jun 24') && matchesSearch
        }
        return t.status === tasksTabFilter && matchesSearch
      }
    })
  }

  const filteredTasks = getFilteredTasks()

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

  return (
    <div className="bg-neutral-950 text-neutral-50 w-full min-h-screen overflow-x-hidden flex flex-row">
      {/* Sidebar Navigation */}
      <div className="min-h-screen bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] flex-shrink-0 border-t-0 border-r border-b-0 border-l-0 border-solid flex p-4 flex-col gap-2 w-60">
        {/* Brand Header */}
        <div className="flex mb-4 px-2 py-4 items-center gap-2">
          <div className="size-8 bg-[oklch(0.488_0.243_264.376)] rounded-lg flex justify-center items-center">
            <Zap className="size-4 text-white" />
          </div>
          <span className="font-bold text-neutral-50 text-lg leading-7 tracking-tight">
            DevTrack
          </span>
        </div>

        {/* Sidebar Nav Actions */}
        <div className="flex flex-col gap-1">
          {sidebarTabs.map((tab) => {
            const IconComponent = tab.icon
            const isTabActive = activeTab === tab.id

            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer rounded-lg flex px-3 py-2 items-center gap-3 transition-colors ${
                  isTabActive
                    ? 'bg-[oklch(0.488_0.243_264.376)] text-white font-semibold'
                    : 'text-[#a1a1a1] hover:bg-neutral-800/40 font-medium'
                }`}
              >
                <IconComponent className="size-4" />
                <span className="text-sm leading-5">{tab.label}</span>
              </div>
            )
          })}
        </div>

        {/* Bottom User Info wrapper */}
        <div className="mt-auto">
          <div className="bg-[oklch(0.269_0_0)] rounded-xl border-white/10 border-1 border-solid flex p-3 items-center gap-3">
            <div className="size-8 bg-[oklch(0.488_0.243_264.376)] font-bold rounded-full text-white text-xs leading-4 flex justify-center items-center">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-neutral-50 text-xs leading-4">{username}</span>
              <span className="text-[#a1a1a1] text-xs leading-4">⚡ Level 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-screen bg-neutral-950 flex flex-col flex-1 overflow-hidden">
        {/* Main Content Header */}
        <div className="bg-neutral-950 border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex px-8 py-6 justify-between items-center">
          {activeTab === 'Analytics' ? (
            <>
              <div>
                <h1 className="font-bold text-neutral-50 text-2xl leading-8">Analytics</h1>
                <p className="text-[#a1a1a1] text-sm leading-5 mt-1">
                  Track your productivity and performance
                </p>
              </div>
              <div className="bg-[oklch(0.205_0_0)] rounded-full flex p-1 items-center gap-2">
                {(['Week', 'Month', 'Year'] as const).map((filter) => {
                  const isFilterActive = analyticsFilter === filter
                  return (
                    <div
                      key={filter}
                      onClick={() => setAnalyticsFilter(filter)}
                      className={`cursor-pointer font-medium rounded-full text-sm leading-5 px-4 py-1.5 transition-colors ${
                        isFilterActive
                          ? 'bg-[oklch(0.488_0.243_264.376)] text-white'
                          : 'text-[#a1a1a1] hover:text-white'
                      }`}
                    >
                      {filter}
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <h1 className="font-bold text-neutral-50 text-2xl leading-8 tracking-tight">
                  {activeTab}
                </h1>
                <p className="text-[#a1a1a1] text-sm leading-5">
                  {activeTab === 'Tasks'
                    ? `${totalTasks} tasks · ${inProgressCount} in progress`
                    : currentDayStr}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Search Input Bar */}
                <div className="bg-[oklch(0.269_0_0)] rounded-lg border-white/10 border-1 border-solid flex px-3 py-1.5 items-center gap-2">
                  <Search className="size-4 text-[#a1a1a1]" />
                  <input
                    type="text"
                    placeholder={activeTab === 'Tasks' ? 'Search tasks...' : 'Search or create...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none text-neutral-200 text-sm focus:outline-none placeholder-[#a1a1a1] w-40"
                  />
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
                    className="bg-[oklch(0.205_0_0)] border border-neutral-800 rounded-xl px-4 py-1.5 text-sm text-neutral-200 focus:outline-none placeholder-neutral-500 w-36"
                  />
                  <Button
                    onClick={handleAddTask}
                    className="bg-[oklch(0.488_0.243_264.376)] font-semibold rounded-xl text-white text-sm leading-5 flex px-4 py-2 items-center gap-2"
                  >
                    <Plus className="size-4" />
                    <span>New Task</span>
                    <span className="text-white/60 text-xs leading-4 ml-1">⌘N</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Dynamic Panels Switcher */}
        {activeTab === 'Dashboard' ? (
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
                  <h2 className="font-semibold text-neutral-50 text-base leading-6">
                    {"Today's Tasks"}
                  </h2>
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
        ) : activeTab === 'Tasks' ? (
          /* Dedicated Table-List Tasks View with side highlights */
          <div className="flex flex-col flex-1">
            {/* Category selector chips row */}
            <div className="border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex px-8 py-4 items-center gap-2">
              {(['Today', 'All', 'In Progress', 'Completed', 'Overdue'] as const).map((chip) => {
                const isChipActive = tasksTabFilter === chip
                return (
                  <div
                    key={chip}
                    onClick={() => setTasksTabFilter(chip)}
                    className={`cursor-pointer text-sm leading-5 flex px-4 py-1.5 items-center gap-2 transition-all ${
                      isChipActive
                        ? 'bg-[oklch(0.488_0.243_264.376)] font-semibold rounded-full text-white'
                        : 'bg-[oklch(0.269_0_0)] font-medium rounded-full text-[#a1a1a1] border-white/10 border border-solid hover:bg-neutral-800/40'
                    }`}
                  >
                    {chip}
                  </div>
                )
              })}
            </div>

            {/* Table Column headers */}
            <div className="border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex px-8 py-2 items-center gap-0">
              <div className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider w-28">
                Priority
              </div>
              <div className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider flex-1">
                Task Name
              </div>
              <div className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider w-28">
                Project
              </div>
              <div className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider w-28">
                Due Date
              </div>
              <div className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider w-24">
                Estimated
              </div>
              <div className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider w-32">
                Status
              </div>
              <div className="font-semibold text-right uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider w-28">
                Actions
              </div>
            </div>

            {/* Tasks List Grid Rows */}
            <div className="overflow-y-auto flex px-8 py-4 flex-col flex-1 gap-2">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const isSelected = task.id === selectedTaskId
                  const isInProgress = task.status === 'In Progress'
                  const isCompleted = task.status === 'Completed'
                  const isOverdue = task.status === 'Overdue'

                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className={`bg-[oklch(0.205_0_0)] transition-all cursor-pointer relative rounded-xl border-1 border-solid flex items-center overflow-hidden ${
                        isSelected ? 'border-[oklch(0.488_0.243_264.376)]/50' : 'border-white/10'
                      } ${isCompleted ? 'opacity-70' : ''}`}
                    >
                      <div
                        style={{ backgroundColor: task.priorityColor }}
                        className="shrink-0 self-stretch w-1"
                      />
                      <div className="flex px-4 py-3 items-center flex-1 gap-0">
                        {/* Priority flag */}
                        <div className="w-28">
                          <span
                            style={{ color: task.priorityColor }}
                            className="font-semibold text-xs leading-4"
                          >
                            {task.priority}
                          </span>
                        </div>

                        {/* Task details column */}
                        <div className="flex flex-col flex-1 gap-0.5 pr-4">
                          <span
                            className={`font-semibold text-neutral-50 text-sm leading-5 ${
                              isCompleted ? 'line-through text-neutral-500' : ''
                            }`}
                          >
                            {task.title}
                          </span>
                          {task.loggedTime > 0 && (
                            <div className="flex mt-0.5 items-center gap-2">
                              <Timer className="size-3 text-[oklch(0.488_0.243_264.376)]" />
                              <span className="text-[oklch(0.488_0.243_264.376)] font-mono font-semibold text-xs leading-4">
                                {formatTime(task.loggedTime)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Project Column */}
                        <div className="w-28">
                          <span className="bg-[oklch(0.269_0_0)] font-medium rounded-full text-[#a1a1a1] text-xs leading-4 px-2 py-1">
                            {task.category}
                          </span>
                        </div>

                        {/* Due Date Column */}
                        <div className="w-28">
                          <span
                            className={`text-xs leading-4 ${isOverdue ? 'text-[oklch(0.704_0.191_22.216)]' : 'text-[#a1a1a1]'}`}
                          >
                            {task.dueDateLabel}
                          </span>
                        </div>

                        {/* Estimated hours Column */}
                        <div className="w-24">
                          <span className="text-[#a1a1a1] text-xs leading-4">
                            {task.estimatedTime}
                          </span>
                        </div>

                        {/* Status badge Column */}
                        <div className="w-32">
                          <span
                            className={`font-semibold rounded-full text-xs leading-4 px-2 py-1 ${
                              isCompleted
                                ? 'bg-[oklch(0.696_0.17_162.48)]/20 text-[oklch(0.696_0.17_162.48)]'
                                : isInProgress
                                  ? 'bg-[oklch(0.488_0.243_264.376)]/20 text-[oklch(0.488_0.243_264.376)]'
                                  : isOverdue
                                    ? 'bg-[oklch(0.704_0.191_22.216)]/20 text-[oklch(0.704_0.191_22.216)]'
                                    : 'bg-[oklch(0.269_0_0)] border border-white/10 text-[#a1a1a1]'
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>

                        {/* Actions Column */}
                        <div className="flex justify-end items-center gap-2 w-28">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTogglePlayPause(task.id)
                            }}
                            className="bg-[oklch(0.488_0.243_264.376)] rounded-full flex justify-center items-center w-7 h-7 border-none cursor-pointer hover:opacity-90"
                          >
                            {isInProgress ? (
                              <Pause className="size-3 text-white" />
                            ) : (
                              <Play className="size-3 text-white" />
                            )}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleComplete(task.id)
                            }}
                            className="bg-[oklch(0.269_0_0)] hover:bg-neutral-800 rounded-full border-white/10 border border-solid flex justify-center items-center w-7 h-7 cursor-pointer"
                          >
                            <Check
                              className={`size-3 ${isCompleted ? 'text-[oklch(0.696_0.17_162.48)]' : 'text-[#a1a1a1]'}`}
                            />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteTask(task.id)
                            }}
                            className="bg-[oklch(0.269_0_0)] hover:bg-neutral-800 rounded-full border-white/10 border border-solid flex justify-center items-center w-7 h-7 cursor-pointer"
                          >
                            <Trash2 className="size-3 text-[#a1a1a1]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12 text-[oklch(0.708_0_0)] text-sm">
                  No matching tasks found for the active filter.
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'Settings' ? (
          /* Settings Management tab */
          <div className="flex flex-col gap-6 max-w-2xl p-8">
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
        ) : activeTab === 'Analytics' ? (
          /* Analytics main panel */
          <div className="overflow-y-auto flex p-8 flex-col flex-1 gap-6">
            <div className="grid grid-cols-5 gap-4">
              <Card className="bg-[oklch(0.205_0_0)] border-white/10 border border-solid p-4">
                <CardContent className="flex p-0 flex-col gap-2">
                  <div className="bg-[oklch(0.488_0.243_264.376)]/20 rounded-xl flex justify-center items-center w-9 h-9">
                    <Clock className="size-4 text-[oklch(0.488_0.243_264.376)]" />
                  </div>
                  <div className="font-bold text-neutral-50 text-2xl leading-8">38h</div>
                  <div className="text-[#a1a1a1] text-xs leading-4">Total Hours</div>
                </CardContent>
              </Card>
              <Card className="bg-[oklch(0.205_0_0)] border-white/10 border border-solid p-4">
                <CardContent className="flex p-0 flex-col gap-2">
                  <div className="bg-[oklch(0.696_0.17_162.48)]/20 rounded-xl flex justify-center items-center w-9 h-9">
                    <CheckSquare className="size-4 text-[oklch(0.696_0.17_162.48)]" />
                  </div>
                  <div className="font-bold text-neutral-50 text-2xl leading-8">42</div>
                  <div className="text-[#a1a1a1] text-xs leading-4">Tasks Done</div>
                </CardContent>
              </Card>
              <Card className="bg-[oklch(0.205_0_0)] border-white/10 border border-solid p-4">
                <CardContent className="flex p-0 flex-col gap-2">
                  <div className="bg-[oklch(0.627_0.265_303.9)]/20 rounded-xl flex justify-center items-center w-9 h-9">
                    <Timer className="size-4 text-[oklch(0.627_0.265_303.9)]" />
                  </div>
                  <div className="font-bold text-neutral-50 text-2xl leading-8">54m</div>
                  <div className="text-[#a1a1a1] text-xs leading-4">Avg Task Time</div>
                </CardContent>
              </Card>
              <Card className="bg-[oklch(0.205_0_0)] border-white/10 border border-solid p-4">
                <CardContent className="flex p-0 flex-col gap-2">
                  <div className="bg-[oklch(0.488_0.243_264.376)]/20 rounded-xl flex justify-center items-center w-9 h-9">
                    <LucidePieChart className="size-4 text-[oklch(0.488_0.243_264.376)]" />
                  </div>
                  <div className="font-bold text-neutral-50 text-2xl leading-8">78%</div>
                  <div className="text-[#a1a1a1] text-xs leading-4">Completion Rate</div>
                </CardContent>
              </Card>
              <Card className="bg-[oklch(0.205_0_0)] border-white/10 border border-solid p-4">
                <CardContent className="flex p-0 flex-col gap-2">
                  <div className="bg-[oklch(0.769_0.188_70.08)]/20 rounded-xl flex justify-center items-center w-9 h-9">
                    <Zap className="size-4 text-[oklch(0.769_0.188_70.08)]" />
                  </div>
                  <div className="font-bold text-neutral-50 text-2xl leading-8">92</div>
                  <div className="text-[#a1a1a1] text-xs leading-4">Productivity Score</div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-[oklch(0.205_0_0)] border-white/10 border border-solid p-6 flex flex-col gap-4">
                <CardHeader className="p-0 flex flex-col gap-1">
                  <div className="font-semibold text-neutral-50 text-base leading-6">
                    Daily Hours
                  </div>
                  <div className="text-[#a1a1a1] text-xs leading-4 font-normal">
                    Hours tracked per day this week
                  </div>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <ChartContainer
                    config={{
                      hours: {
                        label: 'Hours',
                        color: 'oklch(0.488 0.243 264.376)'
                      }
                    }}
                    className="w-full h-48"
                  >
                    <RechartsBarChart
                      data={[
                        { day: 'Mon', hours: 5.2 },
                        { day: 'Tue', hours: 6.8 },
                        { day: 'Wed', hours: 4.5 },
                        { day: 'Thu', hours: 7.1 },
                        { day: 'Fri', hours: 8.4 },
                        { day: 'Sat', hours: 3.2 },
                        { day: 'Sun', hours: 2.8 }
                      ]}
                      margin={{ top: 4, right: 4, bottom: 4, left: -20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(1 0 0 / 8%)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: 'oklch(0.708 0 0)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: 'oklch(0.708 0 0)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <ChartTooltip />
                      <Bar
                        dataKey="hours"
                        fill="oklch(0.488 0.243 264.376)"
                        radius={[4, 4, 0, 0]}
                      />
                    </RechartsBarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="bg-[oklch(0.205_0_0)] border-white/10 border border-solid p-6 flex flex-col gap-4">
                <CardHeader className="p-0 flex flex-col gap-1">
                  <div className="font-semibold text-neutral-50 text-base leading-6">
                    Task Completion by Category
                  </div>
                  <div className="text-[#a1a1a1] text-xs leading-4 font-normal">
                    Tasks completed per category
                  </div>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <ChartContainer
                    config={{
                      tasks: {
                        label: 'Tasks',
                        color: 'oklch(0.488 0.243 264.376)'
                      }
                    }}
                    className="w-full h-48"
                  >
                    <RechartsBarChart
                      layout="vertical"
                      data={[
                        {
                          category: 'Backend',
                          tasks: 18,
                          fill: 'oklch(0.488 0.243 264.376)'
                        },
                        {
                          category: 'Frontend',
                          tasks: 12,
                          fill: 'oklch(0.627 0.265 303.9)'
                        },
                        {
                          category: 'Docs',
                          tasks: 8,
                          fill: 'oklch(0.696 0.17 162.48)'
                        },
                        {
                          category: 'Testing',
                          tasks: 4,
                          fill: 'oklch(0.769 0.188 70.08)'
                        }
                      ]}
                      margin={{ top: 4, right: 24, bottom: 4, left: 16 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(1 0 0 / 8%)"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        tick={{ fill: 'oklch(0.708 0 0)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="category"
                        tick={{ fill: 'oklch(0.708 0 0)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={60}
                      />
                      <ChartTooltip />
                      <Bar dataKey="tasks" radius={[0, 4, 4, 0]}>
                        <Cell fill="oklch(0.488 0.243 264.376)" />
                        <Cell fill="oklch(0.627 0.265 303.9)" />
                        <Cell fill="oklch(0.696 0.17 162.48)" />
                        <Cell fill="oklch(0.769 0.188 70.08)" />
                      </Bar>
                    </RechartsBarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="bg-[oklch(0.205_0_0)] border-white/10 border border-solid p-6 flex flex-col gap-4">
                <CardHeader className="p-0 flex flex-col gap-1">
                  <div className="font-semibold text-neutral-50 text-base leading-6">
                    Monthly Productivity Trend
                  </div>
                  <div className="text-[#a1a1a1] text-xs leading-4 font-normal">
                    Past 4 weeks performance
                  </div>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <ChartContainer
                    config={{
                      score: {
                        label: 'Score',
                        color: 'oklch(0.488 0.243 264.376)'
                      }
                    }}
                    className="w-full h-48"
                  >
                    <RechartsAreaChart
                      data={[
                        { week: 'W1', score: 62 },
                        { week: 'W2', score: 71 },
                        { week: 'W3', score: 78 },
                        { week: 'W4', score: 92 }
                      ]}
                      margin={{ top: 4, right: 4, bottom: 4, left: -20 }}
                    >
                      <defs>
                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="oklch(0.488 0.243 264.376)"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="oklch(0.488 0.243 264.376)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(1 0 0 / 8%)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="week"
                        tick={{ fill: 'oklch(0.708 0 0)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: 'oklch(0.708 0 0)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <ChartTooltip />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="oklch(0.488 0.243 264.376)"
                        strokeWidth={2}
                        fill="url(#scoreGrad)"
                      />
                    </RechartsAreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card className="bg-[oklch(0.205_0_0)] border-white/10 border border-solid p-6 flex flex-col gap-4">
                <CardHeader className="p-0 flex flex-col gap-1">
                  <div className="font-semibold text-neutral-50 text-base leading-6">
                    Time Per Category
                  </div>
                  <div className="text-[#a1a1a1] text-xs leading-4 font-normal">
                    Hours distribution this week
                  </div>
                </CardHeader>
                <CardContent className="flex p-0 items-center gap-6 mt-2">
                  <div className="relative">
                    <ChartContainer
                      config={{
                        backend: {
                          label: 'Backend',
                          color: 'oklch(0.488 0.243 264.376)'
                        },
                        frontend: {
                          label: 'Frontend',
                          color: 'oklch(0.627 0.265 303.9)'
                        },
                        docs: {
                          label: 'Docs',
                          color: 'oklch(0.696 0.17 162.48)'
                        },
                        testing: {
                          label: 'Testing',
                          color: 'oklch(0.769 0.188 70.08)'
                        }
                      }}
                      className="w-44 h-44"
                    >
                      <RechartsPieChart>
                        <Pie
                          data={[
                            {
                              name: 'Backend',
                              value: 18,
                              fill: 'oklch(0.488 0.243 264.376)'
                            },
                            {
                              name: 'Frontend',
                              value: 12,
                              fill: 'oklch(0.627 0.265 303.9)'
                            },
                            {
                              name: 'Docs',
                              value: 5,
                              fill: 'oklch(0.696 0.17 162.48)'
                            },
                            {
                              name: 'Testing',
                              value: 3,
                              fill: 'oklch(0.769 0.188 70.08)'
                            }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={48}
                          outerRadius={68}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          <Cell fill="oklch(0.488 0.243 264.376)" />
                          <Cell fill="oklch(0.627 0.265 303.9)" />
                          <Cell fill="oklch(0.696 0.17 162.48)" />
                          <Cell fill="oklch(0.769 0.188 70.08)" />
                        </Pie>
                        <ChartTooltip />
                      </RechartsPieChart>
                    </ChartContainer>
                    <div className="pointer-events-none flex absolute inset-0 flex-col justify-center items-center">
                      <span className="font-bold text-neutral-50 text-lg leading-7">38h</span>
                      <span className="text-[#a1a1a1] text-xs leading-4">total</span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-[oklch(0.488_0.243_264.376)] rounded-full w-2.5 h-2.5" />
                      <span className="text-neutral-50 text-sm leading-5 flex-1">Backend</span>
                      <span className="font-medium text-neutral-50 text-sm leading-5">18h</span>
                      <span className="text-[#a1a1a1] text-xs leading-4">47%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-[oklch(0.627_0.265_303.9)] rounded-full w-2.5 h-2.5" />
                      <span className="text-neutral-50 text-sm leading-5 flex-1">Frontend</span>
                      <span className="font-medium text-neutral-50 text-sm leading-5">12h</span>
                      <span className="text-[#a1a1a1] text-xs leading-4">32%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-[oklch(0.696_0.17_162.48)] rounded-full w-2.5 h-2.5" />
                      <span className="text-neutral-50 text-sm leading-5 flex-1">Docs</span>
                      <span className="font-medium text-neutral-50 text-sm leading-5">5h</span>
                      <span className="text-[#a1a1a1] text-xs leading-4">13%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-[oklch(0.769_0.188_70.08)] rounded-full w-2.5 h-2.5" />
                      <span className="text-neutral-50 text-sm leading-5 flex-1">Testing</span>
                      <span className="font-medium text-neutral-50 text-sm leading-5">3h</span>
                      <span className="text-[#a1a1a1] text-xs leading-4">8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-[oklch(0.205_0_0)] border-white/10 border border-solid p-6 flex flex-col gap-4">
              <CardHeader className="p-0 flex flex-col gap-1">
                <div className="font-semibold text-neutral-50 text-base leading-6">
                  Average Focus Session
                </div>
                <div className="text-[#a1a1a1] text-xs leading-4 font-normal">
                  Focus session lengths across the week — dashed line shows average (2h 18m)
                </div>
              </CardHeader>
              <CardContent className="p-0 mt-2">
                <ChartContainer
                  config={{
                    duration: {
                      label: 'Duration (hrs)',
                      color: 'oklch(0.488 0.243 264.376)'
                    }
                  }}
                  className="w-full h-36"
                >
                  <RechartsBarChart
                    data={[
                      { day: 'Mon', duration: 1.8 },
                      { day: 'Tue', duration: 2.2 },
                      { day: 'Wed', duration: 3.1 },
                      { day: 'Thu', duration: 2.5 },
                      { day: 'Fri', duration: 1.5 },
                      { day: 'Sat', duration: 2.8 },
                      { day: 'Sun', duration: 2.2 }
                    ]}
                    margin={{ top: 8, right: 8, bottom: 4, left: -20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="oklch(1 0 0 / 8%)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: 'oklch(0.708 0 0)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'oklch(0.708 0 0)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <ChartTooltip />
                    <ReferenceLine
                      y={2.3}
                      stroke="oklch(0.769 0.188 70.08)"
                      strokeDasharray="6 3"
                      strokeWidth={1.5}
                    />
                    <Bar
                      dataKey="duration"
                      fill="oklch(0.488 0.243 264.376)"
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>
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

      {/* Dynamic Right Sidebar stack based on Active Tab */}
      {activeTab === 'Dashboard' ? (
        /* Dashboard sidebar controls */
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
      ) : activeTab === 'Tasks' ? (
        /* Tasks Side Detail view layout stack */
        <div className="min-h-screen bg-[oklch(0.205_0_0)] shrink-0 border-white/10 border-t-0 border-r-0 border-b-0 border-l-1 border-solid flex flex-col gap-0 w-72">
          {/* Header Task Details */}
          <div className="border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid p-6">
            <div className="flex mb-1 justify-between items-center">
              <h2 className="font-semibold text-neutral-50 text-sm leading-5">Task Details</h2>
              <button
                onClick={() => setSelectedTaskId('')}
                className="bg-[oklch(0.269_0_0)] hover:bg-neutral-800 rounded-md border-white/10 border-1 border-solid flex justify-center items-center w-6 h-6 border-none cursor-pointer"
              >
                <X className="size-3 text-[#a1a1a1]" />
              </button>
            </div>
            <p className="text-[#a1a1a1] text-xs leading-4">Selected task info</p>
          </div>

          {/* Task Details pane attributes */}
          {selectedTask ? (
            <div className="overflow-y-auto flex p-6 flex-col flex-1 gap-6">
              {/* Priority and Title */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: selectedTask.priorityColor }}
                    className="rounded-full w-2 h-2"
                  />
                  <span
                    style={{ color: selectedTask.priorityColor }}
                    className="font-semibold uppercase text-xs leading-4 tracking-wider"
                  >
                    {selectedTask.priority} Priority
                  </span>
                </div>
                <h3 className="font-bold text-neutral-50 text-lg leading-7">
                  {selectedTask.title}
                </h3>
                <p className="leading-relaxed text-[#a1a1a1] text-sm leading-5">
                  {selectedTask.description}
                </p>
              </div>

              {/* Table statistics */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider">
                    Project
                  </span>
                  <span className="bg-[oklch(0.269_0_0)] font-medium rounded-full text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid px-2 py-1">
                    {selectedTask.category}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider">
                    Due Date
                  </span>
                  <span className="font-medium text-neutral-50 text-xs leading-4">
                    {selectedTask.dueDate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider">
                    Estimated
                  </span>
                  <span className="font-medium text-neutral-50 text-xs leading-4">
                    {selectedTask.estimatedHours} hours
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider">
                    Actual
                  </span>
                  <span className="text-[oklch(0.488_0.243_264.376)] font-mono font-semibold text-xs leading-4">
                    {formatTime(selectedTask.loggedTime)}
                  </span>
                </div>
              </div>

              {/* Tags Section */}
              <div className="flex flex-col gap-2">
                <span className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider">
                  Tags
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-[oklch(0.488_0.243_264.376)]/20 text-[oklch(0.488_0.243_264.376)] font-medium rounded-full text-xs leading-4 px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress bar details */}
              <div className="flex flex-col gap-2">
                <span className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider">
                  Progress
                </span>
                <div className="bg-[oklch(0.269_0_0)] rounded-full w-full h-1.5 overflow-hidden">
                  <div
                    style={{
                      width: `${Math.min(100, Math.round((selectedTask.loggedTime / (selectedTask.estimatedHours * 3600)) * 100))}%`
                    }}
                    className="bg-[oklch(0.488_0.243_264.376)] rounded-full h-1.5 transition-all duration-300"
                  />
                </div>
                <div className="flex mt-1 justify-between items-center">
                  <span className="text-[#a1a1a1] text-xs leading-4">
                    {Math.floor(selectedTask.loggedTime / 60)}m elapsed
                  </span>
                  <span className="text-[#a1a1a1] text-xs leading-4">
                    {selectedTask.estimatedHours}h estimated
                  </span>
                </div>
              </div>

              {/* Status indicator badge */}
              <div className="flex flex-col gap-2">
                <span className="font-semibold uppercase text-[#a1a1a1] text-xs leading-4 tracking-wider">
                  Status
                </span>
                <span
                  className={`font-semibold rounded-full text-xs leading-4 px-3 py-1.5 w-fit ${
                    selectedTask.status === 'Completed'
                      ? 'bg-[oklch(0.696_0.17_162.48)]/20 text-[oklch(0.696_0.17_162.48)]'
                      : selectedTask.status === 'In Progress'
                        ? 'bg-[oklch(0.488_0.243_264.376)]/20 text-[oklch(0.488_0.243_264.376)]'
                        : selectedTask.status === 'Overdue'
                          ? 'bg-[oklch(0.704_0.191_22.216)]/20 text-[oklch(0.704_0.191_22.216)]'
                          : 'bg-[oklch(0.269_0_0)] border border-white/10 text-[#a1a1a1]'
                  }`}
                >
                  {selectedTask.status}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 p-6 text-center text-xs text-neutral-500">
              Click a task to review detailed milestones.
            </div>
          )}

          {/* Sidebar bottom action */}
          {selectedTask && (
            <div className="border-white/10 border-t border-r-0 border-b-0 border-l-0 border-solid p-6">
              <Button
                onClick={() => handleTogglePlayPause(selectedTask.id)}
                className="bg-[oklch(0.488_0.243_264.376)] font-semibold rounded-xl text-white text-sm leading-5 flex py-2.5 justify-center items-center gap-2 w-full"
              >
                <Zap className="size-4" />
                <span>{selectedTask.status === 'In Progress' ? 'Pause Focus' : 'Start Focus'}</span>
              </Button>
            </div>
          )}
        </div>
      ) : activeTab === 'Analytics' ? (
        /* Analytics right sidebar */
        <div className="min-h-screen bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] flex-shrink-0 border-t-0 border-r-0 border-b-0 border-l border-solid flex p-6 flex-col gap-6 w-75 overflow-y-auto">
          <Card className="bg-[oklch(0.145_0_0)] border-white/10 border border-solid p-4 flex flex-col gap-4">
            <CardHeader className="p-0 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Lightbulb className="size-4 text-[oklch(0.769_0.188_70.08)]" />
                <span className="font-semibold text-neutral-50 text-sm leading-5">
                  Productivity Insights
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex p-0 flex-col gap-3">
              <div className="flex gap-2">
                <div className="bg-[oklch(0.488_0.243_264.376)] shrink-0 rounded-full mt-1.5 w-1.5 h-1.5" />
                <p className="leading-relaxed text-[#a1a1a1] text-xs leading-4">
                  Your peak productivity window is{' '}
                  <span className="font-medium text-neutral-50">9–11 AM</span>. Schedule complex
                  tasks during this time.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="bg-[oklch(0.696_0.17_162.48)] shrink-0 rounded-full mt-1.5 w-1.5 h-1.5" />
                <p className="leading-relaxed text-[#a1a1a1] text-xs leading-4">
                  Backend tasks take <span className="font-medium text-neutral-50">23% longer</span>{' '}
                  than estimated. Consider adding buffer time.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="bg-[oklch(0.627_0.265_303.9)] shrink-0 rounded-full mt-1.5 w-1.5 h-1.5" />
                <p className="leading-relaxed text-[#a1a1a1] text-xs leading-4">
                  You complete <span className="font-medium text-neutral-50">40% more tasks</span>{' '}
                  on days with a morning focus session.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="bg-[oklch(0.769_0.188_70.08)] shrink-0 rounded-full mt-1.5 w-1.5 h-1.5" />
                <p className="leading-relaxed text-[#a1a1a1] text-xs leading-4">
                  Friday is your most productive day. Leverage it for high-priority deliverables.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[oklch(0.145_0_0)] border-white/10 border border-solid p-4 flex flex-col gap-4">
            <CardHeader className="p-0 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <ListChecks className="size-4 text-[oklch(0.488_0.243_264.376)]" />
                <span className="font-semibold text-neutral-50 text-sm leading-5">
                  Top Tasks This Week
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex p-0 flex-col gap-2">
              <div className="border-white/10 border-t-0 border-r-0 border-b border-l-0 border-solid flex py-2 items-start gap-2">
                <div className="bg-[oklch(0.488_0.243_264.376)] shrink-0 rounded-full mt-1.5 w-1.5 h-1.5" />
                <div className="flex-1">
                  <div className="font-medium text-neutral-50 text-xs leading-4">Fix Auth Bug</div>
                  <div className="text-[#a1a1a1] text-xs leading-4 font-normal">
                    Backend · 3h 20m
                  </div>
                </div>
                <div className="text-[oklch(0.696_0.17_162.48)] font-medium text-xs leading-4">
                  Done
                </div>
              </div>
              <div className="border-white/10 border-t-0 border-r-0 border-b border-l-0 border-solid flex py-2 items-start gap-2">
                <div className="bg-[oklch(0.488_0.243_264.376)] shrink-0 rounded-full mt-1.5 w-1.5 h-1.5" />
                <div className="flex-1">
                  <div className="font-medium text-neutral-50 text-xs leading-4">
                    Refactor DB Schema
                  </div>
                  <div className="text-[#a1a1a1] text-xs leading-4 font-normal">
                    Backend · 2h 45m
                  </div>
                </div>
                <div className="text-[oklch(0.769_0.188_70.08)] font-medium text-xs leading-4">
                  Active
                </div>
              </div>
              <div className="border-white/10 border-t-0 border-r-0 border-b border-l-0 border-solid flex py-2 items-start gap-2">
                <div className="bg-[oklch(0.488_0.243_264.376)] shrink-0 rounded-full mt-1.5 w-1.5 h-1.5" />
                <div className="flex-1">
                  <div className="font-medium text-neutral-50 text-xs leading-4">
                    Update API Docs
                  </div>
                  <div className="text-[#a1a1a1] text-xs leading-4 font-normal">Docs · 45m</div>
                </div>
                <div className="text-[oklch(0.696_0.17_162.48)] font-medium text-xs leading-4">
                  Done
                </div>
              </div>
              <div className="border-white/10 border-t-0 border-r-0 border-b border-l-0 border-solid flex py-2 items-start gap-2">
                <div className="bg-[oklch(0.488_0.243_264.376)] shrink-0 rounded-full mt-1.5 w-1.5 h-1.5" />
                <div className="flex-1">
                  <div className="font-medium text-neutral-50 text-xs leading-4">
                    Build Dashboard UI
                  </div>
                  <div className="text-[#a1a1a1] text-xs leading-4 font-normal font-normal">
                    Frontend · 2h 10m
                  </div>
                </div>
                <div className="text-[oklch(0.696_0.17_162.48)] font-medium text-xs leading-4">
                  Done
                </div>
              </div>
              <div className="flex py-2 items-start gap-2">
                <div className="bg-[oklch(0.488_0.243_264.376)] shrink-0 rounded-full mt-1.5 w-1.5 h-1.5" />
                <div className="flex-1">
                  <div className="font-medium text-neutral-50 text-xs leading-4">
                    Write Unit Tests
                  </div>
                  <div className="text-[#a1a1a1] text-xs leading-4 font-normal font-normal">
                    Testing · 1h 30m
                  </div>
                </div>
                <div className="font-medium text-[#a1a1a1] text-xs leading-4">Pending</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[oklch(0.145_0_0)] border-white/10 border border-solid p-4 flex flex-col gap-4">
            <CardHeader className="p-0 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Flame className="size-4 text-[oklch(0.645_0.246_16.439)]" />
                  <span className="font-semibold text-neutral-50 text-sm leading-5">
                    Focus Streak
                  </span>
                </div>
                <span className="text-[#a1a1a1] text-xs leading-4">This week</span>
              </div>
            </CardHeader>
            <CardContent className="flex p-0 flex-col gap-3">
              <div className="flex justify-center items-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-bold text-neutral-50 text-4xl leading-10">7</span>
                  <span className="text-[#a1a1a1] text-xs leading-4 font-normal">day streak</span>
                </div>
              </div>
              <div className="flex justify-between items-center gap-1">
                {(['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const).map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div className="bg-[oklch(0.488_0.243_264.376)] rounded-full flex justify-center items-center w-7 h-7">
                      <Check className="size-3 text-white" />
                    </div>
                    <span className="text-[#a1a1a1] text-xs leading-4 font-normal">{day}</span>
                  </div>
                ))}
              </div>
              <div className="bg-[oklch(0.645_0.246_16.439)]/10 rounded-xl flex p-3 items-center gap-2">
                <Flame className="size-4 text-[oklch(0.645_0.246_16.439)]" />
                <p className="text-[#a1a1a1] text-xs leading-4">
                  Best streak: <span className="font-medium text-neutral-50">21 days</span>. Keep it
                  up!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Empty default fallback */
        <div className="w-0 shrink-0" />
      )}

      {/* Floating Active Timer Widget overlay */}
      {widgetVisible && (
        <div className="fixed z-50 right-6 bottom-6 transition-all duration-300">
          <div className="bg-[oklch(0.205_0_0)] border-[oklch(0.488_0.243_264.376)]/40 shadow-[0_8px_32px_oklch(0.488_0.243_264.376)/30] rounded-2xl border-black/1 border-1 border-solid flex p-4 flex-col gap-3 w-64">
            {/* Widget control bar */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-[oklch(0.488_0.243_264.376)] rounded-full w-2 h-2" />
                <span className="text-[oklch(0.488_0.243_264.376)] font-semibold uppercase text-xs leading-4 tracking-wider">
                  Focus Mode
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setWidgetMinimized(!widgetMinimized)}
                  className="size-5 rounded-sm flex justify-center items-center hover:bg-neutral-800 text-neutral-400 border-none bg-transparent cursor-pointer"
                >
                  {widgetMinimized ? <Plus className="size-3" /> : <Minus className="size-3" />}
                </button>
                <button
                  onClick={() => setWidgetVisible(false)}
                  className="size-5 rounded-sm flex justify-center items-center hover:bg-neutral-800 text-neutral-400 border-none bg-transparent cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              </div>
            </div>

            {/* Widget details */}
            {!widgetMinimized ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-neutral-50 text-sm leading-5 truncate">
                    {activeTask ? activeTask.title : 'No active focus'}
                  </span>
                  <span className="text-[#a1a1a1] text-xs leading-4">
                    {activeTask
                      ? `${activeTask.category} · ${activeTask.priority}`
                      : 'DevTrack Session'}
                  </span>
                </div>

                <div className="flex py-1 justify-center items-center">
                  <span className="font-mono font-bold text-neutral-50 text-2xl leading-8 tracking-widest tabular-nums">
                    {activeTask ? formatTime(activeTask.loggedTime) : '00:00:00'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {activeTask ? (
                    <>
                      <button
                        onClick={() => handleTogglePlayPause(activeTask.id)}
                        className="bg-[oklch(0.269_0_0)] hover:bg-neutral-800 font-semibold rounded-xl text-neutral-50 text-xs leading-4 border-white/10 border border-solid flex py-2 justify-center items-center flex-1 gap-1.5 cursor-pointer"
                      >
                        <Pause className="size-3" />
                        <span>Pause</span>
                      </button>
                      <button
                        onClick={() => handleToggleComplete(activeTask.id)}
                        className="bg-[oklch(0.696_0.17_162.48)]/20 hover:opacity-90 border-[oklch(0.696_0.17_162.48)]/30 text-[oklch(0.696_0.17_162.48)] font-semibold rounded-xl text-xs leading-4 border-black/1 border-1 border-solid flex py-2 justify-center items-center flex-1 gap-1.5 cursor-pointer"
                      >
                        <Check className="size-3" />
                        <span>Done</span>
                      </button>
                      <button
                        onClick={() => handleStopTask(activeTask.id)}
                        className="bg-[oklch(0.704_0.191_22.216)]/10 hover:bg-[oklch(0.704_0.191_22.216)]/20 rounded-xl border-black/1 border-1 border-solid flex justify-center items-center w-8 h-8 cursor-pointer"
                      >
                        <Square className="size-3 text-[oklch(0.704_0.191_22.216)]" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-xs text-neutral-500 py-1 w-full">
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
