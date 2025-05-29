import { AnimatedNumberCard } from "@/components/animated-number-card";
import { StatisticApiRequests } from "@/requests/statistic.request";

export async function TaskStatistics() {
  const { payload } = await StatisticApiRequests.getTaskStatistics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AnimatedNumberCard
        label="Tổng số Task"
        number={payload.totalTasks}
        textColor="text-blue-500"
      />
      <AnimatedNumberCard
        label="Đã hoàn thành"
        number={payload.totalCompletedTasks}
        textColor="text-green-500"
      />
      <AnimatedNumberCard
        label="Ưu tiên cao"
        number={payload.totalHighPriorityTasks}
        textColor="text-yellow-500"
      />
      <AnimatedNumberCard
        label="Quá hạn"
        number={payload.totalOverdueTasks}
        textColor="text-red-500"
      />
    </div>
  );
}
