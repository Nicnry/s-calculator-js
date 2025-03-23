'use client';

import { useEffect, useState } from 'react';
import { Salary } from '@/app/db/schema';
import SalaryService from '@/app/services/salaryService';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';

interface FormattedSalary extends Salary {
  period: string;
  dateObj: Date;
  fromDate: string;
  toDate: string;
  monthYear: string;
  netSalary: number;
}

export default function SalariesStatistics({ userId }: { userId: number }) {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('evolution');
  
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredData, setFilteredData] = useState<FormattedSalary[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    console.log()
    const fetchSalaries = async () => {
      try {
        setLoading(true);
        const data = await SalaryService.getAllUserSalaries(userId);
        
        const sortedData = [...data].sort((a, b) => 
          new Date(a.from).getTime() - new Date(b.from).getTime()
        );
        
        setSalaries(sortedData);
        
        if (sortedData.length > 0) {
          const firstDate = new Date(sortedData[0].from);
          const lastDate = new Date(sortedData[sortedData.length - 1].to);
          
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

    fetchSalaries();
  }, [userId]);

  const formatSalaryData = () => {
    return salaries.map(salary => ({
      ...salary,
      period: `${new Date(salary.from).toLocaleDateString('fr-CH', { month: 'short', year: 'numeric' })}`,
      dateObj: new Date(salary.from),
      fromDate: new Date(salary.from).toLocaleDateString('fr-CH'),
      toDate: new Date(salary.to).toLocaleDateString('fr-CH'),
      monthYear: new Date(salary.from).toLocaleDateString('fr-CH', { month: 'long', year: 'numeric' }),
      netSalary: salary.taxableSalary - (
        salary.avsAiApgContribution + 
        salary.vdLpcfamDeduction + 
        salary.acDeduction + 
        salary.aanpDeduction + 
        salary.ijmA1Deduction + 
        salary.lppDeduction
      )
    }));
  };

  useEffect(() => {
    const formattedFullData = formatSalaryData();
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      const filtered = formattedFullData.filter(item => {
        const itemDate = new Date(item.from);
        return itemDate >= startDateObj && itemDate <= endDateObj;
      });
      
      setFilteredData(filtered);
    } else {
      setFilteredData(formattedFullData);
    }
  }, [salaries, startDate, endDate]);

  const calculateStats = () => {
    if (!salaries.length) return null;

    const totalGross = salaries.reduce((sum, s) => sum + s.totalSalary, 0);
    const totalTaxable = salaries.reduce((sum, s) => sum + s.taxableSalary, 0);
    const totalDeductions = salaries.reduce((sum, s) => sum + (
      s.avsAiApgContribution + 
      s.vdLpcfamDeduction + 
      s.acDeduction + 
      s.aanpDeduction + 
      s.ijmA1Deduction + 
      s.lppDeduction
    ), 0);
    const totalNet = totalTaxable - totalDeductions;
    
    const avgGross = totalGross / salaries.length;
    const avgTaxable = totalTaxable / salaries.length;
    const avgNet = totalNet / salaries.length;
    
    const avgDeductionRate = (totalDeductions / totalGross) * 100;
    
    return {
      totalGross,
      totalTaxable,
      totalDeductions,
      totalNet,
      avgGross,
      avgTaxable,
      avgNet,
      avgDeductionRate
    };
  };

  const prepareDeductionsPieData = () => {
    if (!salaries.length) return [];
    
    const totalAVS = salaries.reduce((sum, s) => sum + s.avsAiApgContribution, 0);
    const totalVD = salaries.reduce((sum, s) => sum + s.vdLpcfamDeduction, 0);
    const totalAC = salaries.reduce((sum, s) => sum + s.acDeduction, 0);
    const totalAANP = salaries.reduce((sum, s) => sum + s.aanpDeduction, 0);
    const totalIJM = salaries.reduce((sum, s) => sum + s.ijmA1Deduction, 0);
    const totalLPP = salaries.reduce((sum, s) => sum + s.lppDeduction, 0);
    
    return [
      { name: 'AVS/AI/APG', value: totalAVS },
      { name: 'VD/LPCFam', value: totalVD },
      { name: 'AC', value: totalAC },
      { name: 'AANP', value: totalAANP },
      { name: 'IJM', value: totalIJM },
      { name: 'LPP', value: totalLPP }
    ].filter(item => item.value > 0);
  };

  const formattedData = formatSalaryData();
  const stats = calculateStats();
  const deductionsPieData = prepareDeductionsPieData();

  const prepareGrossNetData = () => {
    return filteredData.map(salary => ({
      period: salary.period,
      brut: salary.totalSalary,
      net: salary.netSalary,
      taxable: salary.taxableSalary,
      deductions: salary.totalSalary - salary.netSalary
    }));
  };

  const prepareEmploymentRateData = () => {
    return filteredData.map(salary => ({
      period: salary.period,
      taux: salary.employmentRate
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
  };

  const resetFilters = () => {
    if (salaries.length > 0) {
      const firstDate = new Date(salaries[0].from);
      const lastDate = new Date(salaries[salaries.length - 1].to);
      
      setStartDate(firstDate.toISOString().split('T')[0]);
      setEndDate(lastDate.toISOString().split('T')[0]);
    }
  };

  if (loading) return <div className="text-center py-10">Chargement des données...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!salaries.length) return <div className="text-center py-10">Aucune donnée de salaire disponible</div>;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' }).format(value);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Statistiques des salaires</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Salaire brut moyen</h3>
          <p className="text-xl font-bold">{formatCurrency(stats?.avgGross || 0)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Salaire net moyen</h3>
          <p className="text-xl font-bold">{formatCurrency(stats?.avgNet || 0)}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Déductions moyennes</h3>
          <p className="text-xl font-bold">{formatCurrency((stats?.avgGross || 0) - (stats?.avgNet || 0))}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Taux de déduction moyen</h3>
          <p className="text-xl font-bold">{stats?.avgDeductionRate.toFixed(1)}%</p>
        </div>
      </div>
      
      <div className="flex flex-wrap mb-4 border-b">
        <button 
          className={`px-4 py-2 ${activeTab === 'evolution' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('evolution')}
        >
          Évolution des salaires
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'timeline' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Chronologie des salaires
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'comparison' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          Comparaison brut/net
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'deductions' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('deductions')}
        >
          Détail des déductions
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'rate' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('rate')}
        >
          Taux d'activité
        </button>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        {activeTab === 'evolution' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Évolution des salaires</h2>
            
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
            
            {filteredData.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Aucune donnée disponible pour cette période
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={filteredData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="totalSalary" 
                    name="Salaire brut" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="taxableSalary" 
                    name="Salaire imposable" 
                    stroke="#82ca9d" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="netSalary" 
                    name="Salaire net" 
                    stroke="#ffc658" 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
        
        {activeTab === 'comparison' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Comparaison brut vs net</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={prepareGrossNetData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="brut" name="Salaire brut" fill="#8884d8" />
                <Bar dataKey="net" name="Salaire net" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {activeTab === 'deductions' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Détail des déductions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deductionsPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deductionsPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Récapitulatif des déductions</h3>
                <ul className="space-y-2">
                  {deductionsPieData.map((item, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="flex items-center">
                        <span 
                          className="inline-block w-3 h-3 mr-2 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></span>
                        {item.name}
                      </span>
                      <span className="font-medium">{formatCurrency(item.value)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'rate' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Évolution du taux d'activité</h2>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={prepareEmploymentRateData()}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Area type="monotone" dataKey="taux" name="Taux d'activité" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {activeTab === 'timeline' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Chronologie des salaires</h2>
            
            <div className="relative mb-8">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {formattedData.map((salary, index) => {
                const adjustedTotalSalary = SalaryService.calculateAdjustedSalary(salary);
                const adjustedTaxableSalary = SalaryService.calculateAdjustedTaxableSalary(salary);
                
                const totalPercentDeduction = [
                  salary.avsAiApgContribution,
                  salary.vdLpcfamDeduction,
                  salary.acDeduction,
                  salary.aanpDeduction,
                  salary.ijmA1Deduction
                ].reduce((acc, percent) => acc + (adjustedTaxableSalary * percent / 100), 0);
                
                const adjustedNetSalary = adjustedTaxableSalary - totalPercentDeduction - salary.lppDeduction;
                
                return (
                  <div key={index} className="relative pl-8 pb-8">
                    <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 border-4 border-white"></div>
                    <div className="bg-gray-50 p-4 rounded shadow-sm border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-blue-600">{salary.monthYear}</h3>
                        <span className="text-sm text-gray-500">{salary.fromDate} - {salary.toDate}</span>
                      </div>
                      
                      <div className="mb-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Salaires</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <div className="flex flex-col mb-1">
                              <span className="text-xs text-gray-500">Salaire brut de base</span>
                              <span className="font-semibold text-gray-600">CHF {formatCurrency(salary.totalSalary)}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">
                                <span className="font-medium text-blue-600">Ajusté ({salary.employmentRate}%)</span>
                              </span>
                              <span className="font-bold text-blue-700">CHF {formatCurrency(adjustedTotalSalary)}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col">
                            <div className="flex flex-col mb-1">
                              <span className="text-xs text-gray-500">Salaire imposable de base</span>
                              <span className="font-semibold text-gray-600">CHF {formatCurrency(salary.taxableSalary)}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">
                                <span className="font-medium text-blue-600">Ajusté ({salary.employmentRate}%)</span>
                              </span>
                              <span className="font-bold text-blue-700">CHF {formatCurrency(adjustedTaxableSalary)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Taux d'activité</p>
                          <p className="font-bold">{salary.employmentRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Salaire net</p>
                          <p className="font-bold text-green-600">CHF {formatCurrency(adjustedNetSalary)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Paiements mensuels</p>
                          <p className="font-bold">{salary.monthlyPayments}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Déductions totales</p>
                          <p className="font-bold text-red-600">CHF {formatCurrency(adjustedTotalSalary - adjustedNetSalary)}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full" 
                            style={{ width: `${(adjustedNetSalary / adjustedTotalSalary) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span>Net: {((adjustedNetSalary / adjustedTotalSalary) * 100).toFixed(1)}%</span>
                          <span>Déductions: {((1 - adjustedNetSalary / adjustedTotalSalary) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-3 gap-2 text-xs border-t border-gray-200 pt-3">
                        <div className="flex flex-col">
                          <span className="text-gray-500">AVS/AI/APG</span>
                          <span>{salary.avsAiApgContribution}%</span>
                          <span className="text-gray-500">
                            CHF {formatCurrency(adjustedTaxableSalary * salary.avsAiApgContribution / 100)}
                          </span>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-gray-500">VD/LPCFam</span>
                          <span>{salary.vdLpcfamDeduction}%</span>
                          <span className="text-gray-500">
                            CHF {formatCurrency(adjustedTaxableSalary * salary.vdLpcfamDeduction / 100)}
                          </span>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-gray-500">AC</span>
                          <span>{salary.acDeduction}%</span>
                          <span className="text-gray-500">
                            CHF {formatCurrency(adjustedTaxableSalary * salary.acDeduction / 100)}
                          </span>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-gray-500">AANP</span>
                          <span>{salary.aanpDeduction}%</span>
                          <span className="text-gray-500">
                            CHF {formatCurrency(adjustedTaxableSalary * salary.aanpDeduction / 100)}
                          </span>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-gray-500">IJM A1</span>
                          <span>{salary.ijmA1Deduction}%</span>
                          <span className="text-gray-500">
                            CHF {formatCurrency(adjustedTaxableSalary * salary.ijmA1Deduction / 100)}
                          </span>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-gray-500">LPP</span>
                          <span className="text-gray-500">Montant fixe</span>
                          <span>CHF {formatCurrency(salary.lppDeduction)}</span>
                        </div>
                      </div>
                      
                      <button 
                        className="mt-3 text-sm text-blue-500 hover:underline"
                        onClick={() => {
                          setActiveTab('deductions');
                        }}
                      >
                        Voir toutes les déductions
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Tendance sur la période</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={formattedData.map(salary => ({
                  ...salary,
                  adjustedTotalSalary: SalaryService.calculateAdjustedSalary(salary),
                  adjustedNetSalary: SalaryService.calculateAdjustedTaxableSalary(salary) - (
                    (SalaryService.calculateAdjustedTaxableSalary(salary) * 
                      (salary.avsAiApgContribution + salary.vdLpcfamDeduction + 
                      salary.acDeduction + salary.aanpDeduction + salary.ijmA1Deduction) / 100) + 
                    salary.lppDeduction
                  )
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
                  dataKey="adjustedTotalSalary" 
                  name="Salaire brut ajusté" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="adjustedNetSalary" 
                  name="Salaire net ajusté" 
                  stroke="#10b981" 
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