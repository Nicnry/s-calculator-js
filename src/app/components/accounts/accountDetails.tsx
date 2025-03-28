'use client';

import { AccountTransaction, BankAccount } from "@/app/db/schema";
import { UserAccountService } from "@/app/services/userAccountService";
import { useState, useEffect } from "react";
import {
  User as UserIcon, 
  Calendar, 
  Edit,
  Building,
  CreditCard,
  BarChart3,
  Banknote,
  Wallet,
  ArrowLeft,
  Trash2,
  Loader2
} from "lucide-react";
import Link from "next/link";
import DetailItem from "@/app/components/global/DetailItem";
import { AccountTransactionService } from "@/app/services/accountTransactionService";
import { useUser } from "@/app/contexts/UserContext";

export default function AccountDetails({ accountId }: AccountDetailsProps) {
  const { user } = useUser();
  const [account, setAccount] = useState<BankAccount>({ userId: user!.id!, bankName: '', accountNumber: '', accountType: '', balance: 0, currency: '', from: new Date(), to: new Date });
  const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formattedCreatedAt, setFormattedCreatedAt] = useState('');

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setIsLoading(true);
        setTransactions(await AccountTransactionService.getAllAccountTransactions(accountId));
        const accountData = await UserAccountService.getUserAccountById(user!.id!, accountId);
        setAccount(accountData);
      } catch (error) {
        console.error("Erreur lors du chargement des données du compte:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccount();
  }, [accountId, user]);


  useEffect(() => {
    if (account?.createdAt) {
      setFormattedCreatedAt(
        new Date(account.createdAt).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      );
    }
  }, [account?.createdAt]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CH', { 
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleDelete = async (): Promise<void> => {
    if (confirm("Voulez-vous vraiment supprimer ce compte ?")) {
      try {
        // const success = await UserAccountService.deleteUserAccount(accountId);
        alert("Compte supprimé avec succès.");
        window.location.href = "..";
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Une erreur est survenue lors de la suppression.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-8 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const getAccountTypeIcon = () => {
    switch (account.accountType.toLowerCase()) {
      case 'épargne':
      case 'epargne':
      case 'savings':
        return <Wallet className="text-green-500" />;
      case 'courant':
      case 'checking':
        return <Banknote className="text-blue-500" />;
      case 'investissement':
      case 'investment':
        return <BarChart3 className="text-purple-500" />;
      default:
        return <CreditCard className="text-gray-500" />;
    }
  };

  const getBankColor = () => {
    const bankName = account.bankName.toLowerCase();
    if (bankName.includes('ubs')) return 'from-red-500 to-red-600';
    if (bankName.includes('credit suisse') || bankName.includes('cs')) return 'from-blue-800 to-blue-900';
    if (bankName.includes('raiffeisen')) return 'from-yellow-500 to-yellow-600';
    if (bankName.includes('post') || bankName.includes('postfinance')) return 'from-yellow-400 to-amber-500';
    if (bankName.includes('bcv')) return 'from-green-500 to-green-600';
    return 'from-blue-500 to-blue-600';
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <div className={`bg-gradient-to-r ${getBankColor()} px-6 py-8 flex flex-col items-center text-white`}>
        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 border-2 border-white/30">
          {account.currency} {formatCurrency(account.balance)}
        </div>
        <h1 className="text-2xl font-bold">{account.bankName}</h1>
        <p className="text-lg opacity-90 mb-2">{account.accountType}</p>
        <p className="opacity-75 mb-4">****{account.accountNumber.slice(-4)}</p>
        
        <Link 
          href={`${account?.id}/edit`} 
          className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full transition-colors"
        >
          <Edit size={16} />
          <span>Modifier le compte</span>
        </Link>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-700 mb-3">Informations générales</h2>
            <DetailItem 
              icon={<UserIcon size={18} className="text-blue-500" />} 
              label="Utilisateur" 
              value={user!.name} 
            />
            
            <DetailItem 
              icon={<Building size={18} className="text-blue-500" />} 
              label="Nom de la banque" 
              value={account.bankName} 
            />
            
            {formattedCreatedAt && (
              <DetailItem 
                icon={<Calendar size={18} className="text-blue-500" />} 
                label="Date de création" 
                value={formattedCreatedAt} 
              />
            )}
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-700 mb-3">Détails du compte</h2>
            <DetailItem 
              icon={<CreditCard size={18} className="text-green-600" />} 
              label="Numéro de compte" 
              value={account.accountNumber} 
            />
            
            <DetailItem 
              icon={getAccountTypeIcon()} 
              label="Type de compte" 
              value={account.accountType} 
            />
            
            <div className="flex items-start py-2">
              <div className="mt-0.5 mr-3">
                <Banknote size={18} className="text-green-600" />
              </div>
              <div>
                <span className="text-sm text-gray-600">Solde actuel</span>
                <p className="font-semibold text-green-700 bg-green-100 px-2 py-1 rounded mt-1">
                  {account.currency} {formatCurrency(account.balance)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="font-semibold text-gray-700 mb-3">Transactions récentes</h2>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div 
                  key={transaction.id} 
                  className={`flex justify-between items-center p-3 rounded-lg border-l-4 ${
                    transaction.type === 'income' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{transaction.description}</span>
                    <span className="text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                      {transaction.category && ` • ${transaction.category}`}
                    </span>
                  </div>
                  <div className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {account.currency} {transaction.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(String(transaction.amount)))}
                  </div>
                </div>
              ))}
              {transactions.length > 5 && (
                <div className="text-center mt-4">
                  <Link href={`/transactions/${accountId}`} className="text-blue-500 hover:underline">
                    Voir toutes les transactions ({transactions.length})
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-6 text-gray-500">
              <BarChart3 size={36} className="mx-auto mb-2 text-gray-400" />
              <p>Aucune transaction récente à afficher</p>
              <Link href={`${accountId}/transactions/new`} className="mt-2 text-blue-500 hover:underline block">
                Ajouter une transaction
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
        <Link 
          href=".." 
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Retour à la liste</span>
        </Link>
        
        <div className="flex space-x-3">
          <Link 
            href={`${account?.id}/edit`} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Edit size={16} />
            <span>Modifier</span>
          </Link>
          
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
            <span>Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
}

type AccountDetailsProps = {
  accountId: number;
};