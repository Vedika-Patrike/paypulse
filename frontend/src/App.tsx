import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OverviewDashboard } from './components/OverviewDashboard';
import { EmployeeDirectory } from './components/EmployeeDirectory';
import { SalaryAnalytics } from './components/SalaryAnalytics';
import { CompensationSimulator } from './components/CompensationSimulator';
import { AnalyticsSummary } from './types';
import { getAnalyticsSummary, getDepartments, getCountries, reseedDatabase } from './services/api';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [persona, setPersona] = useState<string>('HR Manager');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(true);
  const [isReseeding, setIsReseeding] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchMetaAndSummary = async () => {
    setLoadingSummary(true);
    try {
      const [sumRes, deptRes, countryRes] = await Promise.all([
        getAnalyticsSummary(),
        getDepartments(),
        getCountries(),
      ]);
      setSummary(sumRes);
      setDepartments(deptRes);
      setCountries(countryRes);
    } catch (err) {
      console.error('Failed to load initial metadata', err);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchMetaAndSummary();
  }, []);

  const handleReseed = async () => {
    if (window.confirm('Reseed database with 10,000 fresh employee records?')) {
      setIsReseeding(true);
      try {
        await reseedDatabase(10000);
        showToast('Successfully reseeded 10,000 employee records into H2 database!');
        await fetchMetaAndSummary();
      } catch (err) {
        console.error('Reseed failed', err);
      } finally {
        setIsReseeding(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header with Branding */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        persona={persona}
        setPersona={setPersona}
        totalEmployees={summary?.totalEmployees || 10000}
        onReseed={handleReseed}
        isReseeding={isReseeding}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-indigo-600 text-white text-xs font-semibold shadow-2xl border border-indigo-400/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {activeTab === 'overview' && (
          <OverviewDashboard summary={summary} loading={loadingSummary} />
        )}

        {activeTab === 'directory' && (
          <EmployeeDirectory
            departments={departments}
            countries={countries}
            onRefreshSummary={fetchMetaAndSummary}
          />
        )}

        {activeTab === 'analytics' && (
          <SalaryAnalytics departments={departments} countries={countries} />
        )}

        {activeTab === 'simulator' && (
          <CompensationSimulator departments={departments} countries={countries} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-slate-300 font-semibold">ACME PayPulse</strong> &copy; 2026. Built with Java 21, Spring Boot 3.3, H2 &amp; React.
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Scale: 10,000 Employees</span>
            <span>Zero-Setup H2 Engine</span>
            <span>Persona: {persona}</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
