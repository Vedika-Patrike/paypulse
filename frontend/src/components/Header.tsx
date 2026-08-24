import React from 'react';
import { Activity, Users, Shield, RefreshCw, Sparkles } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between py-3 lg:h-20 gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white whitespace-nowrap">
                  ACME PayPulse
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-400" />
                  Enterprise 10k
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                Global Compensation &amp; Salary Intelligence Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/90 overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'Dashboard Overview' },
              { id: 'directory', label: '10k Employee Directory' },
              { id: 'analytics', label: 'Salary Analytics & Pay Gap' },
              { id: 'simulator', label: 'Compensation Simulator' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Persona Switcher & Reseed Controls */}
          <div className="flex items-center space-x-2.5 shrink-0">
            
            {/* Live Count Badge */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 whitespace-nowrap">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                <strong className="text-white font-bold">{totalEmployees.toLocaleString()}</strong> Records
              </span>
            </div>

            {/* Persona Switcher */}
            <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs whitespace-nowrap">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer text-xs"
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
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isReseeding ? 'animate-spin text-indigo-400' : ''}`} />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
