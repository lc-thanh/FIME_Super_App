"use client";

import { ControlledBoardProps } from "@caldwell619/react-kanban";

import { Box } from "@/components/ui/box";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TaskCardType } from "@/schemaValidations/task.schema";

export const renderColumnHeader: ControlledBoardProps<TaskCardType>["renderColumnHeader"] =
  ({ id, title, cards }) => {
    return (
      <Box
        className={cn(
          "border-b-4 mb-2 pb-2 mx-1 me-2 flex flex-row justify-between items-center",
          id === "TODO" ? "border-blue-500" : "",
          id === "IN_PROGRESS" ? "border-yellow-500" : "",
          id === "IN_REVIEW" ? "border-purple-500" : "",
          id === "DONE" ? "border-green-500" : ""
        )}
      >
        <p>{title}</p>
        <Badge variant="fimeGradient">{cards.length}</Badge>
      </Box>
    );
  };
