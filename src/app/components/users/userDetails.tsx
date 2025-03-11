'use client';

import { User } from "@/app/db/schema";
import { UserService } from "@/app/services/userService";
import { useState, useEffect } from "react";
import { 
  Mail, 
  User as UserIcon, 
  Calendar, 
  Edit 
} from "lucide-react";
import Link from "next/link";
import DetailItem from "@/app/components/global/DetailItem";

export default function UserDetail({ id }: { id: number; }) {
  const [user, setUser] = useState<User>({ name: '', email: '', password: ''});

  useEffect(() => {
    (async () => setUser(await UserService.getUserById(id)))();
  }, [id]);

  const [formattedCreatedAt, setFormattedCreatedAt] = useState('');

  useEffect(() => {
    if (user?.createdAt) {
      setFormattedCreatedAt(
        new Date(user?.createdAt).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      );
    }
  }, [user?.createdAt]);

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
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="bg-blue-50 px-6 py-8 flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-4xl font-bold mb-4">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
        <p className="text-gray-500 mb-4">{user?.email}</p>
        
        <Link 
          href={`/users/${user?.id}/edit`} 
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Edit size={20} />
          <span>Modifier le profil</span>
        </Link>
      </div>

      <div className="p-6 space-y-4">
        <DetailItem 
          icon={<UserIcon size={20} />} 
          label="Nom complet" 
          value={user.name} 
        />
        
        <DetailItem 
          icon={<Mail size={20} />} 
          label="Adresse email" 
          value={user.email} 
        />
        
        {formattedCreatedAt && (
          <DetailItem 
            icon={<Calendar size={20} />} 
            label="Date de création" 
            value={formattedCreatedAt} 
          />
        )}
      </div>

      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
        <Link 
          href="/users" 
          className="text-blue-600 hover:underline"
        >
          Retour à la liste
        </Link>
        
        <div className="flex space-x-3">
          <Link 
            href={`/users/${user?.id}/edit`} 
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
          >
            Modifier
          </Link>
          
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            onClick={handleDelete}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}