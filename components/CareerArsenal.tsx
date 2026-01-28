import React, { useState, useRef, useEffect } from 'react';
import { generateProfessionalHeadshot, generateContentPack, generatePitchDeck, generatePortfolioHTML, generateCVContent, ContentPack, initializeChat, sendMessageToSkillfi, generateCareerRoadmap, CareerRoadmap, generateItemVisual } from '../services/geminiService';
import { AudioService } from '../services/audioService';
import { UserProfile } from '../types';

interface ScheduledPost {
    id: string;
    platform: 'LINKEDIN' | 'TWITTER' | 'TIKTOK';
    content: string;
    date: string;
    status: 'SCHEDULED' | 'PUBLISHED';
}

interface CareerArsenalProps {
    user: UserProfile;
}

const CAREER_QUOTES = [
    "Choose a job you love, and you will never have to work a day in your life.",
    "Opportunities don't happen, you create them.",
    "It's not what you achieve, it's what you overcome.",
    "Skills make you rich, not just money.",
    "Your network is your net worth.",
    "Growth and comfort do not coexist.",
];

// --- RICH KNOWLEDGE BASE ---
const ELITE_KNOWLEDGE_BASE: Record<string, { philosophy: string; mechanics: string; advanced: string; pro_tip: string }> = {
    'Dining Etiquette': {
        philosophy: "The meal is never about the food; it is about the conversation and the comfort of others. Your table manners signal your awareness and discipline.",
        mechanics: "1. **The Place Setting:** Utensils are used from the outside in. Forks on the left, knives/spoons on the right. Solids (bread) on the left, liquids (drinks) on the right (BMW: Bread, Meal, Water).\n2. **The Napkin:** Place it on your lap immediately. If you leave the table, place it on the chair, not the table. When finished, place it loosely to the left of the plate.\n3. **Eating:** Cut one bite at a time. Rest wrists on the table edge (continental style), never elbows.",
        advanced: "**The Silent Service Code:** To signal you are pausing, place knife and fork in an inverted 'V' (knife blade inward). To signal you are finished, place them parallel at the 4 o'clock position (handles at 4, tips at 10). Never season food before tasting; it insults the chef.",
        pro_tip: "If you drop a utensil, do not dive for it. Simply signal the server for a replacement. Treat the server with the same respect as the CEO; this is the ultimate test of character."
    },
    'Networking': {
        philosophy: "Networking is not asking for favors; it is farming. It is planting seeds of value today to harvest relationships years from now. Be the 'Host', not the 'Guest'.",
        mechanics: "1. **The Entry:** Enter a room, pause, scan, and smile. Do not rush to the bar or your phone.\n2. **The Handshake:** Firm, dry, web-to-web contact, 2-3 pumps. Eye contact is mandatory.\n3. **The Name:** Repeat their name immediately ('Nice to meet you, Sarah'). Use it once more in conversation.",
        advanced: "**The 'Host' Mentality:** Even if it's not your event, act like a host. Introduce people to each other. 'John, have you met Lisa? She works in Fintech.' You become the connector, the node of value. People will gravitate toward you because you make them feel comfortable.",
        pro_tip: "Never ask 'What do you do?' immediately. Ask 'What are you working on that excites you right now?' It opens up passion, not just job titles."
    },
    'Sartorial Excellence': {
        philosophy: "Dress is a language. Before you speak, your clothes tell people if you respect yourself, the occasion, and them. 'Sprezzatura' is the art of looking effortless.",
        mechanics: "1. **Fit is King:** A $200 suit tailored perfectly looks better than a $2,000 suit off the rack. Shoulders must line up exactly. Sleeves should reveal 1/2 inch of shirt cuff.\n2. **The Shoes:** They must be polished. Oxford (closed lacing) for formal, Derby (open lacing) for business casual. Belt must match shoes.",
        advanced: "**Fabric & Texture:** Move beyond plain navy. Experiment with texture (flannel, linen, tweed) rather than loud colors. Understand 'Super numbers' (Super 120s vs 180s) - higher isn't always better for daily wear (it's more fragile).",
        pro_tip: "Always dress one notch above what is expected. If the code is casual, wear a blazer. If it's business casual, wear a tie. You can always take the jacket off, but you can't add authority if you didn't bring it."
    },
    'Horology': {
        philosophy: "A watch is the only piece of jewelry a man can wear that represents engineering, history, and investment simultaneously. It signals appreciation for mechanics over digital obsolescence.",
        mechanics: "1. **Movements:** Quartz (battery, ticks once/sec) vs. Mechanical (spring-driven, sweeping hand). High society respects Mechanical (Automatic or Manual).\n2. **Categories:** Dress (thin, leather strap), Diver (rotating bezel, steel), Chronograph (stopwatch function), Complication (Calendar, Moonphase).",
        advanced: "**The Holy Trinity:** Patek Philippe, Audemars Piguet, Vacheron Constantin. Understand why a 'Tourbillon' exists (to counter gravity) even if it's unnecessary today. It's art. Vintage watches (pre-1980) often hold value better than modern ones.",
        pro_tip: "Never wear a massive diver watch with a tuxedo (James Bond is the exception, not the rule). With black tie, the watch should be slim, simple, and on a black leather strap—or wear no watch at all, implying time doesn't matter."
    },
    'Oenology (Wine)': {
        philosophy: "Wine is geography in a bottle. Knowing it shows you are cultured and patient. It's about describing the experience, not just drinking alcohol.",
        mechanics: "1. **The 5 S's:** See (color/viscosity), Swirl (release aromas), Smell (80% of taste), Sip (let it roll over tongue), Savor/Spit.\n2. **Key Regions:** Bordeaux (Cabernet/Merlot blends), Burgundy (Pinot Noir/Chardonnay), Tuscany (Sangiovese), Napa (Cabernet).",
        advanced: "**Reading a List:** Don't just order the second cheapest. Ask the Sommelier: 'We enjoy full-bodied reds like a Left Bank Bordeaux, what do you recommend under $X?' They will respect the specificity. Understand tannins (drying sensation) vs. acidity (watering sensation).",
        pro_tip: "If you are the host, you taste the wine. You are checking for *faults* (cork taint, oxidation), not if you 'like' it. If it's not spoiled, you accept it."
    },
    'Golf & Leisure': {
        philosophy: "Golf is 4 hours of character revelation. You can fake a resume, but you cannot fake honesty, temper control, or adherence to rules when a shot goes wrong.",
        mechanics: "1. **Pace of Play:** No one cares if you are bad; they care if you are slow. Be ready to hit when it's your turn.\n2. **Etiquette:** Repair your divots. Rake the bunker. Do not walk in someone's 'line' on the putting green. Silence when others hit.",
        advanced: "**Business on the Course:** Do not bring up business on the first few holes. Wait for the back 9 or the 19th hole (drinks after). Let the relationship breathe first. Let the client win? No. Play your best, but be generous with praise for their good shots.",
        pro_tip: "Dress code is non-negotiable. Collared shirt tucked in. Belt. No denim. Hat forward. Take your hat off when entering the clubhouse."
    },
    'Art Collection': {
        philosophy: "Art is an asset class that yields 'psychic dividends' (joy) and financial appreciation. It signals you are a patron of culture, not just a consumer.",
        mechanics: "1. **Primary vs. Secondary:** Primary market is buying from the gallery (first sale). Secondary is buying at auction (Christie's, Sotheby's). Primary builds relationships; Secondary determines true market value.\n2. **Mediums:** Canvas (Oil/Acrylic) usually holds more value than works on paper or prints.",
        advanced: "**Due Diligence:** Provenance (history of ownership), Condition Report (damage?), and Authenticity. Blue Chip artists (Warhol, Basquiat) are safe but expensive. Emerging artists are high risk/high reward. Buy with your eyes, but verify with your brain.",
        pro_tip: "Don't buy art to match your sofa. Buy it because it challenges you. A 'pretty' painting is decoration; a challenging painting is art. Visit Art Basel or Frieze just to observe."
    },
    'Strategic Philanthropy': {
        philosophy: "Wealth without purpose is vulgar. Philanthropy is not just writing checks; it's using capital to solve structural problems. It buys influence and legacy.",
        mechanics: "1. **Impact Investing:** Investing in companies that generate social good + financial return.\n2. **Foundations:** Setting up a DAF (Donor Advised Fund) allows immediate tax deduction while granting money out over time.",
        advanced: "**Effective Altruism:** Using data to determine where the next dollar does the most good (e.g., malaria nets vs. opera houses). High society respects strategic giving, not just reactive charity.",
        pro_tip: "Join the board of a non-profit. It is the fastest way to access the elite network of a city. You give 'Time, Talent, or Treasure'."
    }
};

