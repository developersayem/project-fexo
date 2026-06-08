import React from 'react'
import { ChevronLeft, ChevronRight, CheckSquare, Zap, FileText, Clock3 } from 'lucide-react'

interface ActivityItem {
  title: string
  category: string
  timeString: string
  type: 'Done' | 'Focus'
  iconType: 'CheckSquare' | 'Timer' | 'FileText'
}

const MOCK_ACTIVITIES_BY_DAY: Record<number, ActivityItem[]> = {
  3: [
    {
      title: 'Deep Work Session',
      category: 'Deep Work',
      timeString: '1h 45m',
      type: 'Focus',
      iconType: 'Timer'
    }
  ],
  4: [
    {
      title: 'Configure CI/CD cache',
      category: 'DevOps',
      timeString: '2h 10m',
      type: 'Done',
      iconType: 'CheckSquare'
    }
  ],
  5: [
    {
      title: 'Fix Auth middleware bug',
      category: 'Backend',
      timeString: '1h 05m',
      type: 'Done',
      iconType: 'CheckSquare'
    }
  ],
  6: [
    {
      title: 'Focus Sprint',
      category: 'Deep Work',
      timeString: '3h 15m',
      type: 'Focus',
      iconType: 'Timer'
    }
  ],
  9: [
    {
      title: 'Refactor state store',
      category: 'Frontend',
      timeString: '1h 50m',
      type: 'Done',
      iconType: 'CheckSquare'
    }
  ],
  10: [
    {
      title: 'Setup Test suites',
      category: 'Testing',
      timeString: '2h 15m',
      type: 'Done',
      iconType: 'CheckSquare'
    }
  ],
  11: [
    {
      title: 'Research OAuth',
      category: 'Backend',
      timeString: '1h 30m',
      type: 'Focus',
      iconType: 'Timer'
    }
  ],
  12: [
    {
      title: 'Optimize loading performance',
      category: 'Performance',
      timeString: '3h 00m',
      type: 'Done',
      iconType: 'CheckSquare'
    }
  ],
  15: [
    {
      title: 'Design System Sync',
      category: 'Design',
      timeString: '2h 00m',
      type: 'Focus',
      iconType: 'Timer'
    }
  ],
  16: [
    {
      title: 'Update API Endpoints',
      category: 'Backend',
      timeString: '1h 20m',
      type: 'Done',
      iconType: 'CheckSquare'
    }
  ],
  17: [
    {
      title: 'Review CSS styles layout',
      category: 'Styling',
      timeString: '45m',
      type: 'Done',
      iconType: 'CheckSquare'
    }
  ],
  18: [
    {
      title: 'Drafting documentation',
      category: 'Docs',
      timeString: '1h 45m',
      type: 'Focus',
      iconType: 'Timer'
    }
  ],
  19: [
    {
      title: 'Deploy staging cluster',
      category: 'DevOps',
      timeString: '2h 30m',
      type: 'Done',
      iconType: 'CheckSquare'
    }
  ],
  22: [
    {
      title: 'Fix CSS button alignments',
      category: 'Frontend',
      timeString: '50m',
      type: 'Done',
      iconType: 'CheckSquare'
    }
  ],
  23: [
    {
      title: 'Focus Session',
      category: 'Deep Work',
      timeString: '3h 20m',
      type: 'Focus',
      iconType: 'Timer'
    }
  ],
  24: [
    {
      title: 'Fix Auth Bug',
      category: 'Backend',
      timeString: '1h 23m',
      type: 'Done',
      iconType: 'CheckSquare'
    },
    {
      title: 'Focus Session',
      category: 'Deep Work',
      timeString: '2h 14m',
      type: 'Focus',
      iconType: 'Timer'
    },
    {
      title: 'Update API Docs',
      category: 'Docs',
      timeString: '45m',
      type: 'Done',
      iconType: 'FileText'
    }
  ],
  25: [
    {
      title: 'Setup DB Schema',
      category: 'Database',
      timeString: '2h 00m',
      type: 'Done',
      iconType: 'CheckSquare'
    },
    {
      title: 'Focus Session',
      category: 'Design System',
      timeString: '1h 30m',
      type: 'Focus',
      iconType: 'Timer'
    }
  ],
  26: [
    {
      title: 'Code Refactoring Session',
      category: 'Refactoring',
      timeString: '2h 15m',
      type: 'Focus',
      iconType: 'Timer'
    }
  ],
  29: [
    {
      title: 'Bug triage session',
      category: 'Testing',
      timeString: '1h 10m',
      type: 'Done',
      iconType: 'CheckSquare'
    }
  ],
  30: [
    {
      title: 'End-of-month review',
      category: 'Planning',
      timeString: '1h 30m',
      type: 'Focus',
      iconType: 'Timer'
    }
  ]
}

