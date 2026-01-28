
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_HISTORY } from '../constants';
import { Zone, HealthStatus } from '../types';

interface DashboardProps {
  zones: Zone[];
}

const Dashboard: React.FC<DashboardProps> = ({ zones }) => {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Facility Overview</h2>
          <p className="text-gray-500">Real-time performance across {zones.length} active zones</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white p-3 rounded-xl border flex flex-col items-end">
            <span className="text-xs font-semibold text-gray-400 uppercase">Avg Temperature</span>
            <span className="text-xl font-bold text-emerald-600">23.8°C</span>
          </div>
          <div className="bg-white p-3 rounded-xl border flex flex-col items-end">
            <span className="text-xs font-semibold text-gray-400 uppercase">Avg pH</span>
            <span className="text-xl font-bold text-blue-600">6.1</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <div key={zone.id} className="bg-white p-5 rounded-2xl border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{zone.name}</h3>
                <p className="text-sm text-gray-500">{zone.crop} • {zone.stage}</p>
              </div>
              <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                zone.status === HealthStatus.OPTIMAL ? 'bg-emerald-100 text-emerald-700' : 
                zone.status === HealthStatus.WARNING ? 'bg-amber-100 text-amber-700' : 
                'bg-rose-100 text-rose-700'
              }`}>
                {zone.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">pH Level</p>
                <p className="text-lg font-bold text-slate-700">{zone.currentData.pH}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">Nutrient (EC)</p>
                <p className="text-lg font-bold text-slate-700">{zone.currentData.ec}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">Temp</p>
                <p className="text-lg font-bold text-slate-700">{zone.currentData.temp}°C</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">Humidity</p>
                <p className="text-lg font-bold text-slate-700">{zone.currentData.humidity}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Environment Trends (24h)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_HISTORY}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="temp" stroke="#10b981" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
