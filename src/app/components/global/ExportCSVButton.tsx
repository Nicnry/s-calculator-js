'use client'

import { AccountService } from '@/app/services/accountService';
import { SalaryService } from '@/app/services/salaryService';
import { TransactionService } from '@/app/services/transactionService';
import { UserService } from '@/app/services/userService';
import React from 'react';
import { localDb } from '@/app/db/database';
import { User, BankAccount, Salary, AccountTransaction } from '@/app/db/schema';

const ExportCSVButton: React.FC = () => {
  const handleExport = async () => {
    try {
      await localDb.ensureOpen();

      const users = await localDb.users.toArray();
      const bankAccounts = await localDb.bankAccounts.toArray();
      const salaries = await localDb.salaries.toArray();
      const accountTransactions = await localDb.accountTransactions.toArray();

      const objectToCSV = (obj: any): string => {
        return Object.entries(obj)
          .filter(([key, value]) => typeof value !== 'object' || value === null)
          .map(([_, value]) => {
            if (value === null || value === undefined) return '""';
            const valueStr = String(value).replace(/"/g, '""');
            return `"${valueStr}"`;
          })
          .join(',');
      };

      const getHeaders = (obj: any): string[] => {
        return Object.entries(obj)
          .filter(([key, value]) => typeof value !== 'object' || value === null)
          .map(([key, _]) => key);
      };

      const createCSVSection = (data: any[], sectionName: string): string => {
        if (!data || data.length === 0) return '';
        
        const headers = getHeaders(data[0]);
        const headerRow = headers.map(h => `"${h}"`).join(',');
        
        const rows = data.map(item => objectToCSV(item));
        
        return [headerRow, ...rows].join('\n');
      };

      const userSection = createCSVSection(users, 'Users');
      const bankAccountSection = createCSVSection(bankAccounts, 'BankAccounts');
      const salarySection = createCSVSection(salaries, 'Salaries');
      const transactionSection = createCSVSection(accountTransactions, 'AccountTransactions');
      
      const fullCSV = [
        "# SCalculator - Export de la base de données",
        "# Date d'exportation: " + new Date().toISOString(),
        "",
        "# UTILISATEURS",
        userSection,
        "",
        "# COMPTES BANCAIRES",
        bankAccountSection,
        "",
        "# SALAIRES",
        salarySection,
        "",
        "# TRANSACTIONS",
        transactionSection
      ].join('\n');

      const blob = new Blob([fullCSV], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `scaclulator_export_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'exportation:', error);
      alert('Une erreur est survenue lors de l\'exportation des données.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
    >
      Exporter en CSV
    </button>
  );
};

export default ExportCSVButton;