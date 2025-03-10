import Link from "next/link";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { AccountTransaction } from "@/app/db/schema";
import { AccountTransactionService } from "@/app/services/accountTransactionService";

export default function TransactionsItem({ id, bankAccountId, amount, type, category, date, description, onDelete }: AccountTransaction & { onDelete: (id: number) => void }) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true);
    const success = await AccountTransactionService.deleteAccountTransaction(id!);
    if (success) {
      alert("Transaction supprimée avec succès.");
      onDelete(id!);
    } else {
      alert("Erreur lors de la suppression de la transaction.");
    }
    setIsDeleting(false);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CH', { 
      style: 'currency', 
      currency: 'CHF', 
      minimumFractionDigits: 2 
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 mb-4 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${type === 'income' ? 'bg-green-600' : 'bg-red-600'}`}>
              {type === 'income' ? "+" : "-"}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-gray-800">{category}</h3>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {formatCurrency(amount)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link 
              href={`transactions/${id}`} 
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Voir détails"
            >
              <Eye size={20} />
            </Link>
            
            <Link 
              href={`transactions/${id}/edit`} 
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Date</span>
            <span className="font-semibold text-gray-800">{new Date(date).toLocaleDateString()}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Compte bancaire</span>
            <span className="font-semibold text-gray-800">#{bankAccountId}</span>
          </div>

          {description && (
            <div className="flex flex-col col-span-2 md:col-span-1">
              <span className="text-xs text-gray-500">Description</span>
              <span className="font-semibold text-gray-800">{description}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
