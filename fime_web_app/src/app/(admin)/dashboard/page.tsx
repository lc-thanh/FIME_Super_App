import { CardGroupSkeleton } from "@/app/(admin)/dashboard/_components/card-group-skeleton";
import { CloudflareSection } from "@/app/(admin)/dashboard/_components/cloudflare-section";
import { TaskStatistics } from "@/app/(admin)/dashboard/_components/task-statistics";
import { UserActions } from "@/app/(admin)/dashboard/_components/user-actions";
import { FimeTitle } from "@/components/fime-title";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="container mx-auto space-y-4">
      <div>
        <FimeTitle>
          <span className="text-3xl font-bold leading-tight">
            Lượng truy cập Landing Page
          </span>
        </FimeTitle>
        <span className="text-muted-foreground ml-1">30 ngày gần nhất</span>
      </div>

      <Suspense
        fallback={
          <div className="w-full space-y-4">
            <CardGroupSkeleton />
            <Skeleton className="h-[460px] rounded-xl w-full" />
          </div>
        }
      >
        <CloudflareSection />
      </Suspense>

      <div>
        <FimeTitle className="pt-8">
          <span className="text-3xl font-bold leading-tight">Nội bộ</span>
        </FimeTitle>
      </div>
      <span className="text-muted-foreground">Công việc/Hoạt động</span>

      <Suspense fallback={<CardGroupSkeleton />}>
        <TaskStatistics />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-[360px] rounded-xl w-full" />}>
        <UserActions />
      </Suspense>
    </div>
  );
}
