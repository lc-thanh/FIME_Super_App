"use client";

import type React from "react";

import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/date-range-picker";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskApiRequests } from "@/requests/task.request";
import { toast } from "sonner";
import { TASK_QUERY_KEY } from "@/queries/task-query";

export default function TaskTimePicker({
  startDate,
  deadline,
  taskId,
}: {
  startDate: Date;
  deadline: Date;
  taskId: string;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      startDate,
      deadline,
    }: {
      startDate: Date;
      deadline: Date;
    }) => {
      await TaskApiRequests.changeTaskTime(taskId, startDate, deadline);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, taskId] });
      // Cập nhật giá trị ban đầu sau khi lưu
      setOriginalDate(date);
      setIsChanged(false);
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, taskId] });
      toast.error("Có lỗi xảy ra!");
    },
  });

  const initialDateRange = {
    from: dayjs(startDate).toDate(),
    to: dayjs(deadline).toDate(),
  };

  const [date, setDate] = useState<DateRange | undefined>(initialDateRange);
  const [originalDate, setOriginalDate] = useState<DateRange | undefined>(
    initialDateRange
  );
  const [isChanged, setIsChanged] = useState(false);

  // Kiểm tra xem giá trị đã thay đổi chưa
  useEffect(() => {
    if (!originalDate || !date) {
      setIsChanged(false);
      return;
    }

    const fromChanged = originalDate.from?.getTime() !== date.from?.getTime();
    const toChanged = originalDate.to?.getTime() !== date.to?.getTime();

    setIsChanged(fromChanged || toChanged);
  }, [date, originalDate]);

  const handleSubmit = () => {
    console.log("Ngày bắt đầu:", date?.from);
    console.log("Ngày kết thúc:", date?.to);
    // Xử lý dữ liệu ở đây
    mutation.mutate({
      startDate: date?.from ?? new Date(),
      deadline: date?.to ?? new Date(),
    });
  };

  const handleCancel = () => {
    // Khôi phục giá trị ban đầu
    setDate(originalDate);
    setIsChanged(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground mb-1">
        Thời gian thực hiện
      </span>
      <DateRangePicker
        value={date}
        onChange={setDate}
        placeholder="Chọn thời gian"
        isOverdue={dayjs().isAfter(deadline, "day")}
      />
      {isChanged && (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="fime-outline"
            type="button"
            onClick={handleSubmit}
          >
            <Save className="h-4 w-4" />
            Lưu
          </Button>
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
            Hủy
          </Button>
        </div>
      )}
    </div>
  );
}
