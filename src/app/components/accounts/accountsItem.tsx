import Link from "next/link";
import { 
  Eye, 
  Edit, 
  Trash2 
} from "lucide-react";
import { useState } from "react";
import { AccountService } from "@/app/services/accountService";

export default function UsersItem({ id, userId, bankName, accountNumber, accountType, balance, currency, onDelete }: { id: number, userId: number, bankName: string, accountNumber: string, accountType: string, balance: number, currency: string, onDelete: (id: number) => void; }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await AccountService.deleteAccount(id);
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
          {bankName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{userId}</p>
          <p className="font-semibold text-gray-800">{bankName}</p>
          <p className="text-sm text-gray-500">{accountNumber}</p>
          <p className="text-sm text-gray-500">{accountType}</p>
          <p className="text-sm text-gray-500">{balance}</p>
          <p className="text-sm text-gray-500">{currency}</p>
        </div>
      </div>
  
      <div className="flex items-center space-x-3">
        <Link 
          href={`accounts/${id}`} 
          className="text-gray-500 hover:text-blue-600 transition-colors"
          title="Voir détails"
        >
          <Eye size={20} />
        </Link>
        
        <Link 
          href={`accounts/${id}/edit`} 
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