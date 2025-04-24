'use client';

import { UserService } from "@/services/userService";
import { useState, useEffect } from "react";
import { 
  Mail, 
  User as UserIcon, 
  Calendar, 
  Edit,
  Trash
} from "lucide-react";
import Link from "next/link";
import DetailItem from "@/components/global/DetailItem";
import { useUserRequired } from "@/hooks/useUserRequired";


export default function UserDetail({ id }: UserDetailProps) {
  const [formattedCreatedAt, setFormattedCreatedAt] = useState('');
  
  const { user, component, isReady } = useUserRequired({ 
    checkId: true, 
    id,
    loadingComponent: <div className="p-6 text-center">Chargement des informations utilisateur...</div>,
    errorComponent: <div className="p-6 text-center text-red-500">Erreur: Les données utilisateur ne correspondent pas à l'ID demandé</div>
  });

  useEffect(() => {
    if (user?.createdAt) {
      setFormattedCreatedAt(
        new Date(user.createdAt).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      );
    }
  }, [user?.createdAt]);

  if (component && !isReady) return component;

  if (!user) {
    return <div>Erreur inattendue: utilisateur non disponible</div>;
  }

  const userObj = user;

  const handleDelete = async () => {
    if(confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      try {
        await UserService.deleteUser(id);
        window.location.href = '/users';
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("La suppression a échoué");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-blue-50 px-6 py-8 flex flex-col items-center rounded-md overflow-hidden">
        <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-4xl font-bold mb-4">
          {userObj.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{userObj.name}</h1>
        <p className="text-gray-500 mb-4">{userObj.email}</p>
      </div>

      <div className="space-y-4 mt-6">
        <DetailItem 
          icon={<UserIcon size={20} />} 
          label="Nom complet" 
          value={userObj.name} 
        />
        
        <DetailItem 
          icon={<Mail size={20} />} 
          label="Adresse email" 
          value={userObj.email} 
        />
        
        {formattedCreatedAt && (
          <DetailItem 
            icon={<Calendar size={20} />} 
            label="Date de création" 
            value={formattedCreatedAt} 
          />
        )}
      </div>

      <div className="flex items-center justify-end mt-6">
        
        <div className="flex space-x-3">
          <Link 
            href={`/users/${userObj.id}/edit`} 
            className="bg-blue-600 text-white px-4 py-2 flex gap-4 rounded hover:bg-blue-700 transition-colors"
          >
            <Edit size={20} />
            Modifier
          </Link>
          
          <button 
            className="bg-red-500 text-white px-4 py-2 flex gap-4 rounded hover:bg-red-600 transition-colors"
            onClick={handleDelete}
          >
            <Trash size={20} />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

interface UserDetailProps {
  id: number;
}