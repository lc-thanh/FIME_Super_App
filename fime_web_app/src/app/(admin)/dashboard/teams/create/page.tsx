import CreateTeamForm from "@/app/(admin)/dashboard/teams/_components/create-team-form";
import { FimeTitle } from "@/components/fime-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateTeamPage() {
  return (
    <div className="px-1 w-full flex-row gap-2">
      <FimeTitle>
        <h1 className="scroll-m-20 ms-2 pb-4 text-2xl font-semibold tracking-tight first:mt-0">
          Tạo Ban mới
        </h1>
      </FimeTitle>

      <Card className="m-auto w-fit">
        <CardHeader>
          <CardTitle>Biểu mẫu</CardTitle>
          <CardDescription>Điền các thông tin ban</CardDescription>
          <CardDescription>
            <span className="text-red-500">Lưu ý!</span> Các trường có dấu{" "}
            <span className="text-red-500">*</span> là bắt buộc
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTeamForm />
        </CardContent>
      </Card>
    </div>
  );
}
