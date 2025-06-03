"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EventTooltip } from "@/app/(admin)/dashboard/schedule/_components/event-tooltip";
import {
  TaskPriorityType,
  TaskStatusType,
  TypeOfTaskType,
  UserTaskType,
} from "@/schemaValidations/task.schema";

// Define the Task type
export interface Event {
  id: string;
  taskId?: string;
  workspaceId: string;
  title: string;
  startDate: string;
  deadline: string;
  status: TaskStatusType;
  type: TypeOfTaskType;
  priority: TaskPriorityType;
  users: UserTaskType[];
}

interface EventCalendarProps {
  tasks: Event[];
  className?: string;
}

export function EventCalendar({ tasks, className }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

  // Get the last day of the month
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Get the number of days in the month
  const daysInMonth = lastDayOfMonth.getDate();

  // Calculate the number of rows needed for the calendar
  const rows = Math.ceil((daysInMonth + firstDayOfWeek) / 7);

  // Create an array of days for the calendar
  const calendarDays = Array.from({ length: rows * 7 }, (_, i) => {
    const day = i - firstDayOfWeek + 1;
    const date = new Date(currentYear, currentMonth, day);
    return {
      date,
      isCurrentMonth: day > 0 && day <= daysInMonth,
      isToday:
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear(),
    };
  });

  // Function to navigate to the previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Function to navigate to the next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Function to navigate to the current month
  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  // Function to format the month and year
  const formatMonthYear = (date: Date) => {
    return date
      .toLocaleDateString("vi-VN", { month: "long", year: "numeric" })
      .replace("tháng", "Tháng")
      .replace("năm", "/");
  };

  // Function to get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const startDate = new Date(task.startDate);
      const deadline = new Date(task.deadline);

      // Check if the date is between startDate and deadline (inclusive)
      return (
        date >= new Date(startDate.setHours(0, 0, 0, 0)) &&
        date <= new Date(deadline.setHours(23, 59, 59, 999))
      );
    });
  };

  // Days of the week
  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{formatMonthYear(currentDate)}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToCurrentMonth}>
            Hôm nay
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center font-medium py-2 border-b">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={cn(
              "min-h-[100px] p-1 border rounded-md overflow-hidden",
              day.isCurrentMonth
                ? "bg-background"
                : "bg-muted/30 text-muted-foreground",
              day.isToday && "border-fimeYellow border-2"
            )}
          >
            <div className="flex justify-between items-center mb-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  day.isToday &&
                    "bg-gradient-to-br from-fimeOrange from-30% to-fimeYellow to-90% text-white rounded-full w-5 h-5 flex items-center justify-center"
                )}
              >
                {day.isCurrentMonth ? day.date.getDate() : ""}
              </span>
            </div>

            <div className="space-y-1 overflow-y-auto max-h-[96px]">
              {day.isCurrentMonth &&
                getTasksForDate(day.date).map((task) => (
                  <EventTooltip key={task.id} task={task} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
