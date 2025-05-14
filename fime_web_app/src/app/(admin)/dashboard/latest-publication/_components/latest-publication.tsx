"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilIcon, CheckCircle, Trash2Icon, Plus } from "lucide-react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { PublicationApiRequests } from "@/requests/publication.request";
import {
  PUBLICATIONS_QUERY_KEY,
  publicationsQueryOptions,
} from "@/queries/publication-query";
import PublicationFormDialog from "@/app/(admin)/dashboard/latest-publication/_components/form-dialog";
import { useSearchParams } from "next/navigation";
import { LatestPublicationType } from "@/schemaValidations/publication.schema";
import { FimeTitle } from "@/components/fime-title";
import DeleteConfirmationDialog from "@/app/(admin)/dashboard/latest-publication/_components/delete-dialog";
import { FimeOutlineButton } from "@/components/fime-outline-button";

export default function LatestPublicationsAdmin() {
  const searchParams = useSearchParams();

  const [selectedPublication, setSelectedPublication] = useState<Omit<
    LatestPublicationType,
    "createdAt" | "updatedAt"
  > | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [publicationToDelete, setPublicationToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: publications } = useSuspenseQuery(
    publicationsQueryOptions(searchParams.toString())
  );

  const toggleActiveMutation = useMutation({
    mutationFn: async (id: string) => {
      return await PublicationApiRequests.active(id);
    },
    onSuccess: () => {
      toast.success("Đã kích hoạt!");
      queryClient.invalidateQueries({ queryKey: [PUBLICATIONS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra!");
      console.error(error);
    },
  });

  const handleEditClick = (
    publication: Omit<LatestPublicationType, "createdAt" | "updatedAt">
  ) => {
    setSelectedPublication(publication);
    setIsEditDialogOpen(true);
  };

  const handleToggleActive = (id: string) => {
    toggleActiveMutation.mutate(id);
  };

  const handleDeleteClick = (publication: { id: string; title: string }) => {
    setPublicationToDelete(publication);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (publicationToDelete) {
      deleteMutation.mutate(publicationToDelete.id);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await PublicationApiRequests.delete(id);
    },
    onSuccess: () => {
      toast.success("Đã xóa ấn phẩm!");
      queryClient.invalidateQueries({ queryKey: [PUBLICATIONS_QUERY_KEY] });
      setIsDeleteDialogOpen(false);
      setPublicationToDelete(null);
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi xóa Publication!");
      console.error(error);
    },
  });

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <FimeTitle>
          <h1 className="text-2xl font-bold">
            Quản Lý Ấn Phẩm Mới Nhất - FIME Landing Page
          </h1>
        </FimeTitle>
        <FimeOutlineButton
          size="default"
          icon={Plus}
          onClick={() => setIsAddDialogOpen(true)}
        >
          Thêm
        </FimeOutlineButton>
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
        {publications.data?.map((publication) => (
          <Card
            key={publication.id}
            className={`transition-all flex flex-col justify-between ${
              publication.isActive
                ? "border-2 border-green-500 shadow-md"
                : "border border-gray-200"
            }`}
          >
            <CardContent className="pt-6">
              <div className="mb-2 flex justify-between items-start">
                <h2 className="text-xl font-semibold">{publication.title}</h2>
                {publication.isActive && (
                  <div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>

              {publication.note && (
                <p className="text-muted-foreground text-sm mb-4">
                  {publication.note}
                </p>
              )}

              <div className="bg-primary-foreground p-3 rounded-md mt-4 max-h-32 overflow-auto">
                <code className="text-xs break-all">
                  {publication.embed_code}
                </code>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-2 bottom-0">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(publication)}
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() =>
                    handleDeleteClick({
                      id: publication.id,
                      title: publication.title,
                    })
                  }
                >
                  <Trash2Icon className="h-4 w-4 mr-2" />
                  Xóa
                </Button>
              </div>

              <Button
                variant={
                  publication.isActive ? "secondary" : "animated-gradient"
                }
                size="sm"
                onClick={() => handleToggleActive(publication.id)}
                disabled={
                  toggleActiveMutation.isPending || publication.isActive
                }
              >
                {toggleActiveMutation.isPending &&
                toggleActiveMutation.variables === publication.id ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Loading...
                  </span>
                ) : publication.isActive ? (
                  "Đã kích hoạt"
                ) : (
                  "Kích hoạt"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <PublicationFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        publication={selectedPublication || undefined}
        mode="edit"
      />

      {/* Add Dialog */}
      <PublicationFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        mode="create"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setPublicationToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        description={`Bạn có chắc chắn muốn xóa ấn phẩm "${publicationToDelete?.title}"? Hành động này không thể hoàn tác.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
