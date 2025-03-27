import Link from "next/link";
import { 
  Eye, 
  Edit, 
  Trash2,
  Landmark,
  Calculator,
  Receipt
} from "lucide-react";
import { useState } from "react";
import { UserService } from "@/app/services/userService";

export default function UsersItem({ id, name, email, onDelete }: UsersItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await UserService.deleteUser(id);
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
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>
  
      <div className="flex items-center space-x-3">
        <Link 
          href={`/users/${id}`} 
          className="text-gray-500 hover:text-blue-600 transition-colors"
          title="Voir détails"
        >
          <Eye size={20} />
        </Link>
        
        <Link 
          href={`/users/${id}/edit`} 
          className="text-gray-500 hover:text-yellow-600 transition-colors"
          title="Modifier"
        >
          <Edit size={20} />
        </Link>

        <Link 
          href={`/users/${id}/accounts`} 
          className="text-gray-500 hover:text-yellow-600 transition-colors"
          title="Comptes"
        >
          <Landmark size={20} />
        </Link>

        <Link 
          href={`/users/${id}/fixed-expenses`} 
          className="text-gray-500 hover:text-yellow-600 transition-colors"
          title="Dépenses fixes"
        >
          <Receipt size={20} />
        </Link>

        <Link 
          href={`/users/${id}/salaries`} 
          className="text-gray-500 hover:text-yellow-600 transition-colors"
          title="Salaires"
        >
          <Calculator size={20} />
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

interface UsersItemProps {
  id: number;
  name: string;
  email: string;
  onDelete: (id: number) => void;
};