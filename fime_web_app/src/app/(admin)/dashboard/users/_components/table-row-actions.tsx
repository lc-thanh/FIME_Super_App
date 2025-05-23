import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ellipsis,
  FilePenLine,
  Lock,
  LockOpen,
  RectangleEllipsis,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function UserTableRowActions({
  id,
  fullName,
  islocked,
  setActionId,
  setOpenDeleteDialog,
  setOpenResetPasswordDialog,
  setOpenLockDialog,
  setOpenUnlockDialog,
}: {
  id: string;
  fullName: string;
  islocked: boolean;
  setActionId: (id: string) => void;
  setOpenDeleteDialog: (open: boolean) => void;
  setOpenResetPasswordDialog: (open: boolean) => void;
  setOpenLockDialog: (open: boolean) => void;
  setOpenUnlockDialog: (open: boolean) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              className="flex flex-row gap-2 items-center"
              href={`/dashboard/users/edit/${id}`}
            >
              <FilePenLine className="w-4 h-4" />
              Sửa thông tin
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setActionId(id);
              setOpenDeleteDialog(true);
            }}
          >
            <Trash2 />
            Xóa thành viên
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              setActionId(id);
              setOpenResetPasswordDialog(true);
            }}
          >
            <RectangleEllipsis />
            Đặt lại mật khẩu
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Khóa/Mở khóa</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => {
                    setActionId(id);
                    setOpenLockDialog(true);
                  }}
                  disabled={islocked}
                >
                  <Lock />
                  Khóa
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setActionId(id);
                    setOpenUnlockDialog(true);
                  }}
                  disabled={!islocked}
                >
                  <LockOpen />
                  Mở khóa
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
