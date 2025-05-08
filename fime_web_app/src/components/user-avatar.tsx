import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import envConfig from "@/config";

// function getFirstLetterOfLastName(fullName: string) {
//   if (!fullName) return "";
//   const words = fullName.trim().split(" ");
//   const lastWord = words[words.length - 1];
//   return lastWord.charAt(0).toUpperCase();
// }

function getInitials(name: string): string {
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
  className,
}: {
  image: string | null | undefined;
  fullname: string;
  className?: string;
}) => {
  return (
    <Avatar className={`w-8 h-8 ${className}`}>
      <AvatarImage
        src={
          `${envConfig.NEXT_PUBLIC_STATIC_ENDPOINT}/users/avatars/${image}` ||
          ""
        }
        alt={`${fullname}'s avatar`}
      />
      <AvatarFallback className="bg-fimeOrangeLighter text-white">
        {getInitials(fullname)}
      </AvatarFallback>
    </Avatar>
  );
};
