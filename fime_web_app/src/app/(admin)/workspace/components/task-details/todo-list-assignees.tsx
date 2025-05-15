"use client";

import { TaskAssignees } from "@/app/(admin)/workspace/components/task-card/task-assignees";
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
import { UserTaskType } from "@/schemaValidations/task.schema";
import { Check, Users } from "lucide-react";

export const TodoListAssignees = ({
  users,
  usersInTask,
  onUpdateUsers,
}: {
  users: UserTaskType[];
  usersInTask: UserTaskType[];
  onUpdateUsers: (users: UserTaskType[]) => void;
}) => {
  const selectedValues = new Set(users.map((user) => user.id));

  const handleSelect = (isSelected: boolean, value: string) => {
    // if (isSelected) {
    //   selectedValues.delete(value);
    // } else {
    //   selectedValues.add(value);
    // }
    const updatedUsers = isSelected
      ? users.filter((user) => user.id !== value) // Xóa user nếu đã được chọn
      : [...users, usersInTask.find((user) => user.id === value)!]; // Thêm user nếu chưa được chọn

    onUpdateUsers(updatedUsers); // Gọi callback để cập nhật trạng thái
  };

  return (
    <div className="flex flex-col">
      <Popover modal={true}>
        <PopoverTrigger className="w-fit h-full flex align-middle">
          {!!users.length ? (
            <TaskAssignees
              assignees={users}
              maxVisible={2}
              size="sm"
              className="mr-1"
            />
          ) : (
            <div className="hover:bg-primary-foreground p-[9px] py-1 rounded-md cursor-pointer text-muted-foreground hover:text-primary">
              <Users className="inline w-4 h-4 mb-[3px]" />
            </div>
          )}
        </PopoverTrigger>

        <PopoverContent className="w-[12.5rem] p-0" align="start">
          <Command>
            <CommandInput placeholder="Tìm kiếm.." />
            <CommandList className="max-h-full">
              <CommandEmpty>Không có kết quả</CommandEmpty>
              <CommandGroup className="max-h-[18.75rem] overflow-y-auto overflow-x-hidden">
                {[...usersInTask]
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
