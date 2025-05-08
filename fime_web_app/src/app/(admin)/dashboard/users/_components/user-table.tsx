"use client";

import { Button } from "@/components/ui/button";
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
import { FilePenLine, Plus } from "lucide-react";
import Link from "next/link";
import Pagination from "@/components/data-table/my-pagination";
import { TableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import TableSearch from "@/components/data-table/table-search";
import SortableTableHead from "@/components/data-table/sortable-table-head";
import UserDeleteButton from "@/app/(admin)/dashboard/users/_components/user-delete-button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/queries/user-query";
import { UserType } from "@/schemaValidations/user.schema";
import { FimeOutlineButton } from "@/components/fime-outline-button";
import { StatusBadge } from "@/components/status-badge";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";

export function UserTable() {
  const searchParams = useSearchParams();

  const { data: usersPaginated, isError } = useSuspenseQuery(
    userQueryOptions(searchParams.toString())
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
            title="Danh mục"
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

        <div className="flex flex-row">
          <Link href="/dashboard/users/create">
            <FimeOutlineButton size="sm" icon={Plus}>
              Thêm thành viên
            </FimeOutlineButton>
          </Link>
        </div>
      </div>

      {/* {isLoading ? (
        <DataTableSkeleton
          columnCount={8}
          rowCount={6}
          showViewOptions={false}
        />
      ) : ( */}
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
            <TableHead className="text-center border">Tùy chọn</TableHead>
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
                  {user.fullname}
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
              <TableCell className="flex gap-2 items-center justify-center">
                {user.role.map((role) => {
                  if (role === "ADMIN")
                    return (
                      <Badge variant="fimeGradient" key={role}>
                        Admin
                      </Badge>
                    );
                  return (
                    <Badge variant="outline" key={role}>
                      {role}
                    </Badge>
                  );
                })}
              </TableCell>
              <TableCell>
                <div className="flex flex-row h-full justify-center">
                  <Link href={`/dashboard/book/edit/${user.id}`}>
                    <Button variant="ghost" size="icon">
                      <FilePenLine size={20} className="text-blue-500" />
                    </Button>
                  </Link>

                  <UserDeleteButton
                    // id={user.id}
                    callback={() => {
                      console.log("delete user", user.id);
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
      </Table>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={usersPaginated?.totalPage ?? 0} />
      </div>
    </>
  );
}
