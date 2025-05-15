import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TaskPriorityType } from "@/schemaValidations/task.schema";

export const PriorityBadge = ({
  priority,
  className,
}: {
  priority: TaskPriorityType;
  className?: string;
}) => {
  const priorityClass = {
    LOW: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    MEDIUM:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    HIGH: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  }[priority];

  const priorityText = {
    LOW: "Thấp",
    MEDIUM: "Trung bình",
    HIGH: "Cao",
  }[priority];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className={cn(
            "text-xs font-medium h-fit rounded-full py-1",
            priorityClass,
            className
          )}
        >
          {priorityText}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>Độ ưu tiên: {priorityText}</p>
      </TooltipContent>
    </Tooltip>
  );
};
