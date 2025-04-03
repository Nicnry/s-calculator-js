"use client"

import React, { useMemo } from 'react';
import { SalaryModel } from '@/models/SalaryModel';
import { useSalaries } from '@/contexts/SalariesContext';
import { getCurrentDate, getFirstDayOfMonth, getLastDayOfMonth, formatDateSwiss, getMonthName } from '@/utils/dateUtils';

export function SalaryDashboard() {
  const { salaries } = useSalaries();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Utiliser dates pour le mois complet
  const today = useMemo(() => getCurrentDate(), []);
  const firstOfTheMonth = useMemo(() => getFirstDayOfMonth(today), [today]);
  const lastOfTheMonth = useMemo(() => getLastDayOfMonth(today), [today]);
  const currentMonth = useMemo(() => getMonthName(today), [today]);
  
  const currentSalaries = useMemo(() => {
    return salaries 
      ? salaries
          .map(salary => new SalaryModel(salary))
          .filter(salary => {
            const fromDate = new Date(salary.from);
            const toDate = salary.to ? new Date(salary.to) : new Date(9999, 11, 31);
            return fromDate <= lastOfTheMonth && toDate >= firstOfTheMonth;
          })
      : [];
  }, [salaries, firstOfTheMonth, lastOfTheMonth]);

  const sortedSalaries = useMemo(() => {
    return currentSalaries.length
      ? [...currentSalaries].sort((a, b) => new Date(b.from).getTime() - new Date(a.from).getTime()) 
      : [];
  }, [currentSalaries]);
  
  const totalNetSalariesSum = useMemo(() => {
    if (!sortedSalaries.length) return 0;
    return sortedSalaries.reduce((sum, model) => sum + model.getNetSalary(), 0);
  }, [sortedSalaries]);

  return (
    <>
      {sortedSalaries.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Salaires - {currentMonth}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedSalaries.map((salaryModel) => {
                  const fromDate = new Date(salaryModel.from);
                  let toDate = null;
                  if(salaryModel.to) {
                    toDate = new Date(salaryModel.to);
                  }
                  console.log(toDate)
                  return (
                    <tr key={salaryModel.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {toDate ? `${formatDateSwiss(fromDate)} - ${formatDateSwiss(toDate)}` : formatDateSwiss(fromDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <div className="font-medium text-gray-900">{formatCurrency(salaryModel.getNetSalary())}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatCurrency(salaryModel.totalSalary)} brut 
                          <span className="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {salaryModel.employmentRate}%
                          </span>
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
              </p>
              
              {sortedSalaries.length > 0 && (
                <div className="flex justify-between items-center border-t pt-3 border-gray-300">
                  <div className="text-sm font-medium text-gray-900">
                    {formatDateSwiss(firstOfTheMonth)} - {formatDateSwiss(lastOfTheMonth)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {formatCurrency(totalNetSalariesSum)}
                    </p>
                    <p className="text-xs text-gray-500">Somme totale (net)</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">Aucun salaire trouvé pour le mois de {currentMonth}.</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Ajouter un salaire
          </button>
        </div>
      )}
    </>
  );
}