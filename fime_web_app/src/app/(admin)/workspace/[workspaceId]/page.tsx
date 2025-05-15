import NewTaskDialog from "@/app/(admin)/workspace/components/task-details/new-task-dialog";
import { TaskBoard } from "@/app/(admin)/workspace/components/task-board";
import ActionSearchBar from "@/components/action-search-bar";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getQueryClient } from "@/lib/get-query-client";
import { taskCardsQueryOptions } from "@/queries/task-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import TaskDialog from "@/app/(admin)/workspace/components/task-details/task-dialog";
import CardContextMenu from "@/app/(admin)/workspace/components/task-card/card-context-menu";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(taskCardsQueryOptions(workspaceId));

  return (
    <div className="flex w-full flex-col gap-4 w-ful align-middle">
      <TaskDialog />
      <CardContextMenu />

      <header className="flex py-4 bg-fimeOrangeLighter dark:bg-orange-900 flex-row w-full justify-content-evenly pe-4 h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex flex-row w-full justify-content-start items-center gap-2 px-4">
          <SidebarTrigger className="text-white" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl text-white font-bold tracking-tight first:mt-0">
            Quản lý công việc
          </h1>
        </div>
        <div className="flex flex-row gap-4">
          <ActionSearchBar />
          <ModeToggle />
        </div>
      </header>

      <div className="w-full px-4 flex flex-row justify-between items-center">
        <div></div>
        <NewTaskDialog />
      </div>

      <div className="w-fit m-auto">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <TaskBoard workspaceId={workspaceId} />
        </HydrationBoundary>
      </div>
    </div>
  );
}
