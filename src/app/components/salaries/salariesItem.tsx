import Link from "next/link";
import { 
  Eye, 
  Edit, 
  Trash2
} from "lucide-react";
import { useState } from "react";
import { SalaryService } from "@/app/services/salaryService";

export default function SalariesItem({ id, userId, totalSalary, avsAiApgContribution, vdLpcfamDeduction, acDeduction, aanpDeduction, ijmA1Deduction, lppDeduction, onDelete }:   { id: number, userId: number, totalSalary: number, avsAiApgContribution: number, vdLpcfamDeduction: number, acDeduction: number, aanpDeduction: number, ijmA1Deduction: number, lppDeduction: number, onDelete: (id: number) => void; }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await SalaryService.deleteSalary(id);
    if (success) {
      alert("Utilisateur supprimé avec succès.");
      onDelete(id);
    } else {
      alert("Erreur lors de la suppression de l'utilisateur.");
    }
    setIsDeleting(false);
  };
  
  return (
    <div 
      className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
      key={id}
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
          {getNetSalary(totalSalary, [avsAiApgContribution, vdLpcfamDeduction, acDeduction, aanpDeduction, ijmA1Deduction], [lppDeduction])}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{userId}</p>
          <p className="font-semibold text-gray-800">{totalSalary}</p>
          <p className="text-sm text-gray-500">{avsAiApgContribution}</p>
          <p className="text-sm text-gray-500">{vdLpcfamDeduction}</p>
          <p className="text-sm text-gray-500">{acDeduction}</p>
          <p className="text-sm text-gray-500">{aanpDeduction}</p>
          <p className="text-sm text-gray-500">{ijmA1Deduction}</p>
          <p className="text-sm text-gray-500">{lppDeduction}</p>
        </div>
      </div>
  
      <div className="flex items-center space-x-3">
        <Link 
          href={`salaries/${id}`} 
          className="text-gray-500 hover:text-blue-600 transition-colors"
          title="Voir détails"
        >
          <Eye size={20} />
        </Link>
        
        <Link 
          href={`salaries/${id}/edit`} 
          className="text-gray-500 hover:text-yellow-600 transition-colors"
          title="Modifier"
        >
          <Edit size={20} />
        </Link>
        
        <button 
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-600 transition-colors"
          title="Supprimer"
          disabled={isDeleting}
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}

function getNetSalary(taxableSalary: number, percentDeductions: number[], fixedDeductions: number[]): number {
  const totalPercentDeduction = percentDeductions.reduce((acc, percent) => acc + (taxableSalary * percent / 100), 0);
  const totalFixedDeduction = fixedDeductions.reduce((acc, deduction) => acc + deduction, 0);

  return taxableSalary - totalPercentDeduction - totalFixedDeduction;
}