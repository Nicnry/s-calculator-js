/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react';
import { localDb } from '@/db/database';
import Dexie from 'dexie';

const ImportCSVButton: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    setProgress(10);
    
    try {
      await localDb.ensureOpen();
      
      const content = await readFileAsText(file);
      setProgress(20);
      
      const parsedData = parseCSVContent(content);

      setProgress(30);
      
      await clearAndImportData(parsedData);
      
      setProgress(100);
      console.log("Importation terminée avec succès");
      
      setTimeout(() => {
        setIsImporting(false);
      }, 500);
      
    } catch (error) {
      console.error("Erreur lors de l'importation:", error);
      alert(`Erreur lors de l'importation: ${(error as Error).message}`);
      setIsImporting(false);
    }
    
    event.target.value = '';
  };
  
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };
  
  const parseCSVContent = (csvContent: string) => {
    const result: Record<string, { columns: string[], values: any[][] }> = {};
    
    const lines = csvContent.split('\n');
    let currentTable = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) continue;
      
      const tableMatch = line.match(/---\s+(\w+)\s+---/);
      if (tableMatch) {
        currentTable = tableMatch[1];
        result[currentTable] = { columns: [], values: [] };
        continue;
      }
      
      if (currentTable) {
        if (result[currentTable].columns.length === 0) {
          const columns = line.split(',').map(col => col.trim());
          result[currentTable].columns = columns;
        } else {
          const values = parseCSVLine(line);
          result[currentTable].values.push(values);
        }
      }
    }
    
    return result;
  };
  
  const parseCSVLine = (line: string): any[] => {
    const values: any[] = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
          currentValue += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(convertValue(currentValue));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    
    values.push(convertValue(currentValue));
    
    return values;
  };
  
  const convertValue = (value: string): any => {
    value = value.trim();
    
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    
    if (value === '' || value.toLowerCase() === 'null') return null;
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    
    const num = Number(value);
    if (!isNaN(num) && value !== '') return num;
    
    if (/^\d{4}-\d{2}-\d{2}/.test(value) || 
        /^[A-Za-z]{3}\s[A-Za-z]{3}\s\d{2}/.test(value) ||
        /^\w{3}\s\w{3}\s\d{1,2}\s\d{4}/.test(value)) {
      try {
        return new Date(value);
      } catch {

      }
    }
    
    return value;
  };
  
  const clearAndImportData = async (data: Record<string, { columns: string[], values: any[][] }>) => {
    try {
      await localDb.transaction('rw', 
        [localDb.users, localDb.bankAccounts, localDb.salaries, localDb.accountTransactions, localDb.fixedExpenses], 
        async () => {
          
        await localDb.users.clear();
        await localDb.bankAccounts.clear();
        await localDb.salaries.clear();
        await localDb.accountTransactions.clear();
        await localDb.fixedExpenses.clear();
        
        setProgress(40);
        
        const tableMap: Record<string, Dexie.Table<any, any>> = {
          users: localDb.users,
          bankAccounts: localDb.bankAccounts,
          salaries: localDb.salaries,
          accountTransactions: localDb.accountTransactions,
          fixedExpenses: localDb.fixedExpenses
        };
        
        const tableCount = Object.keys(data).length;
        let processedTables = 0;
        
        for (const tableName in data) {
          if (!tableMap[tableName]) {
            console.warn(`Table ${tableName} non reconnue, ignorée.`);
            processedTables++;
            continue;
          }
          
          const { columns, values } = data[tableName];
          const table = tableMap[tableName];
          
          for (const rowValues of values) {
            const obj: Record<string, any> = {};
            
            columns.forEach((column, index) => {
              if (index < rowValues.length) {
                obj[column] = rowValues[index];
              }
            });
            
            if (obj.id) {
              await table.put(obj);
            } else {
              await table.add(obj);
            }
          }
          
          processedTables++;
          setProgress(40 + Math.floor((processedTables / tableCount) * 50));
        }
      });
      
      console.log("Données importées avec succès");
      
    } catch (error) {
      console.error("Erreur lors de l'importation des données:", error);
      throw error;
    }
  };
  
  return (
    <div className="w-full flex flex-col items-start gap-2">
      <label 
        htmlFor="csvImport"
        className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full text-center
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 
                  transition-colors cursor-pointer ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Importer
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