const HEATMAP_GRID = [
  [2, 0, 1, 3, 2, 0, 4], // Col 1
  [1, 4, 2, 0, 3, 1, 0], // Col 2
  [0, 2, 5, 3, 1, 4, 2], // Col 3
  [3, 0, 2, 4, 1, 0, 3], // Col 4
  [1, 3, 0, 2, 5, 2, 1], // Col 5
  [2, 4, 1, 0, 3, 4, 0], // Col 6
  [0, 1, 3, 2, 0, 1, 4], // Col 7
  [3, 2, 0, 4, 2, 3, 1], // Col 8
  [1, 0, 2, 1, 5, 0, 3], // Col 9
  [4, 2, 3, 0, 1, 4, 2], // Col 10
  [2, 5, 1, 3, 2, 0, 3], // Col 11
  [1, 3, 0, 2, 4, 1, 2] // Col 12
]

const taskDays = new Set([3, 5, 9, 10, 12, 13, 16, 19, 22, 25, 29, 31])
const focusDays = new Set([4, 6, 11, 15, 18, 23, 26, 30])

interface CalendarHeaderProps {
  currentMonth: string
  onMonthToggle: (dir: 'next' | 'prev') => void
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentMonth, onMonthToggle }) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-neutral-50 text-2xl leading-8 tracking-tight">Calendar</h1>
        <p className="text-[#a1a1a1] text-sm leading-5 mt-1">{currentMonth}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onMonthToggle('prev')}
          className="size-11 rounded-xl bg-neutral-900 text-[#a1a1a1] border-white/10 border-1 border-solid flex justify-center items-center hover:bg-neutral-800 cursor-pointer"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          onClick={() => onMonthToggle('next')}
          className="size-11 rounded-xl bg-neutral-900 text-[#a1a1a1] border-white/10 border-1 border-solid flex justify-center items-center hover:bg-neutral-800 cursor-pointer"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

interface CalendarContentProps {
  selectedDay: number
  setSelectedDay: (day: number) => void
}

