import React, { useState, useEffect } from 'react';
import { SimulationRequest, SimulationResult } from '../types';
import { simulateCompensation } from '../services/api';
import { Sliders, Calculator, ArrowRight, DollarSign, Users, TrendingUp, AlertCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface CompensationSimulatorProps {
  departments: string[];
  countries: string[];
}

export const CompensationSimulator: React.FC<CompensationSimulatorProps> = ({
  departments,
  countries,
}) => {
  const [targetDept, setTargetDept] = useState<string>('Engineering');
  const [targetCountry, setTargetCountry] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(4.0);
  const [pctIncrease, setPctIncrease] = useState<number>(5.0);
  const [flatIncrease, setFlatIncrease] = useState<number>(0);

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await simulateCompensation({
        targetDepartment: targetDept,
        targetCountry: targetCountry,
        minPerformanceRating: minRating,
        percentageIncrease: pctIncrease,
        flatIncreaseUSD: flatIncrease,
      });
      setResult(res);
    } catch (err) {
      console.error('Failed to run simulation', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [targetDept, targetCountry, minRating, pctIncrease, flatIncrease]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const chartData = result
    ? Object.keys(result.originalDeptPayroll).map((dept) => ({
        department: dept,
        Original: result.originalDeptPayroll[dept] || 0,
        Simulated: result.simulatedDeptPayroll[dept] || 0,
      }))
    : [];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Calculator className="w-6 h-6 text-indigo-400" />
          <span>Interactive "What-If" Compensation Scenario Simulator</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Model prospective budget revisions (e.g. +5% raise for Engineering or $2,500 merit bonus) and preview instant fiscal impact graphs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Form Controls */}
        <div className="glass-panel p-6 space-y-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Scenario Parameters</span>
          </h3>

          <div className="space-y-4 text-xs">
            
            {/* Department Selection */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Target Department</label>
              <select
                value={targetDept}
                onChange={(e) => setTargetDept(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="All">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Country Selection */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Target Operating Region</label>
              <select
                value={targetCountry}
                onChange={(e) => setTargetCountry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="All">All Countries</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Min Performance Rating */}
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1.5">
                <span>Min Performance Threshold</span>
                <span className="text-amber-400 font-bold">★ {minRating.toFixed(1)}+</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Percentage Raise Slider */}
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1.5">
                <span>Percentage Salary Raise</span>
                <span className="text-indigo-400 font-bold">+{pctIncrease.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="25.0"
                step="0.5"
                value={pctIncrease}
                onChange={(e) => setPctIncrease(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Flat Bonus USD */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Flat Adjustment (USD/Employee)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                <input
                  type="number"
                  step="500"
                  value={flatIncrease}
                  onChange={(e) => setFlatIncrease(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Output Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Simulated Impact Cards */}
          {result && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Affected Employees Card */}
              <div className="glass-panel p-5 border-l-4 border-l-indigo-500">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Affected Headcount</span>
                <h4 className="text-2xl font-black text-white mt-2">{result.affectedEmployeesCount.toLocaleString()}</h4>
                <p className="text-xs text-slate-400 mt-1">Qualifying employees</p>
              </div>

              {/* Payroll Delta Card */}
              <div className="glass-panel p-5 border-l-4 border-l-emerald-500">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Additional Budget Delta</span>
                <h4 className="text-2xl font-black text-emerald-400 mt-2">+{formatCurrency(result.payrollDeltaUSD)}</h4>
                <p className="text-xs text-emerald-400 mt-1 font-semibold">+{result.percentagePayrollIncrease}% net increase</p>
              </div>

              {/* Avg Per Employee Increase */}
              <div className="glass-panel p-5 border-l-4 border-l-purple-500">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Raise / Person</span>
                <h4 className="text-2xl font-black text-purple-300 mt-2">+{formatCurrency(result.averageIncreasePerEmployeeUSD)}</h4>
                <p className="text-xs text-slate-400 mt-1">Annual base delta</p>
              </div>

            </div>
          )}

          {/* Comparison Graph */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Before vs After Payroll Impact by Department</span>
            </h3>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <XAxis dataKey="department" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000000}M`} />
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value)), 'Payroll']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Original" fill="#475569" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Simulated" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
