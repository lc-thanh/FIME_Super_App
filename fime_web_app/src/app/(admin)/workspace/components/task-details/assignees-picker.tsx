"use client";

import { TaskAssignees } from "@/app/(admin)/workspace/components/task-card/task-assignees";
import { AssigneesFacetedFilter } from "@/app/(admin)/workspace/components/task-details/assignees-faceted-filter";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { genSelectorsQueryOptions } from "@/queries/gen-query";
import {
  ALL_SELECTABLE_ASSIGNEES_QUERY_KEY,
  allSelectableAssigneesQueryOptions,
  TASK_QUERY_KEY,
} from "@/queries/task-query";
import { teamSelectorsQueryOptions } from "@/queries/team-query";
import { TaskApiRequests } from "@/requests/task.request";
import { AssigneeType, UserTaskType } from "@/schemaValidations/task.schema";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Check, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const AssigneesPicker = ({
  users,
  taskId,
}: {
  users: UserTaskType[];
  taskId: string;
}) => {
  const selectedValues = new Set(users.map((user) => user.id));
  const [filteredUsers, setFilteredUsers] = useState<AssigneeType[]>([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedGenIds, setSelectedGenIds] = useState<Set<string>>(new Set());

  const queryClient = useQueryClient();
  queryClient.invalidateQueries({
    queryKey: [ALL_SELECTABLE_ASSIGNEES_QUERY_KEY, taskId],
  });
  const { data: allUsers } = useSuspenseQuery(
    allSelectableAssigneesQueryOptions(taskId)
  );

  const { data: teams } = useSuspenseQuery(teamSelectorsQueryOptions());
  const { data: gens } = useSuspenseQuery(genSelectorsQueryOptions());

  // Initialize filteredUsers with allUsers
  useEffect(() => {
    let filteredUsers = [...allUsers];

    // Filter by teams if any team is selected
    if (selectedTeamIds.size > 0) {
      filteredUsers = filteredUsers.filter((user) =>
        selectedTeamIds.has(user.teamId || "")
      );
    }

    // Filter by gens if any gen is selected
    if (selectedGenIds.size > 0) {
      filteredUsers = filteredUsers.filter((user) =>
        selectedGenIds.has(user.genId || "")
      );
    }

    setFilteredUsers(filteredUsers);
  }, [allUsers, selectedGenIds, selectedTeamIds]);

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

        <PopoverContent className="w-[24.5rem] p-0" align="start">
          <Command>
            <CommandInput placeholder="Tìm kiếm.." />
            <CommandGroup>
              <AssigneesFacetedFilter
                teams={teams}
                gens={gens}
                selectedTeamIds={selectedTeamIds}
                selectedGenIds={selectedGenIds}
                onTeamFilterChange={setSelectedTeamIds}
                onGenFilterChange={setSelectedGenIds}
              />
            </CommandGroup>
            <CommandSeparator />
            <CommandList className="max-h-full">
              <CommandEmpty>Không có kết quả</CommandEmpty>
              <CommandGroup className="max-h-[24.75rem] w-full overflow-y-auto overflow-x-hidden">
                {[...filteredUsers]
                  .sort((a, b) => {
                    const aSelected = selectedValues.has(a.id);
                    const bSelected = selectedValues.has(b.id);

                    if (aSelected && !bSelected) return -1;
                    if (!aSelected && bSelected) return 1;

                    // Nếu cả hai đều đã select hoặc đều chưa select
                    const aRecommended = a.isRecommended;
                    const bRecommended = b.isRecommended;

                    if (aRecommended && !bRecommended) return -1;
                    if (!aRecommended && bRecommended) return 1;

                    return 0;
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
                        <UserAvatar
                          fullname={user.fullname}
                          image={user.image}
                        />
                        <div className="w-full">
                          <div
                            className={cn(
                              "text-sm font-medium flex flex-row justify-between",
                              user.isRecommended
                                ? "text-green-600 dark:text-green-400"
                                : ""
                            )}
                          >
                            <div>{user.fullname}</div>
                            {user.isRecommended && (
                              <div className="text-xs italic ms-2">Đề xuất</div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.teamName}{" "}
                            {user.genName ? `- ${user.genName}` : ""}
                          </div>
                        </div>
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
