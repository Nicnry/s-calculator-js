'use client';

import { useState } from "react";
import Link from "next/link";
import { 
  MoreHorizontal,
  Trash2,
  Eye,
  BarChart3
} from "lucide-react";
import { UserService } from "@/services/userService";

export default function UsersItem({ id, name, email, onDelete }: UsersItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) {
      setIsDeleting(true);
      const success = await UserService.deleteUser(id);
      if (success) {
        onDelete(id);
      } else {
        alert("Erreur lors de la suppression de l'utilisateur.");
      }
      setIsDeleting(false);
    }
  };
  
  return (
    <div 
      className="rounded px-6 py-4 shadow-md shadow-gray-200 hover:shadow-gray-300 transition-shadow duration-200 flex md:items-center md:justify-between md:flex-row flex-col justify-start items-start gap-6 md:gap-2"
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>
  
      <div className="flex items-center space-x-2 w-full md:w-auto">
        <Link 
          href={`/users/${id}/dashboard`} 
          className="p-2 text-gray-500 rounded-md hover:text-blue-600 transition-colors"
          title="Tableau de bord"
        >
          <BarChart3 size={18} className="mr-1.5" />
        </Link>

        <Link 
          href={`/users/${id}`} 
          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
          title="Voir détails"
        >
          <Eye size={18} />
        </Link>

        <button 
          onClick={handleDelete}
          className="p-2 text-sm text-red-600 hover:cursor-pointer hover:text-red-800 text-left flex items-center transition-colors ml-auto"
          disabled={isDeleting}
        >
          <Trash2 size={16} className="mr-2" />
          {isDeleting ? 'Suppression...' : ''}
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
}