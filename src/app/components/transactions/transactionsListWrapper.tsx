'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { AccountTransaction, BankAccount } from '@/app/db/schema';
import { AccountTransactionService } from '@/app/services/accountTransactionService';
import TransactionsList from '@/app/components/transactions/transactionsList';
import { AccountService } from '@/app/services/accountService';
import CreateNew from '@/app/components/global/CreateNew';
import ListSkeleton from '@/app/components/global/ListSkeleton';
import { useUser } from '@/app/contexts/UserContext';

export default function TransactionsListWrapper({ accountId }: TransactionsListWrapperProps) {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<AccountTransaction[]>([]);
  const [account, setAccount] = useState<BankAccount>();

  useEffect(() => {
    (async () => {
      setTransactions(await AccountTransactionService.getAllAccountTransactions(accountId));
      setAccount(await AccountService.getAccountById(accountId))
    })();
  }, [accountId]);

  const handleDeleteAccount = (deletedId: number) => {
    setTransactions((prevTransactions) => prevTransactions.filter((transaction) => transaction.id !== deletedId));
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6">Gestion des comptes transactions pour le compte{account?.accountNumber} de {user?.name}</h1>
        <CreateNew href="transactions/new" title="+ Ajouter une transaction" />
      </div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          <Suspense fallback={<ListSkeleton />}>
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
    </>
  );
};

type TransactionsListWrapperProps = {
  accountId: number;
};