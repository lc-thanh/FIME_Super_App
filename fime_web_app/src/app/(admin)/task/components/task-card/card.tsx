"use client";

import { FC } from "react";
import { ControlledBoardProps } from "@caldwell619/react-kanban";

import { Card, CardContent } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { TaskCardType } from "@/schemaValidations/task.schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TaskAssignees } from "@/app/(admin)/task/components/task-card/task-assignees";
import { PriorityBadge } from "@/app/(admin)/task/components/task-card/priority-badge";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { TaskTypeBadge } from "@/app/(admin)/task/components/task-card/task-type-badge";

export const FimeCard: FC<TaskCardType> = ({
  id,
  title,
  users,
  priority,
  startDate,
  deadline,
  type,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const openTask = (taskId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("task", taskId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Card
      className="w-[300px] shadow-md rounded-lg m-1"
      onClick={() => openTask(id)}
    >
      <CardContent className="p-4 flex flex-col gap-4">
        <Box className="flex flex-row gap-2 justify-between">
          <p className="text-base leading-7 -mt-1 font-semibold">{title}</p>
          <PriorityBadge priority={priority} className="text-xs" />
        </Box>
        <Box>
          <Box className="flex flex-row text-sm items-center justify-between">
            <TaskTypeBadge taskType={type} className="text-xs" />
          </Box>
          <Box className="flex flex-row items-center justify-between">
            <Box>
              <span
                className={cn(
                  "text-xs text-muted-foreground",
                  dayjs(deadline).isBefore(dayjs(), "day")
                    ? "text-red-500 dark:text-red-400"
                    : ""
                )}
              >
                {dayjs(startDate).format("DD/MM/YYYY")} -{" "}
                {dayjs(deadline).format("DD/MM/YYYY")}
              </span>
            </Box>
            <div className="flex flex-row items-center justify-between gap-2">
              {/* {prLink ? (
                  <Avatar className="w-[24px] h-[24px]">
                    <Link
                      href={prLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Link2 size={20} />
                    </Link>
                  </Avatar>
                ) : null} */}
              {/* <Badge>{storyPoints}</Badge> */}
              <TaskAssignees assignees={users} />
            </div>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const renderCard: ControlledBoardProps<TaskCardType>["renderCard"] = (
  card
) => {
  return <FimeCard {...card} />;
};
