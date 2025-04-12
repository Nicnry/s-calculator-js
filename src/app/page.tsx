import Link from "next/link";
import ExportCSVButton from "@/components/global/ExportCSVButton";
import ImportCSVButton from "@/components/global/ImportCSVButton";
import { UsersIcon, CalculatorIcon, Github } from "lucide-react";
import packageInfo from "@/../package.json";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center mb-12">
        <div className="inline-block bg-blue-100 p-3 rounded-full mb-6">
          <CalculatorIcon size={32} className="text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Calculateur de salaire
        </h1>
        <p className="text-gray-600 text-lg max-w-md mx-auto mb-10">
          Gérez et calculez votre fortune et vos avoirs en toute simplicité
        </p>
        
        <div className="grid gap-4 mb-10">
          <Link
            href="/users/"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-4 px-6 rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            <UsersIcon size={20} />
            Voir les utilisateurs
          </Link>
          <div className="flex items-center justify-center gap-4 bg-white border border-gray-200 py-4 px-6 rounded-xl shadow-sm">
            <ImportCSVButton />
            <div className="h-8 w-px bg-gray-200"></div>
            <ExportCSVButton />
          </div>
        </div>
        
        <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
          Version {packageInfo.version} • Développé par 
          <a 
            href="https:/github.com/Nicnry" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            Nicnry <Github size={14} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}