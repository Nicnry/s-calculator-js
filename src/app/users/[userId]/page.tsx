import UserDetails from "@/components/users/userDetails";

export default async function UserShowPage({ params }: UserShowPageParams) {
  const { userId } = await params;
  const id = Number(userId);

  if (isNaN(id)) return <p>ID invalide</p>;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <UserDetails id={id} />
    </div>
  );
}

type UserShowPageParams = {
  params: Promise<{ userId: string }>
};