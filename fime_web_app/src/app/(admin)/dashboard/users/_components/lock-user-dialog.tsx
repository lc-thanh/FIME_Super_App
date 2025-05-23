"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/utils";
import { USER_TABLE_QUERY_KEY } from "@/queries/user-query";
import { UserApiRequests } from "@/requests/user.request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Lock } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function LockUserDialog({
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
      await UserApiRequests.lock(userId);
    },
    onSuccess: () => {
      toast.success(`Khóa tài khoản ${fullname} thành công!`);
      queryClient.invalidateQueries({ queryKey: [USER_TABLE_QUERY_KEY] });
      setOpen(false);
    },
    onError: (error) => {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra!",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn có muốn khóa tài khoản {fullname}?</DialogTitle>
          <DialogDescription>
            Sau khi khóa, tài khoản sẽ không thể sử dụng được các chức năng
            trong hệ thống, bạn có chắc chắn muốn khóa?
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
            {mutation.isPending && <Loader2 className="animate-spin" />}
            <Lock className="h-4 w-4" />
            Khóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
