"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleApiError } from "@/lib/utils";
import { TASK_CARDS_QUERY_KEY } from "@/queries/task-query";
import { TaskApiRequests } from "@/requests/task.request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function CardDeleteAlert({
  id,
  openChange,
}: {
  id: string;
  openChange: () => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await TaskApiRequests.softDelete(id);
    },
    onSuccess: () => {
      toast.success("Xóa thẻ thành công!");
      queryClient.invalidateQueries({ queryKey: [TASK_CARDS_QUERY_KEY] });
      openChange();
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra!",
      });
    },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Bạn có muốn xóa thẻ này?</DialogTitle>
        <DialogDescription>
          Hành động này không thể hoàn tác, bạn có chắc chắn muốn xóa?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Hủy</Button>
        </DialogClose>
        <Button
          onClick={() => {
            mutation.mutate();
          }}
          className="bg-red-500 text-red-50 hover:bg-red-600"
          disabled={mutation.isPending}
        >
          {mutation.isPending && <Loader2 className="animate-spin" />}
          Xóa
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
