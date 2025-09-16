"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import { cn } from "@/lib/utils"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const colors = ["#2AA63E", "#FE9A37", "#E1712B", "#FB2C36"]

export function Donut({
  className,
  chartData,
  data,
  label,
}: {
  className?: string
  chartData: { label: string; value: number }[]
  data: string
  label: string
}) {
  return (
    <div
      className={cn(
        "bg-[#1F2021]/50 border-white border rounded-lg",
        className
      )}
    >
      <ChartContainer
        config={chartData.reduce((prev, cur) => {
          prev[cur.label] = { label: cur.label }
          return prev
        }, {} as ChartConfig)}
        className="mx-auto aspect-square max-h-[300px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData.map((data, i) => {
              return { ...data, fill: colors[i] }
            })}
            dataKey="value"
            nameKey="label"
            innerRadius={80}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="text-2xl font-bold fill-white"
                      >
                        {data}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        {label}
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  )
}
