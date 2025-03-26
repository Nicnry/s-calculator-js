'use client';

import { useEffect, useState } from 'react';
import { BankAccount } from '@/app/db/schema';
import { UserAccountService } from '@/app/services/userAccountService';
import AccountsList from '@/app/components/accounts/accountsList';
import GenericListWrapper from '@/app/components/global/GenericListWrapper';
import { useUser } from '@/app/contexts/UserContext';

export default function AccountsListWrapper() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    (async () => {
      setLoading(true);
      if(user && user.id) {
        const data = await UserAccountService.getAllUserAccounts(user.id);
        setAccounts(data);
      }
      setLoading(false);
    })();
  }, [user]);

  if (!user) {
    return <div>Erreur inattendue: utilisateur non disponible</div>;
  }

  const handleDeleteAccount = (deletedId: number) => {
    setAccounts((prevAccounts) => prevAccounts.filter((account) => account.id !== deletedId));
  };
  
  return (
    <GenericListWrapper
      title="Gestion des comptes"
      createNewHref="accounts/new"
      createNewTitle="+ Créer un compte"
      items={accounts}
      isLoading={loading}
      renderItem={(account) => (
        <AccountsList
          key={account.id}
          account={account}
          onDelete={handleDeleteAccount}
        />
      )}
      onDelete={handleDeleteAccount}
      emptyMessage="Aucun compte trouvé. Créez votre premier compte."
    />
  );
}