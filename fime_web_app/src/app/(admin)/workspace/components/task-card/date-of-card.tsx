import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TaskStatusType } from "@/schemaValidations/task.schema";

const isOverdue = (deadline: Date, status: TaskStatusType) => {
  const today = new Date();
  return status !== "DONE" && dayjs(deadline).isBefore(today, "day");
};

export const DateOfCard = ({
  startDate,
  deadline,
  status,
}: {
  startDate: Date;
  deadline: Date;
  status: TaskStatusType;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "text-xs text-muted-foreground",
            isOverdue(deadline, status) ? "text-red-500 dark:text-red-400" : ""
          )}
        >
          {dayjs(startDate).format("DD/MM/YYYY")} -{" "}
          {dayjs(deadline).format("DD/MM/YYYY")}
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {isOverdue(deadline, status) ? (
          <p>Đã quá hạn!</p>
        ) : status !== "DONE" ? (
          <p>Chưa hết hạn</p>
        ) : (
          <p>Đã hoàn thành</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
};
