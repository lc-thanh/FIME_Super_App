"use client";

import { TaskAssignees } from "@/app/(admin)/task/components/task-card/task-assignees";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { TASK_QUERY_KEY } from "@/queries/task-query";
import { usersQueryOptions } from "@/queries/user-query";
import { TaskApiRequests } from "@/requests/task.request";
import { UserTaskType } from "@/schemaValidations/task.schema";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Check, Users } from "lucide-react";
import { toast } from "sonner";

export const AssigneesPicker = ({
  users,
  taskId,
}: {
  users: UserTaskType[];
  taskId: string;
}) => {
  const selectedValues = new Set(users.map((user) => user.id));

  const queryClient = useQueryClient();
  const { data: allUsers } = useSuspenseQuery(usersQueryOptions());

  const addUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await TaskApiRequests.addAssignee(taskId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, taskId] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra!");
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, taskId] });
    },
  });

  const removeUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await TaskApiRequests.removeAssignee(taskId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, taskId] });
    },
    onError: () => {
      toast.error("Có lỗi xảy ra!");
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, taskId] });
    },
  });

  const handleSelect = (isSelected: boolean, value: string) => {
    if (isSelected) {
      selectedValues.delete(value);
      removeUserMutation.mutate(value);
    } else {
      selectedValues.add(value);
      addUserMutation.mutate(value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">
        <Users className="inline w-4 h-4 mb-1" /> Thành viên
      </span>
      <Popover modal={true}>
        <PopoverTrigger className="w-fit">
          {!!users.length ? (
            <TaskAssignees assignees={users} maxVisible={5} size="lg" />
          ) : (
            <span className="text-muted-foreground">
              Chưa có thành viên nào
            </span>
          )}
        </PopoverTrigger>

        <PopoverContent className="w-[12.5rem] p-0" align="start">
          <Command>
            <CommandInput placeholder="Tìm kiếm.." />
            <CommandList className="max-h-full">
              <CommandEmpty>Không có kết quả</CommandEmpty>
              <CommandGroup className="max-h-[18.75rem] overflow-y-auto overflow-x-hidden">
                {[...allUsers]
                  .sort((a, b) => {
                    const aSelected = selectedValues.has(a.id);
                    const bSelected = selectedValues.has(b.id);
                    return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
                  })
                  .map((user) => {
                    const isSelected = selectedValues.has(user.id);

                    return (
                      <CommandItem
                        key={user.id}
                        onSelect={() => {
                          handleSelect(isSelected, user.id);
                        }}
                        disabled={
                          addUserMutation.isPending ||
                          removeUserMutation.isPending ||
                          !!queryClient.isFetching({
                            queryKey: [TASK_QUERY_KEY, taskId],
                          })
                        }
                      >
                        <div
                          className={cn(
                            "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <Check className="size-4" aria-hidden="true" />
                        </div>
                        {
                          <UserAvatar
                            fullname={user.fullname}
                            image={user.image}
                          />
                        }
                        <span>{user.fullname}</span>
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
              {/* {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => handleClear()}
                    className="justify-center text-center"
                  >
                    Xóa bộ lọc
                  </CommandItem>
                </CommandGroup>
              </>
            )} */}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
