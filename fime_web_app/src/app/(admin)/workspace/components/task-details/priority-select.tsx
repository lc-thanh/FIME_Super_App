"use client";

import { Button } from "@/components/ui/button";
import {
  TASK_ACTIVITIES_QUERY_KEY,
  TASK_QUERY_KEY,
} from "@/queries/task-query";
import { TaskApiRequests } from "@/requests/task.request";
import { TaskPriorityType } from "@/schemaValidations/task.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const PrioritySelect = ({
  priority,
  taskId,
}: {
  priority: TaskPriorityType;
  taskId: string;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (priority: TaskPriorityType) => {
      await TaskApiRequests.changePriority(taskId, priority);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, taskId] });
      queryClient.invalidateQueries({
        queryKey: [TASK_ACTIVITIES_QUERY_KEY],
      });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, taskId] });
      toast.error("Có lỗi xảy ra!");
    },
  });

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm text-muted-foreground mb-1 block">
        Mức độ ưu tiên
      </label>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          className={`rounded-full px-6 hover:bg-red-50 hover:text-red-500 ${
            priority === "HIGH" && "bg-red-100 text-red-500 border-red-200"
          }`}
          onClick={() => {
            mutation.mutate("HIGH");
          }}
          disabled={
            mutation.isPending ||
            !!queryClient.isFetching({ queryKey: [TASK_QUERY_KEY, taskId] })
          }
        >
          Cao
        </Button>
        <Button
          variant="outline"
          className={`rounded-full px-6 hover:bg-amber-50 hover:text-amber-500 ${
            priority === "MEDIUM" &&
            "bg-amber-100 text-amber-500 border-amber-200"
          }`}
          onClick={() => {
            mutation.mutate("MEDIUM");
          }}
          disabled={
            mutation.isPending ||
            !!queryClient.isFetching({ queryKey: [TASK_QUERY_KEY, taskId] })
          }
        >
          Trung bình
        </Button>
        <Button
          variant="outline"
          className={`rounded-full px-6 hover:bg-green-50 hover:text-green-500 ${
            priority === "LOW" && "bg-green-100 text-green-500 border-green-200"
          }`}
          onClick={() => {
            mutation.mutate("LOW");
          }}
          disabled={
            mutation.isPending ||
            !!queryClient.isFetching({ queryKey: [TASK_QUERY_KEY, taskId] })
          }
        >
          Thấp
        </Button>
      </div>
    </div>
  );
};
