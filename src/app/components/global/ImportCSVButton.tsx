'use client'
import React, { useState } from 'react';

import { localDb } from '@/app/db/database';
import { User, BankAccount, Salary, AccountTransaction } from '@/app/db/schema';

const ImportCSVButton: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const parseCSV = (csvText: string): { section: string; data: any[] }[] => {
    const lines = csvText.split('\n');
    const sections: { section: string; data: any[] }[] = [];
    
    let currentSection = '';
    let headers: string[] = [];
    let currentData: any[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line || (line.startsWith('#') && !line.includes('UTILISATEURS') && 
          !line.includes('COMPTES BANCAIRES') && !line.includes('SALAIRES') && 
          !line.includes('TRANSACTIONS'))) {
        continue;
      }
      
      if (line.startsWith('# UTILISATEURS')) {
        if (currentSection && headers.length > 0 && currentData.length > 0) {
          sections.push({ section: currentSection, data: currentData });
        }
        currentSection = 'users';
        headers = [];
        currentData = [];
        continue;
      } else if (line.startsWith('# COMPTES BANCAIRES')) {
        if (currentSection && headers.length > 0 && currentData.length > 0) {
          sections.push({ section: currentSection, data: currentData });
        }
        currentSection = 'bankAccounts';
        headers = [];
        currentData = [];
        continue;
      } else if (line.startsWith('# SALAIRES')) {
        if (currentSection && headers.length > 0 && currentData.length > 0) {
          sections.push({ section: currentSection, data: currentData });
        }
        currentSection = 'salaries';
        headers = [];
        currentData = [];
        continue;
      } else if (line.startsWith('# TRANSACTIONS')) {
        if (currentSection && headers.length > 0 && currentData.length > 0) {
          sections.push({ section: currentSection, data: currentData });
        }
        currentSection = 'accountTransactions';
        headers = [];
        currentData = [];
        continue;
      }
      
      if (currentSection && headers.length === 0) {
        headers = parseCSVRow(line);
        continue;
      }
      
      if (currentSection && headers.length > 0) {
        const values = parseCSVRow(line);
        
        if (values.length === headers.length) {
          const rowData: Record<string, any> = {};
          
          for (let j = 0; j < headers.length; j++) {
            const header = headers[j].replace(/^"(.*)"$/, '$1');
            let value = values[j];
            
            if (header === 'id') {
              rowData[header] = value === '' ? undefined : value;
              continue;
            }
            
            const numericFields = [
              'balance', 'totalSalary', 'taxableSalary', 'avsAiApgContribution', 
              'vdLpcfamDeduction', 'acDeduction', 'aanpDeduction', 'ijmA1Deduction', 
              'lppDeduction', 'monthlyPayments', 'amount', 'userId', 'bankAccountId'
            ];
            
            if (numericFields.includes(header) && value !== '') {
              rowData[header] = Number(value);
            } else if (value === 'true') {
              rowData[header] = true;
            } else if (value === 'false') {
              rowData[header] = false;
            } else if (value === '') {
              rowData[header] = null;
            } else {
              rowData[header] = value;
            }
          }
          
          if (rowData['createdAt'] && typeof rowData['createdAt'] === 'string') {
            rowData['createdAt'] = new Date(rowData['createdAt']);
          }
          if (rowData['date'] && typeof rowData['date'] === 'string') {
            rowData['date'] = new Date(rowData['date']);
          }
          
          currentData.push(rowData);
        }
      }
    }
    
    if (currentSection && headers.length > 0 && currentData.length > 0) {
      sections.push({ section: currentSection, data: currentData });
    }
    
    return sections;
  };
  
  const parseCSVRow = (row: string): string[] => {
    const result: string[] = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"') {
        if (i < row.length - 1 && row[i + 1] === '"') {
          currentValue += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    result.push(currentValue);
    
    return result;
  };

  const importData = async (file: File) => {
    try {
      setIsImporting(true);
      setProgress(0);
      
      const fileContent = await file.text();
      const sections = parseCSV(fileContent);
      
      await localDb.ensureOpen();
      
      await localDb.transaction('rw', 
        [localDb.users, localDb.bankAccounts, localDb.salaries, localDb.accountTransactions], 
        async () => {
          await localDb.accountTransactions.clear();
          await localDb.salaries.clear();
          await localDb.bankAccounts.clear();
          await localDb.users.clear();
          
          setProgress(20);
          
          for (const section of sections) {
            switch (section.section) {
              case 'users':
                const usersData = section.data.map(item => {
                  const { id, ...rest } = item;
                  return rest;
                });
                await localDb.users.bulkAdd(usersData);
                break;
              case 'bankAccounts':
                const accountsData = section.data.map(item => {
                  const { id, ...rest } = item;
                  return rest;
                });
                await localDb.bankAccounts.bulkAdd(accountsData);
                break;
              case 'salaries':
                const salariesData = section.data.map(item => {
                  const { id, ...rest } = item;
                  return rest;
                });
                await localDb.salaries.bulkAdd(salariesData);
                break;
              case 'accountTransactions':
                const transactionsData = section.data.map(item => {
                  const { id, ...rest } = item;
                  return rest;
                });
                await localDb.accountTransactions.bulkAdd(transactionsData);
                break;
            }
            
            setProgress(prev => prev + Math.floor(80 / sections.length));
          }
        }
      );
      
      setProgress(100);
      alert('Importation réussie! La base de données a été mise à jour.');
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      alert('Une erreur est survenue lors de l\'importation des données.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      const confirmImport = window.confirm(
        'Cette opération va supprimer toutes les données existantes et les remplacer par celles du fichier CSV. Êtes-vous sûr de vouloir continuer?'
      );
      
      if (confirmImport) {
        importData(file);
      }
    } else if (file) {
      alert('Veuillez sélectionner un fichier CSV valide.');
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <label 
        htmlFor="csvImport"
        className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 
                  transition-colors cursor-pointer ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Importer depuis CSV
        <input
          type="file"
          id="csvImport"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isImporting}
          className="hidden"
        />
      </label>
      
      {isImporting && (
        <div className="w-full mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Importation en cours ({progress}%)...</p>
        </div>
      )}
    </div>
  );
};

export default ImportCSVButton;