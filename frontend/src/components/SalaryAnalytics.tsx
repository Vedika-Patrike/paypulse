import React, { useState, useEffect } from 'react';
import { PayGapAnalytics, Percentiles } from '../types';
import { getPayGapAnalytics, getSalaryPercentiles } from '../services/api';
import { BarChart2, Scale, TrendingUp, Award, Filter, ShieldAlert } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface SalaryAnalyticsProps {
  departments: string[];
  countries: string[];
}

export const SalaryAnalytics: React.FC<SalaryAnalyticsProps> = ({ departments, countries }) => {
  const [payGap, setPayGap] = useState<PayGapAnalytics | null>(null);
  const [percentiles, setPercentiles] = useState<Percentiles | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Percentile Filter States
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pgData, pctData] = await Promise.all([
        getPayGapAnalytics(),
        getSalaryPercentiles(selectedDept, selectedCountry),
      ]);
      setPayGap(pgData);
      setPercentiles(pctData);
    } catch (err) {
      console.error('Failed to load salary analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDept, selectedCountry]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  if (loading || !payGap || !percentiles) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const deptGapChartData = payGap.departmentBreakdown.map((d) => ({
    department: d.department,
    Male: d.maleAvgUSD,
    Female: d.femaleAvgUSD,
    gap: d.payGapPercentage,
  }));

  const percentileSpectrumData = [
    { tier: 'P10 (Entry/Junior)', salary: percentiles.p10 },
    { tier: 'P25 (Lower Band)', salary: percentiles.p25 },
    { tier: 'P50 (Median Benchmark)', salary: percentiles.p50Median },
    { tier: 'P75 (Senior Tier)', salary: percentiles.p75 },
    { tier: 'P90 (Executive Level)', salary: percentiles.p90 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="glass-panel p-6">
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Scale className="w-6 h-6 text-purple-400" />
          <span>Compensation Equity & Pay Gap Intelligence</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Deep telemetry comparing gender pay parity, departmental variance, and statistical percentile spectrums.
        </p>
      </div>

      {/* Gender Pay Gap High Level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Raw Pay Gap Percentage Card */}
        <div className="glass-panel p-6 glass-panel-hover border-l-4 border-l-pink-500">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Raw Gender Pay Gap</span>
          <div className="mt-3 flex items-baseline space-x-2">
            <h3 className="text-3xl font-black text-pink-400">{payGap.rawGenderPayGapPercentage}%</h3>
            <span className="text-xs text-slate-400 font-medium">Variance</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Overall difference between Male avg ({formatCurrency(payGap.overallMaleAvgUSD)}) and Female avg ({formatCurrency(payGap.overallFemaleAvgUSD)}).
          </p>
        </div>

        {/* Median Pay Gap Card */}
        <div className="glass-panel p-6 glass-panel-hover border-l-4 border-l-indigo-500">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Median Pay Gap</span>
          <div className="mt-3 flex items-baseline space-x-2">
            <h3 className="text-3xl font-black text-indigo-400">{payGap.rawMedianPayGapPercentage}%</h3>
            <span className="text-xs text-slate-400 font-medium">Midpoint Variance</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Male median ({formatCurrency(payGap.overallMaleMedianUSD)}) vs Female median ({formatCurrency(payGap.overallFemaleMedianUSD)}).
          </p>
        </div>

        {/* Executive Equity Status */}
        <div className="glass-panel p-6 glass-panel-hover border-l-4 border-l-teal-500">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Compliance Benchmark</span>
          <div className="mt-3">
            <h3 className="text-xl font-bold text-teal-400 flex items-center gap-1.5">
              <ShieldAlert className="w-5 h-5" />
              <span>Equal-Role Compliant</span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Department-adjusted gap isolates structural role placement from direct equal-work compensation parity.
          </p>
        </div>

      </div>

      {/* Percentile Spectrum Hub */}
      <div className="glass-panel p-6 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <span>Statistical Percentile Spectrum (P10 - P90)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Sample size: <strong className="text-white">{percentiles.sampleSize.toLocaleString()}</strong> employees ({percentiles.departmentFilter}, {percentiles.countryFilter})
            </p>
          </div>

          {/* Filter dropdowns */}
          <div className="flex items-center space-x-3 text-xs">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Percentile Bar Visualizer */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { label: 'P10 Tier', val: percentiles.p10, color: 'border-slate-700 bg-slate-900/60 text-slate-300' },
            { label: 'P25 Tier', val: percentiles.p25, color: 'border-indigo-500/30 bg-indigo-950/30 text-indigo-300' },
            { label: 'P50 Median', val: percentiles.p50Median, color: 'border-purple-500/40 bg-purple-950/40 text-purple-200 font-extrabold shadow-lg shadow-purple-500/10' },
            { label: 'P75 Tier', val: percentiles.p75, color: 'border-teal-500/30 bg-teal-950/30 text-teal-300' },
            { label: 'P90 Executive', val: percentiles.p90, color: 'border-pink-500/30 bg-pink-950/30 text-pink-300' },
          ].map((item) => (
            <div key={item.label} className={`p-4 rounded-xl border text-center space-y-1 ${item.color}`}>
              <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">{item.label}</div>
              <div className="text-lg font-black tracking-tight">{formatCurrency(item.val)}</div>
            </div>
          ))}
        </div>

        {/* Percentile Chart */}
        <div className="h-[240px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={percentileSpectrumData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <XAxis dataKey="tier" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                formatter={(value: any) => [formatCurrency(Number(value)), 'Salary Tier']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
              />
              <Bar dataKey="salary" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Department Breakdown Table */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <BarChart2 className="w-5 h-5 text-teal-400" />
          <span>Departmental Pay Gap & Demographics</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Male Headcount</th>
                <th className="py-3 px-4 text-center">Female Headcount</th>
                <th className="py-3 px-4 text-right">Male Avg Salary</th>
                <th className="py-3 px-4 text-right">Female Avg Salary</th>
                <th className="py-3 px-4 text-right">Pay Gap %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payGap.departmentBreakdown.map((row) => (
                <tr key={row.department} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-semibold text-white">{row.department}</td>
                  <td className="py-3 px-4 text-center text-slate-300">{row.maleCount}</td>
                  <td className="py-3 px-4 text-center text-slate-300">{row.femaleCount}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{formatCurrency(row.maleAvgUSD)}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{formatCurrency(row.femaleAvgUSD)}</td>
                  <td className="py-3 px-4 text-right font-bold">
                    <span className={`px-2 py-0.5 rounded-full ${
                      row.payGapPercentage > 5
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {row.payGapPercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
