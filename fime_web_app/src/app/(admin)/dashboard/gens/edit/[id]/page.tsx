import UpdateGenForm from "@/app/(admin)/dashboard/gens/_components/update-gen-form";
import { FimeTitle } from "@/components/fime-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function UpdateGenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div className="px-1 w-full flex-row gap-2">
      <FimeTitle>
        <h1 className="scroll-m-20 ms-2 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
          Sửa thông tin Gen
        </h1>
      </FimeTitle>

      <Card className="m-auto w-fit">
        <CardHeader>
          <CardTitle>Biểu mẫu</CardTitle>
          <CardDescription>Điền các thông tin Gen</CardDescription>
          <CardDescription>
            <span className="text-red-500">Lưu ý!</span> Các trường có dấu{" "}
            <span className="text-red-500">*</span> là bắt buộc
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateGenForm genId={id} />
        </CardContent>
      </Card>
    </div>
  );
}
