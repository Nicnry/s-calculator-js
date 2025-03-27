import Sidebar from "@/app/components/global/Sidebar";
import { UserProvider } from "@/app/providers/UserProvider";
import { getUserById } from "@/app/services/userService";

export default async function Layout({ children, params }: LayoutProps) {
  const { userId } = await params;
  const id = Number(userId);
  
  if (isNaN(id)) {
    return <div className="container mx-auto px-4 py-8">ID utilisateur invalide</div>;
  }
  
  const user = await getUserById(id);

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Utilisateur non trouvé</div>;
  }
  
  return (
    <UserProvider user={user}>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </UserProvider>
  );
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}