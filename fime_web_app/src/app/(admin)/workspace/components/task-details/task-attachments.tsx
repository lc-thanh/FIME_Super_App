"use client";

import { Paperclip } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { taskAttachmentsQueryOptions } from "@/queries/task-query";
import { TaskAttachmentsList } from "@/app/(admin)/workspace/components/task-details/task-attachments-list";
import { TaskAttachmentForm } from "@/app/(admin)/workspace/components/task-details/task-attachment-form";

interface TaskAttachmentsProps {
  taskId: string;
}

export function TaskAttachments({ taskId }: TaskAttachmentsProps) {
  const { data: attachments, error } = useSuspenseQuery(
    taskAttachmentsQueryOptions(taskId)
  );

  if (error) {
    return (
      <div className="text-sm text-destructive">
        Không thể tải danh sách đính kèm. Vui lòng thử lại sau.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg text-primary">
        <Paperclip className="h-5 w-5" />
        <h3>Đính kèm</h3>
        {attachments && attachments.length > 0 && (
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
            {attachments.length}
          </span>
        )}
      </div>

      <TaskAttachmentsList attachments={attachments || []} taskId={taskId} />
      <TaskAttachmentForm taskId={taskId} />
    </div>
  );
}
