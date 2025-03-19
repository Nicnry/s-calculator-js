import Link from "next/link";
import { 
  Eye, 
  Edit,
  Trash2,
  Calendar,
  Tag,
  CreditCard,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { FixedExpense } from "@/app/db/schema";
import FixedExpenseService from "@/app/services/fixedExpenseService";

export default function ExpenseItem({ expense, onDelete }: { expense: FixedExpense, onDelete: (id: number) => void; }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await FixedExpenseService.deleteExpense(expense.id);
    if (success) {
      alert("Charge fixe supprimée avec succès.");
      onDelete(expense.id);
    } else {
      alert("Erreur lors de la suppression de la charge fixe.");
    }
    setIsDeleting(false);
  };

  // Formatage du montant avec le bon séparateur de milliers
  const formattedAmount = new Intl.NumberFormat('fr-CH', { 
    style: 'currency', 
    currency: 'CHF',
    minimumFractionDigits: 2
  }).format(expense.amount);

  // Formatage de la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-CH', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Traduction des récurrences pour l'affichage
  const getRecurrenceLabel = (recurrence: string) => {
    const labels = {
      'quotidienne': 'Quotidienne',
      'hebdomadaire': 'Hebdomadaire',
      'mensuelle': 'Mensuelle',
      'annuelle': 'Annuelle',
      'ponctuelle': 'Ponctuelle'
    };
    return labels[recurrence as keyof typeof labels] || recurrence;
  };

  // Couleur de fond basée sur la catégorie
  const getCategoryColor = (category: string) => {
    const colors = {
      'Logement': 'bg-blue-100 text-blue-600',
      'Alimentation': 'bg-green-100 text-green-600',
      'Transport': 'bg-purple-100 text-purple-600',
      'Loisirs': 'bg-yellow-100 text-yellow-600',
      'Santé': 'bg-red-100 text-red-600',
      'Éducation': 'bg-indigo-100 text-indigo-600',
      'Autre': 'bg-gray-100 text-gray-600'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div 
      className="px-6 py-4 hover:bg-gray-50 border-b border-gray-200 transition-colors duration-200"
      key={expense.id}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        {/* En-tête avec titre et montant */}
        <div className="flex items-center mb-3 md:mb-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 ${getCategoryColor(expense.category)}`}>
            {expense.title.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-lg">{expense.title}</p>
            <p className="font-bold text-lg text-blue-600">{formattedAmount}</p>
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 mb-3 md:mb-0">
          <div className="flex items-center">
            <Tag size={16} className="text-gray-500 mr-2" />
            <span className="text-sm">{expense.category}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar size={16} className="text-gray-500 mr-2" />
            <span className="text-sm">{formatDate(expense.date)}</span>
          </div>
          
          <div className="flex items-center">
            <CreditCard size={16} className="text-gray-500 mr-2" />
            <span className="text-sm">{expense.paymentMethod || 'Non spécifié'}</span>
          </div>
          
          <div className="flex items-center">
            {expense.paid ? (
              <CheckCircle size={16} className="text-green-500 mr-2" />
            ) : (
              <XCircle size={16} className="text-red-500 mr-2" />
            )}
            <span className="text-sm">{expense.paid ? 'Payé' : 'Non payé'}</span>
          </div>
        </div>

        {/* Badge de récurrence */}
        <div className="mb-3 md:mb-0">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {getRecurrenceLabel(expense.recurrence)}
          </span>
          {expense.endDate && (
            <span className="inline-block ml-2 text-xs text-gray-500">
              jusqu'au {formatDate(expense.endDate)}
            </span>
          )}
        </div>
  
        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Link 
            href={`fixed-expenses/${expense.id}`} 
            className="text-gray-500 hover:text-blue-600 transition-colors"
            title="Voir détails"
          >
            <Eye size={20} />
          </Link>
          
          <Link 
            href={`fixed-expenses/${expense.id}/edit`} 
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
    </div>
  );
}