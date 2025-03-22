import Sidebar from "@/app/components/global/Sidebar";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params;
  const id = Number(userId);
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar id={id} />
      <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}