'use client';

import { Suspense, useEffect, useState } from 'react';
import React from 'react';
import { BankAccount } from '@/app/db/schema';
import { UserAccountService } from '@/app/services/userAccountService';
import AccountsList from '@/app/components/accounts/accountsList';
import BackLink from '@/app/components/global/BackLink';
import CreateNew from '@/app/components/global/CreateNew';

export default function AccountsListWrapper({ userId }: {userId: number}) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    (async () => {
      setAccounts(await UserAccountService.getAllUserAccounts(userId))
    })();
  }, [userId]);

  const handleDeleteAccount = (deletedId: number) => {
    setAccounts((prevAccounts) => prevAccounts.filter((account) => account.id !== deletedId));
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <BackLink />
        <h1 className="text-3xl font-bold mb-6">Gestion des comptes</h1>
        <CreateNew href="accounts/new" title="+ Créer un compte" />
      </div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          <Suspense fallback={<UserListSkeleton />}>
          {accounts.map((account) => (
              <AccountsList 
                key={account.id} 
                id={account.id!} 
                userId={userId}
                bankName={account.bankName} 
                accountNumber={account.accountNumber}
                accountType={account.accountType}
                balance={account.balance}
                currency={account.currency}
                onDelete={handleDeleteAccount} />
            ))}
          </Suspense>
        </div>
      </div>
    </>
    );
};

function UserListSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
      {[1, 2, 3].map((_, index) => (
        <div 
          key={index} 
          className="h-16 bg-gray-100 rounded mb-2"
        ></div>
      ))}
    </div>
  );
}