"use client";

import { Button } from "@/components/ui/button";
import { TASK_CARDS_QUERY_KEY } from "@/queries/task-query";
import { TaskApiRequests } from "@/requests/task.request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function NewTaskButton({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await TaskApiRequests.create(workspaceId);
    },
    onSuccess: () => {
      // Logic to refetch tasks or update the UI after creating a new task
      queryClient.invalidateQueries({
        queryKey: [TASK_CARDS_QUERY_KEY, workspaceId],
      });
      toast.success("Thêm Task mới thành công!");
    },
    onError: () => {
      toast.error("Có lỗi xảy ra!");
    },
  });

  return (
    <Button variant="gradient" onClick={() => mutation.mutate()}>
      <Plus className="mr-2 h-4 w-4" /> Thêm Task Mới
    </Button>
  );
}
