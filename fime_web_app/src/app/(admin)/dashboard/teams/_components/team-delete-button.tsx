"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/utils";
import { TEAMS_QUERY_KEY } from "@/queries/team-query";
import { TeamApiRequests } from "@/requests/team.request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function TeamDeleteButton({ teamId }: { teamId: string }) {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await TeamApiRequests.delete(teamId);
    },
    onSuccess: () => {
      toast.success("Xóa ban thành công!");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: [TEAMS_QUERY_KEY] });
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra!",
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 size={20} className="text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có muốn xóa ban này?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác, bạn có chắc chắn muốn xóa?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
