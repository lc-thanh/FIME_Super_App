"use client";

import {
  EventCalendar,
  type Event,
} from "@/app/(admin)/dashboard/schedule/_components/event-calendar";
import { scheduleQueryOptions } from "@/queries/task-query";
import { useSuspenseQuery } from "@tanstack/react-query";

// Sample tasks data
const sampleTasks: Event[] = [
  {
    id: "1",
    title: "Họp ban truyền thông",
    startDate: new Date(2025, 4, 10),
    deadline: new Date(2025, 4, 10, 12, 0),
    description: "Thảo luận về kế hoạch truyền thông tháng 5",
    users: "Nguyễn Văn A",
    priority: "high",
    status: "Đang thực hiện",
  },
  {
    id: "2",
    title: "Thiết kế poster sự kiện",
    startDate: new Date(2025, 4, 12),
    deadline: new Date(2025, 4, 15),
    description: "Thiết kế poster cho sự kiện ngày hội việc làm",
    users: "Trần Thị B",
    priority: "medium",
    status: "Chưa bắt đầu",
  },
  {
    id: "3",
    title: "Quay video giới thiệu khoa",
    startDate: new Date(2025, 4, 15),
    deadline: new Date(2025, 4, 20),
    description: "Quay và biên tập video giới thiệu khoa CNTT",
    users: "Lê Văn C",
    priority: "medium",
    status: "Chưa bắt đầu",
  },
  {
    id: "4",
    title: "Đăng bài trên fanpage",
    startDate: new Date(2025, 4, 5),
    deadline: new Date(2025, 4, 5, 18, 0),
    description: "Đăng bài thông báo lịch thi học kỳ",
    users: "Phạm Thị D",
    priority: "low",
    status: "Hoàn thành",
  },
  {
    id: "5",
    title: "Cập nhật website khoa",
    startDate: new Date(2025, 4, 8),
    deadline: new Date(2025, 4, 12),
    description: "Cập nhật thông tin mới về chương trình đào tạo",
    users: "Nguyễn Văn E",
    priority: "high",
    status: "Đang thực hiện",
  },
  {
    id: "6",
    title: "Tổng kết hoạt động tháng 4",
    startDate: new Date(2025, 4, 28),
    deadline: new Date(2025, 4, 30),
    description: "Tổng hợp báo cáo hoạt động truyền thông tháng 4",
    users: "Trần Văn F",
    priority: "medium",
    status: "Chưa bắt đầu",
  },
  {
    id: "7",
    title: "Thiết kế poster sự kiện 2",
    startDate: new Date(2025, 4, 12),
    deadline: new Date(2025, 4, 15),
    description: "Thiết kế poster cho sự kiện ngày hội việc làm",
    users: "Trần Thị B",
    priority: "medium",
    status: "Chưa bắt đầu",
  },
  {
    id: "8",
    title: "Thiết kế poster sự kiện 3",
    startDate: new Date(2025, 4, 12),
    deadline: new Date(2025, 4, 15),
    description: "Thiết kế poster cho sự kiện ngày hội việc làm",
    users:
      "Trần Thị B, Trần Thị B, Trần Thị B, Trần Thị B, Trần Thị B, Trần Thị B",
    priority: "high",
    status: "Chưa bắt đầu",
  },
];

export default function Schedule() {
  const { data: schedule } = useSuspenseQuery(scheduleQueryOptions());

  return (
    <div className="w-full container mx-auto mb-4">
      <EventCalendar tasks={schedule} />
    </div>
  );
}
