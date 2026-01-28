import React, { useState, useRef, useEffect } from 'react';
import { generateProfessionalHeadshot, generateContentPack, generatePitchDeck, generatePortfolioHTML, generateCVContent, ContentPack } from '../services/geminiService';
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

export const CareerArsenal: React.FC<CareerArsenalProps> = ({ user }) => {
    const [activeModule, setActiveModule] = useState<'NUKE' | 'CALENDAR' | 'HEADSHOT' | 'CV' | 'PITCH' | 'SITE'>('NUKE');
    
    // Headshot State
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGeneratingHeadshot, setIsGeneratingHeadshot] = useState(false);
    const [sliderValue, setSliderValue] = useState(50);
    const [selectedStyle, setSelectedStyle] = useState<'CORPORATE' | 'MEDICAL' | 'CREATIVE' | 'TECH'>('CORPORATE');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Content Nuke State
    const [rawIdea, setRawIdea] = useState('');
    const [contentPack, setContentPack] = useState<ContentPack | null>(null);
    const [isNuking, setIsNuking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

    // Pitch Deck State
    const [pitchTopic, setPitchTopic] = useState('');
    const [pitchSlides, setPitchSlides] = useState<{title: string, bullet: string}[]>([]);
    const [isPitching, setIsPitching] = useState(false);

    // Site & CV State
    const [siteUrl, setSiteUrl] = useState<string | null>(null);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deploymentStep, setDeploymentStep] = useState(0);
    const [cvContent, setCvContent] = useState<string | null>(null);
    const [isGeneratingCV, setIsGeneratingCV] = useState(false);

    // Haptic Helper
    const triggerHaptic = () => {
        if (navigator.vibrate) navigator.vibrate(15);
    };

    // --- HEADSHOT HANDLERS ---
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

    // --- NUKE HANDLERS ---
    const handleVoiceInput = () => {
        setIsListening(!isListening);
        if (!isListening) {
            AudioService.playProcessing();
            setTimeout(() => {
                setRawIdea("How to transition from Web2 to Web3 development as a senior engineer");
                setIsListening(false);
                AudioService.playSuccess();
            }, 2000);
        }
    };

    const handleNuke = async () => {
        if (!rawIdea.trim()) return;
        setIsNuking(true);
        triggerHaptic();
        AudioService.playProcessing();

        const pack = await generateContentPack(rawIdea);
        if (pack) {
            setContentPack(pack);
            AudioService.playSuccess();
        } else {
            AudioService.playAlert();
        }
        setIsNuking(false);
    };

    const handleSchedule = (platform: 'LINKEDIN' | 'TWITTER' | 'TIKTOK', content: string | string[]) => {
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * 7) + 1);
        const finalContent = Array.isArray(content) ? content.join('\n\n') : content;
        const newPost: ScheduledPost = {
            id: Date.now().toString(),
            platform,
            content: finalContent,
            date: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
            status: 'SCHEDULED'
        };
        setScheduledPosts(prev => [newPost, ...prev]);
        AudioService.playSuccess();
        triggerHaptic();
    };

    // --- PITCH HANDLERS ---
    const handlePitch = async () => {
        if (!pitchTopic.trim()) return;
        setIsPitching(true);
        triggerHaptic();
        AudioService.playProcessing();
        const slides = await generatePitchDeck(pitchTopic);
        if (slides) {
            setPitchSlides(slides);
            AudioService.playSuccess();
        }
        setIsPitching(false);
    };

    // --- SITE HANDLERS ---
    const handleDeploySite = async () => {
        setIsDeploying(true);
        setDeploymentStep(0);
        AudioService.playProcessing();
        
        // Step 1: Generate HTML
        const context = `Username: ${user.username}. Skills: ${user.skills.join(', ')}. Level: ${user.level}. Bio: Tech enthusiast and builder.`;
        const html = await generatePortfolioHTML(context);
        
        if (html) {
            setDeploymentStep(1); // Compiling
            setTimeout(() => setDeploymentStep(2), 1500); // Hashing
            setTimeout(() => {
                setDeploymentStep(3); // Live
                const blob = new Blob([html], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                setSiteUrl(url);
                setIsDeploying(false);
                AudioService.playSuccess();
            }, 3000);
        } else {
            setIsDeploying(false);
            AudioService.playAlert();
        }
    };

    // --- CV HANDLERS ---
    const handleGenerateCV = async () => {
        setIsGeneratingCV(true);
        AudioService.playProcessing();
        const context = `Name: ${user.username}. Skills: ${user.skills.join(', ')}. Experience: 5 years in Tech. Qualification: ${user.qualification || 'Self Taught'}.`;
        const cv = await generateCVContent(context);
        if (cv) {
            setCvContent(cv);
            AudioService.playSuccess();
        }
        setIsGeneratingCV(false);
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans scrollbar-hide pb-24 touch-pan-y">
            <header className="mb-8">
                <h1 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tighter kinetic-type">
                    The Arsenal<span className="text-skillfi-neon">.</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Sovereign Career Tools // v4.3</p>
            </header>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-8 border-b border-white/10 pb-1 overflow-x-auto scrollbar-hide">
                {[
                    { id: 'NUKE', label: 'Content Nuke' },
                    { id: 'CALENDAR', label: 'Calendar' },
                    { id: 'HEADSHOT', label: 'Neural Headshot' },
                    { id: 'CV', label: 'CV Generator' },
                    { id: 'PITCH', label: 'Deck Builder' },
                    { id: 'SITE', label: 'Sov Site' }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => { setActiveModule(tab.id as any); triggerHaptic(); }}
                        className={`px-6 py-3 text-[10px] font-bold tracking-[0.15em] rounded-t-lg uppercase transition-all whitespace-nowrap ${
                            activeModule === tab.id 
                            ? 'bg-skillfi-neon text-black border-t-2 border-white shadow-[0_-5px_20px_rgba(0,255,255,0.2)]' 
                            : 'text-gray-500 bg-white/5 hover:bg-white/10'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* MODULES */}
            
            {/* 1. CONTENT NUKE */}
            {activeModule === 'NUKE' && (
                <div className="animate-fade-in space-y-8">
                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-9xl select-none pointer-events-none">☢️</div>
                        <h2 className="text-xl font-bold text-white mb-2">Growth Engine</h2>
                        <p className="text-xs text-gray-400 mb-6 max-w-lg">Input a raw thought via text or voice. The engine will deploy a multi-channel content strike (LinkedIn, X, TikTok).</p>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input 
                                    type="text" 
                                    value={rawIdea}
                                    onChange={(e) => setRawIdea(e.target.value)}
                                    placeholder={isListening ? "Listening..." : "e.g. 'Why remote work is actually harder for juniors...'"}
                                    className={`w-full bg-black/50 border border-white/10 p-4 pr-12 rounded-xl text-white outline-none focus:border-skillfi-neon placeholder-gray-600 font-medium transition-all ${isListening ? 'border-skillfi-neon animate-pulse' : ''}`}
                                    onKeyDown={(e) => e.key === 'Enter' && handleNuke()}
                                />
                                <button 
                                    onClick={handleVoiceInput}
                                    className={`absolute right-3 top-3.5 p-1 rounded-full hover:bg-white/10 transition-colors ${isListening ? 'text-red-500' : 'text-gray-400'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                                    </svg>
                                </button>
                            </div>
                            <button 
                                onClick={handleNuke}
                                disabled={isNuking}
                                className="bg-skillfi-neon text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:shadow-[0_0_20px_#00ffff] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isNuking ? <span className="animate-spin text-lg">⚙️</span> : 'DEPLOY'}
                            </button>
                        </div>
                    </div>

                    {contentPack && (
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* LinkedIn Card */}
                            <div className="glass-panel p-5 rounded-xl border-t-4 border-t-blue-600 flex flex-col">
                                <div className="flex justify-between mb-4">
                                    <h3 className="font-bold text-blue-400 text-xs uppercase tracking-widest">LinkedIn Authority</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleSchedule('LINKEDIN', contentPack.linkedin)} className="text-gray-500 hover:text-skillfi-neon" title="Schedule">📅</button>
                                        <button className="text-gray-500 hover:text-white" onClick={() => {navigator.clipboard.writeText(contentPack.linkedin); alert('Copied!');}}>📋</button>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto scrollbar-hide flex-1">
                                    {contentPack.linkedin}
                                </div>
                            </div>
                            {/* Twitter Card */}
                            <div className="glass-panel p-5 rounded-xl border-t-4 border-t-white flex flex-col">
                                <div className="flex justify-between mb-4">
                                    <h3 className="font-bold text-white text-xs uppercase tracking-widest">X Thread</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleSchedule('TWITTER', contentPack.twitter)} className="text-gray-500 hover:text-skillfi-neon" title="Schedule">📅</button>
                                        <button className="text-gray-500 hover:text-white" onClick={() => {navigator.clipboard.writeText(contentPack.twitter.join('\n\n')); alert('Copied!');}}>📋</button>
                                    </div>
                                </div>
                                <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide flex-1">
                                    {contentPack.twitter.map((tweet, i) => (
                                        <div key={i} className="bg-black/40 p-3 rounded-lg border border-white/5 text-xs text-gray-300">
                                            {tweet}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* TikTok Card */}
                            <div className="glass-panel p-5 rounded-xl border-t-4 border-t-pink-500 flex flex-col">
                                <div className="flex justify-between mb-4">
                                    <h3 className="font-bold text-pink-500 text-xs uppercase tracking-widest">TikTok Script</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleSchedule('TIKTOK', contentPack.tiktok)} className="text-gray-500 hover:text-skillfi-neon" title="Schedule">📅</button>
                                        <button className="text-gray-500 hover:text-white" onClick={() => {navigator.clipboard.writeText(contentPack.tiktok); alert('Copied!');}}>📋</button>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto scrollbar-hide font-mono flex-1">
                                    {contentPack.tiktok}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 2. CALENDAR */}
            {activeModule === 'CALENDAR' && (
                <div className="animate-fade-in">
                    <div className="glass-panel p-6 rounded-2xl mb-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-white">Content Command Center</h2>
                            <p className="text-xs text-gray-400">Scheduled automated deployments.</p>
                        </div>
                        <div className="text-right">
                             <div className="text-2xl font-bold text-white">{scheduledPosts.length}</div>
                             <div className="text-[10px] text-gray-500 uppercase tracking-widest">Pending Posts</div>
                        </div>
                    </div>
                    <div className="grid gap-4">
                        {scheduledPosts.map(post => (
                            <div key={post.id} className="glass-panel p-4 rounded-xl flex items-start gap-4 hover:bg-white/5 transition-colors group">
                                <div className={`p-3 rounded-lg text-xl ${
                                    post.platform === 'LINKEDIN' ? 'bg-blue-900/20 text-blue-400' :
                                    post.platform === 'TIKTOK' ? 'bg-pink-900/20 text-pink-400' :
                                    'bg-gray-800 text-white'
                                }`}>
                                    {post.platform === 'LINKEDIN' && '💼'}
                                    {post.platform === 'TIKTOK' && '🎵'}
                                    {post.platform === 'TWITTER' && '🐦'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-white text-sm">{post.date}</span>
                                        <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded uppercase font-bold tracking-wider">{post.status}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-2">{post.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. NEURAL HEADSHOT */}
            {activeModule === 'HEADSHOT' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                    <div className="glass-panel p-6 rounded-2xl h-fit">
                        <h2 className="text-xl font-bold text-white mb-4">Neural Headshot</h2>
                         <div className="space-y-6">
                            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-skillfi-neon/50 hover:bg-white/5 transition-all group">
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📤</div>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-white">Upload Raw Selfie</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {(['CORPORATE', 'MEDICAL', 'CREATIVE', 'TECH'] as const).map(style => (
                                    <button key={style} onClick={() => setSelectedStyle(style)} className={`p-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${selectedStyle === style ? 'bg-skillfi-neon/20 border-skillfi-neon text-white' : 'bg-black/40 border-transparent text-gray-500 hover:text-white'}`}>{style}</button>
                                ))}
                            </div>
                            <button onClick={handleGenerateHeadshot} disabled={!originalImage || isGeneratingHeadshot} className="w-full py-4 font-bold text-sm tracking-widest uppercase rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 bg-skillfi-neon text-black hover:bg-white disabled:bg-white/5 disabled:text-gray-600">{isGeneratingHeadshot ? 'PROCESSING MATRIX...' : 'GENERATE HEADSHOT'}</button>
                        </div>
                    </div>
                    <div className="glass-panel p-1 rounded-2xl h-[400px] md:h-[500px] flex items-center justify-center bg-black/50 relative overflow-hidden group">
                         {!originalImage ? (
                            <div className="text-center opacity-30">
                                <div className="text-6xl mb-4">👁️</div>
                                <p className="font-mono text-xs uppercase">Awaiting Visual Input</p>
                            </div>
                        ) : (
                            <div className="relative w-full h-full rounded-xl overflow-hidden select-none">
                                <img src={generatedImage || originalImage} alt="Result" className="absolute inset-0 w-full h-full object-cover" />
                                {generatedImage && (
                                    <>
                                        <div className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-skillfi-neon bg-black" style={{ width: `${sliderValue}%` }}>
                                            <img src={originalImage} alt="Original" className="absolute inset-0 w-[100vw] lg:w-[calc(50vw-4rem)] h-full object-cover" style={{ objectFit: 'cover', maxWidth: 'none' }} />
                                        </div>
                                        <input type="range" min="0" max="100" value={sliderValue} onChange={(e) => setSliderValue(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20" />
                                        <div className="absolute top-0 bottom-0 w-8 -ml-4 flex items-center justify-center pointer-events-none z-10" style={{ left: `${sliderValue}%` }}>
                                            <div className="w-8 h-8 bg-skillfi-neon rounded-full shadow-[0_0_15px_#00ffff] flex items-center justify-center">↔</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 4. CV GENERATOR */}
            {activeModule === 'CV' && (
                <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl h-fit">
                        <h2 className="text-xl font-bold text-white mb-2">ATS Engine</h2>
                        <p className="text-xs text-gray-400 mb-6">Generates keyword-optimized resumes that beat automated filters.</p>
                        
                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Target Identity</div>
                                <div className="text-white font-bold">{user.username}</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Verified Skills</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {user.skills.length > 0 ? user.skills.map(s => (
                                        <span key={s} className="text-[10px] bg-skillfi-neon/10 text-skillfi-neon px-2 py-0.5 rounded">{s}</span>
                                    )) : <span className="text-xs text-gray-600">No skills found</span>}
                                </div>
                            </div>
                            <button 
                                onClick={handleGenerateCV}
                                disabled={isGeneratingCV}
                                className="w-full py-3 bg-skillfi-neon text-black font-bold uppercase rounded-xl hover:bg-white transition-all shadow-lg text-xs tracking-widest"
                            >
                                {isGeneratingCV ? 'Compiling Data...' : 'Generate Resume'}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 glass-panel p-8 rounded-2xl min-h-[500px] font-mono text-xs leading-relaxed overflow-y-auto relative bg-white">
                        {cvContent ? (
                            <div className="text-black whitespace-pre-wrap">
                                {cvContent}
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                <div className="text-6xl mb-4 opacity-20">📄</div>
                                <p>Awaiting Generation</p>
                            </div>
                        )}
                        {cvContent && (
                            <button className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg text-xs font-bold uppercase" onClick={() => alert('PDF Export Simulated')}>
                                Download PDF
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* 5. PITCH DECK */}
            {activeModule === 'PITCH' && (
                <div className="animate-fade-in space-y-8">
                     <div className="glass-panel p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-2">Investor Deck Builder</h2>
                        <div className="flex gap-4">
                            <input type="text" value={pitchTopic} onChange={(e) => setPitchTopic(e.target.value)} placeholder="e.g. 'Uber for Dog Walking in Lagos'" className="flex-1 bg-black/50 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-skillfi-neon placeholder-gray-600 font-medium" />
                            <button onClick={handlePitch} disabled={isPitching} className="bg-skillfi-neon text-black px-8 rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:shadow-[0_0_20px_#00ffff] transition-all disabled:opacity-50">{isPitching ? 'BUILDING...' : 'BUILD'}</button>
                        </div>
                    </div>
                    {pitchSlides.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {pitchSlides.map((slide, i) => (
                                <div key={i} className="glass-panel p-6 rounded-xl border border-white/5 hover:border-skillfi-neon/30 transition-all group aspect-video flex flex-col justify-between relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 text-[40px] font-black text-white/5 group-hover:text-skillfi-neon/10 transition-colors select-none">{i + 1}</div>
                                    <div>
                                        <h3 className="text-sm font-bold text-skillfi-neon uppercase tracking-wider mb-2">{slide.title}</h3>
                                        <p className="text-gray-300 text-sm leading-relaxed">{slide.bullet}</p>
                                    </div>
                                    <div className="w-full bg-white/5 h-1 rounded-full mt-4"><div className="bg-skillfi-neon h-full rounded-full" style={{ width: '20%' }}></div></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 6. SOVEREIGN SITE */}
            {activeModule === 'SITE' && (
                <div className="animate-fade-in h-full flex flex-col">
                    {!siteUrl ? (
                         <div className="glass-panel p-8 rounded-2xl text-center py-20 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-skillfi-neon to-transparent opacity-20"></div>
                            <div className="text-6xl mb-6 opacity-50 grayscale contrast-125 animate-float-random">🌐</div>
                            <h2 className="text-3xl font-bold text-white mb-2 font-display">Sovereign Site Deployer</h2>
                            <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">
                                One-click portfolio generation. Host your Proof of Work on a decentralized grid.
                            </p>
                            
                            {isDeploying ? (
                                <div className="space-y-4 w-64">
                                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-skillfi-neon animate-pulse" style={{ width: `${deploymentStep * 33}%` }}></div>
                                    </div>
                                    <p className="text-xs text-skillfi-neon font-mono animate-pulse">
                                        {deploymentStep === 0 && 'INITIALIZING HANDSHAKE...'}
                                        {deploymentStep === 1 && 'COMPILING ASSETS...'}
                                        {deploymentStep === 2 && 'HASHING TO IPFS...'}
                                    </p>
                                </div>
                            ) : (
                                <button 
                                    onClick={handleDeploySite}
                                    className="bg-skillfi-neon text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:shadow-[0_0_30px_#00ffff] transition-all"
                                >
                                    Initialize Node
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col h-full">
                            <div className="mb-4 flex justify-between items-center glass-panel p-4 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-green-500 font-mono text-xs">LIVE ON MAINNET</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setSiteUrl(null)} className="text-gray-500 hover:text-white text-xs uppercase font-bold">Close</button>
                                    <a href={siteUrl} target="_blank" rel="noreferrer" className="text-skillfi-neon hover:text-white text-xs uppercase font-bold flex items-center gap-1">
                                        Open New Tab ↗
                                    </a>
                                </div>
                            </div>
                            <div className="flex-1 border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-white">
                                <iframe src={siteUrl} title="Portfolio" className="w-full h-full" />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};