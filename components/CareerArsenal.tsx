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
    const [activeEliteItem, setActiveEliteItem] = useState<{title: string, icon: string, desc: string, detail: string} | null>(null);
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
        { title: 'Dining Etiquette', icon: '🍽️', desc: 'Master the art of the business dinner.', detail: 'Proper utensil usage, napkin placement, and how to navigate a 7-course meal. The deal is often closed at the table.' },
        { title: 'Networking', icon: '🤝', desc: 'How to enter a room and remember names.', detail: 'The science of handshakes, eye contact, and the "host mentality". Be the most memorable person in the room.' },
        { title: 'Sartorial Excellence', icon: '👔', desc: 'Dress codes decoded.', detail: 'Understanding Black Tie, Business Casual, and "Sprezzatura". Your attire is your first language.' },
        { title: 'Horology', icon: '⌚', desc: 'Understanding Timepieces.', detail: 'The difference between a Quartz and a Tourbillon. Why Patek Philippe matters. An investment on your wrist.' },
        { title: 'Oenology (Wine)', icon: '🍷', desc: 'Navigate a wine list with confidence.', detail: 'Understanding varietals, regions (Bordeaux vs Burgundy), and how to properly taste and order wine for the table.' },
        { title: 'Golf & Leisure', icon: '⛳', desc: 'Business happens on the green.', detail: 'Etiquette of the game, club rules, and how to network without ruining the game.' },
        { title: 'Art Collection', icon: '🖼️', desc: 'Investing in culture.', detail: 'Blue chip artists, auction house dynamics (Sotheby’s, Christie’s), and tax advantages of art.' },
        { title: 'Strategic Philanthropy', icon: '🕊️', desc: 'Giving back effectively.', detail: 'Setting up foundations, impact investing, and the social responsibility of wealth.' }
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
                                className="glass-panel p-6 rounded-2xl border-t-4 border-t-skillfi-neon hover:bg-white/5 transition-all cursor-pointer group hover:scale-[1.02]"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <h3 className="font-bold text-white text-lg">{item.title}</h3>
                                <p className="text-gray-400 text-xs mt-2">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Elite Modal */}
                    {activeEliteItem && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fade-in" onClick={() => setActiveEliteItem(null)}>
                            <div className="glass-panel w-full max-w-lg rounded-2xl p-6 relative max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                                <button className="absolute top-4 right-4 text-gray-500 hover:text-white" onClick={() => setActiveEliteItem(null)}>✕</button>
                                
                                <h2 className="text-2xl font-bold font-display text-white mb-2 flex items-center gap-2 pr-8">
                                    {activeEliteItem.icon} {activeEliteItem.title}
                                </h2>
                                <p className="text-skillfi-neon text-sm font-bold uppercase tracking-wide mb-6">Refinement Module</p>
                                
                                {eliteLoading ? (
                                    <div className="h-48 w-full bg-white/5 rounded-xl flex items-center justify-center animate-pulse mb-6">
                                        <div className="text-skillfi-neon font-mono text-xs">Accessing Knowledge Base...</div>
                                    </div>
                                ) : (
                                    eliteImage && (
                                        <div className="h-48 w-full rounded-xl overflow-hidden mb-6 border border-skillfi-neon/30">
                                            <img src={eliteImage} alt={activeEliteItem.title} className="w-full h-full object-cover" />
                                        </div>
                                    )
                                )}
                                
                                <div className="bg-black/50 p-4 rounded-xl border border-white/10">
                                    <p className="text-gray-200 text-sm leading-relaxed">{activeEliteItem.detail}</p>
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