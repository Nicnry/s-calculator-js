import Sidebar from "@/components/global/Sidebar";
import { AccountsClientLoader } from "@/components/layoutLoader/AccountsClientLoader";
import { FixedExpensesClientLoader } from "@/components/layoutLoader/FixedExpensesClientLoader";
import { SalariesClientLoader } from "@/components/layoutLoader/SalariesClientLoader";
import { UserClientLoader } from "@/components/layoutLoader/UserClientLoader";

export default async function Layout({ children, params }: LayoutProps) {
  const { userId } = await params;
  const id = Number(userId);
  
  if (isNaN(id)) {
    return <div className="container mx-auto px-4 py-8">ID utilisateur invalide</div>;
  }
  
  return (
    <UserClientLoader userId={id}>
      <SalariesClientLoader userId={id}>
        <AccountsClientLoader userId={id}>
          <FixedExpensesClientLoader userId={id}>
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
          </FixedExpensesClientLoader>
        </AccountsClientLoader>
      </SalariesClientLoader>
    </UserClientLoader>
  );
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}