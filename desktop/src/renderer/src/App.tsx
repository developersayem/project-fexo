import React, { useState, useEffect } from 'react'
import {
  Zap,
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  FolderOpen,
  Settings,
  Plus,
  Minus,
  X,
  Pause,
  Check,
  Square,
  Maximize2
} from 'lucide-react'
import { useAppStore } from '@renderer/store/useAppStore'
import { Task } from './types/task'

import { DashboardContent, DashboardSidebar } from './screens/DashboardScreen'
import { TasksHeader, TasksContent, TasksSidebar } from './screens/TasksScreen'
import { CalendarHeader, CalendarContent, CalendarSidebar } from './screens/CalendarScreen'
import { AnalyticsHeader, AnalyticsContent, AnalyticsSidebar } from './screens/AnalyticsScreen'
import { SettingsContent } from './screens/SettingsScreen'
import { ProjectsContent } from './screens/ProjectsScreen'
import { FocusScreen } from './screens/FocusScreen'

export default function App(): React.JSX.Element {
  const { theme, username, settingsLoaded, loadSettings, setTheme, setUsername, resetSettings } =
    useAppStore()

  const [storePath, setStorePath] = useState('')
  const [activeTab, setActiveTab] = useState<
    'Dashboard' | 'Tasks' | 'Calendar' | 'Analytics' | 'Projects' | 'Settings'
  >('Dashboard')

  const [isFocusActive, setIsFocusActive] = useState(false)

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

  // Calendar specific state variables
  const [calendarSelectedDay, setCalendarSelectedDay] = useState<number>(24)
  const [calendarMonth, setCalendarMonth] = useState<string>('June 2025')

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

  const sidebarTabs = [
    { id: 'Dashboard', icon: Home, label: 'Dashboard' },
    { id: 'Tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'Calendar', icon: Calendar, label: 'Calendar' },
    { id: 'Analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'Projects', icon: FolderOpen, label: 'Projects' },
    { id: 'Settings', icon: Settings, label: 'Settings' }
  ] as const

  const handleMonthToggle = (direction: 'next' | 'prev'): void => {
    if (direction === 'next') {
      setCalendarMonth(calendarMonth === 'June 2025' ? 'July 2025' : 'June 2025')
    } else {
      setCalendarMonth(calendarMonth === 'June 2025' ? 'May 2025' : 'June 2025')
    }
  }

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

  if (isFocusActive) {
    return (
      <FocusScreen
        activeTask={activeTask}
        formatTime={formatTime}
        onTogglePlayPause={() => activeTask && handleTogglePlayPause(activeTask.id)}
        onToggleComplete={() => activeTask && handleToggleComplete(activeTask.id)}
        onStop={() => {
          if (activeTask) handleStopTask(activeTask.id)
          setIsFocusActive(false)
        }}
        onExitFocus={() => setIsFocusActive(false)}
      />
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
        {activeTab !== 'Settings' && (
          <div className="bg-neutral-950 border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex px-8 py-6 justify-between items-center min-h-[81px]">
            {activeTab === 'Tasks' ? (
              <>
                <div className="flex flex-col gap-1">
                  <h1 className="font-bold text-neutral-50 text-2xl leading-8 tracking-tight">
                    Tasks
                  </h1>
                  <p className="text-[#a1a1a1] text-sm leading-5">
                    {tasks.length} tasks · {tasks.filter((t) => t.status === 'In Progress').length}{' '}
                    in progress
                  </p>
                </div>
                <TasksHeader
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  newTaskListTitle={newTaskListTitle}
                  setNewTaskListTitle={setNewTaskListTitle}
                  handleAddTask={handleAddTask}
                />
              </>
            ) : activeTab === 'Calendar' ? (
              <CalendarHeader currentMonth={calendarMonth} onMonthToggle={handleMonthToggle} />
            ) : activeTab === 'Analytics' ? (
              <AnalyticsHeader
                analyticsFilter={analyticsFilter}
                setAnalyticsFilter={setAnalyticsFilter}
              />
            ) : (
              <div className="flex flex-col gap-1">
                <h1 className="font-bold text-neutral-50 text-2xl leading-8 tracking-tight">
                  {activeTab}
                </h1>
                <p className="text-[#a1a1a1] text-sm leading-5">{currentDayStr}</p>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Panels Switcher */}
        {activeTab === 'Dashboard' ? (
          <DashboardContent
            tasks={tasks}
            dashboardFilter={dashboardFilter}
            setDashboardFilter={setDashboardFilter}
            searchQuery={searchQuery}
            setSelectedTaskId={setSelectedTaskId}
            setActiveTab={setActiveTab}
            formatTime={formatTime}
            handleTogglePlayPause={handleTogglePlayPause}
          />
        ) : activeTab === 'Tasks' ? (
          <TasksContent
            tasks={tasks}
            tasksTabFilter={tasksTabFilter}
            setTasksTabFilter={setTasksTabFilter}
            searchQuery={searchQuery}
            selectedTaskId={selectedTaskId}
            setSelectedTaskId={setSelectedTaskId}
            formatTime={formatTime}
            handleTogglePlayPause={handleTogglePlayPause}
            handleToggleComplete={handleToggleComplete}
            handleDeleteTask={handleDeleteTask}
          />
        ) : activeTab === 'Calendar' ? (
          <CalendarContent
            selectedDay={calendarSelectedDay}
            setSelectedDay={setCalendarSelectedDay}
          />
        ) : activeTab === 'Analytics' ? (
          <AnalyticsContent />
        ) : activeTab === 'Settings' ? (
          <SettingsContent
            username={username}
            setUsername={setUsername}
            theme={theme}
            setTheme={setTheme}
            resetSettings={resetSettings}
            storePath={storePath}
          />
        ) : (
          <ProjectsContent />
        )}
      </div>

      {/* Dynamic Right Sidebar stack based on Active Tab */}
      {activeTab === 'Dashboard' ? (
        <DashboardSidebar
          tasks={tasks}
          activeTask={activeTask}
          widgetVisible={widgetVisible}
          setWidgetVisible={setWidgetVisible}
          setActiveTab={setActiveTab}
          setNewTaskListTitle={setNewTaskListTitle}
          quickNote={quickNote}
          setQuickNote={setQuickNote}
          formatTime={formatTime}
          handleTogglePlayPause={handleTogglePlayPause}
          handleToggleComplete={handleToggleComplete}
          handleStopTask={handleStopTask}
          onStartFocus={() => setIsFocusActive(true)}
        />
      ) : activeTab === 'Tasks' ? (
        <TasksSidebar
          selectedTask={selectedTask}
          setSelectedTaskId={setSelectedTaskId}
          formatTime={formatTime}
          handleTogglePlayPause={handleTogglePlayPause}
          onStartFocus={() => setIsFocusActive(true)}
        />
      ) : activeTab === 'Calendar' ? (
        <CalendarSidebar />
      ) : activeTab === 'Analytics' ? (
        <AnalyticsSidebar />
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
                {activeTask && (
                  <button
                    onClick={() => setIsFocusActive(true)}
                    className="size-5 rounded-sm flex justify-center items-center hover:bg-neutral-800 text-neutral-400 border-none bg-transparent cursor-pointer"
                    title="Maximize Focus Mode"
                  >
                    <Maximize2 className="size-3" />
                  </button>
                )}
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

                <div
                  onClick={() => activeTask && setIsFocusActive(true)}
                  className="flex py-1 justify-center items-center cursor-pointer hover:bg-neutral-800/40 rounded-lg transition-colors group"
                  title="Click to maximize Focus Mode"
                >
                  <span className="font-mono font-bold text-neutral-50 group-hover:text-[oklch(0.488_0.243_264.376)] text-2xl leading-8 tracking-widest tabular-nums transition-colors">
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
