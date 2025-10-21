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

// const chartData = [
//   {
//     id: 9,
//     total_processed: 9,
//     pages_fetched: 10,
//     processed_leads: 30,
//     distinct_leads_checked: 30,
//     interested_lead_count: 9,
//     stopped_early: false,
//     max_emails_cap: 10,
//     max_pages_cap: 10,
//     ai_interest_threshold: 1,
//     total_encoded: 1,
//     created_at: "2025-10-03T13:16:40.837Z",
//   },
//   {
//     id: 8,
//     total_processed: 4,
//     pages_fetched: 1,
//     processed_leads: 4,
//     distinct_leads_checked: 4,
//     interested_lead_count: 4,
//     stopped_early: false,
//     max_emails_cap: 4,
//     max_pages_cap: 3,
//     ai_interest_threshold: 1,
//     total_encoded: 0,
//     created_at: "2025-10-02T21:14:14.158Z",
//   },
//   {
//     id: 7,
//     total_processed: 0,
//     pages_fetched: 3,
//     processed_leads: 30,
//     distinct_leads_checked: 130,
//     interested_lead_count: 0,
//     stopped_early: false,
//     max_emails_cap: 5,
//     max_pages_cap: 3,
//     ai_interest_threshold: 1,
//     total_encoded: 0,
//     created_at: "2025-10-02T21:10:59.745Z",
//   },
//   // ... other entries
// ];

const chartConfig = {
  distinct_leads_checked: {
    label: "Distinct Leads Checked",
    color: "var(--chart-1)",
  },
  total_encoded: {
    label: "Total Encoded",
    color: "var(--chart-2)",
  },
  interested_lead_count: {
    label: "Interested Leads",
    color: "var(--chart-3)",
  },
  total_tobe_encoded: {
    label: "To be encoded Leads",
    color: "var(--chart-3)",
  },
  total_tobe_approved: {
    label: "Total to be approved leads",
    color: "var(--chart-4)",
  },
};

export function ChartAreaInteractive({ chartData }) {
  const [timeRange, setTimeRange] = React.useState("90d");

  // ✅ Sort ascending so newest date is at the right
  const filteredData = React.useMemo(() => {
    return [...chartData].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  }, [chartData]);

 

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>InstaSheet</CardTitle>
          <CardDescription className={"text-xs"}>
            Showing leads and encodings over time
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient
                id="fillProcessedLeads"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
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
              <linearGradient id="fillTotalEncoded" x1="0" y1="0" x2="0" y2="1">
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
              <linearGradient
                id="fillInterestedLeads"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
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
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="created_at"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });
              }}
            />
            <YAxis hide domain={[0, (dataMax) => dataMax * 1.1]} />
            <ChartTooltip
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
              dataKey="distinct_leads_checked"
              type="natural"
              fill="url(#fillProcessedLeads)"
              stroke="var(--chart-1)"
            />
            <Area
              dataKey="total_encoded"
              type="natural"
              fill="url(#fillTotalEncoded)"
              stroke="var(--chart-2)"
            />
            <Area
              dataKey="interested_lead_count"
              type="natural"
              fill="url(#fillInterestedLeads)"
              stroke="var(--chart-3)"
            />
             <Area
              dataKey="total_tobe_approved"
              type="natural"
              fill="url(#fillProcessedLeads)"
              stroke="var(--chart-4)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
