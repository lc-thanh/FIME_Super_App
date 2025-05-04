"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { DialogTitle } from "@radix-ui/react-dialog";
import "@/app/(admin)/task/components/style.css";
import { TaskType } from "@/schemaValidations/task.schema";
import TodoList from "@/app/(admin)/task/components/task-details/todo-list";
import TaskTitle from "@/app/(admin)/task/components/task-details/task-title";

// Tiptap - Text editor
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function TaskDialogContent({ title }: Pick<TaskType, "title">) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<string | undefined>(undefined);

  return (
    <DialogContent
      id="new-task-dialog-container"
      className="max-w-4xl p-0 max-h-[90vh]"
      aria-describedby={undefined}
    >
      <DialogTitle className="hidden">New Task Dialog</DialogTitle>
      <CardContent className="p-2 pr-4 pb-4 pt-8 bg-card gradient-box max-h-[90vh]">
        <div className="p-6 pr-4 pt-0 pb-2 h-full overflow-auto">
          {/* Task Title */}
          <TaskTitle initialTitle={title} className="mb-6" />

          <div className="space-y-6">
            {/* Todo List */}
            <div>
              <TodoList />
            </div>

            {/* Description */}
            <div>
              {/* <Tiptap /> */}
              <SimpleEditor />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Ngày bắt đầu
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal text-gray-400 border-gray-300"
                    >
                      {startDate
                        ? format(startDate, "dd/MM/yyyy", { locale: vi })
                        : "Điền ngày bắt đầu"}
                      <Calendar className="h-4 w-4 text-indigo-600" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Deadline
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal text-gray-400 border-gray-300"
                    >
                      {endDate
                        ? format(endDate, "dd/MM/yyyy", { locale: vi })
                        : "Điền ngày hoàn thành"}
                      <Calendar className="h-4 w-4 text-rose-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Status and Assignee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Chọn trạng thái
                </label>
                <Select>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Chưa làm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-started">Chưa làm</SelectItem>
                    <SelectItem value="in-progress">Đang làm</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Chọn người làm
                </label>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300"
                >
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
                    className="text-orange-500 mr-2"
                  >
                    <circle cx="12" cy="8" r="5" />
                    <path d="M20 21a8 8 0 0 0-16 0" />
                  </svg>
                  Chọn thành viên
                </Button>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                Đính kèm
              </label>
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
            </div>

            {/* Priority */}
            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                Mức độ ưu tiên
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className={`rounded-full px-6 ${
                    priority === "high"
                      ? "bg-red-100 text-red-500 border-red-200"
                      : "hover:bg-red-50 hover:text-red-500"
                  }`}
                  onClick={() => setPriority("high")}
                >
                  Cao
                </Button>
                <Button
                  variant="outline"
                  className={`rounded-full px-6 ${
                    priority === "medium"
                      ? "bg-amber-100 text-amber-500 border-amber-200"
                      : "hover:bg-amber-50 hover:text-amber-500"
                  }`}
                  onClick={() => setPriority("medium")}
                >
                  Trung bình
                </Button>
                <Button
                  variant="outline"
                  className={`rounded-full px-6 ${
                    priority === "low"
                      ? "bg-green-100 text-green-500 border-green-200"
                      : "hover:bg-green-50 hover:text-green-500"
                  }`}
                  onClick={() => setPriority("low")}
                >
                  Thấp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </DialogContent>
  );
}
