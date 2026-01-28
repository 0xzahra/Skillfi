import React, { useState, useEffect, useRef } from 'react';

type FinanceTab = 'BUDGET' | 'PROFIT' | 'INTEREST' | 'TAX';

interface FinanceToolsProps {
    onAnalyze?: (data: string) => void;
}

export const FinanceTools: React.FC<FinanceToolsProps> = ({ onAnalyze }) => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('BUDGET');

  // Budget State
  const [salary, setSalary] = useState(5000);
  const [expenses, setExpenses] = useState([{ id: 1, name: 'Rent', cost: 1200 }, { id: 2, name: 'Groceries', cost: 400 }]);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseCost, setNewExpenseCost] = useState('');

  // Profit State
  const [buyPrice, setBuyPrice] = useState(100);
  const [sellPrice, setSellPrice] = useState(150);
  const [quantity, setQuantity] = useState(10);
  const [fees, setFees] = useState(0.5);

  // Interest State
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(10);
  const [monthly, setMonthly] = useState(100);

  // Tax State
  const [taxIncome, setTaxIncome] = useState(75000);
  const [taxDeductions, setTaxDeductions] = useState(13850);
  const [taxRate, setTaxRate] = useState(22);

  // Canvas Refs
  const galaxyCanvasRef = useRef<HTMLCanvasElement>(null);

  // --- Calculations ---
  const calculateBudget = () => {
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.cost, 0);
    const savings = salary - totalExpenses;
    return { totalExpenses, savings, savingsRate: salary > 0 ? (savings / salary) * 100 : 0 };
  };

  const calculateProfit = () => {
    const costBasis = (buyPrice * quantity) * (1 + fees / 100);
    const saleValue = (sellPrice * quantity) * (1 - fees / 100);
    const profit = saleValue - costBasis;
    const roi = costBasis > 0 ? (profit / costBasis) * 100 : 0;
    return { profit, roi, total: saleValue };
  };

  const calculateInterest = () => {
    let total = principal;
    for (let i = 0; i < years * 12; i++) {
        total = (total + monthly) * (1 + (rate / 100) / 12);
    }
    return total;
  };

  const calculateTax = () => {
      const taxableIncome = Math.max(0, taxIncome - taxDeductions);
      const taxAmount = taxableIncome * (taxRate / 100);
      const netIncome = taxIncome - taxAmount;
      const monthlyNet = netIncome / 12;
      const effectiveRate = taxIncome > 0 ? (taxAmount / taxIncome) * 100 : 0;
      return { taxableIncome, taxAmount, netIncome, monthlyNet, effectiveRate };
  };

  const budgetData = calculateBudget();
  const profitData = calculateProfit();
  const interestTotal = calculateInterest();
  const taxData = calculateTax();

  // --- Effects & Animations ---

  // Portfolio Galaxy Animation
  useEffect(() => {
      if (activeTab === 'PROFIT' && galaxyCanvasRef.current) {
          const canvas = galaxyCanvasRef.current;
          const ctx = canvas.getContext('2d');
          
          if (!canvas || !ctx) return;

          let animationFrameId: number;
          let particles: {x: number, y: number, size: number, speed: number, angle: number, radius: number}[] = [];
          
          // Init Particles
          for(let i=0; i<40; i++) {
              particles.push({
                  x: 0, y: 0,
                  size: Math.random() * 2,
                  speed: 0.005 + Math.random() * 0.01,
                  angle: Math.random() * Math.PI * 2,
                  radius: 50 + Math.random() * 80
              });
          }

          const render = () => {
              // Double check context in loop just in case
              if (!ctx || !canvas) return;

              ctx.clearRect(0, 0, canvas.width, canvas.height);
              const centerX = canvas.width / 2;
              const centerY = canvas.height / 2;
              
              const isProfit = profitData.profit >= 0;
              const primaryColor = isProfit ? '#00ffaa' : '#ff4444'; // Green/Cyan vs Red
              const glowColor = isProfit ? 'rgba(0, 255, 170, 0.2)' : 'rgba(255, 68, 68, 0.2)';

              // Draw Central Star (Asset)
              const baseSize = 20;
              const growth = Math.min(Math.abs(profitData.roi), 50) / 2; // Cap growth
              const starSize = baseSize + growth;

              // Glow
              const gradient = ctx.createRadialGradient(centerX, centerY, starSize * 0.2, centerX, centerY, starSize * 3);
              gradient.addColorStop(0, primaryColor);
              gradient.addColorStop(1, 'transparent');
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(centerX, centerY, starSize * 3, 0, Math.PI * 2);
              ctx.fill();

              // Core
              ctx.fillStyle = '#fff';
              ctx.beginPath();
              ctx.arc(centerX, centerY, starSize * 0.5, 0, Math.PI * 2);
              ctx.fill();

              // Particles (Orbiting Market)
              particles.forEach(p => {
                  p.angle += p.speed * (isProfit ? 1 : 0.5); // Fast market if profit
                  p.x = centerX + Math.cos(p.angle) * p.radius;
                  p.y = centerY + Math.sin(p.angle) * p.radius;
                  
                  ctx.fillStyle = isProfit ? '#ffffffaa' : '#ffaaaa';
                  ctx.beginPath();
                  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                  ctx.fill();
                  
                  // Connect lines if close
                  if (Math.random() > 0.95) {
                       ctx.strokeStyle = glowColor;
                       ctx.lineWidth = 0.5;
                       ctx.beginPath();
                       ctx.moveTo(centerX, centerY);
                       ctx.lineTo(p.x, p.y);
                       ctx.stroke();
                  }
              });

              animationFrameId = requestAnimationFrame(render);
          };
          render();
          return () => cancelAnimationFrame(animationFrameId);
      }
  }, [activeTab, profitData]);

  // --- Handlers ---
  const addExpense = () => {
    if (newExpenseName && newExpenseCost) {
      setExpenses([...expenses, { id: Date.now(), name: newExpenseName, cost: Number(newExpenseCost) }]);
      setNewExpenseName('');
      setNewExpenseCost('');
    }
  };

  const removeExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Audit Handlers
  const handleAuditBudget = () => {
      if (!onAnalyze) return;
      const data = `MONTHLY INCOME: $${salary}\nEXPENSES: ${JSON.stringify(expenses)}\nSAVINGS: $${budgetData.savings} (${budgetData.savingsRate.toFixed(1)}%)`;
      onAnalyze(data);
  };

  const handleAuditProfit = () => {
      if (!onAnalyze) return;
      const data = `ASSET TRADE:\nBUY: $${buyPrice} x ${quantity}\nSELL: $${sellPrice}\nFEES: ${fees}%\nPROFIT: $${profitData.profit.toFixed(2)} (${profitData.roi.toFixed(2)}% ROI)`;
      onAnalyze(data);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in font-sans h-full overflow-y-auto pb-20 scrollbar-hide">
      <header className="mb-6 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold font-display text-white tracking-tight drop-shadow-md kinetic-type">Finance OS <span className="text-skillfi-neon text-shadow-neon">v2.1</span></h1>
            <p className="text-gray-500 text-sm mt-1">Tactical Wealth Management System</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/5 pb-1 overflow-x-auto scrollbar-hide">
        {(['BUDGET', 'PROFIT', 'INTEREST', 'TAX'] as FinanceTab[]).map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 text-[10px] font-bold tracking-[0.15em] rounded-t-lg transition-colors whitespace-nowrap uppercase ${
                    activeTab === tab 
                    ? 'bg-skillfi-neon text-black border-t-2 border-white shadow-glow' 
                    : 'text-gray-500 hover:text-white bg-white/5 border-t-2 border-transparent'
                }`}
            >
                {tab}
            </button>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-3xl shadow-2xl min-h-[500px]">
        
        {/* BUDGET TAB */}
        {activeTab === 'BUDGET' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Income Input */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-skillfi-neon/30 transition-colors">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Monthly Income Flow ($)</label>
                        <input 
                            type="number" 
                            value={salary} 
                            onChange={(e) => setSalary(Number(e.target.value))}
                            className="w-full bg-transparent text-4xl font-bold font-display text-white outline-none border-b border-gray-700 focus:border-skillfi-neon py-2 mt-2 transition-all"
                        />
                    </div>

                    {/* Savings Bloom Visualization */}
                    <div className="relative bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center overflow-hidden min-h-[160px]">
                        {/* Bloom Animation Layer */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                            <div 
                                className={`w-32 h-32 rounded-full blur-3xl transition-all duration-1000 ${budgetData.savings >= 0 ? 'bg-skillfi-neon animate-pulse' : 'bg-red-600 animate-pulse'}`}
                                style={{ transform: `scale(${Math.min(Math.max(budgetData.savingsRate / 20, 0.5), 1.5)})` }}
                            ></div>
                             {/* Geometric Petals */}
                             {[...Array(6)].map((_, i) => (
                                <div 
                                    key={i}
                                    className={`absolute w-40 h-0.5 rounded-full transition-colors duration-500 ${budgetData.savings >= 0 ? 'bg-skillfi-neon' : 'bg-red-500'}`}
                                    style={{ 
                                        transform: `rotate(${i * 30}deg)`,
                                        opacity: 0.2
                                    }}
                                ></div>
                             ))}
                        </div>

                        {/* Text Layer */}
                        <div className="relative z-10 text-center">
                            <div className="flex justify-center items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Net Savings</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${budgetData.savingsRate >= 20 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {budgetData.savingsRate.toFixed(1)}%
                                </span>
                            </div>
                            <div className={`text-5xl font-bold font-display tracking-tighter drop-shadow-lg ${budgetData.savings >= 0 ? 'text-white' : 'text-red-500'}`}>
                                ${budgetData.savings.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2 tracking-wider">
                        Expense Rivers
                        <span className="text-[10px] normal-case bg-white/10 px-2 py-0.5 rounded text-white">${budgetData.totalExpenses.toLocaleString()} Total</span>
                    </h3>
                    
                    {/* Expense Rivers List */}
                    <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                        {expenses.map((exp) => (
                            <div key={exp.id} className="relative group overflow-hidden rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="relative z-10 flex justify-between items-center p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-8 bg-red-500/50 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                        <span className="text-gray-200 font-bold text-sm">{exp.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-white font-bold font-mono">${exp.cost}</span>
                                        <button onClick={() => removeExpense(exp.id)} className="text-gray-600 hover:text-red-500 transition-colors">×</button>
                                    </div>
                                </div>
                                {/* Bar Proportion */}
                                <div className="absolute bottom-0 left-0 h-0.5 bg-red-500/50" style={{ width: `${Math.min((exp.cost / (salary || 1)) * 100, 100)}%` }}></div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 p-1.5 bg-black/50 rounded-xl border border-white/10">
                        <input 
                            type="text" 
                            placeholder="New Stream (e.g. Netflix)" 
                            value={newExpenseName} 
                            onChange={(e) => setNewExpenseName(e.target.value)}
                            className="flex-1 bg-transparent px-4 text-white text-sm focus:outline-none placeholder-gray-600 font-medium"
                        />
                        <div className="w-px bg-white/10 my-2"></div>
                        <input 
                            type="number" 
                            placeholder="$0.00" 
                            value={newExpenseCost} 
                            onChange={(e) => setNewExpenseCost(e.target.value)}
                            className="w-24 bg-transparent px-2 text-white text-sm focus:outline-none placeholder-gray-600 text-right font-mono"
                        />
                        <button 
                            onClick={addExpense}
                            className="bg-white/10 hover:bg-skillfi-neon hover:text-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wide"
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <button 
                        onClick={handleAuditBudget}
                        className="w-full py-4 bg-gradient-to-r from-skillfi-neon/5 to-blue-500/5 border border-skillfi-neon/20 text-skillfi-neon font-bold rounded-xl hover:bg-skillfi-neon hover:text-black transition-all flex items-center justify-center gap-2 group hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:animate-spin-slow">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                        RUN TACTICAL AUDIT
                    </button>
                </div>
            </div>
        )}

        {/* PROFIT TAB */}
        {activeTab === 'PROFIT' && (
             <div className="space-y-6">
                 {/* Inputs */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Entry ($)', val: buyPrice, set: setBuyPrice },
                        { label: 'Exit ($)', val: sellPrice, set: setSellPrice },
                        { label: 'Units', val: quantity, set: setQuantity },
                        { label: 'Fees (%)', val: fees, set: setFees }
                    ].map((field, i) => (
                        <div key={i} className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{field.label}</label>
                            <input 
                                type="number" 
                                value={field.val} 
                                onChange={(e) => field.set(Number(e.target.value))}
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-skillfi-neon text-sm font-bold font-mono transition-colors"
                            />
                        </div>
                    ))}
                 </div>

                 {/* Portfolio Galaxy Canvas */}
                 <div className="relative w-full h-64 bg-black rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center">
                    <canvas 
                        ref={galaxyCanvasRef} 
                        width={600} 
                        height={300} 
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    
                    {/* Overlay Stats */}
                    <div className="relative z-10 text-center pointer-events-none backdrop-blur-md p-6 rounded-2xl bg-black/40 border border-white/10 shadow-2xl">
                        <div className="flex justify-center items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">ROI Analysis</span>
                            <span className={`text-sm font-bold ${profitData.roi >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                                {profitData.roi >= 0 ? '+' : ''}{profitData.roi.toFixed(2)}%
                            </span>
                        </div>
                        <div className={`text-5xl font-bold font-display tracking-tighter drop-shadow-lg ${profitData.profit >= 0 ? 'text-white' : 'text-red-400'}`}>
                            {profitData.profit >= 0 ? '+' : '-'}${Math.abs(profitData.profit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="mt-2 text-[10px] text-gray-400 font-mono bg-black/50 px-3 py-1 rounded-full inline-block">
                            LIQUIDITY: ${profitData.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                 </div>

                 <div className="pt-2">
                    <button 
                        onClick={handleAuditProfit}
                        className="w-full py-4 bg-gradient-to-r from-purple-900/10 to-black border border-purple-500/20 text-purple-400 font-bold rounded-xl hover:bg-purple-500 hover:text-white transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                        </svg>
                        ANALYZE TRADE GALAXY
                    </button>
                 </div>
             </div>
        )}

        {/* INTEREST TAB */}
        {activeTab === 'INTEREST' && (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Principal', val: principal, set: setPrincipal },
                        { label: 'Monthly +', val: monthly, set: setMonthly },
                        { label: 'Rate %', val: rate, set: setRate },
                        { label: 'Years', val: years, set: setYears }
                    ].map((field, i) => (
                        <div key={i} className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{field.label}</label>
                            <input 
                                type="number" 
                                value={field.val} 
                                onChange={(e) => field.set(Number(e.target.value))}
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-skillfi-neon font-mono font-bold transition-colors"
                            />
                        </div>
                    ))}
                </div>

                {/* Net Worth Orb Visualization */}
                <div className="mt-6 min-h-[250px] p-6 bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-skillfi-neon/30 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         {/* The Orb */}
                         <div 
                            className="rounded-full transition-all duration-1000 relative"
                            style={{
                                width: '180px',
                                height: '180px',
                                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), #000)',
                                boxShadow: `0 0 30px ${interestTotal > 100000 ? '#00ffff' : '#444'}, inset 0 0 20px ${interestTotal > 100000 ? 'rgba(0,255,255,0.2)' : 'rgba(255,255,255,0.05)'}`,
                                transform: `scale(${1 + Math.min(interestTotal / 500000, 0.5)})`
                            }}
                         >
                             {/* Inner Pulse */}
                             <div className="absolute inset-0 rounded-full animate-pulse bg-skillfi-neon/5"></div>
                         </div>
                    </div>

                    {/* Orb Data */}
                    <div className="relative z-10 text-center">
                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-shadow-sm">Future Wealth Event</span>
                        <span className="text-4xl md:text-6xl font-black font-display text-white tracking-tighter drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                            ${interestTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                        <div className="mt-3 text-[10px] text-gray-400 uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full inline-block border border-gray-800 backdrop-blur-md">
                            Invested: ${(principal + (monthly * 12 * years)).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* TAX TAB */}
        {activeTab === 'TAX' && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Gross Annual Income</label>
                        <input 
                            type="number" 
                            value={taxIncome} 
                            onChange={(e) => setTaxIncome(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-skillfi-neon font-mono font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Deductions</label>
                        <input 
                            type="number" 
                            value={taxDeductions} 
                            onChange={(e) => setTaxDeductions(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-skillfi-neon font-mono font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Rate (%)</label>
                        <input 
                            type="number" 
                            value={taxRate} 
                            onChange={(e) => setTaxRate(Number(e.target.value))}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none focus:border-skillfi-neon font-mono font-bold"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tax Liability Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Liability Vector</span>
                        <div className="text-4xl font-bold font-display text-red-400 tracking-tight">
                            -${taxData.taxAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="mt-4 w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-800">
                            <div 
                                className="h-full bg-red-600 rounded-full shadow-[0_0_10px_#ff0000]" 
                                style={{ width: `${Math.min(taxData.effectiveRate, 100)}%` }}
                            ></div>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-2 text-right">Effective Drag: {taxData.effectiveRate.toFixed(1)}%</span>
                    </div>

                    {/* Net Income Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Net Capital Retention</span>
                        <div className="text-4xl font-bold font-display text-green-400 tracking-tight">
                            ${taxData.netIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                            <span className="text-xs text-gray-400">Monthly Avg:</span>
                            <span className="text-lg font-bold text-white">${taxData.monthlyNet.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};