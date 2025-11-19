"use client";

import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Predefined palette of colors (will cycle if more than colors.length sheets)
const colorPalette = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

export function SheetDataChartBar({ chartData }) {
  if (!chartData || chartData.length === 0) return null;

  // Dynamically generate sheetConfig from chartData
  const sheetConfig = chartData.reduce((acc, item, index) => {
    acc[item.sheetName] = {
      label: item.sheetName,
      color: colorPalette[index % colorPalette.length],
    };
    return acc;
  }, {});

  // Map chartData to include fill color
  const formattedData = chartData.map((item) => ({
    browser: item.sheetName,
    leads: item.rowCount,
    fill: sheetConfig[item.sheetName].color,
  }));

  return (
    <Card className="p-0 w-[300px] border-0 bg-transparent">
      <CardHeader className="pb-0">
        <CardTitle className="text-xs">Google Sheet Stat</CardTitle>
        <CardDescription className="text-xs">
          Number of encoded leads per sheet
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <ChartContainer config={sheetConfig}>
          <BarChart
            accessibilityLayer
            data={formattedData}
            layout="vertical"
            margin={{ left: 10, top: 20, right: 30 }}
            height={Math.max(200, chartData.length * 50)} // adaptive height
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={120}
              tickFormatter={(value) =>
                sheetConfig[value]?.label || value
              }
            />

            <XAxis dataKey="leads" type="number" hide />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar
              dataKey="leads"
              layout="vertical"
              radius={5}
              barSize={20}
              fill={({ browser }) => sheetConfig[browser].color}
            >
              {/* Add rowCount at the end of each bar */}
              <LabelList
                dataKey="leads"
                position="right"
                style={{ fill: "#fff", fontSize: 12, fontWeight: 500 }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
