import { ReactNode } from "react";
import Link from "next/link";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Salaires</h1>
        <Link 
          href="/salaries/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          title="Créer un nouveau salaire"
        >
          + Créer un salaire
        </Link>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          {children}
        </div>
      </div>
      
      <div className="mt-4">
        <Link href="/users/" className="text-blue-600 hover:underline">
          Retour aux utilisateurs
        </Link>
      </div>
    </div>
  );
}
