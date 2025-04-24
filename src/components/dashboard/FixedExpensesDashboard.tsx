"use client"

import React, { useMemo } from 'react';
import { useFixedExpenses } from '@/contexts/FixedExpensesContext';
import { getCurrentDate, getFirstDayOfMonth, getLastDayOfMonth, formatDateSwiss, getMonthName } from '@/utils/dateUtils';

export type RecurrenceType = 'quotidienne' | 'hebdomadaire' | 'mensuelle' | 'annuelle' | 'ponctuelle';
export type PaymentMethodType = 'Carte' | 'Virement' | 'Prélèvement' | 'Espèces' | 'Autre';

export function FixedExpensesDashboard() {
  const { fixedExpenses } = useFixedExpenses();
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Obtenir les dates du mois complet
  const today = useMemo(() => getCurrentDate(), []);
  const firstOfTheMonth = useMemo(() => getFirstDayOfMonth(today), [today]);
  const lastOfTheMonth = useMemo(() => getLastDayOfMonth(today), [today]);
  const currentMonth = useMemo(() => getMonthName(today), [today]);
  
  // Filtrer les dépenses fixes entre le 1er et le dernier jour du mois
  const currentMonthExpenses = useMemo(() => {
    return fixedExpenses 
      ? fixedExpenses.filter(expense => {
          const fromDate = new Date(expense.from);
          const toDate = expense.to ? new Date(expense.to) : new Date(9999, 11, 31);
          
          // Vérifier si la dépense est active dans le mois actuel
          if (fromDate <= lastOfTheMonth && toDate >= firstOfTheMonth) {
            // Pour les dépenses mensuelles, les inclure toujours
            if (expense.recurrence === 'mensuelle') {
              return true;
            }
            
            // Pour les autres types de dépenses, vérifier si elles sont dans le mois actuel
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === today.getMonth() && 
                   expenseDate.getFullYear() === today.getFullYear();
          }
          
          return false;
        })
      : [];
  }, [fixedExpenses, today, firstOfTheMonth, lastOfTheMonth]);
  
  // Trier les dépenses fixes par date (de la plus récente à la plus ancienne)
  const sortedExpenses = useMemo(() => {
    return currentMonthExpenses.length
      ? [...currentMonthExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) 
      : [];
  }, [currentMonthExpenses]);
  
  // Calculer la somme totale des dépenses fixes pour le mois actuel
  const totalExpensesSum = useMemo(() => {
    if (!sortedExpenses.length) return 0;
    return sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [sortedExpenses]);
  
  // Fonction pour obtenir la traduction des récurrences
  const getRecurrenceLabel = (recurrence: RecurrenceType): string => {
    const labels: Record<RecurrenceType, string> = {
      'quotidienne': 'Quotidienne',
      'hebdomadaire': 'Hebdomadaire',
      'mensuelle': 'Mensuelle',
      'annuelle': 'Annuelle',
      'ponctuelle': 'Ponctuelle'
    };
    return labels[recurrence] || recurrence;
  };
  
  // Fonction pour obtenir la couleur de récurrence
  const getRecurrenceColor = (recurrence: RecurrenceType): string => {
    const colors: Record<RecurrenceType, string> = {
      'quotidienne': 'bg-red-100 text-red-800',
      'hebdomadaire': 'bg-orange-100 text-orange-800',
      'mensuelle': 'bg-blue-100 text-blue-800',
      'annuelle': 'bg-green-100 text-green-800',
      'ponctuelle': 'bg-purple-100 text-purple-800'
    };
    return colors[recurrence] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <>
      {sortedExpenses.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Dépenses - {currentMonth}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedExpenses.map((expense) => {
                  const expenseDate = new Date(expense.date);
                  
                  return (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="font-medium text-gray-900">{expense.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDateSwiss(expenseDate)}
                          <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRecurrenceColor(expense.recurrence)}`}>
                            {getRecurrenceLabel(expense.recurrence)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <div className="font-medium text-gray-900">{formatCurrency(expense.amount)}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {expense.category}
                          {expense.paid !== undefined && (
                            <span className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${expense.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {expense.paid ? 'Payé' : 'Non payé'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 italic mb-3">
                Note: Les montants affichés sont les dépenses pour le mois de {currentMonth}.
              </p>
              
              <div className="flex justify-between items-center border-t pt-3 border-gray-300">
                <div className="text-sm font-medium text-gray-900">
                  {formatDateSwiss(firstOfTheMonth)} - {formatDateSwiss(lastOfTheMonth)}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(totalExpensesSum)}
                  </p>
                  <p className="text-xs text-gray-500">Somme totale des dépenses du mois</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Aucune dépense fixe trouvée pour le mois de {currentMonth}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Ajouter une dépense fixe
          </button>
        </div>
      )}
    </>
  );
}