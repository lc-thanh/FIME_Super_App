"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Loader2, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  TaskType,
  TodoItemType,
  UserTaskType,
} from "@/schemaValidations/task.schema";
import { TodoListAssignees } from "@/app/(admin)/workspace/components/task-details/todo-list-assignees";
import TodoTimePicker from "@/app/(admin)/workspace/components/task-details/todo-time-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskApiRequests } from "@/requests/task.request";
import { TASK_QUERY_KEY } from "@/queries/task-query";
import { toast } from "sonner";

export default function TodoList({ task }: { task: TaskType }) {
  // Initialize with two example todos
  const [todos, setTodos] = useState<TodoItemType[]>(task.todoLists || []);
  // Keep track of original todos for cancellation
  const [originalTodos, setOriginalTodos] = useState<TodoItemType[]>(todos);

  // Track if there are unsaved changes
  const [hasChanges, setHasChanges] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (todos: TodoItemType[]) => {
      const todosBody = todos.map((todo) => ({
        id: todo.id,
        order: todo.order,
        content: todo.content,
        isDone: todo.isDone,
        startDate: todo.startDate,
        deadline: todo.deadline,
        userIds: todo.users.map((user) => user.id),
      }));
      await TaskApiRequests.syncTodoList(task.id, todosBody);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, task.id] });
      setOriginalTodos(todos);
      setHasChanges(false);
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY, task.id] });
      toast.error("Có lỗi xảy ra!");
    },
  });

  // Update the form when todos change
  // useState(() => {
  //   form.reset({ todos });
  // });

  // Check for changes whenever todos are updated
  useEffect(() => {
    // Simple comparison - in a real app you might want a deeper comparison
    const todosChanged =
      JSON.stringify(todos) !== JSON.stringify(originalTodos);
    setHasChanges(todosChanged);
  }, [todos, originalTodos]);

  // Add a new todo
  const addTodo = () => {
    const maxId = todos.reduce(
      (max, todo) => (todo.order > max ? todo.order : max),
      0
    );
    const newTodo: TodoItemType = {
      order: maxId + 1,
      content: "",
      isDone: false,
      startDate: null,
      deadline: null,
      users: [],
    };
    setTodos([...todos, newTodo]);
  };

  // Toggle todo completion
  const toggleTodo = (order: number) => {
    setTodos(
      todos.map((todo) =>
        todo.order === order ? { ...todo, isDone: !todo.isDone } : todo
      )
    );
  };

  // Update todo text
  const updateTodoText = (order: number, content: string) => {
    setTodos(
      todos.map((todo) => (todo.order === order ? { ...todo, content } : todo))
    );
  };

  // Delete a todo
  const deleteTodo = (order: number) => {
    setTodos(todos.filter((todo) => todo.order !== order));
  };

  // Cancel changes and revert to original todos
  const cancelChanges = () => {
    setTodos([...originalTodos]);
    setHasChanges(false);
  };

  // Update todo users
  const updateTodoUsers = (order: number, users: UserTaskType[]) => {
    setTodos(
      todos.map((todo) => (todo.order === order ? { ...todo, users } : todo))
    );
  };

  // Update todo startDate and deadline
  const updateTodoTime = (
    order: number,
    startDate: Date | null,
    deadline: Date | null
  ) => {
    setTodos(
      todos.map((todo) =>
        todo.order === order ? { ...todo, startDate, deadline } : todo
      )
    );
  };

  return (
    <div className="w-full pb-2">
      <div className="bg-orange-100 rounded-full inline-block px-3 py-1 mb-1">
        <h1 className="font-semibold text-base text-orange-500">
          <CalendarCheck className="inline w-4 h-4 mb-1" /> Todo List
        </h1>
      </div>

      {todos.map((todo) => (
        <div
          key={todo.order}
          className="flex items-center space-x-2 px-1 border-b"
        >
          <Checkbox
            id={`todo-${todo.order}`}
            checked={todo.isDone}
            onCheckedChange={() => toggleTodo(todo.order)}
            className={cn("h-4 w-4 border-2")}
          />
          <div className="flex-1">
            <Input
              value={todo.content}
              onChange={(e) => {
                updateTodoText(todo.order, e.target.value);
              }}
              className={cn(
                "border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-base",
                todo.isDone && "text-gray-500 dark:text-gray-400 line-through"
              )}
              placeholder="Điền todo mới..."
            />
          </div>
          <div className="flex flex-row">
            <TodoListAssignees
              users={todo.users}
              usersInTask={task.users}
              onUpdateUsers={(users) => updateTodoUsers(todo.order, users)}
            />
            <TodoTimePicker
              startDate={todo.startDate}
              deadline={todo.deadline}
              onUpdateTime={(startDate, deadline) =>
                updateTodoTime(todo.order, startDate, deadline)
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo(todo.order)}
              className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
              aria-label="Delete todo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </Button>
          </div>
        </div>
      ))}

      <div className="flex gap-2 mt-1 items-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addTodo}
          className="py-0 items-center text-sm ps-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
        >
          <Plus className="h-5 w-5 text-orange-500" />
          Todo mới
        </Button>

        {hasChanges && (
          <>
            <Button
              type="button"
              variant="fime-outline"
              size="sm"
              onClick={() => mutation.mutate(todos)}
              disabled={mutation.isPending}
              className="flex items-center gap-2 "
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Lưu
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={cancelChanges}
              disabled={mutation.isPending}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <X className="h-4 w-4" />
              Hủy
            </Button>
          </>
        )}
      </div>

      <div className="mt-2 px-1 space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span className="text-primary text-sm">Tiến trình</span>
          <span>
            {originalTodos.filter((todo) => todo.isDone).length}/
            {originalTodos.length}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full !transition-all !duration-300 !ease-in-out"
            style={{
              width: `${
                originalTodos.length > 0
                  ? (originalTodos.filter((todo) => todo.isDone).length /
                      originalTodos.length) *
                    100
                  : 0
              }%`,
            }}
            role="progressbar"
            aria-valuenow={
              originalTodos.length > 0
                ? Math.round(
                    (originalTodos.filter((todo) => todo.isDone).length /
                      originalTodos.length) *
                      100
                  )
                : 0
            }
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </div>
  );
}
