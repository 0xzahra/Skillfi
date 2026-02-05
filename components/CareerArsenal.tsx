
import React, { useState, useRef, useEffect } from 'react';
import { 
    generateProfessionalHeadshot, 
    generatePitchDeck, 
    generateCVContent, 
    generateResumeContent, 
    generateCareerRoadmap, 
    generateItemVisual, 
    proofreadDocument, 
    generateContentPack,
    sendMessageToSkillfi,
    initializeChat,
    CareerRoadmap,
    ContentPack
} from '../services/geminiService';
import { AudioService } from '../services/audioService';
import { UserProfile } from '../types';

interface CareerArsenalProps {
    user: UserProfile;
    initialScoutData?: string | null;
    lastSync?: number;
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
interface EliteSkillData {
    icon: string;
    desc: string;
    philosophy: string;
    mechanics: string;
    advanced: string;
    pro_tip: string;
}

const ELITE_DATA: Record<string, EliteSkillData> = {
    'Dining Etiquette': {
        icon: '🍽️',
        desc: 'Master the art of the business dinner.',
        philosophy: "The meal is never about the food; it is about the conversation and the comfort of others. Your table manners signal your awareness and discipline.",
        mechanics: "1. **The Place Setting:** Utensils are used from the outside in. Forks on the left, knives/spoons on the right. Solids (bread) on the left, liquids (drinks) on the right (BMW: Bread, Meal, Water).\n2. **The Napkin:** Place it on your lap immediately. If you leave the table, place it on the chair, not the table. When finished, place it loosely to the left of the plate.\n3. **Eating:** Cut one bite at a time. Rest wrists on the table edge (continental style), never elbows.",
        advanced: "**The Silent Service Code:** To signal you are pausing, place knife and fork in an inverted 'V' (knife blade inward). To signal you are finished, place them parallel at the 4 o'clock position (handles at 4, tips at 10). Never season food before tasting; it insults the chef.",
        pro_tip: "If you drop a utensil, do not dive for it. Simply signal the server for a replacement. Treat the server with the same respect as the CEO; this is the ultimate test of character."
    },
    'Networking': {
        icon: '🤝',
        desc: 'How to enter a room and remember names.',
        philosophy: "Networking is not asking for favors; it is farming. It is planting seeds of value today to harvest relationships years from now. Be the 'Host', not the 'Guest'.",
        mechanics: "1. **The Entry:** Enter a room, pause, scan, and smile. Do not rush to the bar or your phone.\n2. **The Handshake:** Firm, dry, web-to-web contact, 2-3 pumps. Eye contact is mandatory.\n3. **The Name:** Repeat their name immediately ('Nice to meet you, Sarah'). Use it once more in conversation.",
        advanced: "**The 'Host' Mentality:** Even if it's not your event, act like a host. Introduce people to each other. 'John, have you met Lisa? She works in Fintech.' You become the connector, the node of value. People will gravitate toward you because you make them feel comfortable.",
        pro_tip: "Never ask 'What do you do?' immediately. Ask 'What are you working on that excites you right now?' It opens up passion, not just job titles."
    },
    'Strategic Negotiation': {
        icon: '♟️',
        desc: 'Win without making enemies.',
        philosophy: "In business and life, you do not get what you deserve; you get what you negotiate. It is not about conflict, but about collaboration to expand the pie.",
        mechanics: "1. **The Anchor:** The first number spoken anchors the entire deal. Make it ambitious but defensible.\n2. **Silence:** After making an offer, shut up. The next person to speak loses leverage.\n3. **Labeling:** 'It seems like you are hesitant about the price.' Call out emotions to diffuse them.",
        advanced: "**The Ackerman Model:** Offer 65% of target, then 85%, 95%, and finally 100%. Use odd, precise numbers (e.g., $37,550) to imply calculation, not estimation.",
        pro_tip: "Never accept the first offer, even if it's good. It makes the other side feel they left money on the table. Flinch, pause, then counter."
    },
    'Golf Diplomacy': {
        icon: '⛳',
        desc: 'Business is done on the fairway.',
        philosophy: "Golf is the only sport where a CEO and an intern can play together on equal footing. It reveals character: how one handles adversity, luck, and honesty.",
        mechanics: "1. **Pace of Play:** You don't have to be good, but you must be fast. Be ready to hit when it's your turn.\n2. **Silence:** Absolute silence when others are addressing the ball.\n3. **The Green:** Never walk on someone's 'line' (the path between their ball and the hole).",
        advanced: "**Business Timing:** Never discuss business on the first few holes. Build rapport. Business happens naturally on the cart or at the 19th hole (drinks after). Let the senior person bring it up.",
        pro_tip: "If you are bad, admit it early and laugh about it. People enjoy playing with a happy loser, but they hate playing with an angry one. Cheating is the ultimate sin; if you cheat at golf, you cheat at contracts."
    },
};

export const CareerArsenal: React.FC<CareerArsenalProps> = ({ user, initialScoutData, lastSync }) => {
    // TABS
    const [activeModule, setActiveModule] = useState<'PATH' | 'HEADSHOT' | 'CV' | 'RESUME' | 'PITCH' | 'ELITE' | 'CORPORATE_OPS' | 'TRENDS'>('PATH');
    const [dailyQuote, setDailyQuote] = useState(CAREER_QUOTES[0]);
    const [mobileEditorView, setMobileEditorView] = useState<'EDIT' | 'PREVIEW'>('EDIT');
    
    // Pathfinder State
    const [careerMap, setCareerMap] = useState<CareerRoadmap | null>(null);
    const [isMapping, setIsMapping] = useState(false);
    const [riskTolerance, setRiskTolerance] = useState<'STABLE' | 'MOONSHOT'>('STABLE');
    const [manualContext, setManualContext] = useState('');
    const [liveSignal, setLiveSignal] = useState<string>("Scanning Global Markets...");

    // Headshot State
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGeneratingHeadshot, setIsGeneratingHeadshot] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState<'CORPORATE' | 'MEDICAL' | 'CREATIVE' | 'TECH'>('CORPORATE');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // CV State
    const [cvInputs, setCvInputs] = useState({
        targetRole: '',
        skills: user.skills.join(', '),
        experience: '',
        education: user.qualification || '',
        publications: '',
        awards: ''
    });
    const [cvContent, setCvContent] = useState<string | null>(null);
    const [isGeneratingCV, setIsGeneratingCV] = useState(false);
    const cvUploadRef = useRef<HTMLInputElement>(null);

