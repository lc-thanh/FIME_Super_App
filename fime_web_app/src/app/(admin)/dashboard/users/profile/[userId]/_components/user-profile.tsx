"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Clock,
  FileText,
  ListTodo,
  Paperclip,
  Calendar,
  FilePenLine,
  Menu,
  Lock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useSuspenseQuery } from "@tanstack/react-query";
import { userProfileQueryOptions } from "@/queries/user-query";
import { UserRoleText } from "@/schemaValidations/user.schema";
import { UserAvatar } from "@/components/user-avatar";
import { useUserRoleStore } from "@/providers/user-role-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChangePasswordDialog from "@/app/(admin)/dashboard/users/profile/[userId]/_components/change-password-dialog";
import { useState } from "react";
import { FimeTitle } from "@/components/fime-title";

export default function UserProfile({ userId }: { userId: string }) {
  const { id, isAdmin } = useUserRoleStore((state) => state);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);
  const { data: userData } = useSuspenseQuery(userProfileQueryOptions(userId));
  if (!userData) {
    return (
      <div className="text-center text-muted-foreground">
        Không tìm thấy người dùng!
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    return status === "ACTIVE"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  return (
    <>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-4 -mt-4 flex items-center gap-2 sm:flex-row flex-col justify-end">
          {isAdmin() && (
            <Link
              href={`/dashboard/users/edit/${userId}`}
              aria-label="Edit User"
            >
              <Button variant="fime-outline">
                <FilePenLine className="w-4 h-4" />
                Chỉnh sửa (Quản trị)
              </Button>
            </Link>
          )}
          {id === userId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Menu className="w-4 h-4" />
                  Tùy chọn
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="text-sm text-muted-foreground hover:text-primary">
                  <div className="flex items-center gap-2">
                    <FilePenLine className="w-4 h-4" />
                    Chỉnh sửa thông tin
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm text-muted-foreground hover:text-primary">
                  <div
                    className="flex items-center gap-2"
                    onClick={() => setChangePasswordDialogOpen(true)}
                  >
                    <Lock className="w-4 h-4" />
                    Đổi mật khẩu
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <Card className="bg-orange-500/10 dark:bg-orange-300/10 py-2">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <UserAvatar
                  fullname={userData.fullname}
                  image={userData.image}
                  className="h-24 w-24 text-3xl font-bold"
                />

                <div className="flex-1 space-y-3">
                  <div>
                    <FimeTitle className="text-3xl font-bold">
                      {userData.fullname}
                    </FimeTitle>
                    <p className="text-muted-foreground text-lg">
                      {userData.positionName}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={getStatusColor(userData.status)}
                    >
                      {userData.status === "ACTIVE" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Đang hoạt động
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Không hoạt động
                        </>
                      )}
                    </Badge>

                    {userData.role.map((role) => {
                      if (role === "ADMIN")
                        return (
                          <Badge variant="fimeGradient" key={role}>
                            {UserRoleText[role]}
                          </Badge>
                        );
                      if (role === "MANAGER")
                        return (
                          <Badge
                            key={role}
                            className="bg-indigo-500 text-white hover:bg-indigo-500"
                          >
                            {UserRoleText[role]}
                          </Badge>
                        );
                      return (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                          key={role}
                        >
                          {UserRoleText[role]}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Số điện thoại
                      </p>
                      <p className="font-medium">{userData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Địa chỉ</p>
                      <p className="font-medium">{userData.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày sinh</p>
                      <p className="font-medium">
                        {userData.birthday
                          ? new Date(userData.birthday).toLocaleDateString(
                              "vi-VN"
                            )
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Thông tin tổ chức
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Ban</p>
                      <p className="font-medium">{userData.teamName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Gen</p>
                      <p className="font-medium">{userData.genName}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Thời gian hoạt động
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Tham gia
                    </span>
                    <span className="font-medium">
                      {formatDistanceToNow(new Date(userData.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Cập nhật lần cuối
                    </span>
                    <span className="font-medium">
                      {formatDistanceToNow(new Date(userData.updatedAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê hoạt động</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Công việc
                        </p>
                        <p className="font-semibold">{userData.taskCount}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <ListTodo className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          TodoList
                        </p>
                        <p className="font-semibold">
                          {userData.todoListCount}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Paperclip className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Tệp đính kèm
                        </p>
                        <p className="font-semibold">
                          {userData.taskAttachmentCount}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">ID: </span>
                  <span className="font-mono text-xs">{userData.id}</span>
                </div>
                <Separator />
                <div className="text-sm">
                  <span className="text-muted-foreground">Chức vụ ID: </span>
                  <span className="font-mono text-xs">
                    {userData.positionId}
                  </span>
                </div>
                <Separator />
                <div className="text-sm">
                  <span className="text-muted-foreground">Ban ID: </span>
                  <span className="font-mono text-xs">{userData.teamId}</span>
                </div>
                <Separator />
                <div className="text-sm">
                  <span className="text-muted-foreground">Gen ID: </span>
                  <span className="font-mono text-xs">{userData.genId}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        setOpen={setChangePasswordDialogOpen}
      />
    </>
  );
}
