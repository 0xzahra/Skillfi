import React, { useState, useEffect, useRef } from 'react';
import { generateItemVisual, sendMessageToSkillfi, initializeChat, analyzeFinancialHealth, FinancialPersona } from '../services/geminiService';
import { LanguageCode } from '../types';

type FinanceTab = 'BUDGET' | 'PROFIT' | 'INTEREST' | 'MASTERY' | 'MARKETS' | 'TAX';
type MarketCategory = 'METALS' | 'CRYPTO' | 'STOCKS' | 'FOREX';

interface FinanceToolsProps {
    onAnalyze?: (data: string) => void;
    currentLang: LanguageCode;
}

interface MarketAsset {
    id: string;
    name: string;
    symbol: string;
    basePrice: number;
    change: number;
    icon: string;
    color: string;
    desc?: string;
    isSimulated?: boolean;
}

const MONEY_QUOTES = [
    "Do not save what is left after spending, but spend what is left after saving.",
    "The more you learn, the more you earn.",
    "A wise person should have money in their head, but not in their heart.",
    "Beware of little expenses. A small leak will sink a great ship.",
    "Wealth consists not in having great possessions, but in having few wants."
];

// --- STATIC MARKET DATA BASE ---
const METALS: MarketAsset[] = [
    { id: 'gold', name: 'Gold', symbol: 'XAU/USD', basePrice: 2642.80, change: 0.45, icon: '🧈', color: 'text-yellow-500', desc: 'The eternal store of value.' },
    { id: 'silver', name: 'Silver', symbol: 'XAG/USD', basePrice: 31.15, change: -0.12, icon: '🥈', color: 'text-gray-300', desc: 'Industrial and precious.' },
    { id: 'platinum', name: 'Platinum', symbol: 'XPT/USD', basePrice: 980.50, change: 1.20, icon: '⚪', color: 'text-blue-100', desc: 'Rarer than gold.' },
    { id: 'palladium', name: 'Palladium', symbol: 'XPD/USD', basePrice: 1105.20, change: -0.50, icon: '🔩', color: 'text-gray-400', desc: 'Critical for auto catalysts.' },
    { id: 'rhodium', name: 'Rhodium', symbol: 'XRH/USD', basePrice: 4750.00, change: 0.10, icon: '🧪', color: 'text-pink-200', desc: 'The most expensive precious metal.' },
    { id: 'copper', name: 'Copper', symbol: 'HG1!', basePrice: 4.15, change: 0.8, icon: '🥉', color: 'text-orange-600', desc: 'Doctor Copper - Economic indicator.' },
];

const CRYPTO: MarketAsset[] = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', basePrice: 68450.00, change: 2.4, icon: '₿', color: 'text-orange-500' },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', basePrice: 3850.20, change: 1.8, icon: 'Ξ', color: 'text-purple-400' },
    { id: 'sol', name: 'Solana', symbol: 'SOL', basePrice: 145.50, change: 5.2, icon: '◎', color: 'text-green-400' },
    { id: 'bnb', name: 'Binance Coin', symbol: 'BNB', basePrice: 610.00, change: -0.5, icon: '🟡', color: 'text-yellow-400' },
    { id: 'xrp', name: 'Ripple', symbol: 'XRP', basePrice: 0.62, change: 0.1, icon: '✕', color: 'text-blue-400' },
    { id: 'ada', name: 'Cardano', symbol: 'ADA', basePrice: 0.45, change: -1.2, icon: '₳', color: 'text-blue-300' },
    { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', basePrice: 0.16, change: 8.5, icon: 'Ð', color: 'text-yellow-200' },
    { id: 'dot', name: 'Polkadot', symbol: 'DOT', basePrice: 7.50, change: -2.1, icon: '●', color: 'text-pink-500' },
    { id: 'link', name: 'Chainlink', symbol: 'LINK', basePrice: 18.20, change: 1.4, icon: '🔗', color: 'text-blue-500' },
    { id: 'matic', name: 'Polygon', symbol: 'MATIC', basePrice: 0.95, change: -0.8, icon: '💜', color: 'text-purple-500' },
];

