"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/data-table/my-pagination";
import { TableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import TableSearch from "@/components/data-table/table-search";
import SortableTableHead from "@/components/data-table/sortable-table-head";
import { useSuspenseQuery } from "@tanstack/react-query";
import { userTableQueryOptions } from "@/queries/user-query";
import { UserRoleText, UserType } from "@/schemaValidations/user.schema";
import { FimeOutlineButton } from "@/components/fime-outline-button";
import { StatusBadge } from "@/components/status-badge";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";
import UserTableRowActions from "@/app/(admin)/dashboard/users/_components/table-row-actions";
import { useState } from "react";
import DeleteUserDialog from "@/app/(admin)/dashboard/users/_components/delete-user-dialog";
import ResetPasswordDialog from "@/app/(admin)/dashboard/users/_components/reset-password-dialog";
import LockUserDialog from "@/app/(admin)/dashboard/users/_components/lock-user-dialog";
import UnlockUserDialog from "@/app/(admin)/dashboard/users/_components/unlock-user-dialog";
import { useUserRoleStore } from "@/providers/user-role-provider";

export function UserTable() {
  const { isAdmin } = useUserRoleStore((state) => state);

  const searchParams = useSearchParams();
  const [actionId, setActionId] = useState<string>("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
  const [openLockDialog, setOpenLockDialog] = useState(false);
  const [openUnlockDialog, setOpenUnlockDialog] = useState(false);

  const { data: usersPaginated, isError } = useSuspenseQuery(
    userTableQueryOptions(searchParams.toString())
  );

  if (isError) {
    toast.error("Có lỗi xảy ra!");
  }

  return (
    <>
      <div className="flex mb-4 sm:flex-row flex-col justify-between">
        <div className="flex sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-2 sm:mb-0 mb-4">
          <TableSearch placeholder="Tìm kiếm.." />

          <TableFacetedFilter
            title="Ban"
            filterName="categoryIds"
            options={
              // categories.map((category) => ({
              //   label: category.name,
              //   value: category.id,
              //   count: !searchParams.get("searchString")?.toString()
              //     ? category.booksCount
              //     : undefined,
              // })) ?? []
              []
            }
          />
        </div>

        {isAdmin() && (
          <Link href="/dashboard/users/create">
            <FimeOutlineButton size="sm" icon={Plus}>
              Thêm thành viên
            </FimeOutlineButton>
          </Link>
        )}
      </div>

      <Table className="w-full text-center border">
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow className="bg-primary-foreground">
            <TableHead className="text-center border-y">#</TableHead>
            <SortableTableHead
              orderName="fullname"
              className="text-center border"
            >
              Họ và tên
            </SortableTableHead>
            <TableHead className="text-center border">Trạng thái</TableHead>
            <TableHead className="text-center border">Chức vụ</TableHead>
            <TableHead className="text-center border">Ban</TableHead>
            <TableHead className="text-center border">Email</TableHead>
            <TableHead className="text-center border">Gen</TableHead>
            <TableHead className="text-center border">Vai trò</TableHead>
            {isAdmin() && (
              <TableHead className="text-center border">Tùy chọn</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersPaginated?.data.map((user: UserType, index: number) => (
            <TableRow key={user.id}>
              <TableCell>{`${index + 1}.`}</TableCell>
              <TableCell className="min-w-[150px] font-medium">
                <div className="flex flex-row h-full ps-[5%] items-center">
                  <UserAvatar
                    image={user.image}
                    fullname={user.fullname}
                    className="me-2"
                  />
                  <Link
                    href={`/dashboard/users/profile/${user.id}`}
                    className="hover:underline"
                  >
                    {user.fullname}
                  </Link>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-row h-full justify-center">
                  {<StatusBadge status={user.status} />}
                </div>
              </TableCell>
              <TableCell>{user.positionName}</TableCell>
              <TableCell>{user.teamName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.genName}</TableCell>
              <TableCell className="space-x-1 space-y-1 max-w-52">
                {user.role.map((role) => {
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
                    <Badge variant="outline" key={role}>
                      {UserRoleText[role]}
                    </Badge>
                  );
                })}
              </TableCell>
              {isAdmin() && (
                <TableCell>
                  <div className="flex flex-row h-full justify-center">
                    <UserTableRowActions
                      id={user.id}
                      fullName={user.fullname}
                      islocked={user.status === "BANNED"}
                      setActionId={setActionId}
                      setOpenDeleteDialog={setOpenDeleteDialog}
                      setOpenResetPasswordDialog={setOpenResetPasswordDialog}
                      setOpenLockDialog={setOpenLockDialog}
                      setOpenUnlockDialog={setOpenUnlockDialog}
                    />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteUserDialog
        id={actionId}
        fullname={
          usersPaginated?.data.find((user) => user.id === actionId)?.fullname ??
          ""
        }
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
      />

      <ResetPasswordDialog
        id={actionId}
        fullname={
          usersPaginated?.data.find((user) => user.id === actionId)?.fullname ??
          ""
        }
        open={openResetPasswordDialog}
        setOpen={setOpenResetPasswordDialog}
      />

      <LockUserDialog
        id={actionId}
        fullname={
          usersPaginated?.data.find((user) => user.id === actionId)?.fullname ??
          ""
        }
        open={openLockDialog}
        setOpen={setOpenLockDialog}
      />

      <UnlockUserDialog
        id={actionId}
        fullname={
          usersPaginated?.data.find((user) => user.id === actionId)?.fullname ??
          ""
        }
        open={openUnlockDialog}
        setOpen={setOpenUnlockDialog}
      />

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={usersPaginated?.totalPage ?? 0} />
      </div>
    </>
  );
}
