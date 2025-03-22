'use client';

import { useEffect, useState } from 'react';
import { BankAccount } from '@/app/db/schema';
import { UserAccountService } from '@/app/services/userAccountService';
import AccountsList from '@/app/components/accounts/accountsList';
import GenericListWrapper from '@/app/components/global/GenericListWrapper';

export default function AccountsListWrapper({ userId }: { userId: number }) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await UserAccountService.getAllUserAccounts(userId);
      setAccounts(data);
      setLoading(false);
    })();
  }, [userId]);

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