
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PlantHealth from './components/PlantHealth';
import ControlCenter from './components/ControlCenter';
import Analytics from './components/Analytics';
import { INITIAL_ZONES } from './constants';
import { Zone, HealthStatus } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);

  // Simulate real-time sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => prev.map(zone => ({
        ...zone,
        currentData: {
          ...zone.currentData,
          temp: zone.currentData.temp + (Math.random() * 0.4 - 0.2),
          pH: Math.max(0, Math.min(14, zone.currentData.pH + (Math.random() * 0.1 - 0.05))),
        },
        status: zone.currentData.pH < 5.5 || zone.currentData.pH > 6.8 ? HealthStatus.WARNING : HealthStatus.OPTIMAL
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard zones={zones} />;
      case 'monitoring':
        return <Dashboard zones={zones} />; // Reusing grid for simplified demo
      case 'health':
        return <PlantHealth />;
      case 'controls':
        return <ControlCenter zones={zones} />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard zones={zones} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setActiveTab('controls')}
          className="group relative flex items-center gap-3 bg-emerald-600 text-white pl-4 pr-6 py-3 rounded-2xl shadow-2xl hover:bg-emerald-700 transition-all duration-300"
        >
          <span className="w-10 h-10 rounded-xl bg-emerald-500/50 flex items-center justify-center text-xl">🤖</span>
          <div className="text-left">
            <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">Active Assistant</p>
            <p className="font-bold">Ask Maurice AI</p>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full animate-bounce"></div>
        </button>
      </div>
    </div>
  );
};

export default App;
