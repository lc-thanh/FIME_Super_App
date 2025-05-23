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
import { gensQueryOptions } from "@/queries/gen-query";
import { GenType } from "@/schemaValidations/gen.schema";
import GenDeleteButton from "@/app/(admin)/dashboard/gens/_components/gen-delete-button";
import { useUserRoleStore } from "@/providers/user-role-provider";

export function GenTable() {
  const { isAdmin } = useUserRoleStore((state) => state);
  const searchParams = useSearchParams();

  const { data: gensPaginated, isError } = useSuspenseQuery(
    gensQueryOptions(searchParams.toString())
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

        {isAdmin() && (
          <Link href="/dashboard/gens/create">
            <FimeOutlineButton size="sm" icon={Plus}>
              Thêm Gen mới
            </FimeOutlineButton>
          </Link>
        )}
      </div>

      <Table className="w-full text-center border">
        <TableHeader>
          <TableRow className="bg-primary-foreground">
            <TableHead className="text-center border-y">#</TableHead>
            <SortableTableHead orderName="name" className="text-center border">
              Tên Gen
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
            {isAdmin() && (
              <TableHead className="text-center border">Tùy chọn</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {gensPaginated?.data.map((gen: GenType, index: number) => (
            <TableRow key={gen.id}>
              <TableCell>{`${index + 1}.`}</TableCell>
              <TableCell className="min-w-[150px] font-medium">
                {gen.name}
              </TableCell>
              <TableCell>{gen.description}</TableCell>
              <TableCell>{gen.usersCount}</TableCell>
              <TableCell>{dayjs(gen.createdAt).format("DD/MM/YYYY")}</TableCell>
              {isAdmin() && (
                <TableCell>
                  <div className="flex flex-row h-full justify-center">
                    <Link href={`/dashboard/gens/edit/${gen.id}`}>
                      <Button variant="ghost" size="icon">
                        <FilePenLine size={20} className="text-blue-500" />
                      </Button>
                    </Link>

                    <GenDeleteButton genId={gen.id} />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={gensPaginated?.totalPage ?? 0} />
      </div>
    </>
  );
}
