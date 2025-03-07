'use client';

import { BankAccount } from "@/app/db/schema";
import { AccountService } from "@/app/services/accountService";
import { useState, useEffect } from "react";
import { 
  Mail, 
  User as UserIcon, 
  Calendar, 
  Edit 
} from "lucide-react";
import Link from "next/link";

export default function AccountDetails({ userId, accountId }: { userId: number; accountId: number; }) {
  const [account, setAccount] = useState<BankAccount>({ userId: userId, bankName : '', accountNumber: '', accountType: '', balance: 0, currency: ''});

  useEffect(() => {
    (async () => setAccount(await AccountService.getAccountById(accountId)))();
  }, [accountId]);

  const [formattedCreatedAt, setFormattedCreatedAt] = useState('');

  useEffect(() => {
    if (account?.createdAt) {
      setFormattedCreatedAt(
        new Date(account?.createdAt).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      );
    }
  }, [account?.createdAt]);

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="bg-blue-50 px-6 py-8 flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-4xl font-bold mb-4">
          {account?.bankName.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{account?.bankName}</h1>
        <p className="text-gray-500 mb-4">{account?.currency}</p>
        
        <Link 
          href={`${account?.id}/edit`} 
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Edit size={20} />
          <span>Modifier le profil</span>
        </Link>
      </div>

      <div className="p-6 space-y-4">

        <AccountDetailItem 
          icon={<UserIcon size={20} />} 
          label="Nom complet" 
          value={String(account.userId)} 
        />

        <AccountDetailItem 
          icon={<UserIcon size={20} />} 
          label="Nom complet" 
          value={account.bankName} 
        />

        <AccountDetailItem 
          icon={<UserIcon size={20} />} 
          label="Nom complet" 
          value={account.accountNumber} 
        />

        <AccountDetailItem 
          icon={<UserIcon size={20} />} 
          label="Nom complet" 
          value={account.accountType} 
        />

        <AccountDetailItem 
          icon={<UserIcon size={20} />} 
          label="Nom complet" 
          value={String(account.balance)} 
        />
        
        <AccountDetailItem 
          icon={<Mail size={20} />} 
          label="Adresse email" 
          value={account.currency} 
        />
        
        {formattedCreatedAt && (
          <AccountDetailItem 
            icon={<Calendar size={20} />} 
            label="Date de création" 
            value={formattedCreatedAt} 
          />
        )}
      </div>

      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
        <Link 
          href=".." 
          className="text-blue-600 hover:underline"
        >
          Retour à la liste
        </Link>
        
        <div className="flex space-x-3">
          <Link 
            href={`${account?.id}/edit`} 
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
          >
            Modifier
          </Link>
          
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            onClick={() => {
              if(confirm("Voulez-vous vraiment supprimer ce compte ?")) {
                // TODO
              }
            }}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountDetailItem({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string 
}) {
  return (
    <div className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg">
      <div className="text-blue-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}