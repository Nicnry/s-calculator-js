'use client'
import React, { useState } from 'react';
import { localDb } from '@/app/db/database';

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
      
      if (!line) {
        continue;
      }
      
      if (line.startsWith('---')) {
        if (currentSection && headers.length > 0 && currentData.length > 0) {
          sections.push({ section: currentSection, data: currentData });
        }
        
        const sectionMatch = line.match(/^--- (.*) ---$/);
        if (sectionMatch) {
          currentSection = sectionMatch[1];
          headers = [];
          currentData = [];
        }
        continue;
      }
      
      if (line.startsWith('# ')) {
        if (currentSection && headers.length > 0 && currentData.length > 0) {
          sections.push({ section: currentSection, data: currentData });
        }
        
        const sectionName = line.substring(2).trim();
        
        const sectionMap: { [key: string]: string } = {
          'UTILISATEURS': 'users',
          'COMPTES BANCAIRES': 'bankAccounts',
          'SALAIRES': 'salaries',
          'TRANSACTIONS': 'accountTransactions'
        };
        
        currentSection = sectionMap[sectionName] || sectionName.toLowerCase();
        headers = [];
        currentData = [];
        continue;
      }
      
      if (line.startsWith('#')) {
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
            
            if (value === '') {
              rowData[header] = null;
            } else if (value === 'true') {
              rowData[header] = true;
            } else if (value === 'false') {
              rowData[header] = false;
            } else if (!isNaN(Number(value)) && value.trim() !== '') {
              if (!/[a-zA-Z]/.test(value)) {
                rowData[header] = Number(value);
              } else {
                rowData[header] = value;
              }
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
      
      if (sections.length === 0) {
        throw new Error("Aucune donnée valide trouvée dans le fichier CSV");
      }
      
      await localDb.ensureOpen();
      
      const availableTables: string[] = [];
      for (const key in localDb) {
        if (
          typeof localDb[key] === 'object' && 
          localDb[key] !== null && 
          'bulkAdd' in localDb[key] && 
          'clear' in localDb[key]
        ) {
          availableTables.push(key);
        }
      }
      
      const validSections = sections.filter(section => 
        availableTables.includes(section.section)
      );
      
      const tablesToClear = validSections.map(section => localDb[section.section]);
      
      await localDb.transaction('rw', tablesToClear, async () => {
        setProgress(10);
        
        for (const section of validSections) {
          await localDb[section.section].clear();
        }
        
        setProgress(20);
        
        const totalSections = validSections.length;
        let processedSections = 0;
        
        for (const section of validSections) {
          const tableData = section.data.map(item => {
            const { id, ...rest } = item;
            return rest;
          });
          
          await localDb[section.section].bulkAdd(tableData);
          
          processedSections++;
          setProgress(20 + Math.floor((processedSections / totalSections) * 80));
        }
      });
      
      setProgress(100);
      alert('Importation réussie! La base de données a été mise à jour.');
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      alert(`Une erreur est survenue lors de l'importation des données: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      const confirmImport = window.confirm(
        'Cette opération va supprimer toutes les données existantes des tables concernées et les remplacer par celles du fichier CSV. Êtes-vous sûr de vouloir continuer?'
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