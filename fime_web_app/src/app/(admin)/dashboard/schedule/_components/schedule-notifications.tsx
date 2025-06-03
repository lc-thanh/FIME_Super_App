"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Clock,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { type Event } from "@/app/(admin)/dashboard/schedule/_components/event-calendar";
import {
  formatDate,
  getPriorityColor,
  getPriorityText,
  isDueTodayOrTomorrow,
  isOverdue,
} from "@/lib/schedule-utils";
import { TaskAssignees } from "@/app/(admin)/workspace/components/task-card/task-assignees";
import Link from "next/link";
import { TYPE_TEXT } from "@/app/(admin)/workspace/components/task-card/task-type-badge";

interface NotificationItemProps {
  event: Event;
  isOverdue?: boolean;
}

function NotificationItem({ event, isOverdue = false }: NotificationItemProps) {
  return (
    <div
      className={`p-4 rounded-lg border-l-4 ${
        isOverdue
          ? "border-l-red-500 bg-red-50"
          : "border-l-orange-500 bg-orange-50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/workspace/${event.workspaceId}?task=${
                event.taskId ? event.taskId : event.id
              }`}
            >
              <h4 className="font-semibold text-gray-900">{event.title}</h4>
            </Link>
            <Badge variant="outline" className="text-xs">
              {TYPE_TEXT[event.type]}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs ${getPriorityColor(event.priority)}`}
            >
              {getPriorityText(event.priority)}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Hạn: {formatDate(event.deadline)}</span>
            </div>
            {isOverdue && (
              <div className="flex items-center gap-1 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Quá hạn</span>
              </div>
            )}
            {!isOverdue && (
              <div className="flex items-center gap-1 text-orange-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Sắp hết hạn</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <div className="flex -space-x-2">
              <TaskAssignees assignees={event.users} maxVisible={3} />
              {event.users.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">
                    +{event.users.length - 3}
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500 ml-1">
              {event.users.length} người tham gia
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScheduleNotifications({ tasks }: { tasks: Event[] }) {
  const [showOverdue, setShowOverdue] = useState(false);
  const [showUpcoming, setShowUpcoming] = useState(false);

  // Lọc các events theo điều kiện
  const overdueEvents = tasks.filter((event) => isOverdue(event.deadline));

  const upcomingEvents = tasks.filter((event) =>
    isDueTodayOrTomorrow(event.deadline)
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6">
      {/* Thông báo công việc quá hạn */}
      <Card className="border-red-200">
        <CardHeader className="bg-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-red-800">
                  Công Việc Quá Hạn
                </CardTitle>
                <p className="text-sm text-red-600 mt-1">
                  {overdueEvents.length} công việc cần xử lý ngay
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOverdue(!showOverdue)}
              className="text-red-600 hover:text-red-700 hover:bg-red-100"
            >
              {showOverdue ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        {showOverdue && (
          <CardContent className="p-0">
            {overdueEvents.length > 0 ? (
              <div className="space-y-3 p-6">
                {overdueEvents.map((event) => (
                  <NotificationItem
                    key={event.id}
                    event={event}
                    isOverdue={true}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Không có công việc quá hạn</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Thông báo công việc sắp hết hạn */}
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-orange-800">
                  Công Việc Sắp Hết Hạn
                </CardTitle>
                <p className="text-sm text-orange-600 mt-1">
                  {upcomingEvents.length} công việc hết hạn hôm nay hoặc ngày
                  mai
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUpcoming(!showUpcoming)}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-100"
            >
              {showUpcoming ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        {showUpcoming && (
          <CardContent className="p-0">
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3 p-6">
                {upcomingEvents.map((event) => (
                  <NotificationItem
                    key={event.id}
                    event={event}
                    isOverdue={false}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Không có công việc sắp hết hạn</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
