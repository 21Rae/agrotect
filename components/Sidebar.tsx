
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'monitoring', label: 'Real-time Sensors', icon: '🌡️' },
    { id: 'health', label: 'Plant Health', icon: '🌿' },
    { id: 'controls', label: 'AI Controls', icon: '🤖' },
    { id: 'analytics', label: 'Predictions', icon: '📈' },
  ];

  return (
    <div className="w-64 h-screen glass-panel fixed left-0 top-0 border-r flex flex-col p-4 shadow-sm z-50">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
        <h1 className="text-xl font-bold text-gray-800">HydroSense AI</h1>
      </div>
      
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-emerald-50 text-emerald-700 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-emerald-900 rounded-2xl text-white">
        <p className="text-xs text-emerald-300 font-semibold mb-1 uppercase tracking-wider">System Status</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">All Systems Nominal</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
