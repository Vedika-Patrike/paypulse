import React from 'react';
import { Activity, Users, Shield, RefreshCw, Sparkles, Building2 } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  persona: string;
  setPersona: (persona: string) => void;
  totalEmployees: number;
  onReseed: () => void;
  isReseeding: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  persona,
  setPersona,
  totalEmployees,
  onReseed,
  isReseeding,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Activity className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>ACME PayPulse</span>
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-400" />
                  Enterprise 10k
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Global Compensation & Salary Intelligence Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
            {[
              { id: 'overview', label: 'Dashboard Overview' },
              { id: 'directory', label: '10k Employee Directory' },
              { id: 'analytics', label: 'Salary Analytics & Pay Gap' },
              { id: 'simulator', label: 'Compensation Simulator' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Persona Switcher & Reseed Controls */}
          <div className="flex items-center space-x-3">
            {/* Live Count Badge */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-medium text-slate-300">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                <strong className="text-white font-bold">{totalEmployees.toLocaleString()}</strong> Records
              </span>
            </div>

            {/* Persona Switcher */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="HR Manager" className="bg-slate-900 text-slate-100">Persona: HR Manager</option>
                <option value="Comp Director" className="bg-slate-900 text-slate-100">Persona: Comp Director</option>
                <option value="Dept Lead" className="bg-slate-900 text-slate-100">Persona: Dept Lead</option>
              </select>
            </div>

            {/* Reseed Button */}
            <button
              onClick={onReseed}
              disabled={isReseeding}
              title="Reseed database with 10,000 fresh records"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isReseeding ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex border-t border-slate-800 bg-slate-950/90 overflow-x-auto px-4 py-2 space-x-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'directory', label: 'Directory' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'simulator', label: 'Simulator' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
