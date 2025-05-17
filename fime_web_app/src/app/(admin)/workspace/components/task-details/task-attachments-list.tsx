"use client";

import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, ExternalLink } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";
import { TaskApiRequests } from "@/requests/task.request";
import {
  TASK_ACTIVITIES_QUERY_KEY,
  TASK_ATTACHMENTS_QUERY_KEY,
} from "@/queries/task-query";
import { TaskAttachmentType } from "@/schemaValidations/task.schema";
import { UserAvatar } from "@/components/user-avatar";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { useState } from "react";

interface TaskAttachmentsListProps {
  attachments: TaskAttachmentType[];
  taskId: string;
}

export function TaskAttachmentsList({
  attachments,
  taskId,
}: TaskAttachmentsListProps) {
  const queryClient = useQueryClient();
  const [attachmentToDelete, setAttachmentToDelete] =
    useState<TaskAttachmentType | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (attachmentId: string) => {
      return await TaskApiRequests.deleteTaskAttachment(taskId, attachmentId);
    },
    onSuccess: () => {
      toast.success("Đã xóa đính kèm thành công!");
      queryClient.invalidateQueries({
        queryKey: [TASK_ATTACHMENTS_QUERY_KEY, taskId],
      });
      queryClient.invalidateQueries({
        queryKey: [TASK_ACTIVITIES_QUERY_KEY],
      });
      setAttachmentToDelete(null);
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra khi xóa đính kèm!",
      });
    },
  });

  if (attachments.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Chưa có đính kèm nào
      </div>
    );
  }

  const handleDeleteClick = (attachment: TaskAttachmentType) => {
    setAttachmentToDelete(attachment);
  };

  const handleConfirmDelete = () => {
    if (attachmentToDelete) {
      deleteMutation.mutate(attachmentToDelete.id);
    }
  };

  return (
    <>
      <div className="space-y-3">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-start gap-3 p-3 rounded-md border group hover:bg-muted/50"
          >
            <div className="flex-shrink-0 mt-1">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2">
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sm hover:underline flex items-center gap-1 truncate"
                >
                  {attachment.title}
                  <ExternalLink className="h-3 w-3 inline flex-shrink-0" />
                </a>
              </div>

              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>
                  Thêm{" "}
                  {formatDistanceToNow(new Date(attachment.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </span>
                {attachment.user && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <UserAvatar
                        fullname={attachment.user.fullname}
                        image={attachment.user.image}
                        size="sm"
                      />
                      <span className="truncate">
                        {attachment.user.fullname}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDeleteClick(attachment)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Xóa đính kèm</span>
            </Button>
          </div>
        ))}
      </div>

      <ConfirmDeleteDialog
        open={!!attachmentToDelete}
        onOpenChange={(open) => !open && setAttachmentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa đính kèm"
        description={`Bạn có chắc chắn muốn xóa đính kèm "${attachmentToDelete?.title}" không? Hành động này không thể hoàn tác.`}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}
