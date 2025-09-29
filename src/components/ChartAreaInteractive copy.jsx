"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  //   ChartConfig,
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

// Chart will be fed by socket.io events

const chartConfig = {
  totalEmailsCollected: {
    label: "Total Emails Collected",
    color: "var(--chart-1)",
  },
  interestedLeadCount: {
    label: "Interested Lead Count",
    color: "var(--chart-2)",
  },
};

import io from "socket.io-client";
import { socket } from "../utils/utils";

export function ChartAreaInteractive() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  useEffect(() => {
    socket.on("progress", (progress) => {
      console.log(progress);
      console.log("progress");
    });
  }, []);
  useEffect(() => {
    // Connect to your socket.io server (adjust URL as needed)
    socket.on("progress", (progress) => {
      console.log("ASdasdasd");
      setChartData((prev) => {
        // Prevent duplicate percentComplete
        if (
          prev.length > 0 &&
          prev[prev.length - 1].percentComplete === progress.percentComplete
        ) {
          return prev;
        }
        return [
          ...prev,
          {
            percentComplete: progress.percentComplete,
            totalEmailsCollected: progress.totalEmailsCollected,
            interestedLeadCount: progress.interestedLeadCount,
          },
        ];
      });
      setLoading(false);
    });
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // Optionally, you can clear chartData when a new process starts

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Progress Loader Chart</CardTitle>
          <CardDescription>
            Live progress: percent complete, total emails collected, interested
            leads
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-[250px] w-full text-lg text-muted-foreground">
            Waiting for progress...
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="fillTotalEmails"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillInterestedLeads"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="percentComplete"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
                domain={[0, 100]}
                type="number"
                tickFormatter={(value) => `${value}%`}
                label={{
                  value: "Percent Complete",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `${value}% Complete`}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="interestedLeadCount"
                type="natural"
                fill="url(#fillInterestedLeads)"
                stroke="var(--color-mobile)"
                stackId="a"
                name="Interested Leads"
              />
              <Area
                dataKey="totalEmailsCollected"
                type="natural"
                fill="url(#fillTotalEmails)"
                stroke="var(--color-desktop)"
                stackId="a"
                name="Total Emails Collected"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
