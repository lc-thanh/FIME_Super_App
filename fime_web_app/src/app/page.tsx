import { FimeTitle } from "@/components/fime-title";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ThemeLogo from "@/components/theme-logo";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br p-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* Logo lớn */}
        <div className="flex justify-center">
          <ThemeLogo
            darkLogo="/LOGO_FIME_dark.png"
            lightLogo="/LOGO_FIME_light.png"
            width={128}
            height={128}
          />
        </div>

        {/* Tiêu đề lớn */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
            Hệ thống quản lý nội bộ của{" "}
            <FimeTitle className="inline-block">FIT Media</FimeTitle>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
            Nền tảng quản lý toàn diện cho Bộ phận truyền thông Trường Công nghệ
            Thông tin & Truyền thông - Trường Đại học Công nghiệp Hà Nội
          </p>
        </div>

        {/* Nút đăng nhập */}
        <div className="pt-4">
          <Button
            asChild
            variant="animated-gradient"
            size="lg"
            className="text-lg px-8 py-6 rounded-full"
          >
            <Link href="/login">Đăng nhập vào hệ thống</Link>
          </Button>
        </div>

        {/* Thông tin bổ sung */}
        <div className="pt-8 text-sm text-gray-500">
          <p>© 2025 FIME Super App - FIT Media Management System</p>
        </div>
      </div>
    </div>
  );
}
