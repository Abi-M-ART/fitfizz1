
import React, { useState, useEffect, useMemo } from 'react';
import { BmiResult } from '../types';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { History, TrendingUp, Save, AlertTriangle, Calculator } from 'lucide-react';

const BmiCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('male');
  const [result, setResult] = useState<BmiResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const user = authService.getCurrentUser();

  const validation = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    return {
      weightValid: !weight || (w >= 10 && w <= 600),
      heightValid: !height || (h >= 50 && h <= 270),
      canCalculate: weight && height && (w >= 10 && w <= 600) && (h >= 50 && h <= 270)
    };
  }, [weight, height]);

  useEffect(() => {
    if (user?.id) {
      setHistory(dataService.getBmiHistory(user.id));
    }
  }, [user?.id]);

  const calculate = () => {
    if (!validation.canCalculate || !user?.id) return;
    
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w && h) {
      const bmi = parseFloat((w / (h * h)).toFixed(1));
      let category = 'Normal';
      let color = 'text-emerald-500';
      if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-500'; }
      else if (bmi >= 25 && bmi < 30) { category = 'Overweight'; color = 'text-orange-500'; }
      else if (bmi >= 30) { category = 'Obese'; color = 'text-rose-500'; }
      
      const newResult = { bmi, category, color };
      setResult(newResult);

      // Link to the user ID properly
      dataService.saveBmiRecord(user.id, {
        ...newResult,
        date: new Date().toLocaleDateString()
      });
      setHistory(dataService.getBmiHistory(user.id));
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 animate-fadeIn space-y-6">
      <div className="bg-white rounded-[2rem] shadow-2xl p-0 overflow-hidden border border-black/5">
        <div className="bg-slate-900 p-8 flex flex-col items-center justify-center relative">
          <div className="border-2 border-[#00ffd5]/20 p-5 text-center rounded-2xl">
             <h2 className="text-4xl font-black text-white uppercase tracking-tighter">fit</h2>
             <p className="text-[#00ffd5] text-[10px] font-black uppercase tracking-[0.3em] border-t border-white/20 mt-1 pt-1">check</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Weight (kg)</label>
              {!validation.weightValid && <span className="text-rose-500 text-[9px] font-black uppercase flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Range: 10-600</span>}
            </div>
            <input 
              type="number" 
              placeholder="e.g. 70"
              value={weight} 
              onChange={(e) => setWeight(e.target.value)}
              className={`w-full bg-slate-100 border-2 ${!validation.weightValid ? 'border-rose-400 bg-rose-50' : 'border-transparent'} text-black px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#00ffd5] transition-all font-bold`}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-slate-900 text-[10px] font-black uppercase tracking-widest">Height (cm)</label>
              {!validation.heightValid && <span className="text-rose-500 text-[9px] font-black uppercase flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Range: 50-270</span>}
            </div>
            <input 
              type="number" 
              placeholder="e.g. 175"
              value={height} 
              onChange={(e) => setHeight(e.target.value)}
              className={`w-full bg-slate-100 border-2 ${!validation.heightValid ? 'border-rose-400 bg-rose-50' : 'border-transparent'} text-black px-5 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#00ffd5] transition-all font-bold`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-900 text-[10px] font-black uppercase tracking-widest ml-1">Gender Expression</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setGender('male')}
                className={`py-3 rounded-2xl font-black uppercase text-xs transition-all border-2 ${gender === 'male' ? 'bg-slate-900 text-[#00ffd5] border-slate-900' : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'}`}
              >
                Male ♂
              </button>
              <button 
                onClick={() => setGender('female')}
                className={`py-3 rounded-2xl font-black uppercase text-xs transition-all border-2 ${gender === 'female' ? 'bg-slate-900 text-[#00ffd5] border-slate-900' : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100'}`}
              >
                Female ♀
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={calculate}
              disabled={!validation.canCalculate}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${validation.canCalculate ? 'bg-[#00ffd5] text-black shadow-[#00ffd5]/20 hover:scale-[1.02]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              <Calculator className="w-5 h-5" />
              Calculate Now
            </button>
          </div>
        </div>

        {result && (
          <div className="p-8 bg-slate-50 text-center border-t border-slate-100 animate-fadeIn">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Calculated Index</p>
            <div className={`text-7xl font-black ${result.color} drop-shadow-sm`}>{result.bmi}</div>
            <div className={`mt-2 inline-block px-4 py-1 rounded-full bg-white text-xs font-black uppercase tracking-widest shadow-sm ${result.color}`}>{result.category}</div>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
          <div className="flex items-center gap-2 mb-4 text-white">
            <History className="w-5 h-5 text-[#00ffd5]" />
            <h3 className="font-black uppercase text-xs tracking-widest">Linked History</h3>
          </div>
          <div className="space-y-3">
            {history.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-white/60 font-black text-[10px] uppercase">{item.date}</span>
                  <span className={`font-black uppercase text-xs ${item.color}`}>{item.category}</span>
                </div>
                <div className={`text-2xl font-black ${item.color}`}>{item.bmi}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BmiCalculator;
