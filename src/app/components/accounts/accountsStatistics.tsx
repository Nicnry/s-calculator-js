'use client';

import { useEffect, useState, useCallback } from 'react';
import { BankAccount } from '@/app/db/schema';
import { UserAccountService } from '@/app/services/userAccountService';
import { 
  LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';
import { useUser } from '@/app/contexts/UserContext';

export default function BankAccountsStatistics() {
  const { user } = useUser();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredAccounts, setFilteredAccounts] = useState<FormattedBankAccount[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF5733', '#C70039', '#581845'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const accountsData = await UserAccountService.getAllUserAccounts(user!.id!);
        const sortedAccounts = [...accountsData].sort((a, b) => 
          new Date(a.from).getTime() - new Date(b.from).getTime()
        );
        setAccounts(sortedAccounts);
        
        if (sortedAccounts.length > 0) {
          const firstDate = new Date(sortedAccounts[0].from);
          const lastDate = new Date(sortedAccounts[sortedAccounts.length - 1].to);
          
          setStartDate(firstDate.toISOString().split('T')[0]);
          setEndDate(lastDate.toISOString().split('T')[0]);
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const formatAccountData = useCallback(() => {
    return accounts.map(account => ({
      ...account,
      period: `${new Date(account.from).toLocaleDateString('fr-CH', { month: 'short', year: 'numeric' })}`,
      dateObj: new Date(account.from),
      fromDate: new Date(account.from).toLocaleDateString('fr-CH'),
      toDate: new Date(account.to).toLocaleDateString('fr-CH'),
      monthYear: new Date(account.from).toLocaleDateString('fr-CH', { month: 'long', year: 'numeric' })
    }));
  }, [accounts]); // Dépendance uniquement sur accounts

  useEffect(() => {
    const formattedAccounts = formatAccountData();
    
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      const filteredAccs = formattedAccounts.filter(account => {
        const accountDate = new Date(account.from);
        return accountDate >= startDateObj && accountDate <= endDateObj;
      });
      
      setFilteredAccounts(filteredAccs);
    } else {
      setFilteredAccounts(formattedAccounts);
    }
  }, [accounts, startDate, endDate, formatAccountData]);

  const calculateStats = useCallback(() => {
    if (!accounts.length) return null;

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const avgBalance = totalBalance / accounts.length;
    
    const accountTypeCount = accounts.reduce((acc, account) => {
      acc[account.accountType] = (acc[account.accountType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const accountTypeBalances = accounts.reduce((acc, account) => {
      acc[account.accountType] = (acc[account.accountType] || 0) + account.balance;
      return acc;
    }, {} as Record<string, number>);
    
    const bankBalances = accounts.reduce((acc, account) => {
      acc[account.bankName] = (acc[account.bankName] || 0) + account.balance;
      return acc;
    }, {} as Record<string, number>);
    
    const currencyDistribution = accounts.reduce((acc, account) => {
      acc[account.currency] = (acc[account.currency] || 0) + account.balance;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalBalance,
      avgBalance,
      accountTypeCount,
      accountTypeBalances,
      bankBalances,
      currencyDistribution
    };
  }, [accounts]);

  const prepareAccountTypesPieData = useCallback(() => {
    if (!accounts.length) return [];
    
    const accountsByType = accounts.reduce((acc, account) => {
      acc[account.accountType] = (acc[account.accountType] || 0) + account.balance;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(accountsByType).map(([name, value]) => ({
      name,
      value
    }));
  }, [accounts]);

  const prepareBanksPieData = useCallback(() => {
    if (!accounts.length) return [];
    
    const accountsByBank = accounts.reduce((acc, account) => {
      acc[account.bankName] = (acc[account.bankName] || 0) + account.balance;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(accountsByBank).map(([name, value]) => ({
      name,
      value
    }));
  }, [accounts]);

  const prepareCurrenciesPieData = useCallback(() => {
    if (!accounts.length) return [];
    
    const accountsByCurrency = accounts.reduce((acc, account) => {
      acc[account.currency] = (acc[account.currency] || 0) + account.balance;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(accountsByCurrency).map(([name, value]) => ({
      name,
      value
    }));
  }, [accounts]);

  const prepareBalanceOverTimeData = useCallback(() => {
    return filteredAccounts.map(account => ({
      period: account.period,
      balance: account.balance,
      currency: account.currency
    }));
  }, [filteredAccounts]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  const resetFilters = () => {
    if (accounts.length > 0) {
      const firstDate = new Date(accounts[0].from);
      const lastDate = new Date(accounts[accounts.length - 1].to);
      
      setStartDate(firstDate.toISOString().split('T')[0]);
      setEndDate(lastDate.toISOString().split('T')[0]);
    }
  };

  const formattedAccounts = formatAccountData();
  const stats = calculateStats();
  const accountTypesPieData = prepareAccountTypesPieData();
  const banksPieData = prepareBanksPieData();
  const currenciesPieData = prepareCurrenciesPieData();

  if (loading) return <div className="text-center py-10">Chargement des données...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!accounts.length) return <div className="text-center py-10">Aucun compte bancaire disponible</div>;

  const formatCurrency = (value: number, currency: string = 'CHF') => {
    return new Intl.NumberFormat('fr-CH', { style: 'currency', currency }).format(value);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Statistiques des comptes bancaires</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Solde total des comptes</h3>
          <p className="text-xl font-bold">{formatCurrency(stats?.totalBalance || 0)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Solde moyen par compte</h3>
          <p className="text-xl font-bold">{formatCurrency(stats?.avgBalance || 0)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Nombre de comptes</h3>
          <p className="text-xl font-bold">{accounts.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Devises utilisées</h3>
          <p className="text-xl font-bold">
            {[...new Set(accounts.map(account => account.currency))].join(', ')}
          </p>
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
          className={`px-4 py-2 ${activeTab === 'accounts' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('accounts')}
        >
          Types de comptes
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'banks' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('banks')}
        >
          Banques
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'timeline' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Chronologie
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
            <h2 className="text-lg font-semibold mb-4">Vue d'ensemble des comptes</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-md font-semibold mb-3">Répartition par type de compte</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={accountTypesPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {accountTypesPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-md font-semibold mb-3">Répartition par banque</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={banksPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {banksPieData.map((entry, index) => (
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
              <h3 className="text-md font-semibold mb-3">Évolution des soldes bancaires</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={prepareBalanceOverTimeData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    name="Solde bancaire" 
                    stroke="#0088FE" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-semibold mb-3">Répartition par devise</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={currenciesPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {currenciesPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 5) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-md font-semibold mb-3">Liste des comptes</h3>
                <div className="overflow-y-auto max-h-[250px]">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-3 border-b text-left text-xs">Banque</th>
                        <th className="py-2 px-3 border-b text-left text-xs">Type</th>
                        <th className="py-2 px-3 border-b text-right text-xs">Solde</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAccounts.map((account, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="py-2 px-3 border-b text-sm">{account.bankName}</td>
                          <td className="py-2 px-3 border-b text-sm">{account.accountType}</td>
                          <td className="py-2 px-3 border-b text-right text-sm font-medium">
                            {formatCurrency(account.balance, account.currency)}
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
        
        {activeTab === 'accounts' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Analyse par type de compte</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-md font-semibold mb-3">Répartition des soldes par type</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={accountTypesPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {accountTypesPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Récapitulatif par type de compte</h3>
                <div className="max-h-[300px] overflow-y-auto">
                  <ul className="space-y-2">
                    {accountTypesPieData.map((item, index) => (
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
                            ({(item.value / (stats?.totalBalance || 1) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-semibold mb-3">Détail des comptes par type</h3>
              <div className="space-y-6">
                {accountTypesPieData.map((typeData, typeIndex) => (
                  <div key={typeIndex} className="border rounded-md p-4">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span 
                        className="inline-block w-3 h-3 mr-2 rounded-full" 
                        style={{ backgroundColor: COLORS[typeIndex % COLORS.length] }}
                      ></span>
                      {typeData.name}
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        (Total: {formatCurrency(typeData.value)})
                      </span>
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="py-2 px-4 border-b text-left">Banque</th>
                            <th className="py-2 px-4 border-b text-left">N° de compte</th>
                            <th className="py-2 px-4 border-b text-right">Solde</th>
                            <th className="py-2 px-4 border-b text-left">Devise</th>
                            <th className="py-2 px-4 border-b text-left">Période</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAccounts
                            .filter(account => account.accountType === typeData.name)
                            .map((account, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="py-2 px-4 border-b">{account.bankName}</td>
                                <td className="py-2 px-4 border-b">{account.accountNumber}</td>
                                <td className="py-2 px-4 border-b text-right font-medium">
                                  {formatCurrency(account.balance, account.currency)}
                                </td>
                                <td className="py-2 px-4 border-b">{account.currency}</td>
                                <td className="py-2 px-4 border-b">{account.fromDate} - {account.toDate}</td>
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
        
        {activeTab === 'banks' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Analyse par banque</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-md font-semibold mb-3">Répartition des soldes par banque</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={banksPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {banksPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Récapitulatif par banque</h3>
                <div className="max-h-[300px] overflow-y-auto">
                  <ul className="space-y-2">
                    {banksPieData.map((item, index) => (
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
                            ({(item.value / (stats?.totalBalance || 1) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-semibold mb-3">Comptes par banque</h3>
              <div className="space-y-6">
                {banksPieData.map((bankData, bankIndex) => (
                  <div key={bankIndex} className="border rounded-md p-4">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <span 
                        className="inline-block w-3 h-3 mr-2 rounded-full" 
                        style={{ backgroundColor: COLORS[(bankIndex + 3) % COLORS.length] }}
                      ></span>
                      {bankData.name}
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        (Total: {formatCurrency(bankData.value)})
                      </span>
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="py-2 px-4 border-b text-left">Type de compte</th>
                            <th className="py-2 px-4 border-b text-left">N° de compte</th>
                            <th className="py-2 px-4 border-b text-right">Solde</th>
                            <th className="py-2 px-4 border-b text-left">Devise</th>
                            <th className="py-2 px-4 border-b text-left">Période</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAccounts
                            .filter(account => account.bankName === bankData.name)
                            .map((account, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="py-2 px-4 border-b">{account.accountType}</td>
                                <td className="py-2 px-4 border-b">{account.accountNumber}</td>
                                <td className="py-2 px-4 border-b text-right font-medium">
                                  {formatCurrency(account.balance, account.currency)}
                                </td>
                                <td className="py-2 px-4 border-b">{account.currency}</td>
                                <td className="py-2 px-4 border-b">{account.fromDate} - {account.toDate}</td>
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
            <h2 className="text-lg font-semibold mb-4">Chronologie des comptes</h2>
            
            <div className="relative mb-8">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {formattedAccounts.map((account, index) => (
                <div key={`account-${index}`} className="relative pl-8 pb-8">
                  <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 border-4 border-white"></div>
                  <div className="bg-gray-50 p-4 rounded shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-blue-600">{account.bankName} - {account.accountType}</h3>
                      <span className="text-sm text-gray-500">{account.fromDate} - {account.toDate}</span>
                    </div>
                    
                    <div className="mb-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Détails du compte</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Numéro de compte</span>
                          <span className="font-semibold text-gray-600">{account.accountNumber}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Solde</span>
                          <span className="font-bold text-blue-700">{formatCurrency(account.balance, account.currency)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Type de compte</p>
                        <p className="font-semibold">{account.accountType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Devise</p>
                        <p className="font-semibold">{account.currency}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(account.balance / (stats?.totalBalance || 1)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>Part du solde total: {((account.balance / (stats?.totalBalance || 1)) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Tendance sur la période</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={formattedAccounts.map(account => ({
                  period: account.period,
                  balance: account.balance
                }))}
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
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  name="Solde" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

interface FormattedBankAccount extends BankAccount {
  period: string;
  dateObj: Date;
  fromDate: string;
  toDate: string;
  monthYear: string;
}