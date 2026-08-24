import React from 'react';
import { AnalyticsSummary } from '../types';
import {
  DollarSign,
  Users,
  TrendingUp,
  Award,
  Globe,
  PieChart as PieIcon,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface OverviewDashboardProps {
  summary: AnalyticsSummary | null;
  loading: boolean;
}

const COLORS = ['#6366f1', '#14b8a6', '#f43f5e', '#f59e0b', '#8b5cf6', '#3b82f6', '#ec4899', '#10b981'];

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ summary, loading }) => {
  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-400">Loading ACME PayPulse Telemetry...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const deptData = Object.entries(summary.payrollByDepartment).map(([name, value]) => ({
    name,
    payroll: value,
    count: summary.employeesByDepartment[name] || 0,
  }));

  const countryData = Object.entries(summary.employeesByCountry).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60">
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Executive Compensation Overview</span>
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Real-time salary analytics and telemetry for <strong className="text-white">ACME Org’s {summary.totalEmployees.toLocaleString()} employees</strong> across 8 global operating hubs.
          </p>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Payroll Card */}
        <div className="glass-panel p-6 glass-panel-hover flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Annual Payroll</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white tracking-tight">{formatCurrency(summary.totalPayrollUSD)}</h3>
            <p className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Budget allocated globally</span>
            </p>
          </div>
        </div>

        {/* Average Salary Card */}
        <div className="glass-panel p-6 glass-panel-hover flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Salary</span>
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white tracking-tight">{formatCurrency(summary.averageSalaryUSD)}</h3>
            <p className="text-xs font-medium text-slate-400 mt-1">Mean base compensation</p>
          </div>
        </div>

        {/* Median Salary (P50) Card */}
        <div className="glass-panel p-6 glass-panel-hover flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Median Salary (P50)</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white tracking-tight">{formatCurrency(summary.medianSalaryUSD)}</h3>
            <p className="text-xs font-medium text-slate-400 mt-1">Midpoint org benchmark</p>
          </div>
        </div>

        {/* Top Dept & Gender Parity */}
        <div className="glass-panel p-6 glass-panel-hover flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gender Parity Ratio</span>
            <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white tracking-tight">{(summary.genderParityRatio * 100).toFixed(1)}%</h3>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Top Dept: <strong className="text-white font-bold">{summary.topDepartmentByBudget}</strong>
            </p>
          </div>
        </div>

      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Departmental Payroll Distribution Chart */}
        <div className="glass-panel p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-400" />
                <span>Departmental Payroll Allocation</span>
              </h3>
              <p className="text-xs text-slate-400">Annual base salary budget distribution (USD)</p>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000000}M`} />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Total Payroll']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
                <Bar dataKey="payroll" fill="#6366f1" radius={[6, 6, 0, 0]}>
                  {deptData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Country Employee Footprint */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-400" />
                <span>Global Workforce Footprint</span>
              </h3>
              <p className="text-xs text-slate-400">Headcount distribution by country</p>
            </div>
          </div>

          <div className="h-[220px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={countryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {countryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            {countryData.slice(0, 6).map((c, i) => (
              <div key={c.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                <span className="text-slate-300 truncate">{c.name}:</span>
                <strong className="text-white ml-auto">{c.value}</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
