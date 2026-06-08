import React from 'react'
import {
  Clock,
  CheckSquare,
  Timer,
  PieChart as LucidePieChart,
  Zap,
  Lightbulb,
  ListChecks,
  Flame,
  Check
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { ChartContainer, ChartTooltip } from '../components/ui/chart'
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

interface AnalyticsHeaderProps {
  analyticsFilter: 'Week' | 'Month' | 'Year'
  setAnalyticsFilter: (filter: 'Week' | 'Month' | 'Year') => void
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  analyticsFilter,
  setAnalyticsFilter
}) => {
  return (
    <div className="flex justify-between items-center w-full">
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
    </div>
  )
}

export const AnalyticsContent: React.FC = () => {
  return (
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
            <div className="font-semibold text-neutral-50 text-base leading-6">Daily Hours</div>
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
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" vertical={false} />
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
                <Bar dataKey="hours" fill="oklch(0.488 0.243 264.376)" radius={[4, 4, 0, 0]} />
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
                    <stop offset="5%" stopColor="oklch(0.488 0.243 264.376)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="oklch(0.488 0.243 264.376)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" vertical={false} />
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
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" vertical={false} />
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
              <Bar dataKey="duration" fill="oklch(0.488 0.243 264.376)" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export const AnalyticsSidebar: React.FC = () => {
  return (
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
              <span className="font-medium text-neutral-50">9–11 AM</span>. Schedule complex tasks
              during this time.
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
              You complete <span className="font-medium text-neutral-50">40% more tasks</span> on
              days with a morning focus session.
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
              <div className="text-[#a1a1a1] text-xs leading-4 font-normal">Backend · 3h 20m</div>
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
              <div className="text-[#a1a1a1] text-xs leading-4 font-normal">Backend · 2h 45m</div>
            </div>
            <div className="text-[oklch(0.769_0.188_70.08)] font-medium text-xs leading-4">
              Active
            </div>
          </div>
          <div className="border-white/10 border-t-0 border-r-0 border-b border-l-0 border-solid flex py-2 items-start gap-2">
            <div className="bg-[oklch(0.488_0.243_264.376)] shrink-0 rounded-full mt-1.5 w-1.5 h-1.5" />
            <div className="flex-1">
              <div className="font-medium text-neutral-50 text-xs leading-4">Update API Docs</div>
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
              <div className="text-[#a1a1a1] text-xs leading-4 font-normal">Frontend · 2h 10m</div>
            </div>
            <div className="text-[oklch(0.696_0.17_162.48)] font-medium text-xs leading-4">
              Done
            </div>
          </div>
          <div className="flex py-2 items-start gap-2">
            <div className="bg-[oklch(0.488_0.243_264.376)] shrink-0 rounded-full mt-1.5 w-1.5 h-1.5" />
            <div className="flex-1">
              <div className="font-medium text-neutral-50 text-xs leading-4">Write Unit Tests</div>
              <div className="text-[#a1a1a1] text-xs leading-4 font-normal">Testing · 1h 30m</div>
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
              <span className="font-semibold text-neutral-50 text-sm leading-5">Focus Streak</span>
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
              Best streak: <span className="font-medium text-neutral-50">21 days</span>. Keep it up!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