export const CalendarContent: React.FC<CalendarContentProps> = ({
  selectedDay,
  setSelectedDay
}) => {
  const juneDays = Array.from({ length: 31 }, (_, i) => i + 1)
  const julyDays = Array.from({ length: 4 }, (_, i) => i + 1)

  const selectedActivities = MOCK_ACTIVITIES_BY_DAY[selectedDay] || []

  const getHeatmapClass = (level: number): string => {
    switch (level) {
      case 0:
        return 'bg-[oklch(0.488_0.243_264.376/0.12)]'
      case 1:
        return 'bg-[oklch(0.488_0.243_264.376/0.18)]'
      case 2:
        return 'bg-[oklch(0.488_0.243_264.376/0.28)]'
      case 3:
        return 'bg-[oklch(0.488_0.243_264.376/0.42)]'
      case 4:
        return 'bg-[oklch(0.488_0.243_264.376/0.62)]'
      case 5:
        return 'bg-[oklch(0.488_0.243_264.376/0.82)]'
      case 6:
        return 'bg-[oklch(0.488_0.243_264.376)]'
      default:
        return 'bg-[oklch(0.488_0.243_264.376/0.12)]'
    }
  }

  return (
    <div className="overflow-y-auto p-8 flex-1 flex flex-col gap-6">
      {/* Calendar Grid Card */}
      <div className="shadow-sm rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex p-6 flex-col gap-6">
        <div className="grid grid-cols-7 font-medium text-[#a1a1a1] text-xs leading-4 gap-3">
          <div className="text-center">S</div>
          <div className="text-center">M</div>
          <div className="text-center">T</div>
          <div className="text-center">W</div>
          <div className="text-center">T</div>
          <div className="text-center">F</div>
          <div className="text-center">S</div>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {juneDays.map((day) => {
            const isSelected = day === selectedDay
            const hasTask = taskDays.has(day)
            const hasFocus = focusDays.has(day)

            if (isSelected) {
              return (
                <div
                  key={`june-${day}`}
                  onClick={() => setSelectedDay(day)}
                  className="aspect-square bg-[oklch(0.488_0.243_264.376)] shadow-lg shadow-primary/20 font-semibold rounded-full text-neutral-900 text-sm leading-5 flex p-2 flex-col justify-between items-center cursor-pointer"
                >
                  <span>{day}</span>
                  <span className="size-1.5 rounded-full bg-neutral-900/90" />
                </div>
              )
            }

            return (
              <div
                key={`june-${day}`}
                onClick={() => setSelectedDay(day)}
                className="aspect-square rounded-xl hover:bg-neutral-800/40 text-[#a1a1a1]/50 text-sm leading-5 flex p-2 flex-col justify-between items-center cursor-pointer"
              >
                <span>{day}</span>
                {hasTask ? (
                  <span className="size-1.5 bg-[oklch(0.488_0.243_264.376)] rounded-full" />
                ) : hasFocus ? (
                  <span className="size-1.5 bg-[oklch(0.696_0.17_162.48)] rounded-full" />
                ) : (
                  <span className="size-1.5 bg-transparent rounded-full" />
                )}
              </div>
            )
          })}

          {julyDays.map((day) => (
            <div
              key={`july-${day}`}
              className="aspect-square rounded-xl text-[#a1a1a1]/30 text-sm leading-5 flex p-2 flex-col justify-between items-center"
            >
              <span>{day}</span>
              <span className="size-1.5 bg-transparent rounded-full" />
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="text-[#a1a1a1] text-xs leading-4 border-white/10 border-t-1 border-r-0 border-b-0 border-l-0 border-solid flex pt-2 justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="size-2 bg-[oklch(0.488_0.243_264.376)] rounded-full" />
              Tasks
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 bg-[oklch(0.696_0.17_162.48)] rounded-full" />
              Focus
            </div>
          </div>
          <div>June overview</div>
        </div>
      </div>

      {/* Selected Day Activity Cards */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl leading-7 text-neutral-100">{"Today's Activity"}</h2>
          <span className="text-[#a1a1a1] text-sm leading-5">Jun {selectedDay}</span>
        </div>

        {selectedActivities.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {selectedActivities.map((act, idx) => {
              const isDone = act.type === 'Done'
              const bgBadgeClass = isDone
                ? 'bg-[oklch(0.696_0.17_162.48)/0.15] text-[oklch(0.696_0.17_162.48)]'
                : 'bg-[oklch(0.488_0.243_264.376)/0.15] text-[oklch(0.488_0.243_264.376)]'
              const iconColor = isDone
                ? 'text-[oklch(0.696_0.17_162.48)]'
                : 'text-[oklch(0.488_0.243_264.376)]'

              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-neutral-900 border-white/10 border border-solid flex p-4 flex-col gap-3"
                >
                  <div className="flex justify-between items-center">
                    <div
                      className={`size-10 ${iconColor} rounded-xl bg-neutral-800 flex justify-center items-center`}
                    >
                      {act.iconType === 'CheckSquare' ? (
                        <CheckSquare className="size-4" />
                      ) : act.iconType === 'FileText' ? (
                        <FileText className="size-4" />
                      ) : (
                        <Zap className="size-4" />
                      )}
                    </div>
                    <span className={`rounded-full text-xs leading-4 px-2.5 py-1 ${bgBadgeClass}`}>
                      {act.type}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="font-medium text-neutral-100">{act.title}</div>
                    <div className="text-[#a1a1a1] text-sm leading-5">
                      {act.category} · {act.timeString}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-800 p-8 text-center text-sm text-neutral-500">
            No logged tasks or focus activities for June {selectedDay}.
          </div>
        )}
      </div>

      {/* Heatmap Card */}
      <div className="shadow-sm rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex p-6 flex-col gap-5">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-xl leading-7 text-neutral-100">
              Productivity Heatmap
            </h2>
            <p className="text-[#a1a1a1] text-sm leading-5">Last 12 weeks</p>
          </div>
          <span className="text-[#a1a1a1] text-sm leading-5">142 contributions</span>
        </div>

        <div className="flex gap-4">
          <div className="text-[#a1a1a1] text-xs leading-4 flex py-1 flex-col justify-between h-32">
            <span>M</span>
            <span>W</span>
            <span>F</span>
          </div>
          <div className="flex flex-col flex-1 gap-3">
            <div className="text-[#a1a1a1] text-xs leading-4 flex px-1 justify-between">
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
            <div className="grid grid-cols-12 gap-1.5">
              {HEATMAP_GRID.map((col, cIdx) => (
                <div key={cIdx} className="grid gap-1.5">
                  {col.map((val, rIdx) => (
                    <div key={rIdx} className={`size-4 ${getHeatmapClass(val)} rounded-sm`} />
                  ))}
                </div>
              ))}
            </div>
            <div className="text-[#a1a1a1] text-xs leading-4 flex pt-1 justify-between items-center">
              <div className="flex items-center gap-2">
                <span>Less</span>
                <div className="flex items-center gap-1">
                  <span className="size-3 bg-[oklch(0.488_0.243_264.376/0.12)] rounded-sm" />
                  <span className="size-3 bg-[oklch(0.488_0.243_264.376/0.28)] rounded-sm" />
                  <span className="size-3 bg-[oklch(0.488_0.243_264.376/0.62)] rounded-sm" />
                  <span className="size-3 bg-[oklch(0.488_0.243_264.376)] rounded-sm" />
                </div>
                <span>More</span>
              </div>
              <span>142 contributions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const CalendarSidebar: React.FC = () => {
  return (
    <div className="min-h-screen bg-[oklch(0.205_0_0)] border-[oklch(1_0_0/10%)] flex-shrink-0 border-t-0 border-r-0 border-b-0 border-l border-solid flex p-6 flex-col gap-6 w-75">
      {/* Focus Sessions Tracker */}
      <div className="shadow-sm rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex p-6 flex-col gap-5">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-neutral-100 text-lg leading-7">
              Focus Sessions This Week
            </h3>
            <p className="text-[#a1a1a1] text-sm leading-5">Daily progress</p>
          </div>
          <Zap className="size-5 text-[oklch(0.488_0.243_264.376)]" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-sm leading-5 flex justify-between items-center text-neutral-200">
              <span>Mon</span>
              <span className="text-[#a1a1a1]">3h 20m</span>
            </div>
            <div className="rounded-full bg-neutral-800 h-2 overflow-hidden">
              <div className="w-[72%] bg-[linear-gradient(90deg,oklch(0.488_0.243_264.376),oklch(0.627_0.265_303.9))] rounded-full h-full" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm leading-5 flex justify-between items-center text-neutral-200">
              <span>Tue</span>
              <span className="text-[#a1a1a1]">2h 14m</span>
            </div>
            <div className="rounded-full bg-neutral-800 h-2 overflow-hidden">
              <div className="w-[48%] bg-[linear-gradient(90deg,oklch(0.627_0.265_303.9),oklch(0.488_0.243_264.376))] rounded-full h-full" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-sm leading-5 flex justify-between items-center text-neutral-200">
              <span>Wed</span>
              <span className="text-[#a1a1a1]">4h 05m</span>
            </div>
            <div className="rounded-full bg-neutral-800 h-2 overflow-hidden">
              <div className="w-[88%] bg-[linear-gradient(90deg,oklch(0.488_0.243_264.376),oklch(0.627_0.265_303.9))] rounded-full h-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Tasks checklist */}
      <div className="shadow-sm rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex p-6 flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-neutral-100 text-lg leading-7">Upcoming Tasks</h3>
            <p className="text-[#a1a1a1] text-sm leading-5">Next scheduled work</p>
          </div>
          <Clock3 className="size-5 text-[#a1a1a1]" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-xl bg-neutral-800/40 border-white/10 border-1 border-solid flex p-3 items-center gap-2">
            <div className="bg-[oklch(0.704_0.191_22.216)] rounded-full self-stretch w-1.5" />
            <div className="flex flex-col flex-1 gap-1">
              <div className="flex justify-between items-center gap-3">
                <span className="font-medium text-neutral-100 text-sm leading-5">
                  Refactor DB Schema
                </span>
                <span className="text-[#a1a1a1] text-xs leading-4">Today</span>
              </div>
              <div className="text-[#a1a1a1] text-xs leading-4">Backend · Critical</div>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-800/40 border-white/10 border-1 border-solid flex p-3 items-center gap-2">
            <div className="bg-[oklch(0.769_0.188_70.08)] rounded-full self-stretch w-1.5" />
            <div className="flex flex-col flex-1 gap-1">
              <div className="flex justify-between items-center gap-3">
                <span className="font-medium text-neutral-100 text-sm leading-5">
                  Design Review
                </span>
                <span className="text-[#a1a1a1] text-xs leading-4">Tomorrow</span>
              </div>
              <div className="text-[#a1a1a1] text-xs leading-4">UI · High</div>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-800/40 border-white/10 border-1 border-solid flex p-3 items-center gap-2">
            <div className="bg-[oklch(0.696_0.17_162.48)] rounded-full self-stretch w-1.5" />
            <div className="flex flex-col flex-1 gap-1">
              <div className="flex justify-between items-center gap-3">
                <span className="font-medium text-neutral-100 text-sm leading-5">
                  Ship Release Notes
                </span>
                <span className="text-[#a1a1a1] text-xs leading-4">Fri</span>
              </div>
              <div className="text-[#a1a1a1] text-xs leading-4">Docs · Medium</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
