import Link from "next/link";
import { 
  Eye, 
  Edit, 
  Trash2 
} from "lucide-react";
import { User } from "@/app/types/user";

type UserListItemProps = {
  user: User;
  onDelete: () => void;
};

export default function UserListItem({ user, onDelete }: UserListItemProps) {
  return (
    <div 
      className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Link 
          href={`/users/${user.id}`} 
          className="text-gray-500 hover:text-blue-600 transition-colors"
          title="Voir détails"
        >
          <Eye size={20} />
        </Link>
        
        <Link 
          href={`/users/${user.id}/edit`} 
          className="text-gray-500 hover:text-yellow-600 transition-colors"
          title="Modifier"
        >
          <Edit size={20} />
        </Link>
        
        <button 
          onClick={onDelete}
          className="text-gray-500 hover:text-red-600 transition-colors"
          title="Supprimer"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}