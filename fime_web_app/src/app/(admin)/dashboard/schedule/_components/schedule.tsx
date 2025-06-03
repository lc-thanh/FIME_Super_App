"use client";

import { EventCalendar } from "@/app/(admin)/dashboard/schedule/_components/event-calendar";
import ScheduleNotifications from "@/app/(admin)/dashboard/schedule/_components/schedule-notifications";
import { FimeTitle } from "@/components/fime-title";
import { scheduleQueryOptions } from "@/queries/task-query";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function Schedule() {
  const { data: schedule } = useSuspenseQuery(scheduleQueryOptions());

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-2">
      <FimeTitle>
        <h1 className="text-3xl font-bold leading-tight">Lịch Làm Việc FIME</h1>
      </FimeTitle>
      {/* <div className="text-center mb-2">
        <FimeTitle className="text-3xl font-bold mb-2 leading-tight">
          Thông Báo Lịch Làm Việc
        </FimeTitle>
        <p className="text-gray-600">
          Theo dõi các công việc quan trọng và sắp hết hạn
        </p>
      </div> */}
      <ScheduleNotifications tasks={schedule} />

      <EventCalendar tasks={schedule} />
    </div>
  );
}
