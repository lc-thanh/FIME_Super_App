"use client";

// Tiptap - Text editor
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

import "@/app/(admin)/task/components/style.css";
import TodoList from "@/app/(admin)/task/components/task-details/todo-list";
import TaskTitle from "@/app/(admin)/task/components/task-details/task-title";
import { useSuspenseQuery } from "@tanstack/react-query";
import { taskQueryOptions } from "@/queries/task-query";
import { AssigneesPicker } from "@/app/(admin)/task/components/task-details/assignees-picker";
import { PrioritySelect } from "@/app/(admin)/task/components/task-details/priority-select";
import { TaskTypeSelector } from "@/app/(admin)/task/components/task-details/task-type-selector";
import TaskTimePicker from "@/app/(admin)/task/components/task-details/task-time-picker";

export const TaskDetails = ({ id }: { id: string | null }) => {
  const { data: task } = useSuspenseQuery(taskQueryOptions(id));

  if (!task) {
    return <div>Không hiển thị được thông tin Task</div>;
  }

  return (
    <div className="p-6 pr-4 pt-0 pb-2 h-full overflow-auto">
      {/* Task Title */}
      <TaskTitle initialTitle={task.title} className="mb-4" />

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AssigneesPicker users={task.users} taskId={task.id} />
          {/* Priority */}
          <TaskTimePicker
            startDate={task.startDate}
            deadline={task.deadline}
            taskId={task.id}
          />
        </div>
        {/* Dates and TaskType */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
          <PrioritySelect priority={task.priority} taskId={task.id} />
          <TaskTypeSelector type={task.type} taskId={task.id} />
        </div>
        {/* Todo List */}
        <TodoList task={task} />

        {/* Description */}
        {/* <Tiptap /> */}
        <SimpleEditor note={task.note} taskId={task.id} />

        {/* Attachments */}
        {/* <div>
          <label className="text-sm text-gray-500 mb-1 block">Đính kèm</label>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 13 6 6 6-6" />
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
              </svg>
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  );
};
