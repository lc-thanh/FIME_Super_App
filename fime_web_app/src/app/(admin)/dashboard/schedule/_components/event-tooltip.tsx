import { type Event } from "@/app/(admin)/dashboard/schedule/_components/event-calendar";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TaskStatusText } from "@/schemaValidations/task.schema";
import Link from "next/link";
import { FimeTitle } from "@/components/fime-title";

interface TaskCardProps {
  task: Event;
}

export function EventTooltip({ task }: TaskCardProps) {
  // Function to determine the priority color
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500/20 border-red-500 text-red-700 dark:text-red-400";
      case "MEDIUM":
        return "bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-400";
      case "LOW":
        return "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400";
      default:
        return "bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "text-sm p-1 rounded border-l-2 truncate cursor-pointer",
              getPriorityColor(task.priority)
            )}
          >
            <Link
              href={`/workspace/${task.workspaceId}?task=${
                task.taskId ? task.taskId : task.id
              }`}
            >
              {task.title}
            </Link>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="space-y-1">
            <FimeTitle className="font-medium text-base">
              {task.title}
            </FimeTitle>
            <div className="text-sm">
              <p>
                Bắt đầu: {new Date(task.startDate).toLocaleDateString("vi-VN")}
              </p>
              <p>
                Hạn chót: {new Date(task.deadline).toLocaleDateString("vi-VN")}{" "}
              </p>
              {task.users && (
                <p>
                  Người thực hiện:{" "}
                  {task.users.map((user) => user.fullname).join(", ")}
                </p>
              )}
              {task.status && <p>Trạng thái: {TaskStatusText[task.status]}</p>}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
