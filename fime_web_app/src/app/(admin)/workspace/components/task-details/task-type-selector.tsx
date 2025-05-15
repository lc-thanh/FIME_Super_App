import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypeOfTask, TypeOfTaskType } from "@/schemaValidations/task.schema";
import {
  TYPE_CLASS,
  TYPE_TEXT,
} from "@/app/(admin)/workspace/components/task-card/task-type-badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskApiRequests } from "@/requests/task.request";
import { toast } from "sonner";
import { TASK_QUERY_KEY } from "@/queries/task-query";

export const TaskTypeSelector = ({
  type,
  taskId,
}: {
  type: TypeOfTaskType;
  taskId: string;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (type: TypeOfTaskType) => {
      await TaskApiRequests.changeType(taskId, type);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, taskId] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, taskId] });
      toast.error("Có lỗi xảy ra!");
    },
  });

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm text-muted-foreground mb-1 block">
        Phân loại
      </label>
      <Select
        onValueChange={(value) => {
          mutation.mutate(value as TypeOfTaskType);
        }}
        defaultValue={type}
        disabled={
          mutation.isPending ||
          !!queryClient.isFetching({ queryKey: [TASK_QUERY_KEY, taskId] })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Chọn phân loại công việc" />
        </SelectTrigger>
        <SelectContent>
          {TypeOfTask.options.map((type) => (
            <SelectItem
              key={type}
              value={type}
              className={`${TYPE_CLASS[type]} !bg-popover`}
            >
              <span className={`${TYPE_CLASS[type]} !bg-transparent`}>
                {TYPE_TEXT[type]}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
