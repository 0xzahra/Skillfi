import React, { useState, useRef } from 'react';
import { generateProfessionalHeadshot } from '../services/geminiService';
import { AudioService } from '../services/audioService';

export const CareerArsenal: React.FC = () => {
    const [activeModule, setActiveModule] = useState<'HEADSHOT' | 'CV' | 'SITE'>('HEADSHOT');
    
    // Headshot State
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [sliderValue, setSliderValue] = useState(50);
    const [selectedStyle, setSelectedStyle] = useState<'CORPORATE' | 'MEDICAL' | 'CREATIVE' | 'TECH'>('CORPORATE');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result as string);
                setGeneratedImage(null); // Reset generated
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateHeadshot = async () => {
        if (!originalImage) return;
        setIsGenerating(true);
        AudioService.playProcessing();

        // Strip base64 header
        const base64Data = originalImage.split(',')[1];
        const result = await generateProfessionalHeadshot(base64Data, selectedStyle);

        if (result) {
            setGeneratedImage(`data:image/jpeg;base64,${result}`);
            AudioService.playSuccess();
        } else {
            AudioService.playAlert();
            alert("Neural matrix failed. Try a clearer photo.");
        }
        setIsGenerating(false);
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans scrollbar-hide pb-24">
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-display text-white tracking-tight kinetic-type">Professional Arsenal</h1>
                <p className="text-gray-500 text-sm mt-1">Sovereign career tools. No chat needed.</p>
            </header>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-6 border-b border-white/5 pb-1 overflow-x-auto scrollbar-hide">
                <button onClick={() => setActiveModule('HEADSHOT')} className={`px-6 py-2 text-[10px] font-bold tracking-[0.15em] rounded-t-lg uppercase transition-all ${activeModule === 'HEADSHOT' ? 'bg-skillfi-neon text-black border-t-2 border-white' : 'text-gray-500 bg-white/5'}`}>Neural Headshot</button>
                <button onClick={() => setActiveModule('CV')} className={`px-6 py-2 text-[10px] font-bold tracking-[0.15em] rounded-t-lg uppercase transition-all ${activeModule === 'CV' ? 'bg-skillfi-neon text-black border-t-2 border-white' : 'text-gray-500 bg-white/5'}`}>CV Engine</button>
                <button onClick={() => setActiveModule('SITE')} className={`px-6 py-2 text-[10px] font-bold tracking-[0.15em] rounded-t-lg uppercase transition-all ${activeModule === 'SITE' ? 'bg-skillfi-neon text-black border-t-2 border-white' : 'text-gray-500 bg-white/5'}`}>Sovereign Site</button>
            </div>

            {/* NEURAL HEADSHOT ENGINE */}
            {activeModule === 'HEADSHOT' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                    
                    {/* Control Panel */}
                    <div className="glass-panel p-6 rounded-2xl h-fit">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <span className="text-2xl">📸</span> Neural Headshot Engine
                        </h2>
                        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                            Upload a casual selfie. The Neural Engine will reconstruct it into a high-end studio headshot using generative in-painting.
                        </p>

                        <div className="space-y-6">
                            {/* Upload Area */}
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-skillfi-neon/50 hover:bg-white/5 transition-all group"
                            >
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📤</div>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-white">Upload Raw Selfie</span>
                            </div>

                            {/* Style Selection */}
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
                                disabled={!originalImage || isGenerating}
                                className={`w-full py-4 font-bold text-sm tracking-widest uppercase rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                                    !originalImage 
                                    ? 'bg-white/5 text-gray-600 cursor-not-allowed' 
                                    : isGenerating
                                    ? 'bg-skillfi-neon/50 text-black cursor-wait'
                                    : 'bg-skillfi-neon text-black hover:bg-white hover:shadow-[0_0_20px_#00ffff]'
                                }`}
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        PROCESSING MATRIX...
                                    </>
                                ) : 'GENERATE HEADSHOT'}
                            </button>
                        </div>
                    </div>

                    {/* Preview Area (Before/After Slider) */}
                    <div className="glass-panel p-1 rounded-2xl h-[500px] flex items-center justify-center bg-black/50 relative overflow-hidden group">
                        {!originalImage ? (
                            <div className="text-center opacity-30">
                                <div className="text-6xl mb-4">👁️</div>
                                <p className="font-mono text-xs uppercase">Awaiting Visual Input</p>
                            </div>
                        ) : (
                            <div className="relative w-full h-full rounded-xl overflow-hidden select-none">
                                {/* Base Image (After - or Original if no After yet) */}
                                <img 
                                    src={generatedImage || originalImage} 
                                    alt="Result" 
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* Overlay Image (Before) - Clipped by width */}
                                {generatedImage && (
                                    <div 
                                        className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-skillfi-neon bg-black"
                                        style={{ width: `${sliderValue}%` }}
                                    >
                                        <img 
                                            src={originalImage} 
                                            alt="Original" 
                                            className="absolute inset-0 w-[100vw] lg:w-[calc(50vw-4rem)] h-full object-cover" // Approximation to keep aspect ratio sync roughly
                                            style={{ objectFit: 'cover', maxWidth: 'none' }} // Ensure it doesn't shrink
                                        />
                                         <div className="absolute top-4 left-4 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md border border-white/10">ORIGINAL</div>
                                    </div>
                                )}

                                {generatedImage && (
                                    <>
                                        <div className="absolute top-4 right-4 bg-skillfi-neon/20 text-skillfi-neon text-[10px] font-bold px-2 py-1 rounded backdrop-blur-md border border-skillfi-neon/30">AI ENHANCED</div>
                                        
                                        {/* Range Input for Slider */}
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="100" 
                                            value={sliderValue} 
                                            onChange={(e) => setSliderValue(Number(e.target.value))}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                                        />

                                        {/* Slider Handle Visual */}
                                        <div 
                                            className="absolute top-0 bottom-0 w-8 -ml-4 flex items-center justify-center pointer-events-none z-10"
                                            style={{ left: `${sliderValue}%` }}
                                        >
                                            <div className="w-8 h-8 bg-skillfi-neon rounded-full shadow-[0_0_15px_#00ffff] flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="black" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                                </svg>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CV ENGINE (Placeholder UI for Visuals) */}
            {activeModule === 'CV' && (
                <div className="glass-panel p-8 rounded-2xl text-center py-20 animate-fade-in">
                    <div className="text-6xl mb-4 opacity-50">📄</div>
                    <h2 className="text-2xl font-bold text-white mb-2">ATS-Proof CV Engine</h2>
                    <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">
                        Generate a minimalist, keyword-optimized resume that beats automated filters. 
                        Includes your new AI headshot automatically.
                    </p>
                    <button className="bg-white/10 text-gray-400 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                        Initialize Document Build
                    </button>
                </div>
            )}

            {/* SITE BUILDER (Placeholder UI for Visuals) */}
            {activeModule === 'SITE' && (
                <div className="glass-panel p-8 rounded-2xl text-center py-20 animate-fade-in">
                    <div className="text-6xl mb-4 opacity-50">🌐</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Sovereign Site Deployer</h2>
                    <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">
                        One-click portfolio generation. Host your Proof of Work on a decentralized grid.
                    </p>
                    <button className="bg-white/10 text-gray-400 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                        Launch Node
                    </button>
                </div>
            )}

        </div>
    );
};