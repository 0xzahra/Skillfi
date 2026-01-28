import React, { useState, useRef } from 'react';
import { generateProfessionalHeadshot, generateContentPack, generatePitchDeck, ContentPack } from '../services/geminiService';
import { AudioService } from '../services/audioService';

export const CareerArsenal: React.FC = () => {
    const [activeModule, setActiveModule] = useState<'HEADSHOT' | 'NUKE' | 'PITCH' | 'SITE'>('NUKE');
    
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

    // Pitch Deck State
    const [pitchTopic, setPitchTopic] = useState('');
    const [pitchSlides, setPitchSlides] = useState<{title: string, bullet: string}[]>([]);
    const [isPitching, setIsPitching] = useState(false);

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

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans scrollbar-hide pb-24 touch-pan-y">
            <header className="mb-8">
                <h1 className="text-3xl md:text-5xl font-bold font-display text-white tracking-tighter kinetic-type">
                    The Arsenal<span className="text-skillfi-neon">.</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest">Sovereign Career Tools // v4.2</p>
            </header>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-8 border-b border-white/10 pb-1 overflow-x-auto scrollbar-hide">
                {[
                    { id: 'NUKE', label: 'Content Nuke' },
                    { id: 'HEADSHOT', label: 'Neural Headshot' },
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

            {/* CONTENT NUKE (GROWTH ENGINE) */}
            {activeModule === 'NUKE' && (
                <div className="animate-fade-in space-y-8">
                    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-9xl select-none pointer-events-none">☢️</div>
                        <h2 className="text-xl font-bold text-white mb-2">Growth Engine</h2>
                        <p className="text-xs text-gray-400 mb-6 max-w-lg">Input a raw thought. The engine will deploy a multi-channel content strike (LinkedIn, X, TikTok).</p>

                        <div className="flex flex-col md:flex-row gap-4">
                            <input 
                                type="text" 
                                value={rawIdea}
                                onChange={(e) => setRawIdea(e.target.value)}
                                placeholder="e.g. 'Why remote work is actually harder for juniors...'"
                                className="flex-1 bg-black/50 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-skillfi-neon placeholder-gray-600 font-medium"
                                onKeyDown={(e) => e.key === 'Enter' && handleNuke()}
                            />
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
                            <div className="glass-panel p-5 rounded-xl border-t-4 border-t-blue-600">
                                <div className="flex justify-between mb-4">
                                    <h3 className="font-bold text-blue-400 text-xs uppercase tracking-widest">LinkedIn Authority</h3>
                                    <button className="text-gray-500 hover:text-white" onClick={() => {navigator.clipboard.writeText(contentPack.linkedin); alert('Copied!');}}>📋</button>
                                </div>
                                <div className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto scrollbar-hide">
                                    {contentPack.linkedin}
                                </div>
                            </div>

                            {/* Twitter Card */}
                            <div className="glass-panel p-5 rounded-xl border-t-4 border-t-white">
                                <div className="flex justify-between mb-4">
                                    <h3 className="font-bold text-white text-xs uppercase tracking-widest">X Thread</h3>
                                    <button className="text-gray-500 hover:text-white" onClick={() => {navigator.clipboard.writeText(contentPack.twitter.join('\n\n')); alert('Copied!');}}>📋</button>
                                </div>
                                <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide">
                                    {contentPack.twitter.map((tweet, i) => (
                                        <div key={i} className="bg-black/40 p-3 rounded-lg border border-white/5 text-xs text-gray-300">
                                            {tweet}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* TikTok Card */}
                            <div className="glass-panel p-5 rounded-xl border-t-4 border-t-pink-500">
                                <div className="flex justify-between mb-4">
                                    <h3 className="font-bold text-pink-500 text-xs uppercase tracking-widest">TikTok Script</h3>
                                    <button className="text-gray-500 hover:text-white" onClick={() => {navigator.clipboard.writeText(contentPack.tiktok); alert('Copied!');}}>📋</button>
                                </div>
                                <div className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto scrollbar-hide font-mono">
                                    {contentPack.tiktok}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* NEURAL HEADSHOT ENGINE */}
            {activeModule === 'HEADSHOT' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                    <div className="glass-panel p-6 rounded-2xl h-fit">
                        <h2 className="text-xl font-bold text-white mb-4">Neural Headshot</h2>
                        <div className="space-y-6">
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-skillfi-neon/50 hover:bg-white/5 transition-all group"
                            >
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📤</div>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-white">Upload Raw Selfie</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {(['CORPORATE', 'MEDICAL', 'CREATIVE', 'TECH'] as const).map(style => (
                                    <button
                                        key={style}
                                        onClick={() => setSelectedStyle(style)}
                                        className={`p-3 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${selectedStyle === style ? 'bg-skillfi-neon/20 border-skillfi-neon text-white' : 'bg-black/40 border-transparent text-gray-500 hover:text-white'}`}
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={handleGenerateHeadshot}
                                disabled={!originalImage || isGeneratingHeadshot}
                                className={`w-full py-4 font-bold text-sm tracking-widest uppercase rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                                    !originalImage 
                                    ? 'bg-white/5 text-gray-600 cursor-not-allowed' 
                                    : isGeneratingHeadshot
                                    ? 'bg-skillfi-neon/50 text-black cursor-wait'
                                    : 'bg-skillfi-neon text-black hover:bg-white hover:shadow-[0_0_20px_#00ffff]'
                                }`}
                            >
                                {isGeneratingHeadshot ? 'PROCESSING MATRIX...' : 'GENERATE HEADSHOT'}
                            </button>
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
                                    <div className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-skillfi-neon bg-black" style={{ width: `${sliderValue}%` }}>
                                        <img src={originalImage} alt="Original" className="absolute inset-0 w-[100vw] lg:w-[calc(50vw-4rem)] h-full object-cover" style={{ objectFit: 'cover', maxWidth: 'none' }} />
                                        <div className="absolute top-4 left-4 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md border border-white/10">ORIGINAL</div>
                                    </div>
                                )}
                                {generatedImage && (
                                    <>
                                        <div className="absolute top-4 right-4 bg-skillfi-neon/20 text-skillfi-neon text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md border border-skillfi-neon/30">AI ENHANCED</div>
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

            {/* PITCH DECK */}
            {activeModule === 'PITCH' && (
                <div className="animate-fade-in space-y-8">
                     <div className="glass-panel p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-white mb-2">Investor Deck Builder</h2>
                        <p className="text-xs text-gray-400 mb-6">Converts a business concept into a 10-slide high-impact structure.</p>
                        
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                value={pitchTopic}
                                onChange={(e) => setPitchTopic(e.target.value)}
                                placeholder="e.g. 'Uber for Dog Walking in Lagos'"
                                className="flex-1 bg-black/50 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-skillfi-neon placeholder-gray-600 font-medium"
                                onKeyDown={(e) => e.key === 'Enter' && handlePitch()}
                            />
                            <button 
                                onClick={handlePitch}
                                disabled={isPitching}
                                className="bg-skillfi-neon text-black px-8 rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:shadow-[0_0_20px_#00ffff] transition-all disabled:opacity-50"
                            >
                                {isPitching ? 'BUILDING...' : 'BUILD'}
                            </button>
                        </div>
                    </div>

                    {pitchSlides.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pitchSlides.map((slide, i) => (
                                <div key={i} className="glass-panel p-6 rounded-xl border border-white/5 hover:border-skillfi-neon/30 transition-all group aspect-video flex flex-col justify-between relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 text-[40px] font-black text-white/5 group-hover:text-skillfi-neon/10 transition-colors select-none">{i + 1}</div>
                                    <div>
                                        <h3 className="text-sm font-bold text-skillfi-neon uppercase tracking-wider mb-2">{slide.title}</h3>
                                        <p className="text-gray-300 text-sm leading-relaxed">{slide.bullet}</p>
                                    </div>
                                    <div className="w-full bg-white/5 h-1 rounded-full mt-4">
                                        <div className="bg-skillfi-neon h-full rounded-full" style={{ width: '20%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* SOVEREIGN SITE */}
            {activeModule === 'SITE' && (
                <div className="glass-panel p-8 rounded-2xl text-center py-20 animate-fade-in">
                    <div className="text-6xl mb-4 opacity-50 grayscale contrast-125">🌐</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Sovereign Site Deployer</h2>
                    <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">
                        One-click portfolio generation. Host your Proof of Work on a decentralized grid.
                    </p>
                    <button className="bg-white/10 text-gray-400 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                        Launch Node (Simulation)
                    </button>
                </div>
            )}

        </div>
    );
};