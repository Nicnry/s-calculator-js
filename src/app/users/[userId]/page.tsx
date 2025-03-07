import UserDetails from "@/app/components/users/userDetails";

export default async function UserShowPage({ params, }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const id = Number(userId);

  if (isNaN(id)) return <p>ID invalide</p>;
  
  return <UserDetails id={id} />;
}