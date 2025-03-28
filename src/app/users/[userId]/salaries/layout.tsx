import { SalariesClientLoader } from "@/app/components/layoutLoader/SalariesClientLoader";

export default async function Layout({ children, params }: LayoutProps) {
  const { userId } = await params;
  const id = Number(userId);
  
  if (isNaN(id)) {
    return <div className="container mx-auto px-4 py-8">ID utilisateur invalide</div>;
  }
  
  return (
    <div className="layout-container">
      <SalariesClientLoader userId={id}>
        {children}
      </SalariesClientLoader>
    </div>
  );
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}