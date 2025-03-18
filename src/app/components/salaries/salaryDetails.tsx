'use client';

import { Salary } from "@/app/db/schema";
import { SalaryService } from "@/app/services/salaryService";
import { useState, useEffect } from "react";
import { 
  User as UserIcon, 
  Calendar, 
  Edit,
  DollarSign,
  Percent,
  Calculator,
  CreditCard,
  ArrowLeft,
  Trash2,
  CalendarDays,
  CalendarRange
} from "lucide-react";
import Link from "next/link";
import DetailItem from "@/app/components/global/DetailItem";

interface SalaryDetailsProps {
  userId: number;
  salaryId: number;
}

export default function SalaryDetails({ userId, salaryId }: SalaryDetailsProps) {
  const [salary, setSalary] = useState<Salary>({ 
    userId: userId, 
    totalSalary: 0, 
    taxableSalary: 0, 
    avsAiApgContribution: 0, 
    vdLpcfamDeduction: 0, 
    acDeduction: 0, 
    aanpDeduction: 0, 
    ijmA1Deduction: 0, 
    lppDeduction: 0,
    monthlyPayments: 0,
    createdAt: new Date(),
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formattedCreatedAt, setFormattedCreatedAt] = useState<string>('');
  const [isAnnualView, setIsAnnualView] = useState<boolean>(false);

  useEffect(() => {
    const fetchSalary = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const salaryData = await SalaryService.getSalaryById(salaryId);
        setSalary(salaryData);
      } catch (error) {
        console.error("Erreur lors du chargement des données de salaire:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSalary();
  }, [salaryId]);

  useEffect(() => {
    if (salary?.createdAt) {
      setFormattedCreatedAt(
        new Date(salary.createdAt).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      );
    }
  }, [salary?.createdAt]);

  const calculateNetSalary = (): number => {
    if (!salary) return 0;
    
    const percentDeductions = [
      salary.avsAiApgContribution,
      salary.vdLpcfamDeduction,
      salary.acDeduction,
      salary.aanpDeduction,
      salary.ijmA1Deduction
    ];
    
    const totalPercentDeduction = percentDeductions.reduce(
      (acc, percent) => acc + (salary.totalSalary * percent / 100), 
      0
    );
    
    return salary.totalSalary - totalPercentDeduction - salary.lppDeduction;
  };

  const netSalary = calculateNetSalary();

  const getAnnualAmount = (monthlyAmount: number): number => {
    return monthlyAmount * (salary.monthlyPayments || 12);
  };

  const getDisplayAmount = (monthlyAmount: number): number => {
    return isAnnualView ? getAnnualAmount(monthlyAmount) : monthlyAmount;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CH', { 
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleDelete = async (): Promise<void> => {
    if (confirm("Voulez-vous vraiment supprimer ce salaire ?")) {
      try {
        const success = await SalaryService.deleteSalary(salaryId);
        if (success) {
          alert("Salaire supprimé avec succès.");
          window.location.href = "../salaries";
        } else {
          alert("Erreur lors de la suppression du salaire.");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Une erreur est survenue lors de la suppression.");
      }
    }
  };

  const toggleView = (): void => {
    setIsAnnualView(!isAnnualView);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-8 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 flex flex-col items-center text-white">
        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 border-2 border-white/30">
          CHF {formatCurrency(getDisplayAmount(netSalary))}
        </div>
        <h1 className="text-2xl font-bold">Fiche de salaire</h1>
        <p className="mb-2">Employé #{salary?.userId}</p>
        <p className="mb-4 text-sm">{isAnnualView ? 'Vue annuelle' : 'Vue mensuelle'}</p>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={toggleView}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full transition-colors"
          >
            <CalendarRange size={16} />
            <span>{isAnnualView ? 'Voir montant mensuel' : 'Voir montant annuel'}</span>
          </button>
          
          <Link 
            href={`${salary?.id}/edit`} 
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full transition-colors"
          >
            <Edit size={16} />
            <span>Modifier</span>
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-700 mb-3">Informations générales</h2>
            <DetailItem 
              icon={<UserIcon size={18} className="text-blue-500" />} 
              label="ID Employé" 
              value={String(salary.userId)} 
            />
            
            {formattedCreatedAt && (
              <DetailItem 
                icon={<Calendar size={18} className="text-blue-500" />} 
                label="Date de création" 
                value={formattedCreatedAt} 
              />
            )}

            {salary.monthlyPayments && (
              <DetailItem 
                icon={<CalendarDays size={18} className="text-blue-500" />} 
                label="Nombre de paiements" 
                value={String(salary.monthlyPayments)} 
              />
            )}
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-700 mb-3">Montants principaux {isAnnualView && '(annuels)'}</h2>
            <DetailItem 
              icon={<DollarSign size={18} className="text-green-600" />} 
              label={`Salaire brut ${isAnnualView ? 'annuel' : ''}`}
              value={`CHF ${formatCurrency(getDisplayAmount(salary.totalSalary))}`} 
            />
            
            <DetailItem 
              icon={<CreditCard size={18} className="text-green-600" />} 
              label={`Salaire imposable ${isAnnualView ? 'annuel' : ''}`}
              value={`CHF ${formatCurrency(getDisplayAmount(salary.taxableSalary))}`} 
            />
            
            <div className="flex items-start py-2">
              <div className="mt-0.5 mr-3">
                <Calculator size={18} className="text-green-600" />
              </div>
              <div>
                <span className="text-sm text-gray-600">Salaire net {isAnnualView ? 'annuel' : ''}</span>
                <p className="font-semibold text-green-700 bg-green-100 px-2 py-1 rounded mt-1">
                  CHF {formatCurrency(getDisplayAmount(netSalary))}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold text-gray-700 mb-3">Déductions {isAnnualView && '(annuelles)'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem 
              icon={<Percent size={18} className="text-red-500" />} 
              label="AVS/AI/APG" 
              value={`${salary.avsAiApgContribution}% (CHF ${formatCurrency(getDisplayAmount(salary.totalSalary * salary.avsAiApgContribution / 100))})`} 
            />
            
            <DetailItem 
              icon={<Percent size={18} className="text-red-500" />} 
              label="VD/LPCFam" 
              value={`${salary.vdLpcfamDeduction}% (CHF ${formatCurrency(getDisplayAmount(salary.totalSalary * salary.vdLpcfamDeduction / 100))})`} 
            />
            
            <DetailItem 
              icon={<Percent size={18} className="text-red-500" />} 
              label="AC" 
              value={`${salary.acDeduction}% (CHF ${formatCurrency(getDisplayAmount(salary.totalSalary * salary.acDeduction / 100))})`} 
            />
            
            <DetailItem 
              icon={<Percent size={18} className="text-red-500" />} 
              label="AANP" 
              value={`${salary.aanpDeduction}% (CHF ${formatCurrency(getDisplayAmount(salary.totalSalary * salary.aanpDeduction / 100))})`} 
            />
            
            <DetailItem 
              icon={<Percent size={18} className="text-red-500" />} 
              label="IJM A1" 
              value={`${salary.ijmA1Deduction}% (CHF ${formatCurrency(getDisplayAmount(salary.totalSalary * salary.ijmA1Deduction / 100))})`} 
            />
            
            <DetailItem 
              icon={<CreditCard size={18} className="text-red-500" />} 
              label="LPP (montant fixe)" 
              value={`CHF ${formatCurrency(getDisplayAmount(salary.lppDeduction))}`} 
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
        <Link 
          href="../salaries" 
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Retour à la liste</span>
        </Link>
        
        <div className="flex space-x-3">
          <Link 
            href={`${salary?.id}/edit`} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Edit size={16} />
            <span>Modifier</span>
          </Link>
          
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
            <span>Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
}