const STOCKS: MarketAsset[] = [
    { id: 'spy', name: 'S&P 500', symbol: 'SPY', basePrice: 520.00, change: 0.3, icon: '🇺🇸', color: 'text-green-500' },
    { id: 'nvda', name: 'NVIDIA', symbol: 'NVDA', basePrice: 950.00, change: 3.2, icon: '👁️', color: 'text-green-400' },
    { id: 'aapl', name: 'Apple Inc.', symbol: 'AAPL', basePrice: 185.50, change: 0.5, icon: '🍎', color: 'text-gray-200' },
    { id: 'msft', name: 'Microsoft', symbol: 'MSFT', basePrice: 420.00, change: 1.2, icon: '🪟', color: 'text-blue-400' },
    { id: 'tsla', name: 'Tesla', symbol: 'TSLA', basePrice: 178.00, change: -1.5, icon: '🚗', color: 'text-red-400' },
    { id: 'googl', name: 'Alphabet', symbol: 'GOOGL', basePrice: 175.20, change: -0.4, icon: '🔍', color: 'text-yellow-400' },
    { id: 'amzn', name: 'Amazon', symbol: 'AMZN', basePrice: 180.00, change: 0.8, icon: '📦', color: 'text-orange-300' },
    { id: 'meta', name: 'Meta', symbol: 'META', basePrice: 490.00, change: 2.1, icon: '∞', color: 'text-blue-500' },
    { id: 'nflx', name: 'Netflix', symbol: 'NFLX', basePrice: 615.00, change: 1.1, icon: '🎬', color: 'text-red-600' },
];

const FOREX: MarketAsset[] = [
    { id: 'eurusd', name: 'Euro', symbol: 'EUR/USD', basePrice: 1.0850, change: 0.05, icon: '🇪🇺', color: 'text-blue-400' },
    { id: 'gbpusd', name: 'British Pound', symbol: 'GBP/USD', basePrice: 1.2650, change: -0.10, icon: '🇬🇧', color: 'text-purple-400' },
    { id: 'usdjpy', name: 'Japanese Yen', symbol: 'USD/JPY', basePrice: 151.20, change: 0.30, icon: '🇯🇵', color: 'text-red-400' },
    { id: 'usdchf', name: 'Swiss Franc', symbol: 'USD/CHF', basePrice: 0.9050, change: 0.02, icon: '🇨🇭', color: 'text-red-500' },
    { id: 'audusd', name: 'Australian Dollar', symbol: 'AUD/USD', basePrice: 0.6550, change: 0.15, icon: '🇦🇺', color: 'text-green-400' },
    { id: 'usdcad', name: 'Canadian Dollar', symbol: 'USD/CAD', basePrice: 1.3550, change: -0.05, icon: '🇨🇦', color: 'text-red-500' },
    { id: 'usdcny', name: 'Chinese Yuan', symbol: 'USD/CNY', basePrice: 7.2300, change: 0.01, icon: '🇨🇳', color: 'text-red-600' },
    { id: 'usdinr', name: 'Indian Rupee', symbol: 'USD/INR', basePrice: 83.40, change: 0.05, icon: '🇮🇳', color: 'text-orange-400' },
];

