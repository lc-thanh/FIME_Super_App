import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getImageUrl } from "@/lib/utils";

// function getFirstLetterOfLastName(fullName: string) {
//   if (!fullName) return "";
//   const words = fullName.trim().split(" ");
//   const lastWord = words[words.length - 1];
//   return lastWord.charAt(0).toUpperCase();
// }

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export const UserAvatar = ({
  image,
  fullname,
  size = "md",
  className,
}: {
  image: string | null | undefined;
  fullname: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) => {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };

  const avatarSize = sizeClasses[size];
  console.log(">>> image: ", image);

  return (
    <Avatar className={cn(avatarSize, className)}>
      <AvatarImage src={getImageUrl(image)} alt={`${fullname}'s avatar`} />
      <AvatarFallback className="bg-fimeOrangeLighter text-white">
        {getInitials(fullname)}
      </AvatarFallback>
    </Avatar>
  );
};
