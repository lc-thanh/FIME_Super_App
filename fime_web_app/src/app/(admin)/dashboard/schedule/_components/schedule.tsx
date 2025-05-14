"use client";

import { EventCalendar } from "@/app/(admin)/dashboard/schedule/_components/event-calendar";
import { scheduleQueryOptions } from "@/queries/task-query";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function Schedule() {
  const { data: schedule } = useSuspenseQuery(scheduleQueryOptions());

  return (
    <div className="w-full container mx-auto mb-4">
      <EventCalendar tasks={schedule} />
    </div>
  );
}