export const FinanceTools: React.FC<FinanceToolsProps> = ({ onAnalyze, currentLang }) => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('BUDGET');
  const [dailyQuote, setDailyQuote] = useState(MONEY_QUOTES[0]);

  // Market State
  const [marketCategory, setMarketCategory] = useState<MarketCategory>('METALS');
  const [marketSearch, setMarketSearch] = useState('');
  
  // Real-time Simulation State
  const [livePrices, setLivePrices] = useState<Record<string, { price: number, change: number }>>({});
  
  // Analysis Modal State
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<Record<string, string> | null>(null);

  // Budget State
  const [salary, setSalary] = useState(5000);
  const [expenses, setExpenses] = useState([{ id: 1, name: 'Rent', cost: 1200 }, { id: 2, name: 'Groceries', cost: 400 }]);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseCost, setNewExpenseCost] = useState('');
  
  // Wealth Persona State
  const [wealthPersona, setWealthPersona] = useState<FinancialPersona | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

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

  // --- Real-Time Simulation Engine ---
  useEffect(() => {
      // Initialize prices
      const allAssets = [...METALS, ...CRYPTO, ...STOCKS, ...FOREX];
      const initial: Record<string, { price: number, change: number }> = {};
      allAssets.forEach(a => {
          initial[a.id] = { price: a.basePrice, change: a.change };
      });
      setLivePrices(initial);

      // Heartbeat Loop
      const interval = setInterval(() => {
          setLivePrices(prev => {
              const next = { ...prev };
              Object.keys(next).forEach(key => {
                  // Simulate realistic volatility based on asset type (roughly)
                  const volatility = key.length === 3 ? 0.002 : 0.0005; // Crypto vs Forex
                  const move = (Math.random() - 0.5) * volatility;
                  
                  const currentPrice = next[key].price;
                  const newPrice = currentPrice * (1 + move);
                  
                  // Accumulate change slightly
                  const currentChange = next[key].change;
                  const newChange = currentChange + (move * 100);

                  next[key] = { 
                      price: newPrice, 
                      change: parseFloat(newChange.toFixed(2)) 
                  };
              });
              return next;
          });
      }, 3000); // Update every 3 seconds

      return () => clearInterval(interval);
  }, []);

  // --- Deep Analysis Handler ---
  const handleInspectAsset = async (asset: MarketAsset) => {
      setSelectedAsset(asset);
      setAnalysisLoading(true);
      setAnalysisData(null);

      const currentPrice = livePrices[asset.id]?.price || asset.basePrice;

      try {
        const chat = await initializeChat(currentLang);
        // Force structured analysis
        const prompt = `
        ANALYZE ASSET: ${asset.name} (${asset.symbol})
        CURRENT PRICE: ${currentPrice}
        
        Provide a strategic breakdown in this exact format.
        Be concise, professional, and sophisticated. Use financial terminology correctly.
        
        [FUNDAMENTAL]: (1 sentence on value proposition or current economic drivers)
        [TECHNICAL]: (1 sentence on price action, support/resistance, or trends)
        [SENTIMENT]: (1 sentence on market mood: Greed/Fear/Neutral)
        [MACRO]: (1 sentence on global economic impact: Rates, Inflation, Geopolitics)
        [PSYCHOLOGY]: (1 sentence on trader behavior right now)
        [ACTION]: (1 specific, actionable step: e.g., "DCA entry", "Wait for pullback", "Hedge")
        `;

        const response = await sendMessageToSkillfi(chat, prompt);
        
        // Parse the response manually to handle potential AI formatting variations
        const sections: Record<string, string> = {
            Fundamental: "Analysis unavailable.",
            Technical: "Analysis unavailable.",
            Sentiment: "Analysis unavailable.",
            Macro: "Analysis unavailable.",
            Psychology: "Analysis unavailable.",
            Action: "Analysis unavailable.",
        };

        const lines = response.split('\n');
        let currentSection = '';

        lines.forEach(line => {
            if (line.includes('[FUNDAMENTAL]')) { currentSection = 'Fundamental'; sections[currentSection] = line.replace('[FUNDAMENTAL]:', '').trim(); }
            else if (line.includes('[TECHNICAL]')) { currentSection = 'Technical'; sections[currentSection] = line.replace('[TECHNICAL]:', '').trim(); }
            else if (line.includes('[SENTIMENT]')) { currentSection = 'Sentiment'; sections[currentSection] = line.replace('[SENTIMENT]:', '').trim(); }
            else if (line.includes('[MACRO]')) { currentSection = 'Macro'; sections[currentSection] = line.replace('[MACRO]:', '').trim(); }
            else if (line.includes('[PSYCHOLOGY]')) { currentSection = 'Psychology'; sections[currentSection] = line.replace('[PSYCHOLOGY]:', '').trim(); }
            else if (line.includes('[ACTION]')) { currentSection = 'Action'; sections[currentSection] = line.replace('[ACTION]:', '').trim(); }
            else if (currentSection && line.trim()) {
                sections[currentSection] += ' ' + line.trim();
            }
        });

        setAnalysisData(sections);

      } catch (e) {
          console.error("Analysis failed", e);
      } finally {
          setAnalysisLoading(false);
      }
  };

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

      try {
          const chat = await initializeChat(currentLang);
          const prompt = `Explain strictly the financial mechanics of: ${item.name}. Is it an Asset, Liability, or Luxury? Why? If it's rare, explain its exclusivity to high society. Max 50 words. Simple language. Language: ${currentLang}`;
          const text = await sendMessageToSkillfi(chat, prompt);
          setEnlightenment(text);
      } catch (e) {
          setEnlightenment("Could not load data.");
      }

      const img = await generateItemVisual(item.name);
      setItemImage(img ? `data:image/jpeg;base64,${img}` : null);
      
      setIsEnlightening(false);
  };

  // --- Market Filters ---
  const getFilteredMarketData = () => {
      let data: MarketAsset[] = [];
      if (marketCategory === 'METALS') data = METALS;
      if (marketCategory === 'CRYPTO') data = CRYPTO;
      if (marketCategory === 'STOCKS') data = STOCKS;
      if (marketCategory === 'FOREX') data = FOREX;

      if (marketSearch) {
          const lower = marketSearch.toLowerCase();
          const filtered = data.filter(item => 
              item.name.toLowerCase().includes(lower) || 
              item.symbol.toLowerCase().includes(lower)
          );
          
          // Simulation for "All Cryptos/Stocks in the world"
          if (filtered.length === 0 && marketSearch.length > 1) {
              return [{
                  id: 'sim-1',
                  name: marketSearch.toUpperCase(),
                  symbol: marketSearch.substring(0, 4).toUpperCase(),
                  basePrice: 0, // Placeholder
                  change: 0,
                  icon: '🔍',
                  color: 'text-white',
                  isSimulated: true,
                  desc: 'Search Result'
              }];
          }
          return filtered;
      }
      return data;
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
  useEffect(() => {
      if (activeTab === 'PROFIT') {
          const canvas = galaxyCanvasRef.current;
          const ctx = canvas?.getContext('2d');
          
          if (!canvas || !ctx) return;

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

              ctx.clearRect(0, 0, canvas.width, canvas.height);
              const centerX = canvas.width / 2;
              const centerY = canvas.height / 2;
              
              const isProfit = profitData.profit >= 0;
              const primaryColor = isProfit ? '#00ffaa' : '#ff4444'; 
              const glowColor = isProfit ? 'rgba(0, 255, 170, 0.2)' : 'rgba(255, 68, 68, 0.2)';

              const baseSize = 20;
              const growth = Math.min(Math.abs(profitData.roi), 50) / 2;
              const starSize = baseSize + growth;

              const gradient = ctx.createRadialGradient(centerX, centerY, starSize * 0.2, centerX, centerY, starSize * 3);
              gradient.addColorStop(0, primaryColor);
              gradient.addColorStop(1, 'transparent');
              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(centerX, centerY, starSize * 3, 0, Math.PI * 2);
              ctx.fill();

              ctx.fillStyle = '#fff';
              ctx.beginPath();
              ctx.arc(centerX, centerY, starSize * 0.5, 0, Math.PI * 2);
              ctx.fill();

              particles.forEach(p => {
                  p.angle += p.speed * (isProfit ? 1 : 0.5); 
                  p.x = centerX + Math.cos(p.angle) * p.radius;
                  p.y = centerY + Math.sin(p.angle) * p.radius;
                  
                  ctx.fillStyle = isProfit ? '#ffffffaa' : '#ffaaaa';
                  ctx.beginPath();
                  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                  ctx.fill();
                  
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

  const handleAuditBudget = async () => {
      setIsAuditing(true);
      setWealthPersona(null);
      
      const dataString = `Monthly Income: ${salary}. Expenses: ${expenses.map(e => `${e.name}: ${e.cost}`).join(', ')}. Savings Rate: ${budgetData.savingsRate.toFixed(1)}%.`;
      
      const result = await analyzeFinancialHealth(dataString);
      if (result) {
          setWealthPersona(result);
      }
      setIsAuditing(false);
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
            <h1 className="text-2xl md:text-3xl font-bold font-display text-white tracking-tight drop-shadow-md kinetic-type">Money Tools <span className="text-skillfi-neon text-shadow-neon">v4.3</span></h1>
            <p className="text-gray-500 text-sm mt-1">Control your financial future.</p>
        </div>
        <div className="p-3 bg-white/5 border-l-4 border-green-500 rounded-r-xl max-w-sm hidden md:block">
            <p className="text-xs text-gray-300 italic">"{dailyQuote}"</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/5 pb-1 overflow-x-auto scrollbar-hide w-full">
        {(['BUDGET', 'PROFIT', 'INTEREST', 'MASTERY', 'MARKETS', 'TAX'] as FinanceTab[]).map((tab) => (
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
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-skillfi-neon/30 transition-colors">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Monthly Income ($)</label>
                        <input 
                            type="number" 
                            value={salary} 
                            onChange={(e) => setSalary(Number(e.target.value))}
                            className="w-full bg-transparent text-3xl md:text-4xl font-bold font-display text-white outline-none border-b border-gray-700 focus:border-skillfi-neon py-2 mt-2 transition-all"
                        />
                    </div>

                    <div className="relative bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col justify-center items-center overflow-hidden min-h-[160px]">
                        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                            <div 
                                className={`w-32 h-32 rounded-full blur-3xl transition-all duration-1000 ${budgetData.savings >= 0 ? 'bg-skillfi-neon animate-pulse' : 'bg-red-600 animate-pulse'}`}
                                style={{ transform: `scale(${Math.min(Math.max(budgetData.savingsRate / 20, 0.5), 1.5)})` }}
                            ></div>
                        </div>

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
                        disabled={isAuditing}
                        className="w-full py-4 bg-gradient-to-r from-skillfi-neon/5 to-blue-500/5 border border-skillfi-neon/20 text-skillfi-neon font-bold rounded-xl hover:bg-skillfi-neon hover:text-black transition-all flex items-center justify-center gap-2 group hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                    >
                        {isAuditing ? (
                            <>
                                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                Analyzing Financial DNA...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:animate-spin-slow">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                </svg>
                                ANALYZE FINANCIAL DNA
                            </>
                        )}
                    </button>
                </div>

                {wealthPersona && (
                    <div className="mt-6 animate-fade-in bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl font-serif">⚖️</div>
                        <div className="relative z-10">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Detected Persona</span>
                            <h2 className="text-2xl font-bold font-display text-white mt-1 mb-2 text-shadow-glow">{wealthPersona.persona}</h2>
                            <p className="text-sm text-gray-300 italic mb-6 border-l-2 border-skillfi-neon pl-4">"{wealthPersona.analysis}"</p>
                            
                            <h3 className="text-skillfi-neon text-xs font-bold uppercase tracking-widest mb-3">Optimization Protocols</h3>
                            <div className="space-y-2">
                                {wealthPersona.tips.map((tip, i) => (
                                    <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 text-xs text-gray-200 flex items-start gap-2">
                                        <span className="text-skillfi-neon font-bold">0{i+1}.</span>
                                        {tip}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* PROFIT TAB */}
        {activeTab === 'PROFIT' && (
             <div className="space-y-6">
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

                 <div ref={containerRef} className="relative w-full h-64 bg-black rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center">
                    <canvas 
                        ref={galaxyCanvasRef} 
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    
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

        {/* INTEREST TAB */}
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

                <div className="mt-6 min-h-[250px] p-6 bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-skillfi-neon/30 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
                             <div className="absolute inset-0 rounded-full animate-pulse bg-skillfi-neon/5"></div>
                         </div>
                    </div>

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

        {/* WEALTH MASTERY */}
        {activeTab === 'MASTERY' && (
             <div className="space-y-8 animate-fade-in relative">
                 <p className="text-center text-gray-400 text-sm max-w-lg mx-auto">
                     Learn the difference between things that make you money (Assets) and things that take your money (Liabilities).
                 </p>
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

        {/* GLOBAL MARKETS (NEW) */}
        {activeTab === 'MARKETS' && (
            <div className="space-y-6 animate-fade-in relative">
                 {/* DEEP ANALYSIS MODAL */}
                 {selectedAsset && (
                     <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-4 flex flex-col items-center justify-center animate-fade-in overflow-y-auto">
                        <div className="glass-panel w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-skillfi-neon/30 flex flex-col max-h-[90vh]">
                             <div className="p-6 border-b border-white/10 bg-black/60 flex justify-between items-start sticky top-0 z-20 backdrop-blur-md">
                                 <div>
                                     <div className="flex items-center gap-3">
                                         <span className="text-3xl">{selectedAsset.icon}</span>
                                         <div>
                                             <h2 className="text-2xl font-bold text-white font-display tracking-wide">{selectedAsset.name}</h2>
                                             <div className="flex items-center gap-3 text-sm font-mono mt-1">
                                                 <span className="text-gray-400">{selectedAsset.symbol}</span>
                                                 <span className={`${(livePrices[selectedAsset.id]?.change || selectedAsset.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                     ${(livePrices[selectedAsset.id]?.price || selectedAsset.basePrice).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                                     <span className="ml-2 text-xs">
                                                         ({(livePrices[selectedAsset.id]?.change || selectedAsset.change) >= 0 ? '+' : ''}
                                                         {(livePrices[selectedAsset.id]?.change || selectedAsset.change).toFixed(2)}%)
                                                     </span>
                                                 </span>
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                                 <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors">✕</button>
                             </div>

                             <div className="p-8 overflow-y-auto">
                                 {analysisLoading ? (
                                     <div className="flex flex-col items-center justify-center py-20 text-center">
                                         <div className="w-16 h-16 border-4 border-t-skillfi-neon border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-6"></div>
                                         <h3 className="text-xl font-bold text-white animate-pulse">Establishing Satellite Uplink...</h3>
                                         <p className="text-sm text-gray-500 mt-2 font-mono">Analyzing {selectedAsset.name} market data streams.</p>
                                     </div>
                                 ) : analysisData ? (
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[
                                            { title: 'Fundamental', key: 'Fundamental', icon: '📊', color: 'border-blue-500' },
                                            { title: 'Technical', key: 'Technical', icon: '📈', color: 'border-purple-500' },
                                            { title: 'Sentiment', key: 'Sentiment', icon: '🧠', color: 'border-yellow-500' },
                                            { title: 'Macroeconomy', key: 'Macro', icon: '🌐', color: 'border-indigo-500' },
                                            { title: 'Psychology', key: 'Psychology', icon: '🎭', color: 'border-pink-500' },
                                            { title: 'Action Plan', key: 'Action', icon: '🎯', color: 'border-green-500' },
                                        ].map((section, i) => (
                                            <div key={i} className={`bg-white/5 border-l-4 ${section.color} p-5 rounded-r-xl shadow-lg hover:bg-white/10 transition-colors`}>
                                                <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                                                    <span className="text-xl">{section.icon}</span>
                                                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">{section.title}</h3>
                                                </div>
                                                <p className="text-gray-300 text-xs leading-relaxed font-medium">
                                                    {analysisData[section.key] || 'Data unavailable.'}
                                                </p>
                                            </div>
                                        ))}
                                     </div>
                                 ) : (
                                     <div className="text-center py-20 text-red-400">Unable to retrieve market data. Connection error.</div>
                                 )}
                             </div>
                        </div>
                     </div>
                 )}

                 {/* Sub Filters */}
                 <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div className="flex bg-white/5 p-1 rounded-xl overflow-x-auto max-w-full">
                        {(['METALS', 'CRYPTO', 'STOCKS', 'FOREX'] as MarketCategory[]).map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setMarketCategory(cat); setMarketSearch(''); }}
                                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                                    marketCategory === cat 
                                    ? 'bg-skillfi-neon text-black shadow-lg' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                         <input 
                            type="text" 
                            placeholder={`Search ${marketCategory.toLowerCase()}...`} 
                            value={marketSearch}
                            onChange={(e) => setMarketSearch(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-skillfi-neon outline-none"
                        />
                    </div>
                 </div>

                 {/* Simulated Live Connection Banner */}
                 <div className="bg-green-900/10 border border-green-500/20 p-3 rounded-lg flex items-center justify-between">
                     <div className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                         <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Global Market Data Connection: Active</span>
                     </div>
                     <span className="text-[10px] text-gray-500 font-mono">LATENCY: 12ms</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {getFilteredMarketData().map((item, i) => {
                         // Use live price if available, else base price
                         const currentPrice = livePrices[item.id]?.price || item.basePrice;
                         const currentChange = livePrices[item.id]?.change || item.change;

                         return (
                             <div 
                                key={item.id} 
                                onClick={() => handleInspectAsset(item)}
                                className={`glass-panel p-5 rounded-xl border border-white/5 hover:border-skillfi-neon/50 transition-all group cursor-pointer ${item.isSimulated ? 'border-dashed border-gray-700' : ''}`}
                             >
                                 <div className="flex justify-between items-start mb-4">
                                     <div className="flex items-center gap-3">
                                         <div className="text-3xl group-hover:scale-110 transition-transform">{item.icon}</div>
                                         <div>
                                             <div className="font-bold text-white text-sm group-hover:text-skillfi-neon transition-colors">{item.name}</div>
                                             <div className="text-[10px] text-gray-500 font-mono">{item.symbol}</div>
                                         </div>
                                     </div>
                                     <div className="text-right">
                                         <div className={`text-sm font-bold font-mono ${item.color || 'text-white'}`}>${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
                                         <div className={`text-[10px] font-bold ${currentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                             {currentChange >= 0 ? '+' : ''}{currentChange.toFixed(2)}%
                                         </div>
                                     </div>
                                 </div>
                                 
                                 {/* Mini Mock Chart */}
                                 <div className="h-10 flex items-end gap-1 opacity-30 mt-2">
                                     {[...Array(20)].map((_, idx) => (
                                         <div 
                                            key={idx} 
                                            className={`flex-1 rounded-t-sm ${currentChange >= 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                                            style={{height: `${30 + Math.random() * 70}%`}}
                                         ></div>
                                     ))}
                                 </div>

                                 <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center">
                                     <span className="text-[9px] text-gray-500 italic truncate max-w-[70%]">{item.desc || 'Click for deep analysis.'}</span>
                                     <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-white uppercase tracking-wider group-hover:bg-skillfi-neon group-hover:text-black transition-colors">Analyze</span>
                                 </div>
                             </div>
                         );
                     })}
                 </div>
                 
                 {getFilteredMarketData().length === 0 && (
                     <div className="text-center py-20 opacity-50">
                         <div className="text-4xl mb-2">🔭</div>
                         <p className="text-xs uppercase tracking-widest">Asset not found in top lists.</p>
                     </div>
                 )}
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