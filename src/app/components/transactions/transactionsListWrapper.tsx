'use client';

import { Suspense, useEffect, useState } from 'react';
import React from 'react';
import { AccountTransaction, BankAccount, User } from '@/app/db/schema';
import { AccountTransactionService } from '@/app/services/accountTransactionService';
import TransactionsList from '@/app/components/transactions/transactionsList';
import Link from 'next/link';
import { AccountService } from '@/app/services/accountService';
import { UserService } from '@/app/services/userService';

export default function TransactionsListWrapper({ userId, accountId }: { userId: number, accountId: number }) {
  const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
  const [account, setAccount] = useState<BankAccount>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    (async () => {
      setTransactions(await AccountTransactionService.getAllAccountTransactions(accountId));
      setAccount(await AccountService.getAccountById(accountId))
      setUser(await UserService.getUserById(userId))
    })();
  }, []);

  const handleDeleteAccount = (deletedId: number) => {
    setTransactions((prevTransactions) => prevTransactions.filter((transaction) => transaction.id !== deletedId));
  };
  
  return (
    <>
    <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold mb-6">Gestion des comptes transactions pour le compte{account?.accountNumber} de {user?.name}</h1>
        <Link 
          href={`transactions/new`} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          title="+ Ajouter une transaction"
        >+ Ajouter une transaction</Link>
      </div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          <Suspense fallback={<AccountTransactionListSkeleton />}>
            {transactions.map((transaction) => (
              <TransactionsList 
                key={transaction.id}
                id={transaction.id!}
                bankAccountId={transaction.bankAccountId}
                amount={transaction.amount}
                type={transaction.type}
                category={transaction.category}
                date={transaction.date}
                description={transaction.description}
                onDelete={handleDeleteAccount}
              />
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

function AccountTransactionListSkeleton() {
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
