/* eslint-disable */
import * as React from 'react'
import { Tooltip } from 'recharts'

export interface ChartConfig {
  [key: string]: {
    label?: React.ReactNode
    color?: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  children: React.ReactElement
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, className, children, ...props }, ref) => {
    const styles = React.useMemo(() => {
      const vars: Record<string, string> = {}
      Object.entries(config).forEach(([key, value]) => {
        if (value.color) {
          vars[`--color-${key}`] = value.color
        }
      })
      return vars
    }, [config])

    return (
      <div
        ref={ref}
        className={className}
        style={{ ...styles, ...props.style } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ChartContainer.displayName = 'ChartContainer'

// Custom tooltip renderer styled automatically with premium dark mode theme
export const ChartTooltipContent = ({ active, payload, label }: any): React.ReactNode => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[oklch(0.205_0_0)] border border-white/10 px-3 py-2 rounded-xl text-xs font-mono shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <p className="text-[#a1a1a1] font-semibold mb-1">{label}</p>
        {payload.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center gap-1.5 text-neutral-200 mt-0.5">
            <div
              className="size-2 rounded-full"
              style={{
                backgroundColor:
                  item.color || (item.payload && item.payload.fill) || 'var(--color-hours)'
              }}
            />
            <span className="capitalize">{item.name}:</span>
            <span className="font-bold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export const ChartTooltip = (props: any): React.ReactElement => {
  return (
    <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'oklch(1 0 0 / 4%)' }} {...props} />
  )
}
