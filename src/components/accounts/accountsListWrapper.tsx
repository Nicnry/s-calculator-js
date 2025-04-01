'use client';

import { useEffect, useState } from 'react';
import AccountsList from '@/components/accounts/accountsList';
import GenericListWrapper from '@/components/global/GenericListWrapper';
import { useUser } from '@/contexts/UserContext';
import { useAccounts } from '@/contexts/AccountsContext';

export default function AccountsListWrapper() {
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const { accounts, removeAccount } = useAccounts();

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setLoading(false);
    };
    
    initializeData();
  }, [accounts]);

  if (!user) {
    return <div>Erreur inattendue: utilisateur non disponible</div>;
  }

  const handleDeleteAccount = async (deletedId: number) => {
    try {
      if (removeAccount) {
        await removeAccount(deletedId);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
    }
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