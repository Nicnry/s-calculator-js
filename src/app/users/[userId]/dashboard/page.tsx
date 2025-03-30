'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@/app/contexts/UserContext';
import { useSalaries } from '@/app/contexts/SalariesContext';
import { useAccounts } from '@/app/contexts/AccountsContext';
import { useFixedExpenses } from '@/app/contexts/FixedExpensesContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function UserDashboard() {
  const params = useParams();
  const userId = params.userId as string;
  
  const { user } = useUser();
  const { salaries } = useSalaries();
  const { accounts } = useAccounts();
  const { fixedExpenses } = useFixedExpenses();
  console.warn("user : ", user, " / salaries :", salaries, " / accounts :", accounts, " / fixedExpenses :", fixedExpenses);
  const [stats, setStats] = useState<DashboardStats>({
    totalSalarySum: 0,
    totalExpensesSum: 0,
    currentBalance: 0,
    netCashflow: 0,
    savingsRate: 0,
    accountBalances: {},
  });
  
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    endDate: new Date()
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cashflowData, setCashflowData] = useState<Array<{date: string; income: number; expenses: number; balance: number}>>([]);

  const handleDateRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDateRange(prev => ({
      ...prev,
      [name]: new Date(value)
    }));
  };

  const resetDateRange = () => {
    setDateRange({
      startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      endDate: new Date()
    });
  };

  // Filtrer les données en fonction de la plage de dates
  const filterDataByDateRange = <T extends { from: Date; to: Date }>(data: T[] | undefined): T[] => {
    if (!data) return [];
    
    return data.filter(item => {
      const itemFromDate = new Date(item.from);
      const itemToDate = new Date(item.to);
      
      return (
        (itemFromDate >= dateRange.startDate && itemFromDate <= dateRange.endDate) ||
        (itemToDate >= dateRange.startDate && itemToDate <= dateRange.endDate) ||
        (itemFromDate <= dateRange.startDate && itemToDate >= dateRange.endDate)
      );
    });
  };

  // Génération des données de flux de trésorerie pour le graphique
  const generateCashflowData = (
    filteredSalaries: typeof salaries, 
    filteredExpenses: typeof fixedExpenses, 
    filteredAccounts: typeof accounts
  ) => {
    if (!filteredSalaries || !filteredExpenses || !filteredAccounts) return [];

    // Créer une map de toutes les dates pertinentes
    const allDates = new Map<string, { income: number; expenses: number; balance: number }>();
    
    // Initialiser avec la plage de dates
    const currentDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      allDates.set(dateKey, { income: 0, expenses: 0, balance: 0 });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Ajouter les salaires
    filteredSalaries.forEach(salary => {
      // Diviser le salaire total par le nombre de paiements mensuels
      const monthlyAmount = salary.totalSalary / salary.monthlyPayments;
      
      // Calculer les dates de paiement mensuelles
      const fromDate = new Date(salary.from);
      const toDate = new Date(salary.to);
      
      const paymentDate = new Date(fromDate);
      while (paymentDate <= toDate) {
        const dateKey = paymentDate.toISOString().split('T')[0];
        
        if (allDates.has(dateKey)) {
          const currentValues = allDates.get(dateKey);
          if (currentValues) {
            allDates.set(dateKey, {
              ...currentValues,
              income: currentValues.income + monthlyAmount
            });
          }
        }
        
        // Passer au mois suivant
        paymentDate.setMonth(paymentDate.getMonth() + 1);
      }
    });
    
    // Ajouter les dépenses fixes
    filteredExpenses.forEach(expense => {
      const fromDate = new Date(expense.from);
      const toDate = new Date(expense.to);
      
      const expenseDate = new Date(fromDate);
      
      // Facteur de multiplication basé sur la récurrence
      let frequencyFactor = 1;
      switch (expense.recurrence) {
        case 'quotidienne':
          frequencyFactor = 30; // Pour un mois
          break;
        case 'hebdomadaire':
          frequencyFactor = 4; // 4 semaines par mois
          break;
        case 'mensuelle':
          frequencyFactor = 1;
          break;
        case 'annuelle':
          frequencyFactor = 1/12; // Divisé sur 12 mois
          break;
        case 'ponctuelle':
          frequencyFactor = 1; // Une seule fois
          break;
      }
      
      // Pour les dépenses ponctuelles
      if (expense.recurrence === 'ponctuelle') {
        const dateKey = expenseDate.toISOString().split('T')[0];
        
        if (allDates.has(dateKey)) {
          const currentValues = allDates.get(dateKey);
          if (currentValues) {
            allDates.set(dateKey, {
              ...currentValues,
              expenses: currentValues.expenses + expense.amount
            });
          }
        }
      } else {
        // Pour les dépenses récurrentes
        while (expenseDate <= toDate) {
          const dateKey = expenseDate.toISOString().split('T')[0];
          
          if (allDates.has(dateKey)) {
            const currentValues = allDates.get(dateKey);
            if (currentValues) {
              allDates.set(dateKey, {
                ...currentValues,
                expenses: currentValues.expenses + (expense.amount * frequencyFactor)
              });
            }
          }
          
          // Ajuster la date selon la récurrence
          switch (expense.recurrence) {
            case 'quotidienne':
              expenseDate.setDate(expenseDate.getDate() + 1);
              break;
            case 'hebdomadaire':
              expenseDate.setDate(expenseDate.getDate() + 7);
              break;
            case 'mensuelle':
              expenseDate.setMonth(expenseDate.getMonth() + 1);
              break;
            case 'annuelle':
              expenseDate.setFullYear(expenseDate.getFullYear() + 1);
              break;
          }
        }
      }
    });
    
    // Calculer le solde cumulatif
    let cumulativeBalance = 0;
    
    // Si nous avons des comptes, prendre le solde initial
    if (filteredAccounts.length > 0) {
      // Trouver le compte avec la date la plus ancienne comme point de départ
      const oldestAccount = filteredAccounts.reduce((oldest, current) => {
        return new Date(current.from) < new Date(oldest.from) ? current : oldest;
      }, filteredAccounts[0]);
      
      cumulativeBalance = oldestAccount.balance;
    }
    
    // Convertir la Map en tableau et calculer le solde cumulatif
    const result = Array.from(allDates.entries())
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .map(([date, data]) => {
        cumulativeBalance += data.income - data.expenses;
        return {
          date,
          income: data.income,
          expenses: data.expenses,
          balance: cumulativeBalance
        };
      });
    
    return result;
  };

  useEffect(() => {
    async function loadUserData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Filtrer les données selon la plage de dates
        const filteredSalaries = filterDataByDateRange(salaries);
        const filteredExpenses = filterDataByDateRange(fixedExpenses);
        const filteredAccounts = filterDataByDateRange(accounts);
        
        // Calculer les statistiques
        if (filteredSalaries.length > 0 || filteredExpenses.length > 0 || filteredAccounts.length > 0) {
          // Total des salaires
          const totalSalarySum = filteredSalaries.reduce((sum, salary) => sum + salary.totalSalary, 0);
          
          // Total des dépenses
          const totalExpensesSum = filteredExpenses.reduce((sum, expense) => {
            let multiplier = 1;
            // Ajuster le montant en fonction de la récurrence et de la période
            const fromDate = new Date(expense.from);
            const toDate = new Date(expense.to);
            const durationInDays = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
            
            switch (expense.recurrence) {
              case 'quotidienne':
                multiplier = durationInDays;
                break;
              case 'hebdomadaire':
                multiplier = durationInDays / 7;
                break;
              case 'mensuelle':
                multiplier = durationInDays / 30;
                break;
              case 'annuelle':
                multiplier = durationInDays / 365;
                break;
              case 'ponctuelle':
                multiplier = 1;
                break;
            }
            
            return sum + (expense.amount * multiplier);
          }, 0);
          
          // Solde actuel (somme des soldes de tous les comptes)
          const currentBalance = filteredAccounts.reduce((sum, account) => sum + account.balance, 0);
          
          // Soldes par compte
          const accountBalances: {[key: string]: number} = {};
          filteredAccounts.forEach(account => {
            accountBalances[account.bankName] = (accountBalances[account.bankName] || 0) + account.balance;
          });
          
          // Flux de trésorerie net (revenus - dépenses)
          const netCashflow = totalSalarySum - totalExpensesSum;
          
          // Taux d'épargne (flux net / revenus)
          const savingsRate = totalSalarySum > 0 ? (netCashflow / totalSalarySum) * 100 : 0;
          
          setStats({
            totalSalarySum,
            totalExpensesSum,
            currentBalance,
            netCashflow,
            savingsRate,
            accountBalances,
          });
          
          // Générer les données de flux de trésorerie pour le graphique
          const cashflowData = generateCashflowData(filteredSalaries, filteredExpenses, filteredAccounts);
          setCashflowData(cashflowData);
        }
      } catch (err) {
        setError('Erreur lors du chargement des données: ' + (err as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUserData();
  }, [userId, user, salaries, accounts, fixedExpenses, dateRange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Erreur!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Attention!</strong>
        <span className="block sm:inline"> Utilisateur non trouvé.</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Tableau de bord financier de {user.name}
      </h1>
      
      {/* Sélecteur de plage de dates */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Plage de dates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate.toISOString().split('T')[0]}
              onChange={handleDateRangeChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate.toISOString().split('T')[0]}
              onChange={handleDateRangeChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <button
          onClick={resetDateRange}
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
        >
          Réinitialiser
        </button>
      </div>
      
      {/* Vue d'ensemble financière */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Carte statistique: Revenus */}
        <div className={`bg-white rounded-lg shadow p-6 ${stats.totalSalarySum > 0 ? 'border-l-4 border-green-500' : ''}`}>
          <h2 className="text-gray-500 text-sm font-medium">Revenus totaux</h2>
          <p className="text-3xl font-bold text-green-600">{stats.totalSalarySum.toLocaleString()} CHF</p>
        </div>
        
        {/* Carte statistique: Dépenses */}
        <div className={`bg-white rounded-lg shadow p-6 ${stats.totalExpensesSum > 0 ? 'border-l-4 border-red-500' : ''}`}>
          <h2 className="text-gray-500 text-sm font-medium">Dépenses totales</h2>
          <p className="text-3xl font-bold text-red-600">{stats.totalExpensesSum.toLocaleString()} CHF</p>
        </div>
        
        {/* Carte statistique: Bilan */}
        <div className={`bg-white rounded-lg shadow p-6 ${
          stats.netCashflow > 0 
            ? 'border-l-4 border-green-500' 
            : stats.netCashflow < 0 
              ? 'border-l-4 border-red-500' 
              : ''
        }`}>
          <h2 className="text-gray-500 text-sm font-medium">Bilan (Revenus - Dépenses)</h2>
          <p className={`text-3xl font-bold ${
            stats.netCashflow > 0 
              ? 'text-green-600' 
              : stats.netCashflow < 0 
                ? 'text-red-600' 
                : 'text-gray-600'
          }`}>
            {stats.netCashflow.toLocaleString()} CHF
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Carte statistique: Solde actuel */}
        <div className={`bg-white rounded-lg shadow p-6 ${
          stats.currentBalance > 0 
            ? 'border-l-4 border-green-500' 
            : stats.currentBalance < 0 
              ? 'border-l-4 border-red-500' 
              : ''
        }`}>
          <h2 className="text-gray-500 text-sm font-medium">Solde actuel</h2>
          <p className={`text-3xl font-bold ${
            stats.currentBalance > 0 
              ? 'text-green-600' 
              : stats.currentBalance < 0 
                ? 'text-red-600' 
                : 'text-gray-600'
          }`}>
            {stats.currentBalance.toLocaleString()} CHF
          </p>
        </div>
        
        {/* Carte statistique: Taux d'épargne */}
        <div className={`bg-white rounded-lg shadow p-6 ${
          stats.savingsRate > 0 
            ? 'border-l-4 border-green-500' 
            : stats.savingsRate < 0 
              ? 'border-l-4 border-red-500' 
              : ''
        }`}>
          <h2 className="text-gray-500 text-sm font-medium">Taux d'épargne</h2>
          <p className={`text-3xl font-bold ${
            stats.savingsRate > 0 
              ? 'text-green-600' 
              : stats.savingsRate < 0 
                ? 'text-red-600' 
                : 'text-gray-600'
          }`}>
            {stats.savingsRate.toFixed(2)}%
          </p>
        </div>
      </div>
      
      {/* Graphique d'évolution financière */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">Évolution financière</h2>
        <div className="h-80">
          {cashflowData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={cashflowData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('fr-CH', { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${Number(value).toLocaleString()} CHF`, undefined]}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('fr-CH', { year: 'numeric', month: 'long', day: 'numeric' });
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="income" name="Revenus" stroke="#4CAF50" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expenses" name="Dépenses" stroke="#F44336" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="balance" name="Solde" stroke="#2196F3" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">Aucune donnée disponible pour la période sélectionnée.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Résumé des comptes bancaires */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <h2 className="bg-gray-50 px-6 py-3 text-lg font-medium">Comptes bancaires</h2>
        
        {accounts && accounts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banque</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro de compte</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solde</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devise</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filterDataByDateRange(accounts).map((account) => (
                  <tr key={account.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {account.bankName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {account.accountNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {account.accountType}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                      account.balance > 0 
                        ? 'text-green-600' 
                        : account.balance < 0 
                          ? 'text-red-600' 
                          : 'text-gray-600'
                    }`}>
                      {account.balance.toLocaleString()} {account.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {account.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(account.from).toLocaleDateString()} - {new Date(account.to).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 py-4 text-gray-500">Aucun compte bancaire disponible pour cet utilisateur.</p>
        )}
      </div>
      
      {/* Dépenses fixes */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <h2 className="bg-gray-50 px-6 py-3 text-lg font-medium">Dépenses fixes</h2>
        
        {fixedExpenses && fixedExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Récurrence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payé</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filterDataByDateRange(fixedExpenses).map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {expense.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-red-600 font-medium">
                      {expense.amount.toLocaleString()} CHF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expense.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expense.recurrence}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expense.paid ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Oui
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Non
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expense.paymentMethod || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(expense.from).toLocaleDateString()} - {new Date(expense.to).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 py-4 text-gray-500">Aucune dépense fixe disponible pour cet utilisateur.</p>
        )}
      </div>
      
      {/* Liste des salaires */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="bg-gray-50 px-6 py-3 text-lg font-medium">Historique des salaires</h2>
        
        {salaries && salaries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire Imposable</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensualités</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filterDataByDateRange(salaries).map((salary) => (
                  <tr key={salary.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(salary.from).toLocaleDateString()} - {new Date(salary.to).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                      {salary.totalSalary.toLocaleString()} CHF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {salary.taxableSalary.toLocaleString()} CHF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {salary.employmentRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {salary.monthlyPayments}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-6 py-4 text-gray-500">Aucun salaire disponible pour cet utilisateur.</p>
        )}
      </div>
    </div>
  );
}

type DashboardStats = {
  totalSalarySum: number;
  totalExpensesSum: number;
  currentBalance: number;
  netCashflow: number;
  savingsRate: number;
  accountBalances: {
    [key: string]: number;
  };
}

type DateRange = {
  startDate: Date;
  endDate: Date;
}