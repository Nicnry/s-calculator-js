import { 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  Percent
} from "lucide-react";
import { useState } from "react";
import SalaryService from "@/app/services/salaryService";
import { Salary } from "@/app/db/schema";
import ActionMenu, { ActionItem } from "@/app/components/global/ActionMenu";

export default function SalariesItem({ salary, onDelete }: { salary: Salary, onDelete: (id: number) => void; }) {
  const {
    id,
    userId,
    totalSalary,
    taxableSalary,
    avsAiApgContribution,
    vdLpcfamDeduction,
    acDeduction,
    aanpDeduction,
    ijmA1Deduction,
    lppDeduction,
    employmentRate,
    monthlyPayments,
    from,
    to,
  } = salary;
  
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  const adjustedTotalSalary = SalaryService.calculateAdjustedSalary(salary);
  const adjustedTaxableSalary = SalaryService.calculateAdjustedTaxableSalary(salary);
  
  const netSalary = getNetSalary(
    adjustedTaxableSalary, 
    [avsAiApgContribution, vdLpcfamDeduction, acDeduction, aanpDeduction, ijmA1Deduction], 
    [lppDeduction]
  );

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true);
    const success = await SalaryService.deleteSalary(id!);
    if (success) {
      alert("Salaire supprimé avec succès.");
      onDelete(id!);
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
  
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('fr-CH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const actions: ActionItem[] = [
    {
      icon: <Eye size={18} />,
      label: "Voir détails",
      href: `salaries/${id}`
    },
    {
      icon: <Edit size={18} />,
      label: "Modifier",
      href: `salaries/${id}/edit`
    },
    {
      icon: <Trash2 size={18} />,
      label: "Supprimer",
      onClick: handleDelete,
      variant: "danger",
      isLoading: isDeleting
    }
  ];
  
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
                {monthlyPayments > 1 && (
                  <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {monthlyPayments} paiements
                  </span>
                )}
                <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  <Percent size={14} className="mr-1" /> {employmentRate}
                </span>
              </div>
            </div>
          </div>
          
          <ActionMenu actions={actions} />
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar size={16} className="mr-1" />
          <span>Période: {formatDate(from)} - {formatDate(to)}</span>
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Salaires</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="flex flex-col mb-1">
                <span className="text-xs text-gray-500">Salaire brut de base</span>
                <span className="font-semibold text-gray-600">CHF {formatCurrency(totalSalary)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">
                  <span className="font-medium text-blue-600">Ajusté ({employmentRate}%)</span>
                </span>
                <span className="font-bold text-blue-700">CHF {formatCurrency(adjustedTotalSalary)}</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex flex-col mb-1">
                <span className="text-xs text-gray-500">Salaire imposable de base</span>
                <span className="font-semibold text-gray-600">CHF {formatCurrency(taxableSalary)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">
                  <span className="font-medium text-blue-600">Ajusté ({employmentRate}%)</span>
                </span>
                <span className="font-bold text-blue-700">CHF {formatCurrency(adjustedTaxableSalary)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-100 pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">AVS/AI/APG</span>
            <span className="font-semibold text-gray-800">{avsAiApgContribution}%</span>
            <span className="text-xs text-gray-500 mt-1">
              CHF {formatCurrency(adjustedTaxableSalary * avsAiApgContribution / 100)}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">VD/LPCFam</span>
            <span className="font-semibold text-gray-800">{vdLpcfamDeduction}%</span>
            <span className="text-xs text-gray-500 mt-1">
              CHF {formatCurrency(adjustedTaxableSalary * vdLpcfamDeduction / 100)}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">AC</span>
            <span className="font-semibold text-gray-800">{acDeduction}%</span>
            <span className="text-xs text-gray-500 mt-1">
              CHF {formatCurrency(adjustedTaxableSalary * acDeduction / 100)}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">AANP</span>
            <span className="font-semibold text-gray-800">{aanpDeduction}%</span>
            <span className="text-xs text-gray-500 mt-1">
              CHF {formatCurrency(adjustedTaxableSalary * aanpDeduction / 100)}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">IJM A1</span>
            <span className="font-semibold text-gray-800">{ijmA1Deduction}%</span>
            <span className="text-xs text-gray-500 mt-1">
              CHF {formatCurrency(adjustedTaxableSalary * ijmA1Deduction / 100)}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">LPP</span>
            <span className="font-semibold text-gray-800">CHF {formatCurrency(lppDeduction)}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Taux d'emploi</span>
            <span className="font-semibold text-gray-800">{employmentRate}%</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Salaire net</span>
            <span className="font-semibold text-green-600">CHF {formatCurrency(netSalary)}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${(netSalary / adjustedTotalSalary) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>Net: {((netSalary / adjustedTotalSalary) * 100).toFixed(1)}%</span>
            <span>Déductions: {((1 - netSalary / adjustedTotalSalary) * 100).toFixed(1)}%</span>
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