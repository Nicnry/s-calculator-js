'use client';

import { Suspense, useEffect, useState } from 'react';
import React from 'react';
import { BankAccount } from '@/app/db/schema';
import { AccountService } from '@/app/services/accountService';
import Link from 'next/link';
import AccountsList from '@/app/components/accounts/accountsList';

export default function AccountsListWrapper() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    (async () => {
      setAccounts(await AccountService.getAllAccounts())
    })();
  }, []);

  const handleDeleteAccount = (deletedId: number) => {
    setAccounts((prevAccounts) => prevAccounts.filter((account) => account.id !== deletedId));
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold mb-6">Gestion des comptes</h1>
        <Link 
          href={`accounts/new`} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          title="+ Créer un compte"
        >+ Créer un compte</Link>
      </div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
        <Suspense fallback={<UserListSkeleton />}>
        {accounts.map((account) => (
            <AccountsList 
              key={account.id} 
              id={account.id!} 
              userId={1}
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
    <div>
      <Link href="/users/">Retour aux utilisateurs</Link>
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