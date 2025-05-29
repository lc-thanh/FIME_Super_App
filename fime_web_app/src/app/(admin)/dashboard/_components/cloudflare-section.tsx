import RequestsChart from "@/app/(admin)/dashboard/_components/requests-chart";
import { AnimatedNumberCard } from "@/components/animated-number-card";
import { StatisticApiRequests } from "@/requests/statistic.request";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";

export type HttpRequests1dGroup = {
  dimensions: {
    date: string;
  };
  sum: {
    requests: number;
  };
};

export type CloudflareData = {
  data: {
    viewer: {
      zones: {
        httpRequests1dGroups: Array<HttpRequests1dGroup>;
      }[];
    };
  };
};

export type ChartData = {
  date: string;
  requests: number;
  formattedDate: string;
};

export type Stats = {
  totalRequests: number;
  avgRequests: number;
  maxRequests: number;
  minRequests: number;
};

function getFirstDate(data: CloudflareData): string {
  const firstGroup = data.data.viewer.zones[0].httpRequests1dGroups[0];
  return firstGroup
    ? format(parseISO(firstGroup.dimensions.date), "dd/MM/yyyy", {
        locale: vi,
      })
    : "";
}

function getLastDate(data: CloudflareData): string {
  const lastGroup =
    data.data.viewer.zones[0].httpRequests1dGroups[
      data.data.viewer.zones[0].httpRequests1dGroups.length - 1
    ];
  return lastGroup
    ? format(parseISO(lastGroup.dimensions.date), "dd/MM/yyyy", {
        locale: vi,
      })
    : "";
}

// Hàm chuyển đổi dữ liệu cho biểu đồ
function transformCloudflareData(data: CloudflareData): ChartData[] {
  const httpRequestsData = data.data.viewer.zones[0].httpRequests1dGroups;

  return httpRequestsData.map((item: HttpRequests1dGroup) => ({
    date: item.dimensions.date,
    requests: item.sum.requests,
    formattedDate: format(parseISO(item.dimensions.date), "dd/MM", {
      locale: vi,
    }),
  }));
}

// Hàm tính toán thống kê
function calculateStats(data: ChartData[]): Stats {
  const totalRequests = data.reduce(
    (sum: number, item: ChartData) => sum + item.requests,
    0
  );
  const avgRequests = Math.round(totalRequests / data.length);
  const maxRequests = Math.max(...data.map((item: ChartData) => item.requests));
  const minRequests = Math.min(...data.map((item: ChartData) => item.requests));

  return { totalRequests, avgRequests, maxRequests, minRequests };
}

export async function CloudflareSection() {
  // Fetch Cloudflare data
  const { payload: cloudflareData } =
    await StatisticApiRequests.getCloudflareData();

  const chartData = transformCloudflareData(cloudflareData);
  const stats = calculateStats(chartData);

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedNumberCard
          label="Tổng Requests"
          number={stats.totalRequests}
          textColor="text-blue-500"
        />
        <AnimatedNumberCard
          label="Trung bình/ngày"
          number={stats.avgRequests}
          textColor="text-green-500"
        />
        <AnimatedNumberCard
          label="Cao nhất"
          number={stats.maxRequests}
          textColor="text-yellow-500"
        />
        <AnimatedNumberCard
          label="Thấp nhất"
          number={stats.minRequests}
          textColor="text-red-500"
        />
      </div>
      <RequestsChart
        chartData={chartData}
        stats={stats}
        dateFrom={getFirstDate(cloudflareData)}
        dateTo={getLastDate(cloudflareData)}
      />
    </div>
  );
}
