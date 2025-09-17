"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const colors = [
  "#00FF94",
  "#33CCFF",
  "#FFCC00",
  "#9933FF",
  "#FF00FF",
  "#E1712B",
  "#3384FF",
  "#FF5161",
]

export function StackedArea({
  className,
  chartData,
}: {
  className?: string
  chartData: { [label: string]: string | number }[]
}) {
  const params = Object.keys(chartData.at(0) ?? {}).filter(
    (data) => data !== "xAxis"
  )
  return (
    <div
      className={cn(
        "bg-[#1F2021]/50 border-white border rounded-lg p-3",
        className
      )}
    >
      <ChartContainer
        className="aspect-[3/1] max-md:aspect-[2/1]"
        config={params.reduce((prev, cur) => {
          prev[cur] = { label: cur }
          return prev
        }, {} as ChartConfig)}
      >
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="xAxis"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value}
          />
          <YAxis />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          {params.map((param, i) => (
            <Area
              dataKey={param}
              fill={colors[i]}
              fillOpacity={0.4}
              stroke={colors[i]}
              stackId="a"
            />
          ))}
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
