"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/user-avatar";
import { userActionsQueryOptions } from "@/queries/statistic-query";
import {
  TypeOfUserActionType,
  UserActionType,
} from "@/schemaValidations/statistic.schema";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useEffect, useState } from "react";

const contentGenerator = (content: string, type: TypeOfUserActionType) => {
  const contentObj = JSON.parse(content);

  switch (type) {
    case "ADD_MEMBER":
      return (
        <p>
          Đã thêm thành viên mới: <b>{contentObj.fullname}</b>
        </p>
      );
    case "REMOVE_MEMBER":
      return (
        <p>
          Đã xóa thành viên{" "}
          <b className="text-destructive">{contentObj.fullname}</b>
        </p>
      );
    case "EDIT_MEMBER":
      return (
        <p>
          Đã chỉnh sửa thông tin thành viên <b>{contentObj.fullname}</b>
        </p>
      );

    case "ADD_TEAM":
      return (
        <p>
          Đã thêm ban mới: <b>{contentObj.name}</b>
        </p>
      );
    case "REMOVE_TEAM":
      return (
        <p>
          Đã xóa ban <b className="text-destructive">{contentObj.name}</b>
        </p>
      );
    case "EDIT_TEAM":
      return (
        <p>
          Đã chỉnh sửa thông tin ban <b>{contentObj.name}</b>
        </p>
      );

    case "ADD_POSITION":
      return (
        <p>
          Đã thêm chức vụ mới: <b>{contentObj.name}</b>
        </p>
      );
    case "REMOVE_POSITION":
      return (
        <p>
          Đã xóa chức vụ <b className="text-destructive">{contentObj.name}</b>
        </p>
      );
    case "EDIT_POSITION":
      return (
        <p>
          Đã chỉnh sửa thông tin chức vụ <b>{contentObj.name}</b>
        </p>
      );

    case "ADD_GEN":
      return (
        <p>
          Đã thêm gen mới: <b>{contentObj.name}</b>
        </p>
      );
    case "REMOVE_GEN":
      return (
        <p>
          Đã xóa <b className="text-destructive">{contentObj.name}</b>
        </p>
      );
    case "EDIT_GEN":
      return (
        <p>
          Đã chỉnh sửa thông tin <b>{contentObj.name}</b>
        </p>
      );

    case "ADD_WORKSPACE":
      return (
        <p>
          Đã tạo workspace mới: <b>{contentObj.name}</b>
        </p>
      );
    case "REMOVE_WORKSPACE":
      return (
        <p>
          Đã xóa workspace <b className="text-destructive">{contentObj.name}</b>
        </p>
      );
    case "EDIT_WORKSPACE_NAME":
      return (
        <p>
          Đã đổi tên workspace <b>{contentObj.oldName}</b> thành{" "}
          <b>{contentObj.newName}</b>
        </p>
      );

    case "ADD_LATEST_PUBLICATION":
      return (
        <p>
          Đã thêm ấn phẩm mới: <b>{contentObj.title}</b>
        </p>
      );
    case "ACTIVE_LATEST_PUBLICATION":
      return (
        <p>
          Đã kích hoạt ấn phẩm <b>{contentObj.title}</b>
        </p>
      );
    case "REMOVE_LATEST_PUBLICATION":
      return (
        <p>
          Đã xóa ấn phẩm <b className="text-destructive">{contentObj.title}</b>
        </p>
      );
    case "EDIT_LATEST_PUBLICATION":
      return (
        <p>
          Đã chỉnh sửa ấn phẩm <b>{contentObj.title}</b>
        </p>
      );

    case "ADD_NEWEST_PRODUCT":
      return (
        <p>
          Đã thêm sản phẩm mới: <b>{contentObj.title}</b>
        </p>
      );
    case "REMOVE_NEWEST_PRODUCT":
      return (
        <p>
          Đã xóa sản phẩm <b className="text-destructive">{contentObj.title}</b>
        </p>
      );
    case "EDIT_NEWEST_PRODUCT":
      return (
        <p>
          Đã chỉnh sửa sản phẩm <b>{contentObj.title}</b>
        </p>
      );

    default:
      return null;
  }
};

export const UserActions = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [allActions, setAllActions] = useState<UserActionType[]>([]);

  const { data: actions } = useSuspenseQuery(
    userActionsQueryOptions(
      new URLSearchParams({ page: `${pageNumber}` }).toString()
    )
  );

  useEffect(() => {
    if (actions && actions.data) {
      setAllActions(actions.data);
    }
  }, [actions]);

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lịch Sử Hoạt Động Trong Hệ Thống</CardTitle>
        <CardDescription>
          Dữ liệu từ hệ thống ghi lại để theo dõi các hoạt động thay đổi lớn
          được thực hiện bởi Quản trị/Quản lý.
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full overflow-x-auto">
        <div className="space-y-4">
          {allActions.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Chưa có hoạt động nào
            </p>
          ) : (
            allActions.map((action) => (
              <div
                key={action.id}
                className="flex items-start gap-3 pb-3 border-b"
              >
                <UserAvatar
                  fullname={action.user.fullname}
                  image={action.user.image}
                  className="mt-1"
                />

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">{action.user.fullname}</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(action.createdAt)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span className="text-xs text-muted-foreground">
                          {new Date(action.createdAt).toLocaleString("vi-VN")}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {contentGenerator(
                      action.content,
                      action.type as TypeOfUserActionType
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {actions && actions.hasNextPage && (
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
      </CardContent>
    </Card>
  );
};