export const CareerArsenal: React.FC<CareerArsenalProps> = ({ user }) => {
    // Added 'PATH' and 'ELITE' tabs
    const [activeModule, setActiveModule] = useState<'PATH' | 'NUKE' | 'CALENDAR' | 'HEADSHOT' | 'CV' | 'PITCH' | 'SITE' | 'ELITE'>('PATH');
    const [dailyQuote, setDailyQuote] = useState(CAREER_QUOTES[0]);
    
    // Pathfinder State
    const [currentQual, setCurrentQual] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [careerMap, setCareerMap] = useState<CareerRoadmap | null>(null);
    const [isMapping, setIsMapping] = useState(false);

    // Headshot State
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGeneratingHeadshot, setIsGeneratingHeadshot] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState<'CORPORATE' | 'MEDICAL' | 'CREATIVE' | 'TECH'>('CORPORATE');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // CV State
    const [cvInputs, setCvInputs] = useState({
        experience: '',
        education: '',
        skills: user.skills.join(', '),
        targetRole: ''
    });
    const [cvContent, setCvContent] = useState<string | null>(null);
    const [isGeneratingCV, setIsGeneratingCV] = useState(false);

    // Elite Modal State
    const [activeEliteItem, setActiveEliteItem] = useState<{title: string, icon: string, desc: string} | null>(null);
    const [eliteImage, setEliteImage] = useState<string | null>(null);
    const [eliteLoading, setEliteLoading] = useState(false);

    useEffect(() => {
        setDailyQuote(CAREER_QUOTES[Math.floor(Math.random() * CAREER_QUOTES.length)]);
    }, []);

    const triggerHaptic = () => {
        if (navigator.vibrate) navigator.vibrate(15);
    };

    // --- ELITE HANDLERS ---
    const eliteItems = [
        { title: 'Dining Etiquette', icon: '🍽️', desc: 'Master the art of the business dinner.' },
        { title: 'Networking', icon: '🤝', desc: 'How to enter a room and remember names.' },
        { title: 'Sartorial Excellence', icon: '👔', desc: 'Dress codes decoded.' },
        { title: 'Horology', icon: '⌚', desc: 'Understanding Timepieces.' },
        { title: 'Oenology (Wine)', icon: '🍷', desc: 'Navigate a wine list with confidence.' },
        { title: 'Golf & Leisure', icon: '⛳', desc: 'Business happens on the green.' },
        { title: 'Art Collection', icon: '🖼️', desc: 'Investing in culture.' },
        { title: 'Strategic Philanthropy', icon: '🕊️', desc: 'Giving back effectively.' }
    ];

    const openEliteModal = async (item: typeof eliteItems[0]) => {
        setActiveEliteItem(item);
        setEliteImage(null);
        setEliteLoading(true);
        AudioService.playProcessing();

        // Generate Visual for the specific topic
        try {
            const visual = await generateItemVisual(item.title + " high society luxury context");
            if (visual) setEliteImage(`data:image/jpeg;base64,${visual}`);
        } catch (e) {
            console.error(e);
        } finally {
            setEliteLoading(false);
            AudioService.playSuccess();
        }
    };

    // --- DOWNLOAD HANDLERS ---
    const handleDownloadImage = () => {
        if (generatedImage) {
            const link = document.createElement('a');
            link.href = generatedImage;
            link.download = `Skillfi_Headshot_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            AudioService.playSuccess();
        }
    };

    const handleDownloadCV = () => {
        if (cvContent) {
            // Create a Blob pretending to be a Word Doc (HTML content)
            const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Resume</title></head><body>";
            const footer = "</body></html>";
            const sourceHTML = header + cvContent + footer;
            
            const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
            const fileDownload = document.createElement("a");
            document.body.appendChild(fileDownload);
            fileDownload.href = source;
            fileDownload.download = `Skillfi_Resume_${user.username}.doc`;
            fileDownload.click();
            document.body.removeChild(fileDownload);
            AudioService.playSuccess();
        }
    };

    // --- CV HANDLERS ---
    const handleGenerateCV = async () => {
        setIsGeneratingCV(true);
        AudioService.playProcessing();
        const context = `Name: ${user.username}. Target Role: ${cvInputs.targetRole}. Skills: ${cvInputs.skills}. Experience: ${cvInputs.experience}. Education: ${cvInputs.education}.`;
        const cv = await generateCVContent(context);
        if (cv) {
            setCvContent(cv);
            AudioService.playSuccess();
        }
        setIsGeneratingCV(false);
    };
    
    const handlePathfinder = async () => {
        if (!currentQual || !currentStatus) return;
        setIsMapping(true);
        try {
            const context = `Qualification: ${currentQual}. Status: ${currentStatus}. Current Skills: ${user.skills.join(', ')}.`;
            const map = await generateCareerRoadmap(context);
            if (map) {
                setCareerMap(map);
                AudioService.playSuccess();
            } else {
                AudioService.playAlert();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsMapping(false);
        }
    };

     const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result as string);
                setGeneratedImage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateHeadshot = async () => {
        if (!originalImage) return;
        setIsGeneratingHeadshot(true);
        triggerHaptic();
        AudioService.playProcessing();

        const base64Data = originalImage.split(',')[1];
        const result = await generateProfessionalHeadshot(base64Data, selectedStyle);

        if (result) {
            setGeneratedImage(`data:image/jpeg;base64,${result}`);
            AudioService.playSuccess();
        } else {
            AudioService.playAlert();
        }
        setIsGeneratingHeadshot(false);
    };

    const getEliteContent = (title: string) => {
        return ELITE_KNOWLEDGE_BASE[title] || { philosophy: "Loading...", mechanics: "...", advanced: "...", pro_tip: "..." };
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans scrollbar-hide pb-24 touch-pan-y">
            <header className="mb-8">
                <h1 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tighter kinetic-type">
                    Career Guidance<span className="text-skillfi-neon">.</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Plan, Build, and Refine.</p>
                <div className="mt-4 p-3 bg-white/5 border-l-4 border-skillfi-neon rounded-r-xl">
                    <p className="text-xs text-gray-300 italic">"{dailyQuote}"</p>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-8 border-b border-white/10 pb-1 overflow-x-auto scrollbar-hide">
                {[
                    { id: 'PATH', label: 'Pathfinder' },
                    { id: 'ELITE', label: 'High Society' },
                    { id: 'CV', label: 'CV Writer' },
                    { id: 'HEADSHOT', label: 'Pro Photo' },
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => { setActiveModule(tab.id as any); triggerHaptic(); }}
                        className={`px-4 py-3 text-[10px] font-bold tracking-[0.15em] rounded-t-lg uppercase transition-all whitespace-nowrap ${
                            activeModule === tab.id 
                            ? 'bg-skillfi-neon text-black border-t-2 border-white shadow-[0_-5px_20px_rgba(0,255,255,0.2)]' 
                            : 'text-gray-500 bg-white/5 hover:bg-white/10'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* --- ELITE MODULE --- */}
            {activeModule === 'ELITE' && (
                <div className="animate-fade-in relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {eliteItems.map((item, i) => (
                            <div 
                                key={i}
                                onClick={() => openEliteModal(item)}
                                className="glass-panel p-6 rounded-2xl border-t-4 border-t-skillfi-neon hover:bg-white/5 transition-all cursor-pointer group hover:scale-[1.02] active:scale-95"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <h3 className="font-bold text-white text-lg">{item.title}</h3>
                                <p className="text-gray-400 text-xs mt-2">{item.desc}</p>
                                <div className="mt-4 text-[10px] text-skillfi-neon font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to Learn
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Elite Modal */}
                    {activeEliteItem && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fade-in" onClick={() => setActiveEliteItem(null)}>
                            <div className="glass-panel w-full max-w-2xl rounded-2xl p-0 relative max-h-[85vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                                {/* Modal Header */}
                                <div className="p-6 border-b border-white/10 bg-black/40 flex justify-between items-start sticky top-0 z-10 backdrop-blur-md">
                                    <div>
                                        <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
                                            {activeEliteItem.icon} {activeEliteItem.title}
                                        </h2>
                                        <p className="text-skillfi-neon text-xs font-bold uppercase tracking-widest mt-1">Refinement Module</p>
                                    </div>
                                    <button className="text-gray-500 hover:text-white bg-white/5 p-2 rounded-full hover:bg-white/20 transition-all" onClick={() => setActiveEliteItem(null)}>✕</button>
                                </div>
                                
                                <div className="p-6 overflow-y-auto scrollbar-hide">
                                    {eliteLoading ? (
                                        <div className="h-48 w-full bg-white/5 rounded-xl flex items-center justify-center animate-pulse mb-6">
                                            <div className="text-skillfi-neon font-mono text-xs">Accessing Secure Knowledge Base...</div>
                                        </div>
                                    ) : (
                                        <>
                                            {eliteImage && (
                                                <div className="h-56 w-full rounded-xl overflow-hidden mb-8 border border-skillfi-neon/30 shadow-lg relative group">
                                                    <img src={eliteImage} alt={activeEliteItem.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                                    <div className="absolute bottom-4 left-4 text-white text-xs font-mono opacity-80">
                                                        FIG. 1.0 // {activeEliteItem.title.toUpperCase()}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-8 text-sm">
                                                {/* Philosophy */}
                                                <section>
                                                    <h3 className="text-skillfi-neon font-bold text-xs uppercase tracking-[0.2em] mb-3 border-b border-skillfi-neon/20 pb-2">01. The Philosophy</h3>
                                                    <p className="text-gray-200 leading-relaxed font-serif italic text-lg">
                                                        "{getEliteContent(activeEliteItem.title).philosophy}"
                                                    </p>
                                                </section>

                                                {/* Mechanics */}
                                                <section className="bg-white/5 p-5 rounded-xl border border-white/5">
                                                    <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-4">02. Core Mechanics</h3>
                                                    <div className="text-gray-300 leading-relaxed whitespace-pre-line space-y-2">
                                                        {getEliteContent(activeEliteItem.title).mechanics}
                                                    </div>
                                                </section>

                                                {/* Advanced */}
                                                <section>
                                                    <h3 className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-3 border-b border-blue-400/20 pb-2">03. Intermediate & Advanced</h3>
                                                    <p className="text-gray-300 leading-relaxed">
                                                        {getEliteContent(activeEliteItem.title).advanced}
                                                    </p>
                                                </section>

                                                {/* Pro Tip */}
                                                <div className="bg-gradient-to-r from-skillfi-neon/10 to-transparent p-4 rounded-l-xl border-l-4 border-skillfi-neon">
                                                    <span className="text-skillfi-neon font-bold uppercase text-[10px] tracking-widest block mb-1">Insider Pro Tip</span>
                                                    <p className="text-white font-medium">
                                                        {getEliteContent(activeEliteItem.title).pro_tip}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- CV WRITER --- */}
            {activeModule === 'CV' && (
                <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl h-fit overflow-y-auto max-h-[600px]">
                        <h2 className="text-xl font-bold text-white mb-2">CV Data Entry</h2>
                        <p className="text-xs text-gray-400 mb-6">Fill in your raw details. We will structure it professionally.</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Target Role</label>
                                <input 
                                    type="text" 
                                    value={cvInputs.targetRole}
                                    onChange={(e) => setCvInputs({...cvInputs, targetRole: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1 text-sm"
                                    placeholder="e.g. Senior Frontend Engineer"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Skills</label>
                                <textarea 
                                    value={cvInputs.skills}
                                    onChange={(e) => setCvInputs({...cvInputs, skills: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1 text-sm h-20"
                                    placeholder="React, TypeScript, Leadership..."
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Experience Summary</label>
                                <textarea 
                                    value={cvInputs.experience}
                                    onChange={(e) => setCvInputs({...cvInputs, experience: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1 text-sm h-24"
                                    placeholder="Worked at Google for 2 years as Dev..."
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Education</label>
                                <input 
                                    type="text" 
                                    value={cvInputs.education}
                                    onChange={(e) => setCvInputs({...cvInputs, education: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1 text-sm"
                                    placeholder="BSc Computer Science, MIT"
                                />
                            </div>
                            <button 
                                onClick={handleGenerateCV}
                                disabled={isGeneratingCV}
                                className="w-full py-3 bg-skillfi-neon text-black font-bold uppercase rounded-xl hover:bg-white transition-all shadow-lg text-xs tracking-widest mt-2"
                            >
                                {isGeneratingCV ? 'Processing...' : 'Generate Resume'}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 glass-panel p-8 rounded-2xl min-h-[500px] font-mono text-xs leading-relaxed overflow-y-auto relative bg-white border-2 border-white/5">
                        {cvContent ? (
                            <div className="text-black whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: cvContent}}></div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                <div className="text-6xl mb-4 opacity-20">📄</div>
                                <p>Ready to Write</p>
                            </div>
                        )}
                        {cvContent && (
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button className="bg-black text-white px-4 py-2 rounded shadow-lg text-xs font-bold uppercase hover:bg-gray-800" onClick={handleDownloadCV}>
                                    Download Word (.doc)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- HEADSHOT --- */}
            {activeModule === 'HEADSHOT' && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                    <div className="glass-panel p-6 rounded-2xl h-fit">
                        <h2 className="text-xl font-bold text-white mb-4">Professional Photo</h2>
                         <div className="space-y-6">
                            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-skillfi-neon/50 hover:bg-white/5 transition-all group">
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📷</div>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-white">Upload Selfie</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {(['CORPORATE', 'MEDICAL', 'CREATIVE', 'TECH'] as const).map(style => (
                                    <button key={style} onClick={() => setSelectedStyle(style)} className={`p-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${selectedStyle === style ? 'bg-skillfi-neon/20 border-skillfi-neon text-white' : 'bg-black/40 border-transparent text-gray-500 hover:text-white'}`}>{style}</button>
                                ))}
                            </div>
                            <button onClick={handleGenerateHeadshot} disabled={!originalImage || isGeneratingHeadshot} className="w-full py-4 font-bold text-sm tracking-widest uppercase rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 bg-skillfi-neon text-black hover:bg-white disabled:bg-white/5 disabled:text-gray-600">{isGeneratingHeadshot ? 'WORKING MAGIC...' : 'CREATE PHOTO'}</button>
                            {generatedImage && (
                                <button onClick={handleDownloadImage} className="w-full py-3 font-bold text-sm tracking-widest uppercase rounded-xl transition-all border border-white/20 hover:bg-white/10 text-white flex items-center justify-center gap-2">
                                    💾 Save to Gallery
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="glass-panel p-1 rounded-2xl h-[400px] md:h-[500px] flex items-center justify-center bg-black/50 relative overflow-hidden group">
                         {!originalImage ? (
                            <div className="text-center opacity-30">
                                <div className="text-6xl mb-4">👤</div>
                                <p className="font-mono text-xs uppercase">No Photo Yet</p>
                            </div>
                        ) : (
                            <div className="relative w-full h-full rounded-xl overflow-hidden select-none">
                                <img src={generatedImage || originalImage} alt="Result" className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- PATHFINDER --- */}
            {activeModule === 'PATH' && (
                 <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Path UI */}
                    <div className="glass-panel p-6 rounded-2xl h-fit">
                        <h2 className="text-xl font-bold text-white mb-4">Route Planner</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Your Qualification</label>
                                <select 
                                    value={currentQual}
                                    onChange={(e) => setCurrentQual(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1"
                                >
                                    <option value="">Select Level</option>
                                    <option value="High School">High School</option>
                                    <option value="Undergraduate">Undergraduate</option>
                                    <option value="Professional">Working Professional</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Current Status / Goal</label>
                                <input 
                                    type="text" 
                                    value={currentStatus}
                                    onChange={(e) => setCurrentStatus(e.target.value)}
                                    placeholder="e.g. Stuck in job, want remote work..."
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1"
                                />
                            </div>
                            <button 
                                onClick={handlePathfinder}
                                disabled={isMapping}
                                className="w-full py-3 bg-skillfi-neon text-black font-bold uppercase rounded-xl hover:bg-white transition-all shadow-lg text-xs tracking-widest mt-2"
                            >
                                {isMapping ? 'Calculating Routes...' : 'Generate Roadmap'}
                            </button>
                        </div>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10">
                         {careerMap ? (
                            <div className="space-y-6">
                                <h3 className="text-skillfi-neon font-bold font-display text-lg">Strategic Roadmap</h3>
                                <div className="bg-white/5 p-4 rounded-xl border-l-4 border-blue-500">
                                    <div className="text-lg font-bold text-white mb-2">{careerMap.web2.role}</div>
                                    <div className="text-xs bg-black/30 p-2 rounded text-white font-mono border border-white/5">➤ {careerMap.web2.action}</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border-l-4 border-purple-500">
                                    <div className="text-lg font-bold text-white mb-2">{careerMap.web3.role}</div>
                                    <div className="text-xs bg-black/30 p-2 rounded text-white font-mono border border-white/5">➤ {careerMap.web3.action}</div>
                                </div>
                            </div>
                         ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 min-h-[300px]">
                                <div className="text-5xl mb-4 opacity-20">🗺️</div>
                                <p className="text-xs uppercase tracking-widest">Awaiting Input Data</p>
                            </div>
                         )}
                    </div>
                </div>
            )}
        </div>
    );
};