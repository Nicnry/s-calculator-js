import { 
  Eye, 
  Edit,
  ArrowLeftRight,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { UserAccountService } from "@/app/services/userAccountService";
import { BankAccount } from "@/app/db/schema";
import ActionMenu, { ActionItem } from "@/app/components/global/ActionMenu";

export default function AccountsItem({ account, onDelete }: { account: BankAccount, onDelete: (id: number) => void; }) {
  const {id, userId, bankName, accountNumber, accountType, balance, currency} = account;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await UserAccountService.deleteAccount(id!);
    if (success) {
      alert("Utilisateur supprimé avec succès.");
      onDelete(id!);
    } else {
      alert("Erreur lors de la suppression de l'utilisateur.");
    }
    setIsDeleting(false);
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
      className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
      key={id}
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
          {bankName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{userId}</p>
          <p className="font-semibold text-gray-800">{bankName}</p>
          <p className="text-sm text-gray-500">{accountNumber}</p>
          <p className="text-sm text-gray-500">{accountType}</p>
          <p className="text-sm text-gray-500">{balance}</p>
          <p className="text-sm text-gray-500">{currency}</p>
        </div>
      </div>
  
      <div className="flex items-center space-x-3">
        <ActionMenu actions={actions} />
      </div>
    </div>
  );
}