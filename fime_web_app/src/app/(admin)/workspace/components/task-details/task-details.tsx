"use client";

// Tiptap - Text editor
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

import TodoList from "@/app/(admin)/workspace/components/task-details/todo-list";
import TaskTitle from "@/app/(admin)/workspace/components/task-details/task-title";
import { useSuspenseQuery } from "@tanstack/react-query";
import { taskQueryOptions } from "@/queries/task-query";
import { AssigneesPicker } from "@/app/(admin)/workspace/components/task-details/assignees-picker";
import { PrioritySelect } from "@/app/(admin)/workspace/components/task-details/priority-select";
import { TaskTypeSelector } from "@/app/(admin)/workspace/components/task-details/task-type-selector";
import TaskTimePicker from "@/app/(admin)/workspace/components/task-details/task-time-picker";
import { TaskActivities } from "@/app/(admin)/workspace/components/task-details/task-activities";
import { TaskAttachments } from "@/app/(admin)/workspace/components/task-details/task-attachments";

export const TaskDetails = ({ id }: { id: string | null }) => {
  const { data: task } = useSuspenseQuery(taskQueryOptions(id));

  if (!task) {
    return <div>Không hiển thị được thông tin Task</div>;
  }

  return (
    <div className="p-6 pr-4 pt-0 pb-2 h-full overflow-auto">
      {/* Task Title */}
      <TaskTitle initialTitle={task.title} taskId={task.id} className="mb-4" />

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assignees */}
          <AssigneesPicker users={task.users} taskId={task.id} />
          {/* Task Time */}
          <TaskTimePicker
            startDate={task.startDate}
            deadline={task.deadline}
            taskId={task.id}
          />
        </div>

        {/* Priority and TaskType */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
          <PrioritySelect priority={task.priority} taskId={task.id} />
          <TaskTypeSelector type={task.type} taskId={task.id} />
        </div>

        {/* Todo List */}
        <TodoList task={task} />

        {/* Attachments */}
        <TaskAttachments taskId={task.id} />

        {/* Note */}
        {/* <Tiptap /> */}
        <SimpleEditor note={task.note} taskId={task.id} />

        {/* Activities */}
        <TaskActivities taskId={task.id} />
      </div>
    </div>
  );
};
