import CreateUserForm from "@/app/(admin)/dashboard/users/_components/create-user-form";
import { FimeTitle } from "@/components/fime-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateUserPage() {
  return (
    <div className="px-1 w-full flex-row gap-2">
      <FimeTitle>
        <h1 className="scroll-m-20 ms-2 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
          Thành viên mới
        </h1>
      </FimeTitle>

      <Card className="max-w-[1200px] m-auto">
        <CardHeader>
          <CardTitle>Biểu mẫu</CardTitle>
          <CardDescription>Điền các thông tin thành viên</CardDescription>
          <CardDescription>
            <span className="text-red-500">Lưu ý!</span> Các trường có dấu{" "}
            <span className="text-red-500">*</span> là bắt buộc
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <CreateUserForm />
        </CardContent>
      </Card>
    </div>
  );
}
