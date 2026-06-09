import React, { useState } from 'react'
import {
  CheckSquare,
  ChevronRight,
  Clock3,
  Download,
  Flame,
  GitBranch,
  Search,
  Settings,
  Trash2,
  Trophy,
  Workflow,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import Versions from '../components/Versions'

interface SettingsContentProps {
  username: string
  setUsername: (username: string) => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  resetSettings: () => void
  storePath: string
}

export const SettingsContent: React.FC<SettingsContentProps> = ({
  username,
  setUsername,
  theme,
  setTheme,
  resetSettings,
  storePath
}) => {
  // Local Settings States
  const [notifications, setNotifications] = useState(true)
  const [taskOverdue, setTaskOverdue] = useState(true)
  const [dailyReminder, setDailyReminder] = useState(true)
  const [levelUp, setLevelUp] = useState(true)
  const [floatingWidget, setFloatingWidget] = useState(true)
  const [alwaysOnTop, setAlwaysOnTop] = useState(false)
  const [startOnLaunch, setStartOnLaunch] = useState(true)
  const [opacity, setOpacity] = useState(85)
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string): void => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  // Initials Helper
  const initials = username
    ? username
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'AJ'

  // Preferences list for search
  const preferencesList = [
    {
      id: 'notifications',
      title: 'Notifications',
      desc: 'Focus complete, overdue tasks, reminders, and level ups',
      state: notifications,
      setState: setNotifications
    },
    {
      id: 'taskOverdue',
      title: 'Task Overdue',
      desc: 'Alert when a task passes its due date',
      state: taskOverdue,
      setState: setTaskOverdue
    },
    {
      id: 'dailyReminder',
      title: 'Daily Reminder',
      desc: 'Send a daily planning prompt at 9:00 AM',
      state: dailyReminder,
      setState: setDailyReminder
    },
    {
      id: 'levelUp',
      title: 'Level Up',
      desc: 'Celebrate milestone achievements',
      state: levelUp,
      setState: setLevelUp
    },
    {
      id: 'floatingWidget',
      title: 'Floating Widget',
      desc: 'Keep a compact timer on top of other windows',
      state: floatingWidget,
      setState: setFloatingWidget
    },
    {
      id: 'alwaysOnTop',
      title: 'Always On Top',
      desc: 'Pin the widget above all apps',
      state: alwaysOnTop,
      setState: setAlwaysOnTop
    },
    {
      id: 'startOnLaunch',
      title: 'Start on Launch',
      desc: 'Open DevTrack when your computer starts',
      state: startOnLaunch,
      setState: setStartOnLaunch
    }
  ]

  const filteredPrefs = preferencesList.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const shortcutsList = [
    { action: 'New Task', key: 'Cmd+N' },
    { action: 'Start Timer', key: 'Cmd+T' },
    { action: 'Pause Timer', key: 'Cmd+P' },
    { action: 'Quick Capture', key: 'Cmd+K' },
    { action: 'Show Widget', key: 'Cmd+Shift+M' }
  ]

  const filteredShortcuts = shortcutsList.filter(
    (s) =>
      s.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.key.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#0D0D0F]">
      {/* Header bar within Settings Screen */}
      <div className="border-white/10 border-t-0 border-r-0 border-b-1 border-l-0 border-solid flex pb-6 justify-between items-center">
        <div>
          <div className="font-semibold text-4xl leading-10 tracking-tight text-neutral-50">
            Settings
          </div>
          <div className="text-[#a1a1a1] text-sm leading-5 mt-2">
            Manage your profile, preferences, and workspace behavior
          </div>
        </div>
        <div className="rounded-full bg-neutral-900 text-[#a1a1a1] text-sm leading-5 border-white/10 border border-solid flex px-4 py-2 items-center gap-3">
          <Search className="size-4 text-[#a1a1a1]" />
          <input
            type="text"
            placeholder="Search settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-neutral-200 text-sm focus:outline-none placeholder-[#a1a1a1] w-44"
          />
        </div>
      </div>

      {/* Grid Content Layout */}
      <div className="grid min-h-0 grid-cols-[minmax(0,1.05fr)_minmax(0,1.45fr)_300px] mt-8 gap-8">
        {/* Left Column - Profile Card */}
        <section className="flex flex-col gap-8">
          <Card className="shadow-[0_20px_60px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900/60 border-white/10 border-1 border-solid p-8 flex flex-col gap-6">
            <CardHeader className="text-center p-0 flex flex-col gap-2">
              <div className="size-32 bg-[linear-gradient(135deg,oklch(0.488_0.243_264.376),oklch(0.627_0.265_303.9))] shadow-[0_0_50px_oklch(0.488_0.243_264.376/.35)] font-semibold rounded-full text-white text-4xl leading-10 flex mx-auto justify-center items-center">
                {initials}
              </div>
              <div className="flex flex-col gap-1 items-center mt-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent text-center border-b border-transparent hover:border-white/20 focus:border-[oklch(0.488_0.243_264.376)] text-2xl font-bold leading-8 text-neutral-50 focus:outline-none w-full max-w-[200px] text-ellipsis"
                  placeholder="Alex Johnson"
                />
                <span className="text-[#a1a1a1] text-xs">Click name to edit</span>
              </div>
              <div className="inline-flex font-medium rounded-full bg-[#151a2f] text-amber-300 text-sm leading-5 mx-auto px-3 py-1 items-center gap-2 mt-2 border border-violet-500/20">
                <Zap className="size-4 text-violet-400" />
                Level 3
              </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-4">
              <div className="rounded-2xl bg-[#111114] border-white/10 border border-solid p-5">
                <div className="text-[#a1a1a1] text-sm leading-5 flex justify-between items-center">
                  <span>Progress to Level 4</span>
                  <span>82%</span>
                </div>
                <div className="rounded-full bg-white/10 mt-4 h-3 overflow-hidden">
                  <div className="w-[82%] bg-[linear-gradient(90deg,oklch(0.488_0.243_264.376),oklch(0.627_0.265_303.9))] shadow-[0_0_24px_oklch(0.488_0.243_264.376/.35)] rounded-full h-3 transition-all duration-500" />
                </div>
                <div className="text-[#a1a1a1] text-sm leading-5 flex mt-3 justify-between items-center">
                  <span className="font-medium text-neutral-50">1,240 XP</span>
                  <span>1,500 XP</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="rounded-2xl bg-[#111114] border-white/10 border-0 border-solid p-5 flex flex-col gap-3">
                  <CardContent className="p-0 flex flex-col gap-3">
                    <div className="size-10 rounded-xl bg-[#1a2038] text-violet-400 flex justify-center items-center">
                      <CheckSquare className="size-5" />
                    </div>
                    <div className="font-semibold text-3xl leading-9 text-neutral-50">128</div>
                    <div className="text-[#a1a1a1] text-sm leading-5">Total Tasks</div>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl bg-[#111114] border-white/10 border-0 border-solid p-5 flex flex-col gap-3">
                  <CardContent className="p-0 flex flex-col gap-3">
                    <div className="size-10 rounded-xl bg-[#12222b] text-cyan-400 flex justify-center items-center">
                      <Clock3 className="size-5" />
                    </div>
                    <div className="font-semibold text-3xl leading-9 text-neutral-50">214h</div>
                    <div className="text-[#a1a1a1] text-sm leading-5">Total Hours</div>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl bg-[#111114] border-white/10 border-0 border-solid p-5 flex flex-col gap-3">
                  <CardContent className="p-0 flex flex-col gap-3">
                    <div className="size-10 rounded-xl bg-[#2a1b24] text-rose-400 flex justify-center items-center">
                      <Flame className="size-5" />
                    </div>
                    <div className="font-semibold text-3xl leading-9 text-neutral-50">7 days</div>
                    <div className="text-[#a1a1a1] text-sm leading-5">Current Streak</div>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl bg-[#111114] border-white/10 border-0 border-solid p-5 flex flex-col gap-3">
                  <CardContent className="p-0 flex flex-col gap-3">
                    <div className="size-10 rounded-xl bg-[#2a2314] text-amber-400 flex justify-center items-center">
                      <Trophy className="size-5" />
                    </div>
                    <div className="font-semibold text-3xl leading-9 text-neutral-50">21 days</div>
                    <div className="text-[#a1a1a1] text-sm leading-5">Best Streak</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Middle Column - Preferences & Shortcuts */}
        <section className="flex flex-col gap-8">
          <Card className="shadow-[0_20px_60px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900/60 border-white/10 border-1 border-solid p-8 flex flex-col gap-6">
            <CardHeader className="p-0 flex flex-col gap-2">
              <CardTitle className="text-2xl leading-8 text-neutral-50">Preferences</CardTitle>
              <CardDescription>
                Customize notifications, appearance, and productivity tools
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-8">
              <div className="space-y-4">
                {filteredPrefs.slice(0, 4).map((pref) => (
                  <div key={pref.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-neutral-100">{pref.title}</div>
                      <div className="text-[#a1a1a1] text-sm leading-5">{pref.desc}</div>
                    </div>
                    <div
                      onClick={() => pref.setState(!pref.state)}
                      className={`rounded-full p-1 w-11 h-6 cursor-pointer transition-colors duration-200 ${
                        pref.state ? 'bg-[oklch(0.488_0.243_264.376)]' : 'bg-neutral-800'
                      }`}
                    >
                      <div
                        className={`size-4 rounded-full transition-transform duration-200 bg-white ${
                          pref.state ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Theme Selector */}
              {searchQuery === '' || 'theme'.includes(searchQuery.toLowerCase()) ? (
                <div className="space-y-4 border-white/10 border-t border-r-0 border-b-0 border-l-0 border-solid pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-neutral-100">Theme</div>
                      <div className="text-[#a1a1a1] text-sm leading-5">
                        Choose your preferred appearance mode
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setTheme('dark')
                          showToast('Appearance mode changed to Dark')
                        }}
                        className={`font-medium rounded-full text-sm leading-5 px-4 py-2 transition-all cursor-pointer ${
                          theme === 'dark'
                            ? 'bg-neutral-200 text-neutral-900 font-semibold shadow'
                            : 'text-[#a1a1a1] border border-white/10 hover:bg-neutral-800'
                        }`}
                      >
                        Dark
                      </button>
                      <button
                        onClick={() => {
                          setTheme('light')
                          showToast('Appearance mode changed to Light')
                        }}
                        className={`font-medium rounded-full text-sm leading-5 px-4 py-2 transition-all cursor-pointer ${
                          theme === 'light'
                            ? 'bg-neutral-200 text-neutral-900 font-semibold shadow'
                            : 'text-[#a1a1a1] border border-white/10 hover:bg-neutral-800'
                        }`}
                      >
                        Light
                      </button>
                      <button
                        onClick={() => showToast('System mode synced')}
                        className="rounded-full text-[#a1a1a1] text-sm leading-5 border border-white/10 hover:bg-neutral-800 px-4 py-2 cursor-pointer transition-colors"
                      >
                        System
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Floating Widget preferences */}
              <div className="space-y-4 border-white/10 border-t border-r-0 border-b-0 border-l-0 border-solid pt-6">
                {filteredPrefs.slice(4).map((pref) => (
                  <div key={pref.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-neutral-100">{pref.title}</div>
                      <div className="text-[#a1a1a1] text-sm leading-5">{pref.desc}</div>
                    </div>
                    <div
                      onClick={() => pref.setState(!pref.state)}
                      className={`rounded-full p-1 w-11 h-6 cursor-pointer transition-colors duration-200 ${
                        pref.state ? 'bg-[oklch(0.488_0.243_264.376)]' : 'bg-neutral-800'
                      }`}
                    >
                      <div
                        className={`size-4 rounded-full transition-transform duration-200 bg-white ${
                          pref.state ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                ))}

                {(searchQuery === '' ||
                  'opacity widget transparency'.includes(searchQuery.toLowerCase())) && (
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-neutral-100">Opacity Control</div>
                        <div className="text-[#a1a1a1] text-sm leading-5">Widget transparency</div>
                      </div>
                      <div className="text-neutral-200 text-sm font-semibold">{opacity}%</div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="w-full accent-[oklch(0.488_0.243_264.376)] cursor-pointer bg-white/10 rounded-lg h-2 appearance-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card className="shadow-[0_20px_60px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900/60 border-white/10 border-1 border-solid p-8 flex flex-col gap-6">
            <CardHeader className="p-0 flex flex-col gap-2">
              <CardTitle className="text-2xl leading-8 text-neutral-50">
                Keyboard Shortcuts
              </CardTitle>
              <CardDescription>Speed up common actions with quick commands</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-3">
              {filteredShortcuts.map((shortcut) => (
                <div
                  key={shortcut.action}
                  className="rounded-2xl bg-[#111114] border-white/10 border flex px-4 py-3 justify-between items-center"
                >
                  <div className="font-medium text-sm leading-5 text-neutral-200">
                    {shortcut.action}
                  </div>
                  <div className="font-mono rounded-lg bg-black/30 text-[#a1a1a1] text-xs leading-4 border-white/10 border px-3 py-1">
                    {shortcut.key}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Right Column - Stats, Recent Activity, Account */}
        <aside className="flex flex-col gap-8">
          <Card className="shadow-[0_20px_60px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900/60 border-white/10 border-1 border-solid p-8 flex flex-col gap-6">
            <CardHeader className="p-0 flex flex-col gap-2">
              <CardTitle className="text-2xl leading-8 text-neutral-50">Quick Stats</CardTitle>
              <CardDescription>Workspace health at a glance</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-4">
              <div className="rounded-2xl bg-[#111114] border-white/10 border p-4">
                <div className="text-[#a1a1a1] text-sm leading-5">Tasks Completed</div>
                <div className="font-semibold text-3xl leading-9 mt-2 text-neutral-100">128</div>
              </div>
              <div className="rounded-2xl bg-[#111114] border-white/10 border p-4">
                <div className="text-[#a1a1a1] text-sm leading-5">Focus Hours</div>
                <div className="font-semibold text-3xl leading-9 mt-2 text-neutral-100">214h</div>
              </div>
              <div className="rounded-2xl bg-[#111114] border-white/10 border p-4">
                <div className="text-[#a1a1a1] text-sm leading-5">Widget Uptime</div>
                <div className="font-semibold text-3xl leading-9 mt-2 text-neutral-100">85%</div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_20px_60px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900/60 border-white/10 border-1 border-solid p-8 flex flex-col gap-6">
            <CardHeader className="p-0 flex flex-col gap-2">
              <CardTitle className="text-2xl leading-8 text-neutral-50">Recent Activity</CardTitle>
              <CardDescription>Latest changes and account events</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-4">
              <div className="rounded-2xl bg-[#111114] border-white/10 border p-4">
                <div className="text-sm leading-5 flex justify-between items-center">
                  <span className="font-medium text-neutral-100">Theme changed to Dark</span>
                  <span className="text-[#a1a1a1]">2m ago</span>
                </div>
                <div className="text-[#a1a1a1] text-sm leading-5 mt-2">
                  Updated appearance preferences across desktop and mobile.
                </div>
              </div>
              <div className="rounded-2xl bg-[#111114] border-white/10 border p-4">
                <div className="text-sm leading-5 flex justify-between items-center">
                  <span className="font-medium text-neutral-100">Floating Widget enabled</span>
                  <span className="text-[#a1a1a1]">18m ago</span>
                </div>
                <div className="text-[#a1a1a1] text-sm leading-5 mt-2">
                  Widget set to always-on-top with 85% opacity.
                </div>
              </div>
              <div className="rounded-2xl bg-[#111114] border-white/10 border p-4">
                <div className="text-sm leading-5 flex justify-between items-center">
                  <span className="font-medium text-neutral-100">Export completed</span>
                  <span className="text-[#a1a1a1]">1h ago</span>
                </div>
                <div className="text-[#a1a1a1] text-sm leading-5 mt-2">
                  Downloaded tasks and analytics CSV archive.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[0_20px_60px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900/60 border-white/10 border-1 border-solid p-8 flex flex-col gap-6">
            <CardHeader className="p-0 flex flex-col gap-2">
              <CardTitle className="text-2xl leading-8 text-neutral-50">Account</CardTitle>
              <CardDescription>Data, integrations, and safety controls</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-3">
              <div
                onClick={() => showToast('Data exported successfully! Check downloads.')}
                className="rounded-2xl bg-[#111114] border-white/10 border flex px-4 py-3 justify-between items-center cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Download className="size-4 text-violet-400" />
                  <span className="font-medium text-sm leading-5 text-neutral-200">
                    Export Data
                  </span>
                </div>
                <ChevronRight className="size-4 text-[#a1a1a1]" />
              </div>
              <div
                onClick={() => showToast('GitHub Integration initiated')}
                className="rounded-2xl bg-[#111114] border-white/10 border flex px-4 py-3 justify-between items-center cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <GitBranch className="size-4 text-cyan-400" />
                  <span className="font-medium text-sm leading-5 text-neutral-200">
                    GitHub Integration
                  </span>
                </div>
                <ChevronRight className="size-4 text-[#a1a1a1]" />
              </div>
              <div
                onClick={() => showToast('Jira Integration initiated')}
                className="rounded-2xl bg-[#111114] border-white/10 border flex px-4 py-3 justify-between items-center cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Workflow className="size-4 text-emerald-400" />
                  <span className="font-medium text-sm leading-5 text-neutral-200">
                    Jira Integration
                  </span>
                </div>
                <ChevronRight className="size-4 text-[#a1a1a1]" />
              </div>

              {/* Storage Path Info */}
              <div className="rounded-2xl bg-[#111114] border border-white/10 flex flex-col p-4 gap-2">
                <span className="font-medium text-sm text-neutral-300">Secure Storage Path</span>
                <span
                  className="text-[10px] text-blue-400 font-mono select-all break-all"
                  title={storePath}
                >
                  {storePath || 'Resolving path...'}
                </span>
              </div>

              {/* Reset App data */}
              <div
                onClick={() => {
                  resetSettings()
                  showToast('Workspace settings reset to defaults')
                }}
                className="rounded-2xl bg-[#111114] border border-white/10 flex px-4 py-3 justify-between items-center cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="size-4 text-amber-400" />
                  <span className="font-medium text-sm leading-5 text-neutral-200">
                    Reset App Data
                  </span>
                </div>
                <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                  Reset
                </span>
              </div>

              {/* Delete Account (Danger Zone) */}
              <div
                onClick={() => showToast('Delete account requested (requires confirmation)')}
                className="rounded-2xl bg-[#1a1012] border-red-500/20 border flex px-4 py-3 justify-between items-center cursor-pointer hover:bg-red-950/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="size-4 text-red-400" />
                  <span className="font-medium text-red-300 text-sm leading-5">Delete Account</span>
                </div>
                <ChevronRight className="size-4 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Footer Versions */}
      <div className="border-t border-neutral-800 pt-6 mt-8 flex justify-center">
        <Versions />
      </div>

      {/* Floating Interactive Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-neutral-900 border border-white/10 shadow-2xl rounded-2xl px-6 py-3 text-sm text-neutral-200 z-50 flex items-center gap-2 animate-bounce">
          <Zap className="size-4 text-[oklch(0.488_0.243_264.376)] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
