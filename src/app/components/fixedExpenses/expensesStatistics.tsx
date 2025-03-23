'use client';

import { useEffect, useState } from 'react';
import { FixedExpense } from '@/app/db/schema';
import FixedExpenseService from '@/app/services/fixedExpenseService';
import { 
  BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';

interface FormattedFixedExpense extends FixedExpense {
  period: string;
  dateObj: Date;
  fromDate: string;
  toDate: string;
  monthYear: string;
}

export default function FixedExpensesStatistics({ userId }: { userId: number }) {
  const [expenses, setExpenses] = useState<FixedExpense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredExpenses, setFilteredExpenses] = useState<FormattedFixedExpense[]>([]);

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC249', '#EA526F'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const expensesData = await FixedExpenseService.getAllUserExpenses(userId);
        const sortedExpenses = [...expensesData].sort((a, b) => {
          const fromDateA = new Date(a.from);
          const fromDateB = new Date(b.from);
          return fromDateA.getTime() - fromDateB.getTime();
        });
        setExpenses(sortedExpenses);
        
        if (sortedExpenses.length > 0) {
          try {
            const firstDate = new Date(sortedExpenses[0].from);
            const lastDate = new Date(sortedExpenses[sortedExpenses.length - 1].to);
            
            if (!isNaN(firstDate.getTime()) && !isNaN(lastDate.getTime())) {
              setStartDate(firstDate.toISOString().split('T')[0]);
              setEndDate(lastDate.toISOString().split('T')[0]);
            } else {
              const today = new Date();
              const sixMonthsAgo = new Date();
              sixMonthsAgo.setMonth(today.getMonth() - 6);
              
              setStartDate(sixMonthsAgo.toISOString().split('T')[0]);
              setEndDate(today.toISOString().split('T')[0]);
            }
          } catch (dateError) {
            console.error('Erreur lors du traitement des dates:', dateError);
            const today = new Date();
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(today.getMonth() - 6);
            
            setStartDate(sixMonthsAgo.toISOString().split('T')[0]);
            setEndDate(today.toISOString().split('T')[0]);
          }
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const formatExpenseData = () => {
    return expenses.map(expense => {
      try {
        const fromDate = new Date(expense.from);
        const toDate = new Date(expense.to);
        
        const fromDateStr = !isNaN(fromDate.getTime()) 
          ? fromDate.toLocaleDateString('fr-CH')
          : 'Date non valide';
          
        const toDateStr = !isNaN(toDate.getTime()) 
          ? toDate.toLocaleDateString('fr-CH')
          : 'Date non valide';
          
        const period = !isNaN(fromDate.getTime()) 
          ? `${fromDate.toLocaleDateString('fr-CH', { month: 'short', year: 'numeric' })}`
          : 'Période inconnue';
          
        const monthYear = !isNaN(fromDate.getTime()) 
          ? fromDate.toLocaleDateString('fr-CH', { month: 'long', year: 'numeric' })
          : 'Date inconnue';
        
        return {
          ...expense,
          period,
          dateObj: fromDate,
          fromDate: fromDateStr,
          toDate: toDateStr,
          monthYear
        };
      } catch (error) {
        console.error('Erreur lors du formatage de la dépense:', error, expense);
        return {
          ...expense,
          period: 'Période inconnue',
          dateObj: new Date(),
          fromDate: 'Date non valide',
          toDate: 'Date non valide',
          monthYear: 'Date inconnue'
        };
      }
    });
  };

  useEffect(() => {
    const formattedExpenses = formatExpenseData();
    
    if (startDate && endDate) {
      try {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        
        if (!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime())) {
          const filteredExps = formattedExpenses.filter(expense => {
            try {
              const expenseDate = new Date(expense.from);
              return !isNaN(expenseDate.getTime()) && 
                     expenseDate >= startDateObj && 
                     expenseDate <= endDateObj;
            } catch (error) {
              console.error('Erreur lors du filtrage de la dépense:', error);
              return false;
            }
          });
          
          setFilteredExpenses(filteredExps);
        } else {
          setFilteredExpenses(formattedExpenses);
        }
      } catch (error) {
        console.error('Erreur lors du filtrage des dépenses:', error);
        setFilteredExpenses(formattedExpenses);
      }
    } else {
      setFilteredExpenses(formattedExpenses);
    }
  }, [expenses, startDate, endDate]);

  const calculateStats = () => {
    if (!expenses.length) return null;

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const avgExpenseAmount = totalExpenses / expenses.length;
    
    const expenseByCategoryTotal = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const expenseByRecurrenceTotal = expenses.reduce((acc, expense) => {
      acc[expense.recurrence] = (acc[expense.recurrence] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const expenseByPaymentMethodTotal = expenses.reduce((acc, expense) => {
      const method = expense.paymentMethod || 'Non spécifié';
      acc[method] = (acc[method] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const paidVsUnpaidTotal = expenses.reduce(
      (acc, expense) => {
        if (expense.paid) {
          acc.paid += expense.amount;
        } else {
          acc.unpaid += expense.amount;
        }
        return acc;
      },
      { paid: 0, unpaid: 0 }
    );
    
    const monthlyEquivalent = expenses.reduce((total, expense) => {
      let monthlyAmount = 0;
      
      switch (expense.recurrence) {
        case 'quotidienne':
          monthlyAmount = expense.amount * 30;
          break;
        case 'hebdomadaire':
          monthlyAmount = expense.amount * 4.33;
          break;
        case 'mensuelle':
          monthlyAmount = expense.amount;
          break;
        case 'annuelle':
          monthlyAmount = expense.amount / 12;
          break;
        case 'ponctuelle':
          const fromDate = new Date(expense.from);
          const toDate = new Date(expense.to);
          const durationMonths = (toDate.getTime() - fromDate.getTime()) / (30 * 24 * 60 * 60 * 1000);
          monthlyAmount = expense.amount / Math.max(1, durationMonths);
          break;
      }
      
      return total + monthlyAmount;
    }, 0);
    
    return {
      totalExpenses,
      avgExpenseAmount,
      expenseByCategoryTotal,
      expenseByRecurrenceTotal,
      expenseByPaymentMethodTotal,
      paidVsUnpaidTotal,
      monthlyEquivalent
    };
  };

  const prepareCategoriesPieData = () => {
    if (!expenses.length) return [];
    
    const expensesByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value
    }));
  };

  const prepareRecurrencePieData = () => {
    if (!expenses.length) return [];
    
    const expensesByRecurrence = expenses.reduce((acc, expense) => {
      acc[expense.recurrence] = (acc[expense.recurrence] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(expensesByRecurrence).map(([name, value]) => ({
      name,
      value
    }));
  };

  const preparePaymentMethodPieData = () => {
    if (!expenses.length) return [];
    
    const expensesByPaymentMethod = expenses.reduce((acc, expense) => {
      const method = expense.paymentMethod || 'Non spécifié';
      acc[method] = (acc[method] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(expensesByPaymentMethod).map(([name, value]) => ({
      name,
      value
    }));
  };

  const prepareExpensesOverTimeData = () => {
    const expensesByPeriod = filteredExpenses.reduce((acc, expense) => {
      const period = expense.period;
      acc[period] = (acc[period] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(expensesByPeriod).map(([period, amount]) => ({
      period,
      amount
    }));
  };

  const preparePaidVsUnpaidData = () => {
    if (!expenses.length) return [];
    
    const paidVsUnpaid = expenses.reduce(
      (acc, expense) => {
        if (expense.paid) {
          acc.paid += expense.amount;
        } else {
          acc.unpaid += expense.amount;
        }
        return acc;
      },
      { paid: 0, unpaid: 0 }
    );
    
    return [
      { name: 'Payé', value: paidVsUnpaid.paid },
      { name: 'Non payé', value: paidVsUnpaid.unpaid }
    ];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  const resetFilters = () => {
    if (expenses.length > 0) {
      try {
        const firstDate = new Date(expenses[0].from);
        const lastDate = new Date(expenses[expenses.length - 1].to);
        
        if (!isNaN(firstDate.getTime()) && !isNaN(lastDate.getTime())) {
          setStartDate(firstDate.toISOString().split('T')[0]);
          setEndDate(lastDate.toISOString().split('T')[0]);
        } else {
          const today = new Date();
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(today.getMonth() - 6);
          
          setStartDate(sixMonthsAgo.toISOString().split('T')[0]);
          setEndDate(today.toISOString().split('T')[0]);
        }
      } catch (error) {
        console.error('Erreur lors de la réinitialisation des filtres:', error);
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        
        setStartDate(sixMonthsAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
      }
    } else {
      const today = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 6);
      
      setStartDate(sixMonthsAgo.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    }
  };

  const formattedExpenses = formatExpenseData();
  const stats = calculateStats();
  const categoriesPieData = prepareCategoriesPieData();
  const recurrencePieData = prepareRecurrencePieData();
  const paymentMethodPieData = preparePaymentMethodPieData();
  const paidVsUnpaidData = preparePaidVsUnpaidData();

  if (loading) return <div className="text-center py-10">Chargement des données...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!expenses.length) return <div className="text-center py-10">Aucune dépense fixe disponible</div>;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' }).format(value);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Statistiques des dépenses fixes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Total des dépenses fixes</h3>
          <p className="text-xl font-bold">{formatCurrency(stats?.totalExpenses || 0)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Montant moyen par dépense</h3>
          <p className="text-xl font-bold">{formatCurrency(stats?.avgExpenseAmount || 0)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Équivalent mensuel</h3>
          <p className="text-xl font-bold">{formatCurrency(stats?.monthlyEquivalent || 0)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Nombre de dépenses</h3>
          <p className="text-xl font-bold">{expenses.length}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap mb-4 border-b">
        <button 
          className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Vue d'ensemble
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'categories' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Catégories
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'recurrence' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('recurrence')}
        >
          Récurrence
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'timeline' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Chronologie
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'payment' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          Paiements
        </button>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded border">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
            <input 
              type="date" 
              className="w-full p-2 border rounded"
              value={startDate}
              onChange={(e) => handleDateChange(e, 'start')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
            <input 
              type="date" 
              className="w-full p-2 border rounded"
              value={endDate}
              onChange={(e) => handleDateChange(e, 'end')}
            />
          </div>
          <div className="flex items-end">
            <button 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
              onClick={resetFilters}
            >
              Réinitialiser
            </button>
          </div>
        </div>
        
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Vue d'ensemble des dépenses</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-md font-semibold mb-3">Répartition par catégorie</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoriesPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoriesPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-md font-semibold mb-3">Répartition par récurrence</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={recurrencePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {recurrencePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-md font-semibold mb-3">Évolution des dépenses</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={prepareExpensesOverTimeData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Bar 
                    dataKey="amount" 
                    name="Montant des dépenses" 
                    fill="#FF6384" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-semibold mb-3">Statut de paiement</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={paidVsUnpaidData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#4BC0C0" />
                      <Cell fill="#FF6384" />
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-md font-semibold mb-3">Récapitulatif des dépenses</h3>
                <div className="overflow-y-auto max-h-[250px]">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-3 border-b text-left text-xs">Titre</th>
                        <th className="py-2 px-3 border-b text-left text-xs">Catégorie</th>
                        <th className="py-2 px-3 border-b text-left text-xs">Récurrence</th>
                        <th className="py-2 px-3 border-b text-right text-xs">Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.slice(0, 10).map((expense, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="py-2 px-3 border-b text-sm">{expense.title}</td>
                          <td className="py-2 px-3 border-b text-sm">{expense.category}</td>
                          <td className="py-2 px-3 border-b text-sm">{expense.recurrence}</td>
                          <td className="py-2 px-3 border-b text-right text-sm font-medium">
                            {formatCurrency(expense.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'categories' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Analyse par catégorie</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-md font-semibold mb-3">Répartition des dépenses par catégorie</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoriesPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoriesPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Récapitulatif par catégorie</h3>
                <div className="max-h-[300px] overflow-y-auto">
                  <ul className="space-y-2">
                    {categoriesPieData.map((item, index) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <span 
                            className="inline-block w-3 h-3 mr-2 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></span>
                          <span>{item.name}</span>
                        </div>
                        <div>
                          <span className="font-medium">{formatCurrency(item.value)}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({(item.value / (stats?.totalExpenses || 1) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-semibold mb-3">Détail des dépenses par catégorie</h3>
              <div className="space-y-6">
                {categoriesPieData.map((categoryData, categoryIndex) => (
                  <div key={categoryIndex} className="border rounded-md p-4">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span 
                        className="inline-block w-3 h-3 mr-2 rounded-full" 
                        style={{ backgroundColor: COLORS[categoryIndex % COLORS.length] }}
                      ></span>
                      {categoryData.name}
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        (Total: {formatCurrency(categoryData.value)})
                      </span>
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="py-2 px-4 border-b text-left">Titre</th>
                            <th className="py-2 px-4 border-b text-left">Récurrence</th>
                            <th className="py-2 px-4 border-b text-right">Montant</th>
                            <th className="py-2 px-4 border-b text-center">Payé</th>
                            <th className="py-2 px-4 border-b text-left">Période</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredExpenses
                            .filter(expense => expense.category === categoryData.name)
                            .map((expense, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="py-2 px-4 border-b">{expense.title}</td>
                                <td className="py-2 px-4 border-b">{expense.recurrence}</td>
                                <td className="py-2 px-4 border-b text-right font-medium">
                                  {formatCurrency(expense.amount)}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                  {expense.paid ? '✅' : '❌'}
                                </td>
                                <td className="py-2 px-4 border-b">{expense.fromDate} - {expense.toDate}</td>
                              </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'recurrence' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Analyse par récurrence</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-md font-semibold mb-3">Répartition des dépenses par récurrence</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={recurrencePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {recurrencePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Récapitulatif par récurrence</h3>
                <div className="max-h-[300px] overflow-y-auto">
                  <ul className="space-y-2">
                    {recurrencePieData.map((item, index) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="flex items-center">
                          <span 
                            className="inline-block w-3 h-3 mr-2 rounded-full" 
                            style={{ backgroundColor: COLORS[(index + 3) % COLORS.length] }}
                          ></span>
                          <span>{item.name}</span>
                        </div>
                        <div>
                          <span className="font-medium">{formatCurrency(item.value)}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({(item.value / (stats?.totalExpenses || 1) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-semibold mb-3">Détail des dépenses par récurrence</h3>
              <div className="space-y-6">
                {recurrencePieData.map((recurrenceData, recurrenceIndex) => (
                  <div key={recurrenceIndex} className="border rounded-md p-4">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span 
                        className="inline-block w-3 h-3 mr-2 rounded-full" 
                        style={{ backgroundColor: COLORS[(recurrenceIndex + 3) % COLORS.length] }}
                      ></span>
                      {recurrenceData.name}
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        (Total: {formatCurrency(recurrenceData.value)})
                      </span>
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="py-2 px-4 border-b text-left">Titre</th>
                            <th className="py-2 px-4 border-b text-left">Catégorie</th>
                            <th className="py-2 px-4 border-b text-right">Montant</th>
                            <th className="py-2 px-4 border-b text-center">Payé</th>
                            <th className="py-2 px-4 border-b text-left">Période</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredExpenses
                            .filter(expense => expense.recurrence === recurrenceData.name)
                            .map((expense, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="py-2 px-4 border-b">{expense.title}</td>
                                <td className="py-2 px-4 border-b">{expense.category}</td>
                                <td className="py-2 px-4 border-b text-right font-medium">
                                  {formatCurrency(expense.amount)}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                  {expense.paid ? '✅' : '❌'}
                                </td>
                                <td className="py-2 px-4 border-b">{expense.fromDate} - {expense.toDate}</td>
                              </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'timeline' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Chronologie des dépenses</h2>
            
            <div className="relative mb-8">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {formattedExpenses.map((expense, index) => (
                <div key={`expense-${index}`} className="relative pl-8 pb-8">
                  <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-red-500 border-4 border-white"></div>
                  <div className="bg-gray-50 p-4 rounded shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-red-600">{expense.title}</h3>
                      <span className="text-sm text-gray-500">{expense.fromDate} - {expense.toDate}</span>
                    </div>
                    
                    <div className="mb-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Détails de la dépense</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Catégorie</span>
                          <span className="font-semibold text-gray-600">{expense.category}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Montant</span>
                          <span className="font-bold text-red-600">{formatCurrency(expense.amount)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Récurrence</p>
                        <p className="font-semibold">{expense.recurrence}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Statut</p>
                        <p className="font-semibold">{expense.paid ? 'Payé ✅' : 'Non payé ❌'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Méthode de paiement</p>
                        <p className="font-semibold">{expense.paymentMethod || 'Non spécifié'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-xs text-gray-500">
                        Date d'échéance: {expense.date ? new Date(expense.date).toLocaleDateString('fr-CH') : 'Non spécifiée'}
                      </div>
                      {expense.endDate && (
                        <div className="text-xs text-gray-500">
                          Date de fin: {new Date(expense.endDate).toLocaleDateString('fr-CH')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Tendance des dépenses sur la période</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={prepareExpensesOverTimeData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="period"
                  tickFormatter={(value) => value.split(' ')[0]} 
                />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  name="Montant des dépenses" 
                  stroke="#FF6384" 
                  fill="#FF6384"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {activeTab === 'payment' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Analyse des paiements</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-md font-semibold mb-3">Répartition par méthode de paiement</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethodPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 5) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-md font-semibold mb-3">Statut de paiement</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paidVsUnpaidData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#4BC0C0" />
                      <Cell fill="#FF6384" />
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-md font-semibold mb-3">Détail des paiements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-semibold mb-3">Dépenses payées</h4>
                  <div className="overflow-y-auto max-h-[300px]">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-3 border-b text-left">Titre</th>
                          <th className="py-2 px-3 border-b text-left">Catégorie</th>
                          <th className="py-2 px-3 border-b text-right">Montant</th>
                          <th className="py-2 px-3 border-b text-left">Méthode</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExpenses
                          .filter(expense => expense.paid)
                          .map((expense, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              <td className="py-2 px-3 border-b">{expense.title}</td>
                              <td className="py-2 px-3 border-b">{expense.category}</td>
                              <td className="py-2 px-3 border-b text-right font-medium">
                                {formatCurrency(expense.amount)}
                              </td>
                              <td className="py-2 px-3 border-b">
                                {expense.paymentMethod || 'Non spécifié'}
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-semibold mb-3">Dépenses non payées</h4>
                  <div className="overflow-y-auto max-h-[300px]">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-2 px-3 border-b text-left">Titre</th>
                          <th className="py-2 px-3 border-b text-left">Catégorie</th>
                          <th className="py-2 px-3 border-b text-right">Montant</th>
                          <th className="py-2 px-3 border-b text-left">Date d'échéance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExpenses
                          .filter(expense => !expense.paid)
                          .map((expense, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              <td className="py-2 px-3 border-b">{expense.title}</td>
                              <td className="py-2 px-3 border-b">{expense.category}</td>
                              <td className="py-2 px-3 border-b text-right font-medium">
                                {formatCurrency(expense.amount)}
                              </td>
                              <td className="py-2 px-3 border-b">
                                {expense.date ? new Date(expense.date).toLocaleDateString('fr-CH') : '-'}
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-semibold mb-3">Récapitulatif par méthode de paiement</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Méthode de paiement</th>
                      <th className="py-2 px-4 border-b text-right">Montant total</th>
                      <th className="py-2 px-4 border-b text-right">Nombre de dépenses</th>
                      <th className="py-2 px-4 border-b text-right">Montant moyen</th>
                      <th className="py-2 px-4 border-b text-right">Pourcentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentMethodPieData.map((methodData, methodIndex) => {
                      const expensesWithMethod = filteredExpenses.filter(expense => 
                        (expense.paymentMethod || 'Non spécifié') === methodData.name
                      );
                      const count = expensesWithMethod.length;
                      const average = methodData.value / count;
                      const percentage = (methodData.value / (stats?.totalExpenses || 1)) * 100;
                      
                      return (
                        <tr key={methodIndex} className={methodIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="py-2 px-4 border-b font-medium">
                            <div className="flex items-center">
                              <span 
                                className="inline-block w-3 h-3 mr-2 rounded-full" 
                                style={{ backgroundColor: COLORS[(methodIndex + 5) % COLORS.length] }}
                              ></span>
                              {methodData.name}
                            </div>
                          </td>
                          <td className="py-2 px-4 border-b text-right">
                            {formatCurrency(methodData.value)}
                          </td>
                          <td className="py-2 px-4 border-b text-right">
                            {count}
                          </td>
                          <td className="py-2 px-4 border-b text-right">
                            {formatCurrency(average)}
                          </td>
                          <td className="py-2 px-4 border-b text-right">
                            {percentage.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}