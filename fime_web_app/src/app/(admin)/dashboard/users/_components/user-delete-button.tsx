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
import { Loader2, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function UserDeleteButton({
  // id,
  callback,
}: {
  // id: string;
  callback: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    // Call API to delete book
    setLoading(true);
    try {
      setOpen(false);
      // window.location.reload();
      toast.success("Xóa thành viên thành công!");
      callback();
    } catch (error) {
      handleApiError({ error, toastMessage: "Có lỗi xảy ra!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 size={20} className="text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có muốn xóa thành viên này?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác, bạn có chắc chắn muốn xóa?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <Button
            onClick={() => {
              handleDelete();
            }}
            className="bg-red-500 text-red-50 hover:bg-red-600"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            Xóa
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
