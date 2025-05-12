"use client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { vi } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  className?: string;
  value: DateRange | undefined;
  onChange: (date: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  isOverdue?: boolean;
}

export function DateRangePicker({
  className,
  value,
  onChange,
  placeholder = "Chọn khoảng thời gian",
  disabled = false,
  isOverdue = false,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full border-2 justify-start text-left font-normal",
              isOverdue ? "border-red-500" : "border-emerald-500",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "dd/MM/yyyy", { locale: vi })} -{" "}
                  {format(value.to, "dd/MM/yyyy", { locale: vi })}
                </>
              ) : (
                format(value.from, "dd/MM/yyyy", { locale: vi })
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            locale={vi}
            disabled={(date) => date < new Date("1900-01-01")}
            className="rounded-md border"
            classNames={{
              day_selected: "bg-fimeOrangeLighter text-white",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
