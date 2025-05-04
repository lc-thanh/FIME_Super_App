"use client";

import { FC, useEffect, useState } from "react";
import { ControlledBoardProps } from "@caldwell619/react-kanban";

import { Card, CardContent } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
import { AvatarFallback } from "@radix-ui/react-avatar";
// import Link from "next/link";
// import { Link2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import TaskDialogContent from "@/app/(admin)/task/components/task-details/task-dialog-content";
import { TaskCardType } from "@/schemaValidations/task.schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const JiraCard: FC<TaskCardType> = ({ id, title }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Lấy taskId từ URL hoặc null nếu không có
  const taskIdFromUrl = searchParams.get("task");
  const [open, setOpen] = useState(!!taskIdFromUrl);

  // Khi URL thay đổi (ví dụ người paste link có ?task=...), auto mở dialog
  useEffect(() => {
    setOpen(!!taskIdFromUrl && taskIdFromUrl === id);
  }, [id, taskIdFromUrl]);

  // Khi đóng dialog, remove param task
  const handleClose = () => {
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("task");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const openTask = (taskId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("task", taskId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Dialog open={open} onOpenChange={(opened) => !opened && handleClose()}>
      <DialogTrigger asChild>
        <Card
          className="w-[300px] shadow-md rounded-lg m-1"
          onClick={() => openTask(id)}
        >
          <CardContent className="p-4">
            <p className="text-sm leading-7">{title}</p>
            <Box className="flex flex-row items-center justify-between mt-2">
              <Box>
                {/* <Avatar
                  className="w-[16] h-[16] me-4"
                >
                  {" "}
                </Avatar>
                <small className="text-sm font-medium leading-none">
                  {id.split("-")[0]}
                </small> */}
              </Box>
              <div className="flex flex-row items-center justify-between gap-2">
                {/* {prLink ? (
                  <Avatar className="w-[24px] h-[24px]">
                    <Link
                      href={prLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Link2 size={20} />
                    </Link>
                  </Avatar>
                ) : null} */}
                {/* <Badge>{storyPoints}</Badge> */}
                <Avatar className="w-[24px] h-[24px]">
                  <AvatarImage
                    src={`https://mui.com/static/images/avatar/2.jpg`}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </Box>
          </CardContent>
        </Card>
      </DialogTrigger>
      <TaskDialogContent title={title} />
    </Dialog>
  );
};

export const renderCard: ControlledBoardProps<TaskCardType>["renderCard"] = (
  card
) => {
  return <JiraCard {...card} />;
};
