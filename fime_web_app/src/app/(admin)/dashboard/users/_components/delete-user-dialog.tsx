"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleApiError } from "@/lib/utils";
import { USER_TABLE_QUERY_KEY } from "@/queries/user-query";
import { UserApiRequests } from "@/requests/user.request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, TriangleAlert } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function DeleteUserDialog({
  id,
  fullname,
  open,
  setOpen,
}: {
  id: string;
  fullname: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (userId: string) => {
      await UserApiRequests.delete(userId);
    },
    onSuccess: () => {
      toast.success(`Xóa tài khoản ${fullname} thành công!`);
      queryClient.invalidateQueries({ queryKey: [USER_TABLE_QUERY_KEY] });
      setOpen(false);
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra khi xóa!",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn có muốn xóa tài khoản {fullname}?</DialogTitle>
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
              mutation.mutate(id);
            }}
            className="bg-red-500 text-red-50 hover:bg-red-600"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <TriangleAlert className="h-4 w-4" />
            )}
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
