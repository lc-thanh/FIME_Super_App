"use client";

import { useEffect, useState } from "react";
import {
  ControlledBoard,
  OnDragEndNotification,
  moveCard,
} from "@caldwell619/react-kanban";

import { renderCard } from "@/app/(admin)/workspace/components/task-card/card";
import { renderColumnHeader } from "@/app/(admin)/workspace/components/column-header";
import {
  ColumnIdToNumber,
  ColumnType,
  TaskCardType,
  TaskStatusType,
} from "@/schemaValidations/task.schema";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  TASK_CARDS_QUERY_KEY,
  taskCardsQueryOptions,
} from "@/queries/task-query";
import { MoveCardData, TaskApiRequests } from "@/requests/task.request";
import { useSocketEvent } from "@/hooks/use-socket-event";
import { useEmitOnConnect } from "@/hooks/use-emit-on-connect";
import { handleApiError } from "@/lib/utils";

interface MyBoard {
  columns: ColumnType[];
}

interface MovedCard {
  cardId: string;
  toPosition: number;
  toColumn: TaskStatusType;
}

export const TaskBoard = ({ workspaceId }: { workspaceId: string }) => {
  // const socket = useSocket();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(taskCardsQueryOptions(workspaceId));
  const [controlledBoard, setBoard] = useState<MyBoard>(data);
  const [movedCard, setMovedCard] = useState<MovedCard | null>(null);
  // const [socketId, setSocketId] = useState<string | undefined>(undefined);

  // useSocketEvent("connect", () => {
  //   setSocketId(socket.id);
  // });

  useSocketEvent("board-updated", () => {
    queryClient.invalidateQueries({
      queryKey: [TASK_CARDS_QUERY_KEY, workspaceId],
    });
  });

  useEmitOnConnect("join-workspace", workspaceId);

  const mutation = useMutation({
    mutationFn: (data: MoveCardData) => {
      return TaskApiRequests.moveCard({
        ...data,
        workspaceId,
        // socketId: socketId,
      });
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Di chuyển thẻ thất bại",
      });
      queryClient.invalidateQueries({
        queryKey: [TASK_CARDS_QUERY_KEY, workspaceId],
      });
      setBoard(data);
    },
  });

  useEffect(() => {
    if (data) {
      setBoard(data);
    }
  }, [data]);

  useEffect(() => {
    if (movedCard) {
      const column =
        controlledBoard.columns[ColumnIdToNumber[movedCard.toColumn]];

      const movedData = {
        cardId: movedCard.cardId,
        cardBeforeId:
          movedCard.toPosition === 0
            ? null
            : column.cards[movedCard.toPosition - 1].id,
        cardAfterId: column.cards[movedCard.toPosition + 1]?.id || null,
        column: movedCard.toColumn,
      };

      mutation.mutate(movedData);
      setMovedCard(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movedCard]);

  const handleCardMove: OnDragEndNotification<TaskCardType> = (
    _card,
    source,
    destination
  ) => {
    setBoard((currentBoard) => {
      return moveCard(currentBoard, source, destination);
    });

    setMovedCard({
      cardId: _card.id,
      toPosition: destination?.toPosition || 0,
      toColumn: `${destination?.toColumnId}` as TaskStatusType,
    });
  };

  return (
    <div className="w-fit">
      <ControlledBoard<TaskCardType>
        onCardDragEnd={handleCardMove}
        disableColumnDrag
        renderCard={renderCard}
        renderColumnHeader={renderColumnHeader}
        allowAddCard={false}
      >
        {controlledBoard}
      </ControlledBoard>
    </div>
  );
};
