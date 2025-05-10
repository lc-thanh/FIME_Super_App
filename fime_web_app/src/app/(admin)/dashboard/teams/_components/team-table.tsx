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
import { teamsQueryOptions } from "@/queries/team-query";
import { TeamType } from "@/schemaValidations/team.schema";
import dayjs from "dayjs";
import TeamDeleteButton from "@/app/(admin)/dashboard/teams/_components/team-delete-button";

export function TeamTable() {
  const searchParams = useSearchParams();

  const { data: teamsPaginated, isError } = useSuspenseQuery(
    teamsQueryOptions(searchParams.toString())
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
          <Link href="/dashboard/teams/create">
            <FimeOutlineButton size="sm" icon={Plus}>
              Thêm ban mới
            </FimeOutlineButton>
          </Link>
        </div>
      </div>

      <Table className="w-full text-center border">
        <TableHeader>
          <TableRow className="bg-primary-foreground">
            <TableHead className="text-center border-y">#</TableHead>
            <SortableTableHead orderName="name" className="text-center border">
              Tên ban
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
          {teamsPaginated?.data.map((team: TeamType, index: number) => (
            <TableRow key={team.id}>
              <TableCell>{`${index + 1}.`}</TableCell>
              <TableCell className="min-w-[150px] font-medium">
                {team.name}
              </TableCell>
              <TableCell>{team.description}</TableCell>
              <TableCell>{team.usersCount}</TableCell>
              <TableCell>
                {dayjs(team.createdAt).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell>
                <div className="flex flex-row h-full justify-center">
                  <Link href={`/dashboard/teams/edit/${team.id}`}>
                    <Button variant="ghost" size="icon">
                      <FilePenLine size={20} className="text-blue-500" />
                    </Button>
                  </Link>

                  <TeamDeleteButton teamId={team.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={teamsPaginated?.totalPage ?? 0} />
      </div>
    </>
  );
}
