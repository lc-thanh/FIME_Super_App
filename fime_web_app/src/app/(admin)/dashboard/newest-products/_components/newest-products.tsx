"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2Icon, Plus, Calendar, Link2 } from "lucide-react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { NewestProductApiRequests } from "@/requests/newest-product.request";
import {
  NEWEST_PRODUCTS_QUERY_KEY,
  newestProductsQueryOptions,
} from "@/queries/newest-product-query";
import { useSearchParams } from "next/navigation";
import { FimeTitle } from "@/components/fime-title";
import { FimeOutlineButton } from "@/components/fime-outline-button";
import Image from "next/image";
import dayjs from "dayjs";
import NewestProductFormDialog from "@/app/(admin)/dashboard/newest-products/_components/form-dialog";
import { NewestProductType } from "@/schemaValidations/newest-product.schema";
import MyPagination from "@/components/data-table/my-pagination";
import DeleteConfirmationDialog from "@/app/(admin)/dashboard/newest-products/_components/delete-dialog";
import { getProductImageUrl } from "@/lib/utils";
import { useUserRoleStore } from "@/providers/user-role-provider";

export default function NewestProductsAdmin() {
  const { isManager } = useUserRoleStore((state) => state);
  const searchParams = useSearchParams();

  const [selectedProduction, setSelectedProduction] = useState<Omit<
    NewestProductType,
    "createdAt" | "updatedAt"
  > | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productionToDelete, setProductionToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: productions } = useSuspenseQuery(
    newestProductsQueryOptions(searchParams.toString())
  );

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await NewestProductApiRequests.delete(id);
    },
    onSuccess: () => {
      toast.success("Đã xóa sản phẩm!");
      queryClient.invalidateQueries({ queryKey: [NEWEST_PRODUCTS_QUERY_KEY] });
      setIsDeleteDialogOpen(false);
      setProductionToDelete(null);
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi xóa sản phẩm!");
      console.error(error);
    },
  });

  const handleEditClick = (
    production: Omit<NewestProductType, "createdAt" | "updatedAt">
  ) => {
    setSelectedProduction(production);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (production: { id: string; title: string }) => {
    setProductionToDelete(production);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productionToDelete) {
      deleteMutation.mutate(productionToDelete.id);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <FimeTitle>
          <h1 className="text-2xl font-bold">
            Quản Lý Các Sản Phẩm Gần Đây - FIME Landing Page
          </h1>
        </FimeTitle>
        {isManager() && (
          <FimeOutlineButton
            size="default"
            icon={Plus}
            onClick={() => setIsAddDialogOpen(true)}
          >
            Thêm
          </FimeOutlineButton>
        )}
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productions.data?.map((product) => (
          <Card
            key={product.id}
            className="transition-all flex flex-col justify-between"
          >
            <CardContent className="p-0">
              <div
                className="relative w-full overflow-hidden rounded-md"
                style={{
                  width: "100%",
                  aspectRatio: "3/2",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={
                    getProductImageUrl(product?.image || "") ||
                    "/newest-product/newest-product_cover.jpg"
                  }
                  alt={product.title}
                  fill
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div className="p-4 px-6">
                <div className="mb-2 flex justify-between items-start">
                  <h2 className="text-xl font-semibold">{product.title}</h2>
                </div>

                <div className="flex items-center text-muted-foreground text-sm mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {product.date && dayjs(product.date).format("DD/MM/YYYY")}
                  </span>
                </div>

                {product.note && (
                  <p className="text-muted-foreground text-sm mb-4">
                    {product.note.slice(0, 180)}...
                  </p>
                )}

                {product.link && (
                  <div className="flex items-center text-sm text-blue-500 mb-4">
                    <div>
                      <Link2 className="h-4 w-4 mr-1" />
                    </div>
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate hover:underline"
                    >
                      {product.link}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-2 bottom-0">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(product)}
                  disabled={!isManager()}
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={!isManager()}
                  onClick={() =>
                    handleDeleteClick({
                      id: product.id,
                      title: product.title,
                    })
                  }
                >
                  <Trash2Icon className="h-4 w-4 mr-2" />
                  Xóa
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {productions.totalPage > 1 && (
        <div className="mt-8 flex justify-center">
          <MyPagination totalPages={productions.totalPage} />
        </div>
      )}

      {/* Edit Dialog */}
      <NewestProductFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        product={selectedProduction || undefined}
        mode="edit"
      />

      {/* Add Dialog */}
      <NewestProductFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        mode="create"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setProductionToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        description={`Bạn có chắc chắn muốn xóa "${productionToDelete?.title}"? Hành động này không thể hoàn tác.`}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
