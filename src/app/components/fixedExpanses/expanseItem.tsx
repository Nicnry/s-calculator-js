import Link from "next/link";
import { 
  Eye, 
  Edit,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { FixedExpense } from "@/app/db/schema";
import FixedExpanseService from "@/app/services/fixedExpanseService";

export default function ExpanseItem({ expanse, onDelete }: { expanse: FixedExpense, onDelete: (id: number) => void; }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await FixedExpanseService.deleteExpanse(expanse.id);
    if (success) {
      alert("Utilisateur supprimé avec succès.");
      onDelete(expanse.id);
    } else {
      alert("Erreur lors de la suppression de l'utilisateur.");
    }
    setIsDeleting(false);
  };

  return (
    <div 
      className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
      key={expanse.id}
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
          {expanse.title.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{expanse.userId}</p>
          <p className="font-semibold text-gray-800">{expanse.amount}</p>
          <p className="text-sm text-gray-500">{expanse.category}</p>
          <p className="text-sm text-gray-500">{expanse.date}</p>
          <p className="text-sm text-gray-500">{expanse.recurrence}</p>
          <p className="text-sm text-gray-500">{expanse.paid}</p>
          <p className="text-sm text-gray-500">{expanse.paymentMethod}</p>
          <p className="text-sm text-gray-500">{expanse.endDate}</p>
        </div>
      </div>
  
      <div className="flex items-center space-x-3">
        <Link 
          href={`fixedExpanses/${expanse.id}`} 
          className="text-gray-500 hover:text-blue-600 transition-colors"
          title="Voir détails"
        >
          <Eye size={20} />
        </Link>
        
        <Link 
          href={`fixedExpanses/${expanse.id}/edit`} 
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