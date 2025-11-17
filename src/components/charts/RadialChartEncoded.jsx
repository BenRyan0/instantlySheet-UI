"use client";

import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A radial chart with stacked sections";

const chartData = [{offers: 11, partnership: 3,sba: 0,total: 14 }];

const chartConfig = {
   offers: {
    label: "Offer",
    color: "var(--chart-1)",
  },
  sba: {
    label: "SBA",
    color: "var(--chart-2)",
  },
  partnership: {
    label: "Partnership",
    color: "var(--chart-3)",
  }
};

const formatDate = (isoDate) => {
  if (!isoDate) return "No date available";
  
  const date = new Date(isoDate);
  
  // Format options, you can customize this
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  
  return date.toLocaleDateString(undefined, options); // e.g., "November 17, 2025"
};

export function RadialChartEncoded({chartData}) {
  return (
    <Card className="flex flex-col w-[300px] bg-transparent border-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>Date Interest Distribution</CardTitle>
        {/* <CardDescription className="text-xs">interested in offer, sba or partnership</CardDescription> */}
        <CardDescription>{formatDate(chartData[0].date)}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 items-center pb-0 ">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[180px] "
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {chartData[0].total}
                          {/* {totalVisitors.toLocaleString()} */}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Interested
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
           
            <RadialBar
              dataKey="offers"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-offers)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="sba"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-sba)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="partnership"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-partnership)"
              className="stroke-transparent stroke-2"
            />
             
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

     
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
