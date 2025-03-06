import UserDetails from "@/app/components/users/userDetails";

export default async function UserShowPage({ params, }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = Number(id);

  if (isNaN(userId)) return <p>ID invalide</p>;
  
  return <UserDetails id={userId} />;
}