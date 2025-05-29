"use client";

import { XAxis, CartesianGrid, Area, AreaChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TrendingDown, TrendingUp } from "lucide-react";
import {
  ChartData,
  Stats,
} from "@/app/(admin)/dashboard/_components/cloudflare-section";

const chartConfig = {
  requests: {
    label: "Requests",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const compareYesterdayToAvg = (stats: Stats, yesterdayRequests: number) => {
  const yesterday = yesterdayRequests;
  const avg = stats.avgRequests ?? 1;
  const diff = ((yesterday - avg) / avg) * 100;
  const sign = diff > 0 ? "+" : "";
  return (
    <>
      Lượng Request hôm qua: {yesterday.toLocaleString()} Requests (
      <span className={diff >= 0 ? "text-green-600" : "text-red-600"}>
        {sign}
        {diff.toFixed(1)}%
      </span>
      )
      {diff >= 0 ? (
        <TrendingUp className="inline h-4 w-4" />
      ) : (
        <TrendingDown className="inline h-4 w-4" />
      )}
    </>
  );
};

export default function RequestsChart({
  chartData = [],
  stats,
  dateFrom,
  dateTo,
}: {
  chartData?: ChartData[];
  stats: Stats;
  dateFrom?: string;
  dateTo?: string;
}) {
  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lượng Request Hàng Ngày</CardTitle>
        <CardDescription>
          Dữ liệu từ Cloudflare API - 30 ngày gần nhất ({dateFrom} - {dateTo})
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full overflow-x-auto">
        <ChartContainer config={chartConfig} className="h-[360px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="formattedDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="requestsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-requests)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-requests)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="requests"
              type="linear"
              fill="url(#requestsGradient)"
              fillOpacity={0.4}
              stroke="var(--color-requests)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {compareYesterdayToAvg(
                stats,
                chartData[chartData.length - 1].requests
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              So sánh với trung bình 30 ngày
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
