
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { predictYield } from '../services/geminiService';
import { MOCK_HISTORY } from '../constants';

const Analytics: React.FC = () => {
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      try {
        const res = await predictYield(MOCK_HISTORY);
        setPrediction(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, []);

  const data = [
    { name: 'Last Week', value: 450 },
    { name: 'This Week', value: prediction?.estimatedYieldKg || 520 },
    { name: 'Target', value: 600 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Yield Analytics & Forecasting</h2>
          <p className="text-gray-500">Historical performance vs AI projection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Projected Harvest</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{prediction?.estimatedYieldKg || '--'}</span>
            <span className="text-sm text-gray-400 font-bold uppercase">KG</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">↑ 12% vs LY</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Est. Harvest Date</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600">{prediction?.harvestDate?.split(' ')[0] || 'Oct 24'}</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">Peak maturation window</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Model Confidence</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{Math.round((prediction?.confidence || 0.85) * 100)}%</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">Based on historical cycle data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Yield Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 1 ? '#10b981' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-emerald-900 p-8 rounded-3xl text-white">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span>💡</span> Maurice Optimization Tips
          </h3>
          <div className="space-y-4">
            {prediction?.optimizationTips?.map((tip: string, idx: number) => (
              <div key={idx} className="flex gap-4 items-start bg-white/10 p-4 rounded-2xl border border-white/5">
                <span className="text-emerald-400 font-bold">0{idx + 1}</span>
                <p className="text-sm leading-relaxed text-emerald-50">{tip}</p>
              </div>
            )) || (
              <p className="text-emerald-300">Calculating recommendations based on current growth trajectory...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
