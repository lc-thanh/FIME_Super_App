import Schedule from "@/app/(admin)/dashboard/schedule/_components/schedule";
import { FimeTitle } from "@/components/fime-title";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { scheduleQueryOptions } from "@/queries/task-query";

export default function SchedulePage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(scheduleQueryOptions());

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <FimeTitle>
        <h1 className="text-3xl font-bold leading-tight mb-2">
          Lịch Làm Việc FIME
        </h1>
      </FimeTitle>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Schedule />
      </HydrationBoundary>
    </div>
  );
}
