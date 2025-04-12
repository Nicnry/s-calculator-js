/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { AccountService } from '@/services/accountService';
import SalaryService from '@/services/salaryService';
import { TransactionService } from '@/services/transactionService';
import { UserService } from '@/services/userService';
import React from 'react';
import FixedExpenseService from '@/services/fixedExpenseService';

async function getAllDatas() {
  const users = await UserService.getAllUsers();
  const bankAccounts = await AccountService.getAllAccounts();
  const salaries = await SalaryService.getAllSalaries();
  const accountTransactions = await TransactionService.getAllTransactions();
  const fixedExpenses = await FixedExpenseService.getAllExpenses();

  return {users, bankAccounts, salaries, accountTransactions, fixedExpenses};
}

function transformData(data: any) {
  const result: Record<string, { 
    keys: string[], 
    values: (string | number | boolean | null)[][] 
  }> = {};

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (Array.isArray(data[key]) && data[key].length > 0) {
        const keys = Object.keys(data[key][0]);
        const values = data[key].map(obj => keys.map(k => obj[k]));

        result[key] = { keys, values };
      }
    }
  }

  return result;
}

function convertToSingleCSV(data: any) {

  let csvContent = '';
  
  for (const tableName in data) {
    const tableData = data[tableName];
    
    csvContent += `\n--- ${tableName} ---\n`;
    
    csvContent += tableData.keys.join(',') + '\n';
    
    for (const row of tableData.values) {
      const formattedRow = row.map((value: any) => {
        if (value === null || value === undefined) return '';
        const strValue = String(value);
        if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
          return `"${strValue.replace(/"/g, '""')}"`;
        }
        return strValue;
      });
      csvContent += formattedRow.join(',') + '\n';
    }
    
    csvContent += '\n';
  }
  
  return csvContent;
}

function downloadSingleCSV(csvContent: string, filename = 'export_data.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

const ExportCSVButton: React.FC = () => {
  const handleExport = async () => {
    try {
      const db = await getAllDatas();
      
      const transformedData = transformData(db);
      
      const csvContent = convertToSingleCSV(transformedData);
      
      downloadSingleCSV(csvContent, 'database_export.csv');
    } catch (error) {
      console.error("Erreur lors de l'exportation CSV:", error);
      alert("Une erreur est survenue lors de l'exportation des données.");
    }
  };
  
  return (
    <button
      onClick={handleExport}
      className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
    >
      Exporter
    </button>
  );
};

export default ExportCSVButton;