    // Resume State
    const [resumeInputs, setResumeInputs] = useState({
        targetRole: '',
        skills: user.skills.join(', '),
        experience: '',
        education: user.qualification || '',
        projects: ''
    });
    const [resumeContent, setResumeContent] = useState<string | null>(null);
    const [isGeneratingResume, setIsGeneratingResume] = useState(false);
    const resumeUploadRef = useRef<HTMLInputElement>(null);

    // Pitch Deck State
    const [pitchTopic, setPitchTopic] = useState('');
    const [pitchSlides, setPitchSlides] = useState<{title: string, bullet: string}[] | null>(null);
    const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);

    // Trends / Content State
    const [trendIdea, setTrendIdea] = useState('');
    const [contentPack, setContentPack] = useState<ContentPack | null>(null);
    const [isGeneratingTrend, setIsGeneratingTrend] = useState(false);

    // Corp Ops State
    const [corpInput, setCorpInput] = useState('');
    const [corpOutput, setCorpOutput] = useState('');
    const [corpMode, setCorpMode] = useState<'EMAIL' | 'POLITE_REJECTION' | 'NEGOTIATION'>('EMAIL');
    const [isProcessingCorp, setIsProcessingCorp] = useState(false);

    // Elite Modal State
    const [activeEliteItem, setActiveEliteItem] = useState<{title: string, icon: string, desc: string} | null>(null);
    const [eliteImage, setEliteImage] = useState<string | null>(null);
    const [eliteLoading, setEliteLoading] = useState(false);
    const [eliteSearch, setEliteSearch] = useState('');
    const [assignedSkill, setAssignedSkill] = useState<string | null>(user.assignedEliteGoal || null);

    // --- PERSISTENCE ---
    useEffect(() => {
        // Load state from local storage on mount
        const savedState = localStorage.getItem('skillfi_career_state');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.cvInputs) setCvInputs(parsed.cvInputs);
                if (parsed.cvContent) setCvContent(parsed.cvContent);
                if (parsed.resumeInputs) setResumeInputs(parsed.resumeInputs);
                if (parsed.resumeContent) setResumeContent(parsed.resumeContent);
                if (parsed.careerMap) setCareerMap(parsed.careerMap);
                if (parsed.generatedImage) setGeneratedImage(parsed.generatedImage);
                if (parsed.pitchSlides) setPitchSlides(parsed.pitchSlides);
                if (parsed.pitchTopic) setPitchTopic(parsed.pitchTopic);
            } catch (e) {
                console.error("Failed to load career state", e);
            }
        }
        setDailyQuote(CAREER_QUOTES[Math.floor(Math.random() * CAREER_QUOTES.length)]);
    }, []);

    // Reset mobile view when switching tabs
    useEffect(() => {
        setMobileEditorView('EDIT');
    }, [activeModule]);

    // Instant Scout Trigger
    useEffect(() => {
        if (initialScoutData && !isMapping) {
            handlePathfinder(initialScoutData);
        }
    }, [initialScoutData]);

    // Live Signal Simulation
    useEffect(() => {
        const signals = [
            "Web3 Solidity Demand: +15% in Q4",
            "Remote DevOps Roles: Trending High",
            "AI Prompt Engineering: Salary Base $120k",
            "Cybersecurity Analysts: Critical Shortage",
            "Data Science: +8% YoY Growth"
        ];
        const interval = setInterval(() => {
            setLiveSignal(signals[Math.floor(Math.random() * signals.length)]);
        }, 5000);
        return () => clearInterval(interval);
    }, [lastSync]);

    // Auto-Save Effect
    useEffect(() => {
        const stateToSave = {
            cvInputs,
            cvContent,
            resumeInputs,
            resumeContent,
            careerMap,
            generatedImage,
            pitchSlides,
            pitchTopic
        };
        localStorage.setItem('skillfi_career_state', JSON.stringify(stateToSave));
    }, [cvInputs, cvContent, resumeInputs, resumeContent, careerMap, generatedImage, pitchSlides, pitchTopic]);

    const triggerHaptic = () => {
        if (navigator.vibrate) navigator.vibrate(15);
    };

    // --- ELITE HANDLERS ---
    const getFilteredEliteItems = () => {
        const term = eliteSearch.toLowerCase();
        return Object.entries(ELITE_DATA)
            .filter(([title, data]) => 
                title.toLowerCase().includes(term) || 
                data.desc.toLowerCase().includes(term)
            )
            .map(([title, data]) => ({
                title,
                ...data
            }));
    };

    const openEliteModal = async (item: {title: string, icon: string, desc: string}) => {
        setActiveEliteItem(item);
        setEliteImage(null);
        setEliteLoading(true);
        AudioService.playProcessing();

        try {
            const visual = await generateItemVisual(item.title + " high society luxury context cinematic lighting");
            if (visual) setEliteImage(`data:image/jpeg;base64,${visual}`);
        } catch (e) {
            console.error(e);
        } finally {
            setEliteLoading(false);
            AudioService.playSuccess();
        }
    };

    const handleAssignEliteGoal = () => {
        if (activeEliteItem) {
            setAssignedSkill(activeEliteItem.title);
            // In a real app, this would persist to user profile
            const savedUser = localStorage.getItem('skillfi_user');
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                parsed.assignedEliteGoal = activeEliteItem.title;
                localStorage.setItem('skillfi_user', JSON.stringify(parsed));
            }
            alert(`Quarterly Goal Set: Master ${activeEliteItem.title}`);
            AudioService.playSuccess();
        }
    };

    // --- DOWNLOAD HANDLERS ---
    const handleDownloadImage = (imgSrc: string, name: string) => {
        if (imgSrc) {
            const link = document.createElement('a');
            link.href = imgSrc;
            link.download = `${name}_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            AudioService.playSuccess();
        }
    };

    const handleDownloadDoc = (content: string, filename: string) => {
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header+content+footer;
        
        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = filename;
        fileDownload.click();
        document.body.removeChild(fileDownload);
        AudioService.playSuccess();
    };

    const handlePrintPDF = (elementId: string) => {
        const printContent = document.getElementById(elementId);
        if (!printContent) return;
        
        const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        if (WinPrint) {
            WinPrint.document.write('<html><head><title>Print</title>');
            // Inline tailored styles for clean print output
            WinPrint.document.write(`
                <style>
                    body { font-family: 'Times New Roman', serif; padding: 40px; color: black; background: white; }
                    h1, h2, h3 { color: #000; border-bottom: 1px solid #000; padding-bottom: 5px; margin-top: 20px; }
                    p, li { line-height: 1.5; margin-bottom: 8px; font-size: 12pt; }
                    ul { padding-left: 20px; }
                    strong { font-weight: bold; }
                    a { color: black; text-decoration: none; }
                </style>
            `);
            WinPrint.document.write('</head><body>');
            WinPrint.document.write(printContent.innerHTML);
            WinPrint.document.write('</body></html>');
            WinPrint.document.close();
            WinPrint.focus();
            setTimeout(() => {
                WinPrint.print();
                WinPrint.close();
            }, 500); // Allow time for styles to load
            AudioService.playSuccess();
        }
    };

    // --- GENERATION HANDLERS ---
    const handleGenerateCV = async () => {
        setIsGeneratingCV(true);
        AudioService.playProcessing();
        // Construct detailed context for CV
        const context = `
            Name: ${user.username}
            Email: ${user.email}
            Target Role: ${cvInputs.targetRole}
            Core Skills: ${cvInputs.skills}
            Professional Experience: ${cvInputs.experience}
            Education: ${cvInputs.education}
            Publications/Research: ${cvInputs.publications}
            Awards/Certifications: ${cvInputs.awards}
        `;
        const cv = await generateCVContent(context);
        if (cv) {
            setCvContent(cv);
            AudioService.playSuccess();
            setMobileEditorView('PREVIEW'); // Switch to preview on mobile
        }
        setIsGeneratingCV(false);
    };

    const handleGenerateResume = async () => {
        setIsGeneratingResume(true);
        AudioService.playProcessing();
        // Construct context for Resume
        const context = `
            Name: ${user.username}
            Email: ${user.email}
            Target Role: ${resumeInputs.targetRole}
            Core Skills: ${resumeInputs.skills}
            Experience: ${resumeInputs.experience}
            Education: ${resumeInputs.education}
            Key Projects: ${resumeInputs.projects}
        `;
        const resume = await generateResumeContent(context);
        if (resume) {
            setResumeContent(resume);
            AudioService.playSuccess();
            setMobileEditorView('PREVIEW'); // Switch to preview on mobile
        }
        setIsGeneratingResume(false);
    };

    const handleGeneratePitch = async () => {
        if (!pitchTopic) return;
        setIsGeneratingPitch(true);
        AudioService.playProcessing();
        const slides = await generatePitchDeck(pitchTopic);
        if (slides) {
            setPitchSlides(slides);
            AudioService.playSuccess();
        }
        setIsGeneratingPitch(false);
    };

    const handleGenerateTrend = async () => {
        if (!trendIdea) return;
        setIsGeneratingTrend(true);
        AudioService.playProcessing();
        const pack = await generateContentPack(trendIdea);
        if (pack) {
            setContentPack(pack);
            AudioService.playSuccess();
        }
        setIsGeneratingTrend(false);
    };

    const handleCorpOps = async () => {
        if (!corpInput) return;
        setIsProcessingCorp(true);
        AudioService.playProcessing();
        try {
            const chat = await initializeChat('en');
            let prompt = `Rewrite the following text to be `;
            if (corpMode === 'EMAIL') prompt += "a professional, concise corporate email.";
            if (corpMode === 'POLITE_REJECTION') prompt += "a polite, firm, but professional rejection or 'no'.";
            if (corpMode === 'NEGOTIATION') prompt += "a strategic negotiation counter-offer, firm but collaborative.";
            
            prompt += `\n\nInput Text: "${corpInput}"`;
            
            const result = await sendMessageToSkillfi(chat, prompt);
            setCorpOutput(result);
            AudioService.playSuccess();
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessingCorp(false);
        }
    };
    
    const handlePathfinder = async (overrideContext?: string) => {
        setIsMapping(true);
        try {
            // Prioritize manual input, then user profile, then fallback
            const finalAge = user.age || "Not specified";
            const finalType = user.userType || "Professional";
            const finalSkills = (user.skills && user.skills.length > 0) ? user.skills.join(', ') : "General";
            
            const context = `
                User Profile Analysis Request:
                - Age: ${finalAge}
                - User Type: ${finalType}
                - Qualification: ${user.qualification || 'Unknown'}
                - Current Skills: ${finalSkills}
                - Tech Savvy: ${user.isTechie ? 'Yes' : 'No'}
                - Desired Strategy: ${riskTolerance} (Stable means low risk, corporate. Moonshot means high risk, startup/crypto).
                - Additional Hobbies/Interests: ${overrideContext || manualContext || 'None provided'}
                
                Note to AI: If profile data is generic, infer likely roles based on 'User Type' and 'Strategy'. 
                Resolve any gaps by suggesting paths that fit the 'User Type'.
            `;
            
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

    const handleProofreadUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'CV' | 'RESUME') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (type === 'CV') setIsGeneratingCV(true);
        else setIsGeneratingResume(true);
        
        AudioService.playProcessing();

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                const base64Data = base64String.split(',')[1]; 
                
                const result = await proofreadDocument(base64Data, file.type, type);
                
                if (result) {
                    if (type === 'CV') setCvContent(result);
                    else setResumeContent(result);
                    AudioService.playSuccess();
                    setMobileEditorView('PREVIEW');
                } else {
                    AudioService.playAlert();
                    alert("Could not analyze document. Please ensure it is a PDF or Image.");
                }
                
                if (type === 'CV') setIsGeneratingCV(false);
                else setIsGeneratingResume(false);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error(err);
            if (type === 'CV') setIsGeneratingCV(false);
            else setIsGeneratingResume(false);
        }
    };

    const getEliteContent = (title: string) => {
        return ELITE_DATA[title] || { philosophy: "Loading...", mechanics: "...", advanced: "...", pro_tip: "..." };
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans pb-24 touch-pan-y">
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tighter kinetic-type">
                        Career Toolkit<span className="text-skillfi-neon">.</span>
                    </h1>
                </div>
                <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Plan, Build, and Refine.</p>
            </header>

            {/* Navigation Tabs - Sticky */}
            <div className="sticky top-0 z-30 bg-skillfi-bg/95 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-white/5 mb-8">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'PATH', label: 'Pathfinder' },
                        { id: 'CORPORATE_OPS', label: 'Corp Ops' },
                        { id: 'TRENDS', label: 'Trend Radar' },
                        { id: 'RESUME', label: 'Resume' },
                        { id: 'CV', label: 'CV (Academic)' },
                        { id: 'PITCH', label: 'Pitch Deck' },
                        { id: 'HEADSHOT', label: 'Pro Photo' },
                        { id: 'ELITE', label: 'Elite Class' },
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
            </div>

            {/* --- PATHFINDER --- */}
            {activeModule === 'PATH' && (
                 <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Path UI */}
                    <div className="glass-panel p-6 rounded-2xl h-fit">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Role Generator</h2>
                                <p className="text-xs text-gray-500">Assigning specific career roles based on profile.</p>
                            </div>
                            
                            {/* Live Signal Ticker */}
                            <div className="hidden md:block bg-black/40 border border-skillfi-neon/30 rounded-lg px-3 py-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-skillfi-neon animate-pulse"></span>
                                    <span className="text-[10px] font-mono text-skillfi-neon uppercase tracking-wide">{liveSignal}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Profile Summary Card */}
                            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Detected Profile</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[10px] text-gray-500">Age</div>
                                        <div className="text-white font-bold">{user.age || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-500">Type</div>
                                        <div className="text-white font-bold">{user.userType || 'N/A'}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-[10px] text-gray-500">Core Skills</div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {(user.skills && user.skills.length > 0) ? user.skills.map(s => (
                                                <span key={s} className="bg-skillfi-neon/10 text-skillfi-neon text-[9px] px-1.5 py-0.5 rounded border border-skillfi-neon/20">{s}</span>
                                            )) : <span className="text-gray-600 text-xs">General / Not Listed</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Context */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Hobbies & Interests (Optional)</label>
                                <textarea 
                                    value={manualContext}
                                    onChange={(e) => setManualContext(e.target.value)}
                                    placeholder="e.g. I like drawing, gaming, and solving puzzles..."
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white text-xs h-20 outline-none focus:border-skillfi-neon"
                                />
                            </div>

                            {/* Strategy Toggle */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Career Strategy</label>
                                <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl">
                                    <button 
                                        onClick={() => setRiskTolerance('STABLE')}
                                        className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${riskTolerance === 'STABLE' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        🛡️ Safe Path
                                    </button>
                                    <button 
                                        onClick={() => setRiskTolerance('MOONSHOT')}
                                        className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${riskTolerance === 'MOONSHOT' ? 'bg-skillfi-neon text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        🚀 Bold Path
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={() => handlePathfinder()}
                                disabled={isMapping}
                                className="w-full py-4 bg-gradient-to-r from-skillfi-neon to-yellow-500 text-black font-bold uppercase rounded-xl hover:shadow-[0_0_20px_#D4AF37] transition-all text-xs tracking-widest mt-2 flex items-center justify-center gap-2"
                            >
                                {isMapping ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                        Computing...
                                    </>
                                ) : 'Generate Roles'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/10 flex flex-col">
                         {careerMap ? (
                            <div className="space-y-6 animate-fade-in">
                                <div className="border-b border-white/10 pb-4">
                                     <h3 className="text-skillfi-neon font-bold font-display text-lg mb-1">Strategic Analysis</h3>
                                     <p className="text-gray-400 text-xs italic">"{careerMap.advice}"</p>
                                </div>

                                {/* $CF Score & Gap Analysis */}
                                <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-6 items-center">
                                    <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className={`${careerMap.fitScore >= 85 ? 'text-green-500' : 'text-yellow-500'} transition-all duration-1000`} strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * careerMap.fitScore) / 100} />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-xl font-bold text-white">{careerMap.fitScore}</span>
                                            <span className="text-[8px] text-gray-500 font-mono">$CF INDEX</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full">
                                        <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">
                                            {careerMap.fitScore >= 85 ? "Career Fit: Optimized" : "Path to 85 (Gap Analysis)"}
                                        </h4>
                                        <ul className="space-y-1">
                                            {careerMap.gapAnalysis?.map((gap, i) => (
                                                <li key={i} className="text-[10px] text-gray-400 flex items-center gap-2">
                                                    <span className="text-red-500">⚠</span> {gap}
                                                </li>
                                            )) || <li className="text-[10px] text-gray-500">No gaps detected.</li>}
                                        </ul>
                                    </div>
                                </div>

                                {/* Traditional Role Card */}
                                <div className="bg-white/5 p-5 rounded-xl border-l-4 border-blue-500 hover:bg-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-lg font-bold text-white uppercase">{careerMap.web2.role}</div>
                                        <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">TRADITIONAL</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {careerMap.web2.skills.map((s, i) => <span key={i} className="text-[9px] text-gray-400 bg-black/30 px-1.5 rounded">{s}</span>)}
                                    </div>
                                    <div className="text-xs bg-black/30 p-3 rounded text-white font-mono border border-white/5 mb-3">➤ {careerMap.web2.action}</div>
                                    
                                    {/* Global Salaries */}
                                    <div className="bg-blue-900/10 p-3 rounded-lg border border-blue-500/20">
                                        <div className="text-[10px] text-blue-300 font-bold uppercase mb-2">
                                            Global Salary Intelligence
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {careerMap.web2.salaries?.map((item, idx) => (
                                                <div key={idx} className="text-[9px] text-gray-300 bg-black/40 px-2 py-1.5 rounded border border-white/5 flex justify-between items-center">
                                                    <span className="text-gray-500 font-bold uppercase">{item.country}</span>
                                                    <span className="text-white font-mono">{item.amount}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Web3 Role Card */}
                                <div className="bg-white/5 p-5 rounded-xl border-l-4 border-purple-500 hover:bg-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-lg font-bold text-white uppercase">{careerMap.web3.role}</div>
                                        <span className="text-[9px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30">WEB3</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {careerMap.web3.skills.map((s, i) => <span key={i} className="text-[9px] text-gray-400 bg-black/30 px-1.5 rounded">{s}</span>)}
                                    </div>
                                    <div className="text-xs bg-black/30 p-3 rounded text-white font-mono border border-white/5 mb-3">➤ {careerMap.web3.action}</div>

                                    {/* Global Salaries */}
                                    <div className="bg-purple-900/10 p-3 rounded-lg border border-purple-500/20">
                                        <div className="text-[10px] text-purple-300 font-bold uppercase mb-2">
                                            Global Salary Intelligence
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {careerMap.web3.salaries?.map((item, idx) => (
                                                <div key={idx} className="text-[9px] text-gray-300 bg-black/40 px-2 py-1.5 rounded border border-white/5 flex justify-between items-center">
                                                    <span className="text-gray-500 font-bold uppercase">{item.country}</span>
                                                    <span className="text-white font-mono">{item.amount}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                         ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600 min-h-[300px]">
                                <div className="text-5xl mb-4 opacity-20">🗺️</div>
                                <p className="text-xs uppercase tracking-widest">Awaiting Command</p>
                            </div>
                         )}
                    </div>
                </div>
            )}

            {/* --- CORPORATE OPS --- */}
            {activeModule === 'CORPORATE_OPS' && (
                <div className="animate-fade-in grid grid-cols-1 gap-8">
                    <div className="glass-panel p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Corporate Translator</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Input (Rough Draft)</label>
                                <textarea 
                                    value={corpInput}
                                    onChange={(e) => setCorpInput(e.target.value)}
                                    placeholder="e.g., 'I can't do this right now, I'm busy.'"
                                    className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-skillfi-neon h-40 resize-none text-sm"
                                />
                                <div className="flex gap-2 bg-white/5 p-2 rounded-xl">
                                    {(['EMAIL', 'POLITE_REJECTION', 'NEGOTIATION'] as const).map(mode => (
                                        <button
                                            key={mode}
                                            onClick={() => setCorpMode(mode)}
                                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${corpMode === mode ? 'bg-skillfi-neon text-black' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            {mode.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    onClick={handleCorpOps}
                                    disabled={isProcessingCorp || !corpInput}
                                    className="w-full bg-white text-black py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-skillfi-neon transition-all"
                                >
                                    {isProcessingCorp ? 'Translating...' : 'Translate to Corporate'}
                                </button>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Output (Professional)</label>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-xl h-full min-h-[200px] text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                                    {corpOutput || <span className="text-gray-600 italic">Output will appear here...</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TREND RADAR --- */}
            {activeModule === 'TRENDS' && (
                <div className="animate-fade-in max-w-4xl mx-auto">
                    <div className="glass-panel p-6 rounded-2xl mb-8">
                        <h2 className="text-xl font-bold text-white mb-2">Trend Viral Strategist</h2>
                        <p className="text-xs text-gray-500 mb-6">Convert any idea into a multi-platform content strategy.</p>
                        
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                value={trendIdea}
                                onChange={(e) => setTrendIdea(e.target.value)}
                                placeholder="Enter topic (e.g. AI Agents in Finance)"
                                className="flex-1 bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-skillfi-neon text-sm"
                            />
                            <button 
                                onClick={handleGenerateTrend}
                                disabled={isGeneratingTrend || !trendIdea}
                                className="bg-purple-600 hover:bg-purple-500 text-white px-8 rounded-xl font-bold uppercase text-xs tracking-widest transition-all"
                            >
                                {isGeneratingTrend ? 'Generating...' : 'Create Strategy'}
                            </button>
                        </div>
                    </div>

                    {contentPack && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                            <div className="bg-[#0077b5]/10 border border-[#0077b5]/30 p-5 rounded-xl">
                                <h3 className="text-[#0077b5] font-bold text-sm uppercase tracking-widest mb-3">LinkedIn</h3>
                                <p className="text-gray-200 text-xs leading-relaxed whitespace-pre-wrap">{contentPack.linkedin}</p>
                            </div>
                            <div className="bg-[#1da1f2]/10 border border-[#1da1f2]/30 p-5 rounded-xl">
                                <h3 className="text-[#1da1f2] font-bold text-sm uppercase tracking-widest mb-3">Twitter Thread</h3>
                                <ul className="space-y-4">
                                    {contentPack.twitter.map((tweet, i) => (
                                        <li key={i} className="text-gray-200 text-xs border-b border-white/5 pb-2 last:border-0">{tweet}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-[#ff0050]/10 border border-[#ff0050]/30 p-5 rounded-xl">
                                <h3 className="text-[#ff0050] font-bold text-sm uppercase tracking-widest mb-3">TikTok Script</h3>
                                <p className="text-gray-200 text-xs leading-relaxed whitespace-pre-wrap">{contentPack.tiktok}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- RESUME --- */}
            {activeModule === 'RESUME' && (
                <div className="animate-fade-in flex flex-col lg:grid lg:grid-cols-2 gap-8 h-full">
                    {/* Mobile View Toggle */}
                    <div className="lg:hidden flex mb-4 bg-white/5 p-1 rounded-xl">
                        <button 
                            onClick={() => setMobileEditorView('EDIT')} 
                            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${mobileEditorView === 'EDIT' ? 'bg-skillfi-neon text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Editor
                        </button>
                        <button 
                            onClick={() => setMobileEditorView('PREVIEW')} 
                            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${mobileEditorView === 'PREVIEW' ? 'bg-skillfi-neon text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Preview
                        </button>
                    </div>

                    <div className={`space-y-6 overflow-y-auto pr-2 ${mobileEditorView === 'PREVIEW' ? 'hidden lg:block' : 'block'}`}>
                        <div className="glass-panel p-6 rounded-2xl">
                            <h2 className="text-xl font-bold text-white mb-4">Resume Builder</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Target Role</label>
                                    <input 
                                        type="text" 
                                        value={resumeInputs.targetRole}
                                        onChange={(e) => setResumeInputs({...resumeInputs, targetRole: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-white text-sm outline-none focus:border-skillfi-neon mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Experience Summary</label>
                                    <textarea 
                                        value={resumeInputs.experience}
                                        onChange={(e) => setResumeInputs({...resumeInputs, experience: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-white text-sm outline-none focus:border-skillfi-neon mt-1 h-32"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={handleGenerateResume}
                                        disabled={isGeneratingResume}
                                        className="bg-white text-black font-bold py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-skillfi-neon transition-all"
                                    >
                                        {isGeneratingResume ? 'Drafting...' : 'Generate Resume'}
                                    </button>
                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            ref={resumeUploadRef}
                                            onChange={(e) => handleProofreadUpload(e, 'RESUME')}
                                            className="hidden"
                                            accept=".pdf,image/*"
                                        />
                                        <button 
                                            onClick={() => resumeUploadRef.current?.click()}
                                            className="w-full bg-white/10 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                                        >
                                            Upload to Polish
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`bg-white text-black p-8 rounded-xl shadow-2xl overflow-y-auto h-[600px] relative font-serif ${mobileEditorView === 'EDIT' ? 'hidden lg:block' : 'block'}`} id="resume-preview">
                        {resumeContent ? (
                            <div dangerouslySetInnerHTML={{ __html: resumeContent }} className="prose prose-sm max-w-none" />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
                                Preview Area
                            </div>
                        )}
                        {resumeContent && (
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button onClick={() => handleDownloadDoc(resumeContent, 'resume.doc')} className="bg-black text-white px-3 py-1 rounded text-[10px] font-bold uppercase">DOC</button>
                                <button onClick={() => handlePrintPDF('resume-preview')} className="bg-black text-white px-3 py-1 rounded text-[10px] font-bold uppercase">PDF</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- CV (ACADEMIC) --- */}
            {activeModule === 'CV' && (
                <div className="animate-fade-in flex flex-col lg:grid lg:grid-cols-2 gap-8 h-full">
                    {/* Mobile View Toggle */}
                    <div className="lg:hidden flex mb-4 bg-white/5 p-1 rounded-xl">
                        <button 
                            onClick={() => setMobileEditorView('EDIT')} 
                            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${mobileEditorView === 'EDIT' ? 'bg-skillfi-neon text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Editor
                        </button>
                        <button 
                            onClick={() => setMobileEditorView('PREVIEW')} 
                            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${mobileEditorView === 'PREVIEW' ? 'bg-skillfi-neon text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Preview
                        </button>
                    </div>

                    <div className={`space-y-6 overflow-y-auto pr-2 ${mobileEditorView === 'PREVIEW' ? 'hidden lg:block' : 'block'}`}>
                        <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-blue-500">
                            <h2 className="text-xl font-bold text-white mb-4">Academic CV</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Research / Publications</label>
                                    <textarea 
                                        value={cvInputs.publications}
                                        onChange={(e) => setCvInputs({...cvInputs, publications: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-white text-sm outline-none focus:border-blue-500 mt-1 h-32"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={handleGenerateCV}
                                        disabled={isGeneratingCV}
                                        className="bg-blue-600 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-blue-500 transition-all"
                                    >
                                        {isGeneratingCV ? 'Compiling...' : 'Generate CV'}
                                    </button>
                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            ref={cvUploadRef}
                                            onChange={(e) => handleProofreadUpload(e, 'CV')}
                                            className="hidden"
                                            accept=".pdf,image/*"
                                        />
                                        <button 
                                            onClick={() => cvUploadRef.current?.click()}
                                            className="w-full bg-white/10 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                                        >
                                            Upload to Fix
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`bg-white text-black p-8 rounded-xl shadow-2xl overflow-y-auto h-[600px] relative font-serif ${mobileEditorView === 'EDIT' ? 'hidden lg:block' : 'block'}`} id="cv-preview">
                        {cvContent ? (
                            <div dangerouslySetInnerHTML={{ __html: cvContent }} className="prose prose-sm max-w-none" />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
                                Academic Preview Area
                            </div>
                        )}
                        {cvContent && (
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button onClick={() => handleDownloadDoc(cvContent, 'cv.doc')} className="bg-black text-white px-3 py-1 rounded text-[10px] font-bold uppercase">DOC</button>
                                <button onClick={() => handlePrintPDF('cv-preview')} className="bg-black text-white px-3 py-1 rounded text-[10px] font-bold uppercase">PDF</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- PITCH DECK --- */}
            {activeModule === 'PITCH' && (
                <div className="animate-fade-in max-w-5xl mx-auto">
                    <div className="glass-panel p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full">
                            <h2 className="text-xl font-bold text-white mb-2">Pitch Deck Builder</h2>
                            <input 
                                type="text" 
                                value={pitchTopic}
                                onChange={(e) => setPitchTopic(e.target.value)}
                                placeholder="Describe your startup idea (e.g. Uber for Dog Walking)"
                                className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-skillfi-neon text-sm"
                            />
                        </div>
                        <button 
                            onClick={handleGeneratePitch}
                            disabled={isGeneratingPitch || !pitchTopic}
                            className="bg-white text-black px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-skillfi-neon transition-all md:mt-8 w-full md:w-auto"
                        >
                            {isGeneratingPitch ? 'Structuring...' : 'Build Deck'}
                        </button>
                    </div>

                    {pitchSlides && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                            {pitchSlides.map((slide, i) => (
                                <div key={i} className="bg-white text-black aspect-video p-6 rounded-lg shadow-xl flex flex-col justify-center relative overflow-hidden group hover:scale-105 transition-transform">
                                    <div className="absolute top-2 left-2 text-[10px] font-bold text-gray-400">SLIDE 0{i+1}</div>
                                    <h3 className="text-lg font-bold mb-2 font-display uppercase">{slide.title}</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">{slide.bullet}</p>
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-skillfi-neon"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* --- HEADSHOT --- */}
            {activeModule === 'HEADSHOT' && (
                <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-panel p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-6">AI Headshot Studio</h2>
                        
                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-skillfi-neon transition-colors cursor-pointer relative" onClick={() => fileInputRef.current?.click()}>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                {originalImage ? (
                                    <img src={originalImage} alt="Upload" className="max-h-48 mx-auto rounded-lg shadow-lg" />
                                ) : (
                                    <div className="text-gray-500">
                                        <div className="text-4xl mb-2">📸</div>
                                        <p className="text-xs uppercase tracking-widest">Upload Selfie</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">Style</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['CORPORATE', 'MEDICAL', 'CREATIVE', 'TECH'] as const).map(style => (
                                        <button 
                                            key={style}
                                            onClick={() => setSelectedStyle(style)}
                                            className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${selectedStyle === style ? 'bg-skillfi-neon text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={handleGenerateHeadshot}
                                disabled={isGeneratingHeadshot || !originalImage}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:shadow-lg transition-all"
                            >
                                {isGeneratingHeadshot ? 'Processing...' : 'Generate Pro Headshot'}
                            </button>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex items-center justify-center bg-black/40 border border-white/10 relative overflow-hidden group">
                        {generatedImage ? (
                            <div className="relative w-full h-full max-h-[500px]">
                                <img src={generatedImage} alt="Generated Headshot" className="w-full h-full object-contain rounded-xl shadow-2xl" />
                                <button 
                                    onClick={() => handleDownloadImage(generatedImage!, 'headshot')}
                                    className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-full text-xs font-bold uppercase shadow-lg hover:scale-105 transition-transform"
                                >
                                    Download HD
                                </button>
                            </div>
                        ) : (
                            <div className="text-center text-gray-600">
                                <div className="text-6xl mb-4 opacity-20">🖼️</div>
                                <p className="text-xs uppercase tracking-widest">Result Area</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* --- ELITE MODULE --- */}
            {activeModule === 'ELITE' && (
                <div className="animate-fade-in relative space-y-6">
                    {/* Header with Assigned Goal */}
                    <div className="flex justify-between items-center">
                        <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center gap-3 relative flex-1 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                            <input 
                                type="text" 
                                placeholder="Search high-value skills..." 
                                value={eliteSearch}
                                onChange={(e) => setEliteSearch(e.target.value)}
                                className="bg-transparent w-full text-white outline-none placeholder-gray-500 text-sm"
                            />
                        </div>
                        {assignedSkill && (
                            <div className="bg-skillfi-neon/10 border border-skillfi-neon/30 px-4 py-2 rounded-xl">
                                <span className="text-[9px] text-skillfi-neon font-bold uppercase block">Quarterly Goal</span>
                                <span className="text-white font-bold text-xs">{assignedSkill}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {getFilteredEliteItems().map((item, i) => (
                            <div 
                                key={i}
                                onClick={() => openEliteModal(item)}
                                className="glass-panel p-6 rounded-2xl border-t-4 border-t-skillfi-neon hover:bg-white/5 transition-all cursor-pointer group hover:scale-[1.02] active:scale-95"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                                <h3 className="font-bold text-white text-lg">{item.title}</h3>
                                <p className="text-gray-400 text-xs mt-2 line-clamp-2">{item.desc}</p>
                                <div className="mt-4 text-[10px] text-skillfi-neon font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to Learn
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {getFilteredEliteItems().length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            <p>No elite skills found matching "{eliteSearch}".</p>
                        </div>
                    )}

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
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={handleAssignEliteGoal}
                                            className="bg-white/10 hover:bg-skillfi-neon hover:text-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border border-white/10"
                                        >
                                            Assign as Goal
                                        </button>
                                        <button className="text-gray-500 hover:text-white bg-white/5 p-2 rounded-full hover:bg-white/20 transition-all" onClick={() => setActiveEliteItem(null)}>✕</button>
                                    </div>
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
                                                    {/* Download Button for Generated Image */}
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDownloadImage(eliteImage!, activeEliteItem.title); }}
                                                        className="absolute top-4 right-4 bg-white/20 hover:bg-white text-white hover:text-black p-2 rounded-full backdrop-blur-md transition-all"
                                                        title="Download Visual"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3-3m0 0l3-3m-3 3h7.5" transform="rotate(-90 12 12)" />
                                                        </svg>
                                                    </button>
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
        </div>
    );
};
