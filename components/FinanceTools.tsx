import React, { useState } from 'react';

type FinanceTab = 'BUDGET' | 'PROFIT' | 'INTEREST';

export const FinanceTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('BUDGET');

  // Budget State
  const [salary, setSalary] = useState(5000);
  const [expenses, setExpenses] = useState([{ id: 1, name: 'Rent', cost: 1200 }]);
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

  const calculateBudget = () => {
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.cost, 0);
    const savings = salary - totalExpenses;
    return { totalExpenses, savings, savingsRate: (savings / salary) * 100 };
  };

  const calculateProfit = () => {
    const costBasis = (buyPrice * quantity) * (1 + fees / 100);
    const saleValue = (sellPrice * quantity) * (1 - fees / 100);
    const profit = saleValue - costBasis;
    const roi = (profit / costBasis) * 100;
    return { profit, roi, total: saleValue };
  };

  const calculateInterest = () => {
    let total = principal;
    for (let i = 0; i < years * 12; i++) {
        total = (total + monthly) * (1 + (rate / 100) / 12);
    }
    return total;
  };

  const budgetData = calculateBudget();
  const profitData = calculateProfit();
  const interestTotal = calculateInterest();

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-fade-in font-sans h-full overflow-y-auto pb-20">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">Finance OS <span className="text-skillfi-neon">v2.0</span></h1>
        <p className="text-gray-500 text-sm">Tactical Wealth Management System</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-800 pb-1 overflow-x-auto">
        {(['BUDGET', 'PROFIT', 'INTEREST'] as FinanceTab[]).map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-bold tracking-wider rounded-t-lg transition-colors ${
                    activeTab === tab 
                    ? 'bg-skillfi-neon text-black border-t-2 border-skillfi-neon' 
                    : 'text-gray-500 hover:text-white bg-[#111]'
                }`}
            >
                {tab}
            </button>
        ))}
      </div>

      <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl shadow-xl min-h-[400px]">
        
        {/* BUDGET TAB */}
        {activeTab === 'BUDGET' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/40 p-4 rounded-xl border border-gray-800">
                        <label className="text-xs font-bold text-gray-500 uppercase">Monthly Income ($)</label>
                        <input 
                            type="number" 
                            value={salary} 
                            onChange={(e) => setSalary(Number(e.target.value))}
                            className="w-full bg-transparent text-2xl font-bold text-white outline-none border-b border-gray-700 focus:border-skillfi-neon py-2 mt-1"
                        />
                    </div>
                    <div className="bg-black/40 p-4 rounded-xl border border-gray-800 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-gray-500 uppercase">Disposable Income</span>
                            <span className={`text-xs font-bold ${budgetData.savings >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {budgetData.savingsRate.toFixed(1)}% Rate
                            </span>
                        </div>
                        <div className={`text-3xl font-bold ${budgetData.savings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${budgetData.savings.toLocaleString()}
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                        Expenses Stream
                        <span className="text-xs normal-case bg-gray-800 px-2 rounded-full text-white">${budgetData.totalExpenses.toLocaleString()}</span>
                    </h3>
                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                        {expenses.map((exp) => (
                            <div key={exp.id} className="flex justify-between items-center p-3 bg-[#1a1a1a] rounded-lg border border-gray-800 hover:border-skillfi-accent/50 transition-colors">
                                <span className="text-gray-300 font-medium">{exp.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-white font-bold">${exp.cost}</span>
                                    <button onClick={() => removeExpense(exp.id)} className="text-gray-600 hover:text-red-500 transition-colors">×</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Expense Name" 
                            value={newExpenseName} 
                            onChange={(e) => setNewExpenseName(e.target.value)}
                            className="flex-1 bg-[#080808] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-skillfi-neon outline-none"
                        />
                        <input 
                            type="number" 
                            placeholder="Cost" 
                            value={newExpenseCost} 
                            onChange={(e) => setNewExpenseCost(e.target.value)}
                            className="w-24 bg-[#080808] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-skillfi-neon outline-none"
                        />
                        <button 
                            onClick={addExpense}
                            className="bg-gray-800 hover:bg-skillfi-neon hover:text-black text-white px-4 py-2 rounded-lg font-bold transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* PROFIT TAB */}
        {activeTab === 'PROFIT' && (
             <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Buy Price ($)</label>
                        <input 
                            type="number" 
                            value={buyPrice} 
                            onChange={(e) => setBuyPrice(Number(e.target.value))}
                            className="w-full bg-[#080808] border border-gray-700 p-3 rounded-xl text-white outline-none focus:border-skillfi-neon"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Sell Price ($)</label>
                        <input 
                            type="number" 
                            value={sellPrice} 
                            onChange={(e) => setSellPrice(Number(e.target.value))}
                            className="w-full bg-[#080808] border border-gray-700 p-3 rounded-xl text-white outline-none focus:border-skillfi-neon"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Quantity</label>
                        <input 
                            type="number" 
                            value={quantity} 
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full bg-[#080808] border border-gray-700 p-3 rounded-xl text-white outline-none focus:border-skillfi-neon"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Fee (%)</label>
                        <input 
                            type="number" 
                            value={fees} 
                            onChange={(e) => setFees(Number(e.target.value))}
                            className="w-full bg-[#080808] border border-gray-700 p-3 rounded-xl text-white outline-none focus:border-skillfi-neon"
                        />
                    </div>
                 </div>

                 <div className="mt-8 bg-gradient-to-r from-[#151515] to-[#0a0a0a] border border-gray-800 p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold text-gray-400">NET PROFIT / LOSS</span>
                        <span className={`text-lg font-bold ${profitData.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {profitData.roi >= 0 ? '+' : ''}{profitData.roi.toFixed(2)}% ROI
                        </span>
                    </div>
                    <div className={`text-5xl font-bold tracking-tighter ${profitData.profit >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                        {profitData.profit >= 0 ? '+' : '-'}${Math.abs(profitData.profit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="mt-2 text-xs text-gray-600 font-mono">
                        TOTAL EXIT VALUE: ${profitData.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                 </div>
             </div>
        )}

        {/* INTEREST TAB */}
        {activeTab === 'INTEREST' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Initial Principal ($)</label>
                        <input 
                            type="number" 
                            value={principal} 
                            onChange={(e) => setPrincipal(Number(e.target.value))}
                            className="w-full bg-[#080808] border border-gray-700 p-3 rounded-xl text-white outline-none focus:border-skillfi-neon"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Monthly Contribution ($)</label>
                        <input 
                            type="number" 
                            value={monthly} 
                            onChange={(e) => setMonthly(Number(e.target.value))}
                            className="w-full bg-[#080808] border border-gray-700 p-3 rounded-xl text-white outline-none focus:border-skillfi-neon"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Annual Rate (%)</label>
                        <input 
                            type="number" 
                            value={rate} 
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="w-full bg-[#080808] border border-gray-700 p-3 rounded-xl text-white outline-none focus:border-skillfi-neon"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Years</label>
                        <input 
                            type="number" 
                            value={years} 
                            onChange={(e) => setYears(Number(e.target.value))}
                            className="w-full bg-[#080808] border border-gray-700 p-3 rounded-xl text-white outline-none focus:border-skillfi-neon"
                        />
                    </div>
                </div>

                <div className="mt-6 p-6 bg-[#080808] border border-skillfi-neon/30 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 font-bold text-6xl text-skillfi-neon select-none">$</div>
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Projected Future Wealth</span>
                    <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
                        ${interestTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                    <div className="mt-2 text-[10px] text-gray-600 uppercase tracking-widest">
                        Total Invested: ${(principal + (monthly * 12 * years)).toLocaleString()}
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};