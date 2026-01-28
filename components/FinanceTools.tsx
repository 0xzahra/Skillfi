import React, { useState, useEffect, useRef } from 'react';
import { generateItemVisual, sendMessageToSkillfi, initializeChat } from '../services/geminiService';
import { LanguageCode } from '../types';

type FinanceTab = 'BUDGET' | 'PROFIT' | 'INTEREST' | 'MASTERY' | 'RWA' | 'TAX';

interface FinanceToolsProps {
    onAnalyze?: (data: string) => void;
    currentLang: LanguageCode;
}

const MONEY_QUOTES = [
    "Do not save what is left after spending, but spend what is left after saving.",
    "The more you learn, the more you earn.",
    "A wise person should have money in their head, but not in their heart.",
    "Beware of little expenses. A small leak will sink a great ship.",
    "Wealth consists not in having great possessions, but in having few wants."
];

export const FinanceTools: React.FC<FinanceToolsProps> = ({ onAnalyze, currentLang }) => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('BUDGET');
  const [dailyQuote, setDailyQuote] = useState(MONEY_QUOTES[0]);

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

  // Mastery State
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [enlightenment, setEnlightenment] = useState<string>('');
  const [itemImage, setItemImage] = useState<string | null>(null);
  const [isEnlightening, setIsEnlightening] = useState(false);

  // Canvas Refs
  const galaxyCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      setDailyQuote(MONEY_QUOTES[Math.floor(Math.random() * MONEY_QUOTES.length)]);
  }, []);

  // --- Mastery Data ---
  const masteryItems = {
      assets: [
          { name: 'Rental Real Estate', type: 'ASSET', icon: '🏢', desc: 'Pays you monthly rent.' },
          { name: 'Dividend Stocks', type: 'ASSET', icon: '📈', desc: 'Shares that pay you.' },
          { name: 'Intellectual Property', type: 'ASSET', icon: '💡', desc: 'Ideas you own.' },
          { name: 'Automated Business', type: 'ASSET', icon: '⚙️', desc: 'Makes money while you sleep.' }
      ],
      liabilities: [
          { name: 'Luxury Car Loan', type: 'LIABILITY', icon: '🏎️', desc: 'Loses value every day.' },
          { name: 'Credit Card Debt', type: 'LIABILITY', icon: '💳', desc: 'Takes money from you.' },
          { name: 'Oversized Mortgage', type: 'LIABILITY', icon: '🏠', desc: 'Expensive upkeep.' },
          { name: 'Unused Subscriptions', type: 'LIABILITY', icon: '📺', desc: 'Wasted monthly money.' }
      ],
      luxuries: [
          { name: 'Designer Fashion', type: 'LUXURY', icon: '👜', desc: 'For looking good.' },
          { name: 'First Class Travel', type: 'LUXURY', icon: '✈️', desc: 'For comfort.' },
          { name: 'Fine Dining', type: 'LUXURY', icon: '🥂', desc: 'Expensive food.' },
          { name: 'Tech Gadgets', type: 'LUXURY', icon: '📱', desc: 'Fun but costly.' }
      ],
      rareVault: [
          { name: 'Patek Philippe Nautilus', type: 'RARE', icon: '⌚', desc: 'Watch worth millions.' },
          { name: '1962 Ferrari 250 GTO', type: 'RARE', icon: '🚗', desc: 'Rare classic car.' },
          { name: 'Basquiat Painting', type: 'RARE', icon: '🎨', desc: 'Art for the rich.' },
          { name: 'Prime Waterfront Land', type: 'RARE', icon: '🏝️', desc: 'Land they are not making more of.' }
      ]
  };

  const handleInspectItem = async (item: any) => {
      setSelectedItem(item);
      setEnlightenment('');
      setItemImage(null);
      setIsEnlightening(true);

      // 1. Generate Explanation
      try {
          const chat = await initializeChat(currentLang);
          const prompt = `Explain strictly the financial mechanics of: ${item.name}. Is it an Asset, Liability, or Luxury? Why? If it's rare, explain its exclusivity to high society. Max 50 words. Simple language. Language: ${currentLang}`;
          const text = await sendMessageToSkillfi(chat, prompt);
          setEnlightenment(text);
      } catch (e) {
          setEnlightenment("Could not load data.");
      }

      // 2. Generate Image
      const img = await generateItemVisual(item.name);
      setItemImage(img ? `data:image/jpeg;base64,${img}` : null);
      
      setIsEnlightening(false);
  };

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
      if (activeTab === 'PROFIT') {
          const canvas = galaxyCanvasRef.current;
          const ctx = canvas?.getContext('2d');
          
          if (!canvas || !ctx) return;

          // Resize Handler
          const handleResize = () => {
             if (containerRef.current && canvas) {
                 canvas.width = containerRef.current.clientWidth;
                 canvas.height = containerRef.current.clientHeight;
             }
          };
          
          handleResize();
          window.addEventListener('resize', handleResize);

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
              if (!ctx || !canvas) return;

              // Use current canvas dimensions to avoid clearing wrong area on resize
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
          return () => {
              window.removeEventListener('resize', handleResize);
              cancelAnimationFrame(animationFrameId);
          };
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
    <div className="p-4 md:p-6 w-full mx-auto animate-fade-in font-sans h-full overflow-y-auto pb-32 scrollbar-hide">
      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight drop-shadow-md kinetic-type">Money Tools <span className="text-skillfi-neon text-shadow-neon">v4.2</span></h1>
            <p className="text-gray-500 text-sm mt-1">Control your financial future.</p>
        </div>
        <div className="p-3 bg-white/5 border-l-4 border-green-500 rounded-r-xl max-w-sm hidden md:block">
            <p className="text-xs text-gray-300 italic">"{dailyQuote}"</p>
        </div>
      </header>

      {/* Tabs - Scrollable on mobile */}
      <div className="flex gap-2 mb-6 border-b border-white/5 pb-1 overflow-x-auto scrollbar-hide w-full">
        {(['BUDGET', 'PROFIT', 'INTEREST', 'MASTERY', 'RWA', 'TAX'] as FinanceTab[]).map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 md:px-6 py-2 text-[10px] font-bold tracking-[0.15em] rounded-t-lg transition-colors whitespace-nowrap uppercase flex-shrink-0 ${
                    activeTab === tab 
                    ? 'bg-skillfi-neon text-black border-t-2 border-white shadow-glow' 
                    : 'text-gray-500 hover:text-white bg-white/5 border-t-2 border-transparent'
                }`}
            >
                {tab}
            </button>
        ))}
      </div>

      <div className="glass-panel p-4 md:p-8 rounded-3xl shadow-2xl w-full relative">
        
        {/* BUDGET TAB */}
        {activeTab === 'BUDGET' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Income Input */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-skillfi-neon/30 transition-colors">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Monthly Income ($)</label>
                        <input 
                            type="number" 
                            value={salary} 
                            onChange={(e) => setSalary(Number(e.target.value))}
                            className="w-full bg-transparent text-3xl md:text-4xl font-bold font-display text-white outline-none border-b border-gray-700 focus:border-skillfi-neon py-2 mt-2 transition-all"
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
                        </div>

                        {/* Text Layer */}
                        <div className="relative z-10 text-center">
                            <div className="flex justify-center items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saved</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${budgetData.savingsRate >= 20 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {budgetData.savingsRate.toFixed(1)}%
                                </span>
                            </div>
                            <div className={`text-4xl md:text-5xl font-bold font-display tracking-tighter drop-shadow-lg ${budgetData.savings >= 0 ? 'text-white' : 'text-red-500'}`}>
                                ${budgetData.savings.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2 tracking-wider">
                        Expenses
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

                    <div className="flex flex-col md:flex-row gap-2 p-1.5 bg-black/50 rounded-xl border border-white/10">
                        <input 
                            type="text" 
                            placeholder="Expense Name" 
                            value={newExpenseName} 
                            onChange={(e) => setNewExpenseName(e.target.value)}
                            className="flex-1 bg-transparent px-4 py-3 text-white text-sm focus:outline-none placeholder-gray-600 font-medium"
                        />
                        <div className="w-full md:w-px h-px md:h-auto bg-white/10 my-1 md:my-0"></div>
                        <input 
                            type="number" 
                            placeholder="$0.00" 
                            value={newExpenseCost} 
                            onChange={(e) => setNewExpenseCost(e.target.value)}
                            className="w-full md:w-24 bg-transparent px-4 py-3 text-white text-sm focus:outline-none placeholder-gray-600 md:text-right font-mono"
                        />
                        <button 
                            onClick={addExpense}
                            className="bg-white/10 hover:bg-skillfi-neon hover:text-black text-white px-6 py-3 rounded-lg text-xs font-bold transition-all uppercase tracking-wide w-full md:w-auto"
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
                        ASK AI FOR ADVICE
                    </button>
                </div>
            </div>
        )}

        {/* PROFIT TAB */}
        {activeTab === 'PROFIT' && (
             <div className="space-y-6">
                 {/* Inputs */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Buy Price ($)', val: buyPrice, set: setBuyPrice },
                        { label: 'Sell Price ($)', val: sellPrice, set: setSellPrice },
                        { label: 'Quantity', val: quantity, set: setQuantity },
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
                 <div ref={containerRef} className="relative w-full h-64 bg-black rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center">
                    <canvas 
                        ref={galaxyCanvasRef} 
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    
                    {/* Overlay Stats */}
                    <div className="relative z-10 text-center pointer-events-none backdrop-blur-md p-6 rounded-2xl bg-black/40 border border-white/10 shadow-2xl mx-4">
                        <div className="flex justify-center items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Return</span>
                            <span className={`text-sm font-bold ${profitData.roi >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                                {profitData.roi >= 0 ? '+' : ''}{profitData.roi.toFixed(2)}%
                            </span>
                        </div>
                        <div className={`text-4xl md:text-5xl font-bold font-display tracking-tighter drop-shadow-lg ${profitData.profit >= 0 ? 'text-white' : 'text-red-400'}`}>
                            {profitData.profit >= 0 ? '+' : '-'}${Math.abs(profitData.profit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="mt-2 text-[10px] text-gray-400 font-mono bg-black/50 px-3 py-1 rounded-full inline-block">
                            CASH BACK: ${profitData.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
                        ANALYZE THIS TRADE
                    </button>
                 </div>
             </div>
        )}

        {/* INTEREST TAB (Net Worth Orb) */}
        {activeTab === 'INTEREST' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: 'Start Money', val: principal, set: setPrincipal },
                        { label: 'Monthly Add', val: monthly, set: setMonthly },
                        { label: 'Interest %', val: rate, set: setRate },
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
                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-shadow-sm">Future Wealth</span>
                        <span className="text-4xl md:text-6xl font-black font-display text-white tracking-tighter drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
                            ${interestTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                        <div className="mt-3 text-[10px] text-gray-400 uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full inline-block border border-gray-800 backdrop-blur-md">
                            You Invested: ${(principal + (monthly * 12 * years)).toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* WEALTH MASTERY (NEW) */}
        {activeTab === 'MASTERY' && (
             <div className="space-y-8 animate-fade-in relative">
                 <p className="text-center text-gray-400 text-sm max-w-lg mx-auto">
                     Learn the difference between things that make you money (Assets) and things that take your money (Liabilities).
                 </p>
                 {/* Item Inspector Modal */}
                 {selectedItem && (
                     <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-fade-in">
                        <div className="glass-panel w-full max-w-lg rounded-2xl p-6 relative flex flex-col max-h-[90vh] overflow-y-auto">
                             <button 
                                 onClick={() => setSelectedItem(null)}
                                 className="absolute top-4 right-4 text-gray-500 hover:text-white"
                             >
                                 ✕
                             </button>
                             <div className="text-4xl mb-4 text-center">{selectedItem.icon}</div>
                             <h3 className="text-2xl font-bold font-display text-white mb-2 text-center">{selectedItem.name}</h3>
                             <div className={`text-[10px] font-bold px-3 py-1 rounded-full mb-6 mx-auto w-fit ${
                                 selectedItem.type === 'ASSET' ? 'bg-green-500/20 text-green-400' :
                                 selectedItem.type === 'LIABILITY' ? 'bg-red-500/20 text-red-400' :
                                 selectedItem.type === 'RARE' ? 'bg-yellow-500/20 text-yellow-400' :
                                 'bg-purple-500/20 text-purple-400'
                             }`}>
                                 {selectedItem.type}
                             </div>

                             {isEnlightening ? (
                                 <div className="text-center py-10">
                                     <div className="w-12 h-12 border-4 border-skillfi-neon border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                     <p className="text-skillfi-neon font-mono text-xs animate-pulse">Loading info...</p>
                                 </div>
                             ) : (
                                 <div className="w-full space-y-6">
                                     {itemImage && (
                                         <div className="rounded-xl overflow-hidden border border-white/20 shadow-2xl h-48 w-full">
                                             <img src={itemImage} alt={selectedItem.name} className="w-full h-full object-cover" />
                                         </div>
                                     )}
                                     <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                                         <p className="text-sm text-gray-200 leading-relaxed font-medium">"{enlightenment}"</p>
                                     </div>
                                 </div>
                             )}
                        </div>
                     </div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {/* ASSETS */}
                     <div className="space-y-4">
                         <h3 className="text-green-500 font-bold text-xs uppercase tracking-widest text-center">Real Assets (Good)</h3>
                         {masteryItems.assets.map((item, i) => (
                             <div key={i} onClick={() => handleInspectItem(item)} className="glass-panel p-4 rounded-xl hover:bg-green-900/10 cursor-pointer transition-all border-l-2 border-l-green-500 flex items-center gap-4 group">
                                 <div className="text-2xl">{item.icon}</div>
                                 <div>
                                     <div className="font-bold text-white text-sm group-hover:text-green-400 transition-colors">{item.name}</div>
                                     <div className="text-[10px] text-gray-500">{item.desc}</div>
                                 </div>
                             </div>
                         ))}
                     </div>

                     {/* LIABILITIES */}
                     <div className="space-y-4">
                         <h3 className="text-red-500 font-bold text-xs uppercase tracking-widest text-center">Liabilities (Bad)</h3>
                         {masteryItems.liabilities.map((item, i) => (
                             <div key={i} onClick={() => handleInspectItem(item)} className="glass-panel p-4 rounded-xl hover:bg-red-900/10 cursor-pointer transition-all border-l-2 border-l-red-500 flex items-center gap-4 group">
                                 <div className="text-2xl">{item.icon}</div>
                                 <div>
                                     <div className="font-bold text-white text-sm group-hover:text-red-400 transition-colors">{item.name}</div>
                                     <div className="text-[10px] text-gray-500">{item.desc}</div>
                                 </div>
                             </div>
                         ))}
                     </div>

                     {/* LUXURIES */}
                     <div className="space-y-4">
                         <h3 className="text-purple-500 font-bold text-xs uppercase tracking-widest text-center">Luxuries (Fun)</h3>
                         {masteryItems.luxuries.map((item, i) => (
                             <div key={i} onClick={() => handleInspectItem(item)} className="glass-panel p-4 rounded-xl hover:bg-purple-900/10 cursor-pointer transition-all border-l-2 border-l-purple-500 flex items-center gap-4 group">
                                 <div className="text-2xl">{item.icon}</div>
                                 <div>
                                     <div className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">{item.name}</div>
                                     <div className="text-[10px] text-gray-500">{item.desc}</div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>

                 {/* 1% VAULT */}
                 <div className="glass-panel p-8 rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-black to-yellow-900/10 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-6 opacity-5 text-8xl text-yellow-500 font-serif italic select-none">The 1%</div>
                     <h3 className="text-yellow-500 font-bold text-lg font-display mb-6 flex items-center gap-3">
                         <span className="text-2xl">🏆</span> High Society Vault
                         <span className="text-[10px] bg-yellow-500/10 px-2 py-0.5 rounded text-yellow-500 border border-yellow-500/20">RARE & EXPENSIVE</span>
                     </h3>
                     
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {masteryItems.rareVault.map((item, i) => (
                             <div key={i} onClick={() => handleInspectItem(item)} className="bg-black/40 border border-white/5 p-4 rounded-xl hover:border-yellow-500/50 cursor-pointer transition-all flex flex-col items-center text-center group">
                                 <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                                 <div className="text-white font-bold text-xs mb-1 group-hover:text-yellow-400">{item.name}</div>
                                 <div className="text-[9px] text-gray-500 uppercase tracking-wide">{item.desc}</div>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
        )}

        {/* RWA MONITOR (Gold/Silver) */}
        {activeTab === 'RWA' && (
            <div className="space-y-6 animate-fade-in">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* GOLD (XAU) CARD */}
                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-yellow-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:opacity-20 transition-opacity">🧈</div>
                        <h3 className="text-yellow-500 font-bold text-sm tracking-widest uppercase mb-4">GOLD PRICE</h3>
                        <div className="text-4xl font-black text-white mb-2">$2,642.80</div>
                        <div className="text-green-400 text-xs font-mono font-bold mb-6">▲ +0.45% (Today)</div>
                        
                        {/* Mock Chart Line */}
                        <div className="w-full h-16 flex items-end gap-1 opacity-50">
                            {[40,45,42,50,55,53,60,65,62,70,75,80].map((h, i) => (
                                <div key={i} className="flex-1 bg-yellow-500 rounded-t-sm" style={{height: `${h}%`}}></div>
                            ))}
                        </div>
                    </div>

                    {/* SILVER (XAG) CARD */}
                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-gray-300 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:opacity-20 transition-opacity">🥈</div>
                        <h3 className="text-gray-300 font-bold text-sm tracking-widest uppercase mb-4">SILVER PRICE</h3>
                        <div className="text-4xl font-black text-white mb-2">$31.15</div>
                        <div className="text-red-400 text-xs font-mono font-bold mb-6">▼ -0.12% (Today)</div>

                         {/* Mock Chart Line */}
                         <div className="w-full h-16 flex items-end gap-1 opacity-50">
                            {[60,55,58,50,45,48,40,42,38,35,40,38].map((h, i) => (
                                <div key={i} className="flex-1 bg-gray-400 rounded-t-sm" style={{height: `${h}%`}}></div>
                            ))}
                        </div>
                    </div>
                 </div>

                 <div className="glass-panel p-6 rounded-2xl">
                     <h3 className="text-white font-bold mb-4">Vault Holdings</h3>
                     <div className="text-center py-8 text-gray-500 text-xs uppercase tracking-widest border border-dashed border-white/10 rounded-xl">
                         No Physical Assets Linked
                     </div>
                 </div>
            </div>
        )}

        {/* TAX TAB */}
        {activeTab === 'TAX' && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Yearly Income</label>
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
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tax Rate (%)</label>
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
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Money Lost to Tax</span>
                        <div className="text-4xl font-bold font-display text-red-400 tracking-tight">
                            -${taxData.taxAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </div>
                        <div className="mt-4 w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-800">
                            <div 
                                className="h-full bg-red-600 rounded-full shadow-[0_0_10px_#ff0000]" 
                                style={{ width: `${Math.min(taxData.effectiveRate, 100)}%` }}
                            ></div>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-2 text-right">You lose {taxData.effectiveRate.toFixed(1)}% of income</span>
                    </div>

                    {/* Net Income Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Money You Keep</span>
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