import { getUserById } from "@/app/services/userService";
import { notFound } from "next/navigation";
import UserDetails from "./userDetails";

export default async function UserShowPage({ params, }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  try {
    const user = await getUserById(Number(id));
    return <UserDetails user={user} />;
  } catch {
    notFound();
  }
}