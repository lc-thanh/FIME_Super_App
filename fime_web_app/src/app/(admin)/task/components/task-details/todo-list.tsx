"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Loader2, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { TodoItemType } from "@/schemaValidations/task.schema";

// Mock API function
const saveTodosToAPI = async (
  todos: TodoItemType[]
): Promise<TodoItemType[]> => {
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Saved todos to API:", todos);
      resolve(todos);
    }, 1000);
  });
};

export default function TodoList() {
  // Initialize with two example todos
  const [todos, setTodos] = useState<TodoItemType[]>([
    {
      id: "c40e6dcf-e019-46b8-9c5e-12b79e2f36e9",
      order: 0,
      content: "Ví dụ: Chuẩn bị source",
      isDone: true,
    },
    {
      id: "357f53d2-ab24-4ded-a1bf-61e401d04b89",
      order: 1,
      content: "Ví dụ: Chỉnh màu",
      isDone: false,
    },
  ]);
  // Keep track of original todos for cancellation
  const [originalTodos, setOriginalTodos] = useState<TodoItemType[]>(todos);

  // Track if there are unsaved changes
  const [hasChanges, setHasChanges] = useState(false);

  // Track loading state for save button
  const [isSaving, setIsSaving] = useState(false);

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

  // Save todos to API
  const saveTodos = async () => {
    setIsSaving(true);
    try {
      const savedTodos = await saveTodosToAPI(todos);
      setOriginalTodos(savedTodos);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save todos:", error);
      // You could add error handling UI here
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel changes and revert to original todos
  const cancelChanges = () => {
    setTodos([...originalTodos]);
    setHasChanges(false);
  };

  return (
    <div className="w-full">
      <div className="bg-orange-100 rounded-full inline-block px-3 py-1 mb-1">
        <h1 className="font-semibold text-base text-orange-500">
          <CalendarCheck className="inline w-4 h-4 mb-1" /> Todo List
        </h1>
      </div>

      {todos.map((todo) => (
        <div
          key={todo.order}
          className="flex items-center space-x-2 p-1 border-b"
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
                "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-base",
                todo.isDone && "text-gray-500 dark:text-gray-400 line-through"
              )}
              placeholder="Enter a todo item"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => deleteTodo(todo.order)}
            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
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
              onClick={saveTodos}
              disabled={isSaving}
              className="flex items-center gap-2 "
            >
              {isSaving ? (
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
              disabled={isSaving}
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
