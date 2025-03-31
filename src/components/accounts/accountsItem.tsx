import { 
  Eye, 
  Edit,
  ArrowLeftRight,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { BankAccount } from "@/db/schema";
import ActionMenu, { ActionItem } from "@/components/global/ActionMenu";

export default function AccountsItem({ account, onDelete }: AccountsItemProps) {
  const {id, userId, bankName, accountNumber, accountType, balance, currency} = account;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    onDelete(id!);
    alert("Utilisateur supprimé avec succès.");
    setIsDeleting(false);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CH', { 
      style: 'currency', 
      currency: currency || 'CHF'
    }).format(amount);
  };

  const actions: ActionItem[] = [
    {
      icon: <Eye size={18} />,
      label: "Voir détails",
      href: `accounts/${id}`
    },
    {
      icon: <Edit size={18} />,
      label: "Modifier",
      href: `accounts/${id}/edit`
    },
    {
      icon: <ArrowLeftRight size={18} />,
      label: "Transactions",
      href: `accounts/${id}/transactions`
    },
    {
      icon: <Trash2 size={18} />,
      label: "Supprimer",
      onClick: handleDelete,
      variant: "danger",
      isLoading: isDeleting
    }
  ];
  
  return (
    <div 
      className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200"
      key={id}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0">
            {bankName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
              <p className="font-semibold text-gray-800 truncate">ID: {userId}</p>
              <p className="font-semibold text-gray-800 truncate">{bankName}</p>
            </div>
            <p className="text-sm text-gray-500 truncate">N° {accountNumber}</p>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
              <p className="text-sm text-gray-500">{accountType}</p>
              <p className="font-medium text-blue-600">{typeof balance === 'number' ? formatCurrency(balance) : balance} {!formatCurrency ? currency : ''}</p>
            </div>
          </div>
        </div>
  
        <div className="flex justify-end">
          <ActionMenu actions={actions} />
        </div>
      </div>
    </div>
  );
}

interface AccountsItemProps {
  account: BankAccount;
  onDelete: (id: number) => void;
}