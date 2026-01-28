
import React, { useState, useEffect } from 'react';
import { analyzeSensorData } from '../services/geminiService';
import { Zone, AIRecommendation } from '../types';

interface ControlCenterProps {
  zones: Zone[];
}

const ControlCenter: React.FC<ControlCenterProps> = ({ zones }) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  const fetchAIInsights = async () => {
    setLoading(true);
    try {
      const allRecs: AIRecommendation[] = [];
      for (const zone of zones) {
        const analysis = await analyzeSensorData(zone.name, zone.crop, zone.currentData);
        analysis.recommendations.forEach((rec: any, idx: number) => {
          allRecs.push({
            id: `${zone.id}-${idx}`,
            type: 'nutrient', // dynamic based on parameter ideally
            parameter: rec.parameter,
            currentValue: 0, // Mock current
            recommendedValue: 0, // Mock target
            rationale: rec.rationale,
            priority: rec.priority.toLowerCase() as any,
            status: 'pending'
          });
        });
      }
      setRecommendations(allRecs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Automation Control Center</h2>
          <p className="text-gray-500">Approve or execute AI-generated environmental adjustments</p>
        </div>
        <button 
          onClick={fetchAIInsights}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-emerald-700"
        >
          Refresh AI Analysis
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Maurice is processing system telemetry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm">⚠️</span>
              Pending AI Proposals
            </h3>
            {recommendations.filter(r => r.status === 'pending').map((rec) => (
              <div key={rec.id} className="bg-white p-5 rounded-2xl border hover:shadow-sm transition-all border-l-4 border-l-amber-400">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      rec.priority === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {rec.priority} PRIORITY
                    </span>
                    <h4 className="font-bold text-gray-800 capitalize">{rec.parameter} Adjustment</h4>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAction(rec.id, 'rejected')}
                      className="text-gray-400 hover:text-rose-500 p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{rec.rationale}</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleAction(rec.id, 'approved')}
                    className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold shadow hover:bg-emerald-700 transition-colors"
                  >
                    Approve & Execute
                  </button>
                </div>
              </div>
            ))}
            {recommendations.filter(r => r.status === 'pending').length === 0 && (
              <div className="p-8 text-center bg-gray-50 border border-dashed rounded-2xl text-gray-400">
                No active recommendations
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm">✓</span>
              Executed Logs
            </h3>
            <div className="bg-white rounded-2xl border overflow-hidden">
              {recommendations.filter(r => r.status !== 'pending').map((rec) => (
                <div key={rec.id} className="p-4 border-b last:border-0 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                      rec.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {rec.status === 'approved' ? '✓' : '✕'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{rec.parameter}</p>
                      <p className="text-xs text-gray-500">{rec.status === 'approved' ? 'Successfully adjusted' : 'Declined by operator'}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">Just now</span>
                </div>
              ))}
              {recommendations.filter(r => r.status !== 'pending').length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  History is empty
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlCenter;
