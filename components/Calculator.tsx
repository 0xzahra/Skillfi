import React, { useState } from 'react';

export const Calculator: React.FC = () => {
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);
  const [monthly, setMonthly] = useState(100);

  const calculate = () => {
    let total = principal;
    for (let i = 0; i < years * 12; i++) {
        total = (total + monthly) * (1 + (rate / 100) / 12);
    }
    return total.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto animate-fade-in font-sans">
        <div className="bg-[#111] border border-gray-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 font-bold text-6xl text-skillfi-neon select-none">
                $
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <div className="p-2 bg-skillfi-neon/10 rounded-lg text-skillfi-neon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                </div>
                Compound Interest Engine
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Initial Investment ($)</label>
                    <input 
                        type="number" 
                        value={principal} 
                        onChange={(e) => setPrincipal(Number(e.target.value))}
                        className="w-full bg-[#050505] border border-gray-700 p-4 rounded-xl text-white focus:border-skillfi-neon outline-none transition-colors font-medium text-lg"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Monthly Contribution ($)</label>
                    <input 
                        type="number" 
                        value={monthly} 
                        onChange={(e) => setMonthly(Number(e.target.value))}
                        className="w-full bg-[#050505] border border-gray-700 p-4 rounded-xl text-white focus:border-skillfi-neon outline-none transition-colors font-medium text-lg"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Interest Rate (%)</label>
                    <input 
                        type="number" 
                        value={rate} 
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="w-full bg-[#050505] border border-gray-700 p-4 rounded-xl text-white focus:border-skillfi-neon outline-none transition-colors font-medium text-lg"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Time Period (Years)</label>
                    <input 
                        type="number" 
                        value={years} 
                        onChange={(e) => setYears(Number(e.target.value))}
                        className="w-full bg-[#050505] border border-gray-700 p-4 rounded-xl text-white focus:border-skillfi-neon outline-none transition-colors font-medium text-lg"
                    />
                </div>
            </div>

            <div className="bg-gradient-to-r from-[#151515] to-[#1a1a1a] border border-skillfi-neon/20 p-8 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Total Projected Wealth</span>
                <span className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
                    {calculate()}
                </span>
            </div>
        </div>
    </div>
  );
};