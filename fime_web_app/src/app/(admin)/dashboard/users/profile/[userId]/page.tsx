import UserProfile from "@/app/(admin)/dashboard/users/profile/[userId]/_components/user-profile";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return <UserProfile userId={userId} />;
}
