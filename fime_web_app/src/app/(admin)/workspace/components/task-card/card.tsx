"use client";

import { FC } from "react";
import { ControlledBoardProps } from "@caldwell619/react-kanban";

import { Card, CardContent } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { TaskCardType } from "@/schemaValidations/task.schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TaskAssignees } from "@/app/(admin)/workspace/components/task-card/task-assignees";
import { PriorityBadge } from "@/app/(admin)/workspace/components/task-card/priority-badge";
import { TaskTypeBadge } from "@/app/(admin)/workspace/components/task-card/task-type-badge";
import { DateOfCard } from "@/app/(admin)/workspace/components/task-card/date-of-card";
import { cn } from "@/lib/utils";
import { useBoundStore } from "@/providers/store-provider";

export const FimeCard: FC<TaskCardType> = ({
  id,
  title,
  users,
  priority,
  startDate,
  deadline,
  status,
  type,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { setContextMenu } = useBoundStore((state) => state);
  const handleContextMenu = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any,
    cardId: string | null
  ) => {
    event.preventDefault(); // Ngăn mở context menu mặc định của trình duyệt
    setContextMenu(cardId, { x: event.clientX, y: event.clientY });
  };

  const openTask = (taskId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("task", taskId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Card
      onContextMenu={(e) => {
        handleContextMenu(e, id);
      }}
      className={cn(
        "w-[300px] shadow-md rounded-lg m-1",
        status === "DONE" && "opacity-40"
      )}
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
              <DateOfCard
                startDate={startDate}
                deadline={deadline}
                status={status}
              />
            </Box>
            <div className="flex flex-row items-center justify-between gap-2">
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
