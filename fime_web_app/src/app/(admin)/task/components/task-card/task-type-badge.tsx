import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TypeOfTaskType } from "@/schemaValidations/task.schema";

export const TaskTypeBadge = ({
  taskType,
  className,
}: {
  taskType: TypeOfTaskType;
  className?: string;
}) => {
  const typeClass = {
    TODO: "text-blue-500 bg-blue-50 dark:bg-blue-900 dark:text-blue-300",
    MONTHLY_SEGMENTS:
      "text-green-500 bg-green-50 dark:bg-green-900 dark:text-green-300",
    PUBLICATION: "text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-300",
    EVENT:
      "text-yellow-600 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-300",
    MEETING:
      "text-purple-500 bg-purple-50 dark:bg-purple-900 dark:text-purple-300",
    TRAINING: "text-pink-500 bg-pink-50 dark:bg-pink-900 dark:text-pink-300",
    WORKSHOP:
      "text-orange-500 bg-orange-50 dark:bg-orange-900 dark:text-orange-300",
  }[taskType];

  const typeText = {
    TODO: "Công việc",
    MONTHLY_SEGMENTS: "Chuyên mục hàng tháng",
    PUBLICATION: "Ấn phẩm",
    EVENT: "Sự kiện",
    MEETING: "Cuộc họp",
    TRAINING: "Đào tạo",
    WORKSHOP: "Workshop",
  }[taskType];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className={cn("text-xs font-medium h-fit py-1", typeClass, className)}
        >
          {typeText}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>Loại: {typeText}</p>
      </TooltipContent>
    </Tooltip>
  );
};
