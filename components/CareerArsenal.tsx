import React, { useState, useRef, useEffect } from 'react';
import { generateProfessionalHeadshot, generatePitchDeck, generateCVContent, generateResumeContent, generateCareerRoadmap, generateItemVisual, CareerRoadmap } from '../services/geminiService';
import { AudioService } from '../services/audioService';
import { UserProfile } from '../types';

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
};

export const CareerArsenal: React.FC<CareerArsenalProps> = ({ user }) => {
    // TABS
    const [activeModule, setActiveModule] = useState<'PATH' | 'HEADSHOT' | 'CV' | 'RESUME' | 'PITCH' | 'ELITE'>('PATH');
    const [dailyQuote, setDailyQuote] = useState(CAREER_QUOTES[0]);
    
    // Pathfinder State
    const [careerMap, setCareerMap] = useState<CareerRoadmap | null>(null);
    const [isMapping, setIsMapping] = useState(false);
    const [riskTolerance, setRiskTolerance] = useState<'STABLE' | 'MOONSHOT'>('STABLE');

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

    // Pitch Deck State
    const [pitchTopic, setPitchTopic] = useState('');
    const [pitchSlides, setPitchSlides] = useState<{title: string, bullet: string}[] | null>(null);
    const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);

    // Elite Modal State
    const [activeEliteItem, setActiveEliteItem] = useState<{title: string, icon: string, desc: string} | null>(null);
    const [eliteImage, setEliteImage] = useState<string | null>(null);
    const [eliteLoading, setEliteLoading] = useState(false);

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
    const eliteItems = [
        { title: 'Dining Etiquette', icon: '🍽️', desc: 'Master the art of the business dinner.' },
        { title: 'Networking', icon: '🤝', desc: 'How to enter a room and remember names.' },
    ];

    const openEliteModal = async (item: typeof eliteItems[0]) => {
        setActiveEliteItem(item);
        setEliteImage(null);
        setEliteLoading(true);
        AudioService.playProcessing();

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

    const handleDownloadDoc = (content: string | null, filename: string) => {
        if (content) {
            const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Document</title></head><body>";
            const footer = "</body></html>";
            const sourceHTML = header + content + footer;
            
            const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
            const fileDownload = document.createElement("a");
            document.body.appendChild(fileDownload);
            fileDownload.href = source;
            fileDownload.download = filename;
            fileDownload.click();
            document.body.removeChild(fileDownload);
            AudioService.playSuccess();
        }
    };

    const handlePrintPDF = (elementId: string) => {
        const printContent = document.getElementById(elementId);
        if (printContent) {
            const win = window.open('', '', 'height=800,width=800');
            if (win) {
                win.document.write('<html><head><title>Print Preview</title>');
                // Inject simple CSS for printing
                win.document.write(`
                    <style>
                        body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #000; line-height: 1.6; }
                        h1 { font-size: 24px; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                        h2 { font-size: 18px; text-transform: uppercase; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                        p { margin-bottom: 10px; font-size: 14px; }
                        ul { margin-bottom: 10px; padding-left: 20px; }
                        li { font-size: 14px; margin-bottom: 5px; }
                    </style>
                `);
                win.document.write('</head><body>');
                win.document.write(printContent.innerHTML);
                win.document.write('</body></html>');
                win.document.close();
                win.focus();
                win.print();
            }
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
    
    const handlePathfinder = async () => {
        setIsMapping(true);
        try {
            const context = `
                User Profile:
                - Age: ${user.age || 'Unknown'}
                - User Type: ${user.userType || 'Professional'}
                - Qualification: ${user.qualification || 'Unknown'}
                - Current Skills: ${user.skills.join(', ') || 'General'}
                - Tech Savvy: ${user.isTechie ? 'Yes' : 'No'}
                - Desired Strategy: ${riskTolerance} (Stable means low risk, corporate. Moonshot means high risk, startup/crypto).
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

    const getEliteContent = (title: string) => {
        return ELITE_KNOWLEDGE_BASE[title] || { philosophy: "Loading...", mechanics: "...", advanced: "...", pro_tip: "..." };
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans scrollbar-hide pb-24 touch-pan-y">
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tighter kinetic-type">
                        Career Arsenal<span className="text-skillfi-neon">.</span>
                    </h1>
                </div>
                <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Plan, Build, and Refine.</p>
            </header>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-8 border-b border-white/10 pb-1 overflow-x-auto scrollbar-hide">
                {[
                    { id: 'PATH', label: 'Pathfinder' },
                    { id: 'RESUME', label: 'Resume' },
                    { id: 'CV', label: 'CV (Academic)' },
                    { id: 'PITCH', label: 'Pitch Deck' },
                    { id: 'HEADSHOT', label: 'Pro Photo' },
                    { id: 'ELITE', label: 'High Society' },
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

            {/* --- RESUME BUILDER --- */}
            {activeModule === 'RESUME' && (
                <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl h-fit overflow-y-auto max-h-[700px]">
                        <h2 className="text-xl font-bold text-white mb-2">Resume Builder</h2>
                        <p className="text-xs text-gray-400 mb-6">Corporate focus. Concise & Results-Driven.</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Target Role</label>
                                <input 
                                    type="text" 
                                    value={resumeInputs.targetRole}
                                    onChange={(e) => setResumeInputs({...resumeInputs, targetRole: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1 text-sm focus:border-skillfi-neon outline-none transition-colors"
                                    placeholder="e.g. Product Manager"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Education</label>
                                <input 
                                    type="text" 
                                    value={resumeInputs.education}
                                    onChange={(e) => setResumeInputs({...resumeInputs, education: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1 text-sm focus:border-skillfi-neon outline-none transition-colors"
                                    placeholder="MBA, Harvard (2022)"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Skills (Comma Separated)</label>
                                <textarea 
                                    value={resumeInputs.skills}
                                    onChange={(e) => setResumeInputs({...resumeInputs, skills: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1 text-sm h-20 focus:border-skillfi-neon outline-none transition-colors"
                                    placeholder="Agile, SQL, Strategy..."
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Professional Experience</label>
                                <textarea 
                                    value={resumeInputs.experience}
                                    onChange={(e) => setResumeInputs({...resumeInputs, experience: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1 text-sm h-32 focus:border-skillfi-neon outline-none transition-colors"
                                    placeholder="Role - Company (Year)&#10;- Increased revenue by 20%&#10;- Led team of 10"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Key Projects</label>
                                <textarea 
                                    value={resumeInputs.projects}
                                    onChange={(e) => setResumeInputs({...resumeInputs, projects: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1 text-sm h-20 focus:border-skillfi-neon outline-none transition-colors"
                                    placeholder="Launched mobile app with 10k users..."
                                />
                            </div>
                            <button 
                                onClick={handleGenerateResume}
                                disabled={isGeneratingResume}
                                className="w-full py-3 bg-skillfi-neon text-black font-bold uppercase rounded-xl hover:bg-white transition-all shadow-lg text-xs tracking-widest mt-2 flex items-center justify-center gap-2"
                            >
                                {isGeneratingResume ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                        Compiling Resume...
                                    </>
                                ) : 'Generate Resume'}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 glass-panel p-0 rounded-2xl min-h-[600px] overflow-hidden relative flex flex-col bg-white border-2 border-white/5">
                        <div className="bg-gray-100 p-2 border-b flex justify-between items-center px-4">
                            <span className="text-xs font-bold text-gray-500 uppercase">Resume Preview</span>
                            <div className="flex gap-2">
                                {resumeContent && (
                                    <>
                                        <button className="bg-gray-800 text-white px-3 py-1.5 rounded shadow text-xs font-bold uppercase hover:bg-black transition-colors" onClick={() => handlePrintPDF('resume-preview')}>
                                            Print / PDF
                                        </button>
                                        <button className="bg-blue-600 text-white px-3 py-1.5 rounded shadow text-xs font-bold uppercase hover:bg-blue-700 transition-colors" onClick={() => handleDownloadDoc(resumeContent, 'Resume.doc')}>
                                            Word (.doc)
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8 bg-white text-gray-900">
                            {resumeContent ? (
                                <div id="resume-preview" className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{__html: resumeContent}}></div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <div className="text-6xl mb-4 opacity-20">📄</div>
                                    <p className="text-sm font-medium">Drafting Corporate Profile...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- CV BUILDER --- */}
            {activeModule === 'CV' && (
                <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl h-fit overflow-y-auto max-h-[700px]">
                        <h2 className="text-xl font-bold text-white mb-2">CV Builder</h2>
                        <p className="text-xs text-gray-400 mb-6">Academic & Comprehensive. Detail-Oriented.</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Target Role / Position</label>
                                <input 
                                    type="text" 
                                    value={cvInputs.targetRole}
                                    onChange={(e) => setCvInputs({...cvInputs, targetRole: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1 text-sm focus:border-skillfi-neon outline-none transition-colors"
                                    placeholder="e.g. Research Fellow"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Education & Honors</label>
                                <textarea 
                                    value={cvInputs.education}
                                    onChange={(e) => setCvInputs({...cvInputs, education: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1 text-sm h-20 focus:border-skillfi-neon outline-none transition-colors"
                                    placeholder="PhD, MIT (2020) - Thesis on AI Ethics..."
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Professional History</label>
                                <textarea 
                                    value={cvInputs.experience}
                                    onChange={(e) => setCvInputs({...cvInputs, experience: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1 text-sm h-24 focus:border-skillfi-neon outline-none transition-colors"
                                    placeholder="Senior Lecturer - Oxford (2018-2022)..."
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Publications & Research</label>
                                <textarea 
                                    value={cvInputs.publications}
                                    onChange={(e) => setCvInputs({...cvInputs, publications: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1 text-sm h-24 focus:border-skillfi-neon outline-none transition-colors"
                                    placeholder="List key papers, journals, or books..."
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Awards & Certifications</label>
                                <textarea 
                                    value={cvInputs.awards}
                                    onChange={(e) => setCvInputs({...cvInputs, awards: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-white mt-1 text-sm h-16 focus:border-skillfi-neon outline-none transition-colors"
                                    placeholder="Nobel Prize, PMP Certification..."
                                />
                            </div>
                            <button 
                                onClick={handleGenerateCV}
                                disabled={isGeneratingCV}
                                className="w-full py-3 bg-skillfi-neon text-black font-bold uppercase rounded-xl hover:bg-white transition-all shadow-lg text-xs tracking-widest mt-2 flex items-center justify-center gap-2"
                            >
                                {isGeneratingCV ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                        Compiling CV...
                                    </>
                                ) : 'Generate Academic CV'}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 glass-panel p-0 rounded-2xl min-h-[600px] overflow-hidden relative flex flex-col bg-white border-2 border-white/5">
                        <div className="bg-gray-100 p-2 border-b flex justify-between items-center px-4">
                            <span className="text-xs font-bold text-gray-500 uppercase">CV Preview</span>
                            <div className="flex gap-2">
                                {cvContent && (
                                    <>
                                        <button className="bg-gray-800 text-white px-3 py-1.5 rounded shadow text-xs font-bold uppercase hover:bg-black transition-colors" onClick={() => handlePrintPDF('cv-preview')}>
                                            Print / PDF
                                        </button>
                                        <button className="bg-blue-600 text-white px-3 py-1.5 rounded shadow text-xs font-bold uppercase hover:bg-blue-700 transition-colors" onClick={() => handleDownloadDoc(cvContent, 'CV.doc')}>
                                            Word (.doc)
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8 bg-white text-gray-900">
                            {cvContent ? (
                                <div id="cv-preview" className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{__html: cvContent}}></div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <div className="text-6xl mb-4 opacity-20">🎓</div>
                                    <p className="text-sm font-medium">Drafting Academic Record...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- PITCH DECK --- */}
            {activeModule === 'PITCH' && (
                <div className="animate-fade-in grid grid-cols-1 gap-8">
                    <div className="glass-panel p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Pitch Deck Generator</h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input 
                                type="text" 
                                value={pitchTopic} 
                                onChange={(e) => setPitchTopic(e.target.value)}
                                placeholder="Describe your business idea (e.g. Uber for Dog Walkers)..."
                                className="flex-1 bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-skillfi-neon transition-colors"
                            />
                            <button 
                                onClick={handleGeneratePitch}
                                disabled={isGeneratingPitch}
                                className="bg-skillfi-neon text-black px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-white transition-all whitespace-nowrap shadow-lg flex items-center justify-center gap-2"
                            >
                                {isGeneratingPitch ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                        Thinking...
                                    </>
                                ) : 'Generate Slides'}
                            </button>
                        </div>
                    </div>

                    {pitchSlides && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pitchSlides.map((slide, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl shadow-lg border-t-8 border-skillfi-neon relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                    <div className="absolute top-2 right-4 text-6xl text-gray-100 font-black pointer-events-none select-none">{idx + 1}</div>
                                    <h3 className="text-black font-bold text-lg mb-4 relative z-10 pr-8">{slide.title}</h3>
                                    <p className="text-gray-600 text-sm relative z-10 font-medium leading-relaxed">{slide.bullet}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* --- HEADSHOT --- */}
            {activeModule === 'HEADSHOT' && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                    <div className="glass-panel p-6 rounded-2xl h-fit">
                        <h2 className="text-xl font-bold text-white mb-4">Professional Photo Studio</h2>
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
                            <button onClick={handleGenerateHeadshot} disabled={!originalImage || isGeneratingHeadshot} className="w-full py-4 font-bold text-sm tracking-widest uppercase rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 bg-skillfi-neon text-black hover:bg-white disabled:bg-white/5 disabled:text-gray-600">
                                {isGeneratingHeadshot ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                        PROCESSING...
                                    </>
                                ) : 'CREATE PHOTO'}
                            </button>
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
                                {isGeneratingHeadshot && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                        <div className="w-12 h-12 border-4 border-skillfi-neon border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
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
                        <h2 className="text-xl font-bold text-white mb-2">Route Planner</h2>
                        <p className="text-xs text-gray-500 mb-6">Auto-calibrated to your profile.</p>

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
                                        <div className="text-[10px] text-gray-500">Education</div>
                                        <div className="text-white font-bold text-sm">{user.qualification || 'N/A'}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="text-[10px] text-gray-500">Core Skills</div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {user.skills.length > 0 ? user.skills.map(s => (
                                                <span key={s} className="bg-skillfi-neon/10 text-skillfi-neon text-[9px] px-1.5 py-0.5 rounded border border-skillfi-neon/20">{s}</span>
                                            )) : <span className="text-gray-600 text-xs">None listed</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Strategy Toggle */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Strategy Mode</label>
                                <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-xl">
                                    <button 
                                        onClick={() => setRiskTolerance('STABLE')}
                                        className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${riskTolerance === 'STABLE' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        🛡️ Stable Path
                                    </button>
                                    <button 
                                        onClick={() => setRiskTolerance('MOONSHOT')}
                                        className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${riskTolerance === 'MOONSHOT' ? 'bg-skillfi-neon text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        🚀 Moonshot
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-2 text-center">
                                    {riskTolerance === 'STABLE' ? 'Focuses on corporate ladders, job security, and steady income.' : 'Focuses on startups, high-risk equity, and rapid scaling.'}
                                </p>
                            </div>

                            <button 
                                onClick={handlePathfinder}
                                disabled={isMapping}
                                className="w-full py-4 bg-gradient-to-r from-skillfi-neon to-yellow-500 text-black font-bold uppercase rounded-xl hover:shadow-[0_0_20px_#D4AF37] transition-all text-xs tracking-widest mt-2 flex items-center justify-center gap-2"
                            >
                                {isMapping ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                        Computing...
                                    </>
                                ) : 'Generate Personal Roadmap'}
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

                                <div className="bg-white/5 p-5 rounded-xl border-l-4 border-blue-500 hover:bg-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-lg font-bold text-white">WEB2: {careerMap.web2.role}</div>
                                        <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">TRADITIONAL</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {careerMap.web2.skills.map((s, i) => <span key={i} className="text-[9px] text-gray-400 bg-black/30 px-1.5 rounded">{s}</span>)}
                                    </div>
                                    <div className="text-xs bg-black/30 p-3 rounded text-white font-mono border border-white/5">➤ {careerMap.web2.action}</div>
                                </div>

                                <div className="bg-white/5 p-5 rounded-xl border-l-4 border-purple-500 hover:bg-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-lg font-bold text-white">WEB3: {careerMap.web3.role}</div>
                                        <span className="text-[9px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30">EMERGING</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {careerMap.web3.skills.map((s, i) => <span key={i} className="text-[9px] text-gray-400 bg-black/30 px-1.5 rounded">{s}</span>)}
                                    </div>
                                    <div className="text-xs bg-black/30 p-3 rounded text-white font-mono border border-white/5">➤ {careerMap.web3.action}</div>
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
        </div>
    );
};