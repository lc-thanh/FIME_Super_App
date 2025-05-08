"use client";

import { UserTable } from "@/app/(admin)/dashboard/users/_components/user-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { FimeTitle } from "@/components/fime-title";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex flex-col mt-2 gap-4 w-full">
      <FimeTitle>
        <h1 className="scroll-m-20 ms-2 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
          Thành viên FIT Media
        </h1>
      </FimeTitle>

      <div className="w-full px-4">
        <Suspense
          fallback={
            <DataTableSkeleton
              columnCount={8}
              rowCount={6}
              showViewOptions={true}
              searchableColumnCount={1}
            />
          }
        >
          <UserTable />
        </Suspense>
      </div>
    </div>
  );
}
