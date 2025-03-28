'use client';

import { FixedExpense, FixedExpenseTimeStamps } from "@/app/db/schema";
import { useState, useEffect } from "react";
import {
  User as UserIcon, 
  Calendar, 
  Edit,
  CalendarDays,
  DollarSign,
  Calculator,
  ArrowLeft,
  Trash2
} from "lucide-react";
import Link from "next/link";
import DetailItem from "@/app/components/global/DetailItem";
import FixedExpenseService from "@/app/services/fixedExpenseService";
import { useUser } from "@/app/contexts/UserContext";

export default function FixedExpensesDetails({ fixedExpenseId }: FixedExpenseDetailsProps) {
  const [fixedExpense, setFixedExpense] = useState<(FixedExpense & Partial<FixedExpenseTimeStamps>) | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formattedCreatedAt, setFormattedCreatedAt] = useState<string>('');
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [formattedEndDate, setFormattedEndDate] = useState<string>('');
  const [isAnnualView, setIsAnnualView] = useState<boolean>(false);
  const { user } = useUser(); 

  useEffect(() => {
    const fetchExpense = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const expenseData = await FixedExpenseService.getUserFixedExpenseById(fixedExpenseId);
        setFixedExpense(expenseData);
      } catch (error) {
        console.error("Erreur lors du chargement des données de la charge fixe:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExpense();
  }, [fixedExpenseId]);

  useEffect(() => {
    if (fixedExpense) {
      if (fixedExpense.createdAt) {
        const createdDate = new Date(fixedExpense.createdAt);
        setFormattedCreatedAt(
          createdDate.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        );
      }

      const mainDate = new Date(fixedExpense.date);
      setFormattedDate(
        mainDate.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      );

      if (fixedExpense.endDate) {
        const endDate = new Date(fixedExpense.endDate);
        setFormattedEndDate(
          endDate.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })
        );
      }
    }
  }, [fixedExpense]);

  const getAnnualAmount = (monthlyAmount: number): number => {
    if (!fixedExpense) return 0;
    
    switch (fixedExpense.recurrence) {
      case 'quotidienne':
        return monthlyAmount * 365;
      case 'hebdomadaire':
        return monthlyAmount * 52;
      case 'mensuelle':
        return monthlyAmount * 12;
      case 'annuelle':
        return monthlyAmount;
      case 'ponctuelle':
        return monthlyAmount;
      default:
        return monthlyAmount;
    }
  };

  const getDisplayAmount = (amount: number): number => {
    return isAnnualView ? getAnnualAmount(amount) : amount;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CH', { 
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleDelete = async (): Promise<void> => {
    if (confirm("Voulez-vous vraiment supprimer cette charge fixe ?")) {
      try {
        const success = await FixedExpenseService.deleteExpense(fixedExpenseId);
        if (success) {
          alert("Charge fixe supprimée avec succès.");
          window.location.href = "../fixed-expenses";
        } else {
          alert("Erreur lors de la suppression de la charge fixe.");
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

  const getRecurrenceLabel = (recurrence: string): string => {
    switch (recurrence) {
      case 'quotidienne': return 'Quotidienne';
      case 'hebdomadaire': return 'Hebdomadaire';
      case 'mensuelle': return 'Mensuelle';
      case 'annuelle': return 'Annuelle';
      case 'ponctuelle': return 'Ponctuelle';
      default: return recurrence;
    }
  };

  const getPaymentMethodLabel = (method?: string): string => {
    if (!method) return 'Non spécifié';
    
    switch (method) {
      case 'Carte': return 'Carte bancaire';
      case 'Virement': return 'Virement bancaire';
      case 'Prélèvement': return 'Prélèvement automatique';
      case 'Espèces': return 'Espèces';
      case 'Autre': return 'Autre';
      default: return method;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-8 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!fixedExpense) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Charge fixe non trouvée</h2>
          <p>La charge fixe demandée n'existe pas ou a été supprimée.</p>
          <Link href="../fixed-expenses" className="text-blue-600 hover:underline mt-2 inline-block">
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 flex flex-col items-center text-white">
        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 border-2 border-white/30">
          CHF {formatCurrency(getDisplayAmount(fixedExpense.amount))}
        </div>
        <h1 className="text-2xl font-bold">{fixedExpense.title}</h1>
        <p className="mb-2">{fixedExpense.category}</p>
        <p className="mb-4 text-sm">{isAnnualView ? 'Vue annuelle' : 'Vue standard'}</p>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={toggleView}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full transition-colors"
          >
            <CalendarDays size={16} />
            <span>{isAnnualView ? 'Voir montant standard' : 'Voir montant annuel'}</span>
          </button>
          
          <Link 
            href={`${fixedExpenseId}/edit`} 
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
              label="Utilisateur" 
              value={user!.name} 
            />
            
            <DetailItem 
              icon={<Calendar size={18} className="text-blue-500" />} 
              label="Date de début" 
              value={formattedDate} 
            />

            {formattedEndDate && (
              <DetailItem 
                icon={<Calendar size={18} className="text-blue-500" />} 
                label="Date de fin" 
                value={formattedEndDate} 
              />
            )}
            
            <DetailItem 
              icon={<CalendarDays size={18} className="text-blue-500" />} 
              label="Récurrence" 
              value={getRecurrenceLabel(fixedExpense.recurrence)} 
            />
            
            {formattedCreatedAt && (
              <DetailItem 
                icon={<Calendar size={18} className="text-blue-500" />} 
                label="Date de création" 
                value={formattedCreatedAt} 
              />
            )}
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-700 mb-3">Détails du paiement {isAnnualView && '(annuel)'}</h2>
            <DetailItem 
              icon={<DollarSign size={18} className="text-green-600" />} 
              label={`Montant ${isAnnualView ? 'annuel' : ''}`}
              value={`CHF ${formatCurrency(getDisplayAmount(fixedExpense.amount))}`} 
            />
            
            <DetailItem 
              icon={<Calculator size={18} className="text-green-600" />} 
              label="Statut" 
              value={fixedExpense.paid ? "Payé" : "Non payé"} 
            />
            
            {fixedExpense.paymentMethod && (
              <DetailItem 
                icon={<Calculator size={18} className="text-green-600" />} 
                label="Méthode de paiement" 
                value={getPaymentMethodLabel(fixedExpense.paymentMethod)} 
              />
            )}
            
            <DetailItem 
              icon={<Calculator size={18} className="text-green-600" />} 
              label="Catégorie" 
              value={fixedExpense.category} 
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
        <Link 
          href="../fixed-expenses" 
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Retour à la liste</span>
        </Link>
        
        <div className="flex space-x-3">
          <Link 
            href={`${fixedExpenseId}/edit`} 
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

type FixedExpenseDetailsProps = {
  fixedExpenseId: number;
};