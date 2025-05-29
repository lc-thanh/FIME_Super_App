"use client";

import { taskActivitiesQueryOptions } from "@/queries/task-query";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  TaskPriorityType,
  TaskStatusText,
  TaskStatusTextColor,
  TaskStatusType,
  TypeOfTaskType,
  type TaskActivityType,
  type TypeOfTaskActivityType,
} from "@/schemaValidations/task.schema";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { UserAvatar } from "@/components/user-avatar";
import {
  PRIORITY_CLASS,
  PRIORITY_TEXT,
} from "@/app/(admin)/workspace/components/task-card/priority-badge";
import {
  TYPE_CLASS,
  TYPE_TEXT,
} from "@/app/(admin)/workspace/components/task-card/task-type-badge";
import { History } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const contentGenerator = (content: string, type: TypeOfTaskActivityType) => {
  switch (type) {
    case "CREATE_CARD":
      return <p>Đã tạo thẻ</p>;
    case "DELETE_CARD":
      return <p>Đã xóa thẻ</p>;
    case "MOVE_CARD":
      return (
        <p>
          Đã di chuyển thẻ qua cột{" "}
          <span
            className={`${
              TaskStatusTextColor[content as TaskStatusType]
            } !bg-transparent font-bold`}
          >
            {TaskStatusText[content as TaskStatusType].toUpperCase()}
          </span>
        </p>
      );
    case "CHANGE_TITLE":
      return (
        <p>
          Đã đổi tiêu đề thành <b>{content}</b>
        </p>
      );
    case "ADD_ASSIGNEE":
      return (
        <p>
          Đã thêm <b className="text-primary">{content.split("@")[1]}</b> vào
          thẻ
        </p>
      );
    case "REMOVE_ASSIGNEE":
      return (
        <p>
          Đã xóa <b className="text-primary">{content.split("@")[1]}</b> khỏi
          thẻ
        </p>
      );
    case "SYNC_TODO":
      return <p>Đã chỉnh sửa Todo List</p>;
    case "SYNC_NOTE":
      return <p>Đã chỉnh sửa ghi chú</p>;
    case "ADD_ATTACHMENT":
      return (
        <p>
          Đã thêm đính kèm: <b>{content}</b>
        </p>
      );
    case "REMOVE_ATTACHMENT":
      return (
        <p>
          Đã xóa đính kèm: <b>{content}</b>
        </p>
      );
    case "CHANGE_PRIORITY":
      return (
        <p>
          Đã thay đổi độ ưu tiên thành{" "}
          <span
            className={`${
              PRIORITY_CLASS[content as TaskPriorityType]
            } !bg-transparent`}
          >
            {PRIORITY_TEXT[content as TaskPriorityType]}
          </span>
        </p>
      );
    case "CHANGE_TYPE":
      return (
        <p>
          Đã thay đổi loại công việc thành{" "}
          <span
            className={`${
              TYPE_CLASS[content as TypeOfTaskType]
            } !bg-transparent`}
          >
            {TYPE_TEXT[content as TypeOfTaskType]}
          </span>
        </p>
      );
    case "CHANGE_DATE":
      return (
        <p>
          Đã thay đổi thời gian thành <b>{content}</b>
        </p>
      );
    default:
      return null;
  }
};

export const TaskActivities = ({ taskId }: { taskId: string }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [allActivities, setAllActivities] = useState<TaskActivityType[]>([]);

  const { data: activities } = useQuery(
    taskActivitiesQueryOptions(
      new URLSearchParams({ page: `${pageNumber}` }).toString(),
      taskId
    )
  );

  useEffect(() => {
    if (activities && activities.data) {
      setAllActivities(activities.data);
    }
  }, [activities]);

  const handleLoadMore = () => {
    setPageNumber((prev) => prev + 1);
  };

  const formatTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: vi,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-2 items-center text-primary">
        <History className="h-5 w-5" />

        <h3 className="text-lg">Hoạt động</h3>
      </div>

      <div className="space-y-3">
        {allActivities.length === 0 ? (
          <p className="text-muted-foreground text-sm">Chưa có hoạt động nào</p>
        ) : (
          allActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 pb-3 border-b"
            >
              <UserAvatar
                fullname={activity.user.fullname}
                image={activity.user.image}
              />

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold">{activity.user.fullname}</p>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(activity.createdAt)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="text-sm text-muted-foreground">
                  {contentGenerator(
                    activity.content,
                    activity.type as TypeOfTaskActivityType
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {activities && activities.hasNextPage && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadMore}
            className="w-full"
          >
            Xem thêm
          </Button>
        </div>
      )}
    </div>
  );
};
