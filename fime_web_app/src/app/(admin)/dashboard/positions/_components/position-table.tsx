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
import TableSearch from "@/components/data-table/table-search";
import SortableTableHead from "@/components/data-table/sortable-table-head";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FimeOutlineButton } from "@/components/fime-outline-button";
import dayjs from "dayjs";
import { positionsQueryOptions } from "@/queries/position-query";
import { PositionType } from "@/schemaValidations/position.schema";
import PositionDeleteButton from "@/app/(admin)/dashboard/positions/_components/position-delete-button";

export function PositionTable() {
  const searchParams = useSearchParams();

  const { data: positionsPaginated, isError } = useSuspenseQuery(
    positionsQueryOptions(searchParams.toString())
  );

  if (isError) {
    toast.error("Có lỗi xảy ra!");
  }

  return (
    <>
      <div className="flex mb-4 sm:flex-row flex-col justify-between">
        <div className="flex sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-2 sm:mb-0 mb-4">
          <TableSearch placeholder="Tìm kiếm.." />
        </div>

        <div className="flex flex-row">
          <Link href="/dashboard/positions/create">
            <FimeOutlineButton size="sm" icon={Plus}>
              Thêm chức vụ mới
            </FimeOutlineButton>
          </Link>
        </div>
      </div>

      <Table className="w-full text-center border">
        <TableHeader>
          <TableRow className="bg-primary-foreground">
            <TableHead className="text-center border-y">#</TableHead>
            <SortableTableHead orderName="name" className="text-center border">
              Tên chức vụ
            </SortableTableHead>
            <TableHead className="text-center border">Mô tả</TableHead>
            <SortableTableHead orderName="users" className="text-center border">
              Số thành viên
            </SortableTableHead>
            <SortableTableHead
              orderName="createdAt"
              className="text-center border"
            >
              Ngày tạo
            </SortableTableHead>
            <TableHead className="text-center border">Tùy chọn</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positionsPaginated?.data.map(
            (position: PositionType, index: number) => (
              <TableRow key={position.id}>
                <TableCell>{`${index + 1}.`}</TableCell>
                <TableCell className="min-w-[150px] font-medium">
                  {position.name}
                </TableCell>
                <TableCell>{position.description}</TableCell>
                <TableCell>{position.usersCount}</TableCell>
                <TableCell>
                  {dayjs(position.createdAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  <div className="flex flex-row h-full justify-center">
                    <Link href={`/dashboard/positions/edit/${position.id}`}>
                      <Button variant="ghost" size="icon">
                        <FilePenLine size={20} className="text-blue-500" />
                      </Button>
                    </Link>

                    <PositionDeleteButton positionId={position.id} />
                  </div>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={positionsPaginated?.totalPage ?? 0} />
      </div>
    </>
  );
}
