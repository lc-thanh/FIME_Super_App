"use client";

import type React from "react";

import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRangePicker } from "@/components/date-range-picker";

export default function TodoTimePicker({
  startDate,
  deadline,
  onUpdateTime,
}: {
  startDate: Date | null;
  deadline: Date | null;
  onUpdateTime: (startDate: Date | null, deadline: Date | null) => void;
}) {
  const initialDateRange = {
    from: startDate ? dayjs(startDate).toDate() : undefined,
    to: deadline ? dayjs(deadline).toDate() : undefined,
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="hover:bg-primary-foreground p-[9px] py-1 rounded-md cursor-pointer text-muted-foreground hover:text-primary">
          <CalendarIcon className="inline w-4 h-4 mb-[3px]" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <DateRangePicker
          value={initialDateRange}
          onChange={(date) => {
            onUpdateTime(date?.from || null, date?.to || null);
          }}
          placeholder="Chọn thời gian"
          isOverdue={dayjs().isAfter(deadline, "day")}
        />
      </PopoverContent>
    </Popover>
  );
}
