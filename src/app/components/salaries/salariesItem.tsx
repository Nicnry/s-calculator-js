import Link from "next/link";
import { 
  Eye, 
  Edit, 
  Trash2
} from "lucide-react";
import { useState } from "react";
import { SalaryService } from "@/app/services/salaryService";

export default function SalariesItem({ id, userId, totalSalary, avsAiApgContribution, vdLpcfamDeduction, acDeduction, aanpDeduction, ijmA1Deduction, lppDeduction, onDelete }:   { id: number, userId: number, totalSalary: number, avsAiApgContribution: number, vdLpcfamDeduction: number, acDeduction: number, aanpDeduction: number, ijmA1Deduction: number, lppDeduction: number, onDelete: (id: number) => void; }) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  const netSalary = getNetSalary(
    totalSalary, 
    [avsAiApgContribution, vdLpcfamDeduction, acDeduction, aanpDeduction, ijmA1Deduction], 
    [lppDeduction]
  );

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true);
    const success = await SalaryService.deleteSalary(id);
    if (success) {
      alert("Salaire supprimé avec succès.");
      onDelete(id);
    } else {
      alert("Erreur lors de la suppression du salaire.");
    }
    setIsDeleting(false);
  };
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CH', { 
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 mb-4 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {userId}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-800">
                Employé #{userId}
              </h3>
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Net: CHF {formatCurrency(netSalary)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link 
              href={`salaries/${id}`} 
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Voir détails"
            >
              <Eye size={20} />
            </Link>
            
            <Link 
              href={`salaries/${id}/edit`} 
              className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
              title="Modifier"
            >
              <Edit size={20} />
            </Link>
            
            <button 
              onClick={handleDelete}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Supprimer"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <Trash2 size={20} />
              )}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-100 pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Salaire brut</span>
            <span className="font-semibold text-gray-800">CHF {formatCurrency(totalSalary)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">AVS/AI/APG</span>
            <span className="font-semibold text-gray-800">{avsAiApgContribution}%</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">VD/LPCFam</span>
            <span className="font-semibold text-gray-800">{vdLpcfamDeduction}%</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">AC</span>
            <span className="font-semibold text-gray-800">{acDeduction}%</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">AANP</span>
            <span className="font-semibold text-gray-800">{aanpDeduction}%</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">IJM A1</span>
            <span className="font-semibold text-gray-800">{ijmA1Deduction}%</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">LPP</span>
            <span className="font-semibold text-gray-800">CHF {formatCurrency(lppDeduction)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Salaire net</span>
            <span className="font-semibold text-green-600">CHF {formatCurrency(netSalary)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getNetSalary(taxableSalary: number, percentDeductions: number[], fixedDeductions: number[]): number {
  const totalPercentDeduction = percentDeductions.reduce((acc, percent) => acc + (taxableSalary * percent / 100), 0);
  const totalFixedDeduction = fixedDeductions.reduce((acc, deduction) => acc + deduction, 0);

  return taxableSalary - totalPercentDeduction - totalFixedDeduction;
}