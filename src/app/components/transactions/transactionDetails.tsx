'use client';

import { useState, useEffect } from "react";
import { 
  User as UserIcon, 
  Calendar, 
  Edit,
  CreditCard,
  ArrowLeft,
  Trash2,
  Tag,
  DollarSign,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  FileText
} from "lucide-react";
import Link from "next/link";
import DetailItem from "@/app/components/global/DetailItem";
import { AccountTransactionService } from "@/app/services/accountTransactionService";

interface AccountTransaction {
  id?: number;
  bankAccountId: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: Date;
  description?: string;
  createdAt?: Date;
}

interface TransactionDetailsProps {
  userId: number;
  accountId: number;
  transactionId: number;
}

export default function TransactionDetails({ userId, accountId, transactionId }: TransactionDetailsProps) {
  const [transaction, setTransaction] = useState<AccountTransaction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formattedCreatedAt, setFormattedCreatedAt] = useState<string>('');
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    const fetchTransaction = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const transactionData = await AccountTransactionService.getAccountTransactionById(transactionId);
        setTransaction(transactionData);
      } catch (error) {
        console.error("Erreur lors du chargement des données de transaction:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransaction();
  }, [transactionId]);

  useEffect(() => {
    if (transaction?.createdAt) {
      const createdDate = new Date(transaction.createdAt);
      setFormattedCreatedAt(
        createdDate.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      );
    }

    if (transaction?.date) {
      const transactionDate = new Date(transaction.date);
      setFormattedDate(
        transactionDate.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      );
    }
  }, [transaction?.createdAt, transaction?.date]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CH', { 
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleDelete = async (): Promise<void> => {
    if (confirm("Voulez-vous vraiment supprimer cette transaction ?")) {
      try {
        const success = await AccountTransactionService.deleteAccountTransaction(transactionId);
        if (success) {
          alert("Transaction supprimée avec succès.");
          window.location.href = `/accounts/${accountId}`;
        } else {
          alert("Erreur lors de la suppression de la transaction.");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Une erreur est survenue lors de la suppression.");
      }
    }
  };

  const getTransactionTypeColor = () => {
    if (!transaction) return 'from-blue-500 to-blue-600';
    return transaction.type === 'income' 
      ? 'from-green-500 to-green-600' 
      : 'from-red-500 to-red-600';
  };

  const getTransactionTypeIcon = () => {
    if (!transaction) return null;
    return transaction.type === 'income' 
      ? <ArrowUpRight className="w-8 h-8 text-white/80" /> 
      : <ArrowDownRight className="w-8 h-8 text-white/80" />;
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

  if (!transaction) {
    return (
      <div className="max-w-2xl mx-auto p-8 flex justify-center items-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Transaction non trouvée</p>
          <Link 
            href={`../..`} 
            className="text-blue-600 hover:underline"
          >
            Retour au compte
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
      <div className={`bg-gradient-to-r ${getTransactionTypeColor()} px-6 py-8 flex flex-col items-center text-white`}>
        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white mb-4 border-2 border-white/30 relative">
          <span className="text-xl font-bold">
            CHF {formatCurrency(transaction.amount)}
          </span>
          <div className="absolute bottom-0 right-0 bg-white/30 rounded-full p-1 transform translate-x-2 translate-y-2">
            {getTransactionTypeIcon()}
          </div>
        </div>
        <h1 className="text-2xl font-bold">{transaction.description || 'Transaction'}</h1>
        <p className="text-lg opacity-90 mb-2">
          {transaction.type === 'income' ? 'Entrée' : 'Dépense'}
        </p>
        <p className="opacity-75 mb-4">{formattedDate}</p>
        
        <Link 
          href={`accounts/${accountId}/transactions/${transaction.id}/edit`} 
          className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full transition-colors"
        >
          <Edit size={16} />
          <span>Modifier la transaction</span>
        </Link>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-700 mb-3">Informations générales</h2>
            <DetailItem 
              icon={<UserIcon size={18} className="text-blue-500" />} 
              label="ID Utilisateur" 
              value={String(userId)} 
            />
            
            <DetailItem 
              icon={<CreditCard size={18} className="text-blue-500" />} 
              label="ID Compte" 
              value={String(transaction.bankAccountId)} 
            />
            
            {formattedCreatedAt && (
              <DetailItem 
                icon={<Calendar size={18} className="text-blue-500" />} 
                label="Date d'enregistrement" 
                value={formattedCreatedAt} 
              />
            )}
          </div>
          
          <div className={`${transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'} p-4 rounded-lg`}>
            <h2 className="font-semibold text-gray-700 mb-3">Détails de la transaction</h2>
            <DetailItem 
              icon={<Calendar size={18} className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'} />} 
              label="Date de transaction" 
              value={formattedDate} 
            />

            <DetailItem 
              icon={<Tag size={18} className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'} />} 
              label="Catégorie" 
              value={transaction.category || 'Non catégorisé'} 
            />
            
            <div className="flex items-start py-2">
              <div className="mt-0.5 mr-3">
                <DollarSign size={18} className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'} />
              </div>
              <div>
                <span className="text-sm text-gray-600">Montant</span>
                <p className={`font-semibold ${transaction.type === 'income' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'} px-2 py-1 rounded mt-1`}>
                  CHF {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {transaction.description && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center">
              <FileText size={18} className="mr-2 text-gray-600" />
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {transaction.description}
            </p>
          </div>
        )}
      </div>

      <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
        <Link 
          href={`../..`} 
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Retour au compte</span>
        </Link>
        
        <div className="flex space-x-3">
          <Link 
            href={`${transaction.id}/edit`} 
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