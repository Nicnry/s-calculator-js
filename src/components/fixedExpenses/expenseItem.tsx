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
import { FixedExpense } from "@/db/schema";
import FixedExpenseService from "@/services/fixedExpenseService";
import ActionMenu, { ActionItem } from "@/components/global/ActionMenu";

export default function ExpenseItem({ expense, onDelete }: ExpenseItemProps) {
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

  const formattedAmount = new Intl.NumberFormat('fr-CH', { 
    style: 'currency', 
    currency: 'CHF',
    minimumFractionDigits: 2
  }).format(expense.amount);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-CH', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

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

  const actions: ActionItem[] = [
    {
      icon: <Eye size={18} />,
      label: "Voir détails",
      href: `fixed-expenses/${expense.id}`
    },
    {
      icon: <Edit size={18} />,
      label: "Modifier",
      href: `fixed-expenses/${expense.id}/edit`
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
    <div 
      className="px-4 sm:px-6 py-4 hover:bg-gray-50 border-b border-gray-200 transition-colors duration-200"
      key={expense.id}
    >
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3 shrink-0 ${getCategoryColor(expense.category)}`}>
              {expense.title.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-lg truncate">{expense.title}</p>
              <p className="font-bold text-lg text-blue-600">{formattedAmount}</p>
            </div>
          </div>

          <div className="self-start">
            <ActionMenu actions={actions} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
          <div className="flex items-center">
            <Tag size={16} className="text-gray-500 mr-2 shrink-0" />
            <span className="text-sm truncate">{expense.category}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar size={16} className="text-gray-500 mr-2 shrink-0" />
            <span className="text-sm truncate">{formatDate(expense.date)}</span>
          </div>
          
          <div className="flex items-center">
            <CreditCard size={16} className="text-gray-500 mr-2 shrink-0" />
            <span className="text-sm truncate">{expense.paymentMethod || 'Non spécifié'}</span>
          </div>
          
          <div className="flex items-center">
            {expense.paid ? (
              <CheckCircle size={16} className="text-green-500 mr-2 shrink-0" />
            ) : (
              <XCircle size={16} className="text-red-500 mr-2 shrink-0" />
            )}
            <span className="text-sm truncate">{expense.paid ? 'Payé' : 'Non payé'}</span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {getRecurrenceLabel(expense.recurrence)}
          </span>
          {expense.endDate && (
            <span className="inline-block text-xs text-gray-500">
              jusqu'au {formatDate(expense.endDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface ExpenseItemProps {
  expense: FixedExpense;
  onDelete: (id: number) => void;
}