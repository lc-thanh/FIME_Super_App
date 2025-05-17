"use client";

import { Suspense, useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { TaskDetails } from "@/app/(admin)/workspace/components/task-details/task-details";
import TaskDetailsLoader from "@/app/(admin)/workspace/components/task-details/task-details-loader";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function TaskDialog() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const taskIdFromUrl = searchParams.get("task");

  // Auto open nếu có taskId trên URL
  useEffect(() => {
    setSelectedTaskId(taskIdFromUrl);
  }, [taskIdFromUrl]);

  // Xử lý đóng dialog
  const handleClose = () => {
    setSelectedTaskId(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("task");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Dialog open={!!selectedTaskId} onOpenChange={handleClose}>
      <DialogContent
        id="new-task-dialog-container"
        className="max-w-4xl p-0 h-[90vh]"
        aria-describedby={undefined}
      >
        <DialogTitle className="hidden">New Task Dialog</DialogTitle>
        <CardContent className="w-full p-2 pr-4 pb-4 pt-8 bg-card gradient-box max-h-[90vh]">
          <Suspense fallback={<TaskDetailsLoader />}>
            <TaskDetails id={selectedTaskId} />
          </Suspense>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}
