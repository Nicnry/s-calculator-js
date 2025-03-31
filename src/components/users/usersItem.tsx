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
      className="px-6 py-4 hover:bg-gray-50 border-b border-gray-100 transition-colors duration-200 flex items-center justify-between"
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
  
      <div className="flex items-center space-x-4">
        <Link 
          href={`/users/${id}/dashboard`} 
          className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200 transition-colors flex items-center"
          title="Tableau de bord"
        >
          <BarChart3 size={18} className="mr-1.5" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <Link 
          href={`/users/${id}`} 
          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
          title="Voir détails"
        >
          <Eye size={18} />
        </Link>
        
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="Plus d'options"
            aria-haspopup="true"
          >
            <MoreHorizontal size={18} />
          </button>
          
          {showDropdown && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button 
                onClick={handleDelete}
                className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left flex items-center transition-colors"
                disabled={isDeleting}
              >
                <Trash2 size={16} className="mr-2" />
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          )}
        </div>
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