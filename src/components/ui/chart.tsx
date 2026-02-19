"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { TooltipProps } from "recharts"

import { cn } from "@/lib/utils"

type TooltipPayload = {
  dataKey?: string | number
  name?: string
  value?: number | string | Array<number | string>
  payload?: Record<string, unknown>
  color?: string
}

const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn("flex aspect-video justify-center text-xs", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof THEMES] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

export const ChartTooltip = RechartsPrimitive.Tooltip

export function ChartTooltipContent({
  active,
  payload,
  className,
}: TooltipProps<number, string> & {
  className?: string
} & {
  payload?: TooltipPayload[]
}) {
  if (!active || !payload?.length) return null

  return (
    <div className={cn("bg-white p-2 rounded shadow text-xs", className)}>
      {payload.map((item: TooltipPayload, index: number) => (
        <div key={index} className="flex justify-between gap-4">
          <span>{item.name}</span>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export const ChartLegend = RechartsPrimitive.Legend

export function ChartLegendContent(
  props: RechartsPrimitive.LegendProps & { payload?: RechartsPrimitive.LegendPayload[] }
) {
  const payload = props.payload as RechartsPrimitive.LegendPayload[] | undefined
  if (!payload?.length) return null

  return (
    <div className="flex gap-4 text-xs">
      {payload.map((item: RechartsPrimitive.LegendPayload, i: number) => (
        <div key={i} className="flex items-center gap-1">
          <div
            className="h-2 w-2 rounded"
            style={{ backgroundColor: item.color }}
          />
          {item.value}
        </div>
      ))}
    </div>
  )
}
