
import React, { useState, useRef } from 'react';
import { analyzePlantImage } from '../services/geminiService';
import { PlantHealthAnalysis } from '../types';

const PlantHealth: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<PlantHealthAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    try {
      const base64Data = image.split(',')[1];
      const analysis = await analyzePlantImage(base64Data, 'Lettuce');
      setResult(analysis);
    } catch (error) {
      console.error('Analysis failed', error);
      alert('AI Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl border text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Visual Health Assessment</h2>
        <p className="text-gray-500 mb-8">Upload a clear photo of your plant's foliage for Maurice Vision analysis</p>
        
        <div className="flex flex-col items-center justify-center">
          {image ? (
            <div className="relative group mb-6">
              <img src={image} className="max-w-md rounded-2xl border-4 border-emerald-50 shadow-xl" alt="Plant Preview" />
              <button 
                onClick={() => setImage(null)}
                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow hover:bg-white transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-md aspect-video border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors mb-6"
            >
              <span className="text-4xl mb-4">📸</span>
              <p className="text-emerald-700 font-medium">Click to upload photo</p>
              <p className="text-sm text-emerald-600/60">Supports JPG, PNG</p>
            </div>
          )}
          
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept="image/*"
          />

          <button
            onClick={handleAnalyze}
            disabled={!image || analyzing}
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all ${
              !image || analyzing ? 'bg-gray-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200'
            }`}
          >
            {analyzing ? 'AI Analyzing...' : 'Start Maurice Analysis'}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white p-6 rounded-3xl border animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Maurice Analysis Report</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Confidence</span>
              <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${result.confidence * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Health Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-700">{result.healthScore}</span>
                  <span className="text-sm text-emerald-600 font-medium">/ 100</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Detected Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {result.detectedIssues.map((issue, idx) => (
                    <span key={idx} className="bg-rose-50 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-rose-100 capitalize">
                      {issue}
                    </span>
                  ))}
                  {result.detectedIssues.length === 0 && (
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-100">
                      Optimal Condition
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border">
                <p className="text-sm font-bold text-gray-700 mb-2">AI Recommended Actions</p>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                   "{result.treatmentPlan}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantHealth;
