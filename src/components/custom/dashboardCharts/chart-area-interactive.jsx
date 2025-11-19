"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive area chart";

const chartConfig = {
  approved: {
    label: "Approved And Encoded Leads",
    color: "var(--chart-4)",
  },
  fetched: {
    label: "Fetched Interested Leads",
    color: "var(--chart-3)",
  },
  appended: {
    label: "Appended Leads To CRM",
    color: "var(--chart-2)",
  },
  total_fetched: {
    label: "Total Fetched Leads",
    color: "var(--chart-1)",
  },
};

export function ChartAreaInteractive({ chartData }) {
  // Sort ascending so newest date is at the right
  const filteredData = React.useMemo(() => {
    return [...chartData].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [chartData]);

  return (
    <Card className="pt-0 bg-transparent border-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>InstaSheet</CardTitle>
          <CardDescription className={"text-xs"}>
            Showing leads and encodings over time
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full overflow-visible "
        >
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 40, left: 10, bottom: 20 }}
          >
            <defs>
              <linearGradient id="approved" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-4)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-4)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fetched" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="appended" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="total_fetched" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  // hour: "2-digit",
                  // minute: "2-digit",
                  hour12: true,
                });
              }}
            />
            <YAxis
              hide
              domain={[0, (dataMax) => dataMax + Math.max(dataMax * 0.1, 50)]}
            />

            <ChartTooltip
              className=""
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="approved"
              type="natural"
              fill="url(#approved)"
              stroke="var(--chart-4)"
            />
            <Area
              dataKey="fetched"
              type="natural"
              fill="url(#fetched)"
              stroke="var(--chart-3)"
            />
            <Area
              dataKey="appended"
              type="natural"
              fill="url(#appended)"
              stroke="var(--chart-2)"
            />
            <Area
              dataKey="total_fetched"
              type="natural"
              fill="url(#total_fetched)"
              stroke="var(--chart-1)"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
