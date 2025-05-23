"use client";

import { TeamTable } from "@/app/(admin)/dashboard/teams/_components/team-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { FimeTitle } from "@/components/fime-title";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex flex-col container mx-auto px-4 mt-2 gap-4 w-full">
      <FimeTitle>
        <h1 className="scroll-m-20 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
          Thông tin các ban
        </h1>
      </FimeTitle>

      <div className="w-full">
        <Suspense
          fallback={
            <DataTableSkeleton
              columnCount={6}
              rowCount={4}
              showViewOptions={true}
              searchableColumnCount={1}
            />
          }
        >
          <TeamTable />
        </Suspense>
      </div>
    </div>
  );
}
