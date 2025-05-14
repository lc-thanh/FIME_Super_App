import Schedule from "@/app/(admin)/dashboard/schedule/_components/schedule";
import { FimeTitle } from "@/components/fime-title";

export default function SchedulePage() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <FimeTitle>
        <h1 className="text-3xl font-bold leading-tight mb-2">
          Lịch Làm Việc FIME
        </h1>
      </FimeTitle>

      <Schedule />
    </div>
  );
}
