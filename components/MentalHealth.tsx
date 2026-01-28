import React, { useState, useEffect } from 'react';
import { initializeChat, sendMessageToSkillfi } from '../services/geminiService';

export const MentalHealth: React.FC = () => {
    const [entry, setEntry] = useState('');
    const [response, setResponse] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [severity, setSeverity] = useState(0); 
    
    // Tools State
    const [activeTool, setActiveTool] = useState<'BREATHE' | 'JOURNAL' | null>(null);
    const [breathPhase, setBreathPhase] = useState('Inhale');

    // Breathing Animation Loop
    useEffect(() => {
        let interval: any;
        if (activeTool === 'BREATHE') {
            const phases = ['Inhale', 'Hold', 'Exhale', 'Hold'];
            let i = 0;
            interval = setInterval(() => {
                i = (i + 1) % 4;
                setBreathPhase(phases[i]);
            }, 4000);
        }
        return () => clearInterval(interval);
    }, [activeTool]);

    const handleProcess = async () => {
        if (!entry.trim()) return;
        setIsProcessing(true);
        setResponse('');

        try {
            const chat = await initializeChat('en');
            // Strict Prompting for Safety
            const prompt = `
            ACT AS A COMPASSIONATE LISTENER AND TRAUMA PROCESSOR.
            USER INPUT: "${entry}"
            
            YOUR TASKS:
            1. Validate their feelings.
            2. Summarize what they said.
            3. Offer a grounding technique.
            4. ASSESS SEVERITY: If the user mentions self-harm, urge them to see a professional.
            
            CRITICAL DISCLAIMER: You MUST end with "I am an AI, not a doctor. Please see a professional for medical diagnosis."
            Keep it under 100 words. Gentle tone.
            `;
            
            const text = await sendMessageToSkillfi(chat, prompt);
            setResponse(text);
            setSeverity(Math.floor(Math.random() * 5) + 1); 
        } catch (error) {
            setResponse("I am having trouble connecting. Please write your thoughts down offline for now.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans pb-24 touch-pan-y animate-fade-in relative">
            <header className="mb-6 text-center">
                <h1 className="text-3xl font-bold font-display text-white mb-2">Mental Wellness Space</h1>
                <p className="text-gray-400 text-sm max-w-lg mx-auto">Trauma affects career and growth. This is a safe space to unload your mind.</p>
            </header>

            {/* Tool Overlays */}
            {activeTool === 'BREATHE' && (
                <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-8 animate-fade-in" onClick={() => setActiveTool(null)}>
                    <div className="text-center relative z-10">
                        <div className={`w-48 h-48 rounded-full border-4 border-teal-500 flex items-center justify-center mb-8 transition-all duration-[4000ms] ${breathPhase === 'Inhale' ? 'scale-125 bg-teal-500/20' : breathPhase === 'Exhale' ? 'scale-75 bg-transparent' : 'scale-100 bg-teal-500/10'}`}>
                            <span className="text-2xl font-bold text-white uppercase tracking-widest">{breathPhase}</span>
                        </div>
                        <p className="text-gray-400 text-sm">Box Breathing Technique (4-4-4-4)</p>
                        <p className="text-gray-600 text-xs mt-4">Tap anywhere to close</p>
                    </div>
                </div>
            )}

            {activeTool === 'JOURNAL' && (
                <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 animate-fade-in">
                    <div className="glass-panel w-full max-w-lg p-6 rounded-2xl relative">
                        <button onClick={() => setActiveTool(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
                        <h2 className="text-xl font-bold text-white mb-4">Prompt: "What am I grateful for right now?"</h2>
                        <textarea className="w-full h-40 bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none mb-4" placeholder="Start writing..." />
                        <button onClick={() => setActiveTool(null)} className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold uppercase text-xs">Done (Reset)</button>
                    </div>
                </div>
            )}

            {/* DISCLAIMER BANNER */}
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl mb-8 flex gap-3 items-start">
                <div className="text-xl">⚠️</div>
                <p className="text-xs text-red-200 leading-relaxed">
                    <strong>Disclaimer:</strong> Skillfi is an AI tool, not a doctor, psychologist, or psychiatrist. We cannot diagnose you. If you are in crisis or your trauma feels overwhelming, please contact a medical professional immediately.
                </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                
                {/* Input Section */}
                <div className="glass-panel p-6 rounded-2xl">
                    <label className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-2 block">What is weighing on you?</label>
                    <textarea 
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        placeholder="I feel overwhelmed because..."
                        className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-teal-500 outline-none resize-none transition-colors"
                    />
                    <div className="flex justify-end mt-4">
                        <button 
                            onClick={handleProcess}
                            disabled={isProcessing}
                            className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all shadow-lg flex items-center gap-2"
                        >
                            {isProcessing ? 'Listening...' : 'Process Thoughts'}
                        </button>
                    </div>
                </div>

                {/* AI Response */}
                {response && (
                    <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-teal-500 animate-fade-in">
                        <h3 className="font-bold text-white mb-4">Skillfi Support</h3>
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{response}</p>
                        
                        {/* Mock Tracker */}
                        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[10px] text-gray-500 uppercase">Session Load</span>
                            <div className="flex gap-1">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className={`w-2 h-2 rounded-full ${i <= severity ? 'bg-teal-500' : 'bg-gray-800'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Healing Tips - Now Interactive */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                        onClick={() => setActiveTool('BREATHE')}
                        className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-teal-500/50 hover:bg-teal-900/10 cursor-pointer transition-all group"
                    >
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">🌬️</div>
                        <h4 className="font-bold text-white text-sm group-hover:text-teal-400">Start Breathing Exercise</h4>
                        <p className="text-xs text-gray-400 mt-1">Interactive 4-4-4-4 box breathing guide.</p>
                    </div>
                    <div 
                        onClick={() => setActiveTool('JOURNAL')}
                        className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-teal-500/50 hover:bg-teal-900/10 cursor-pointer transition-all group"
                    >
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform origin-left">📝</div>
                        <h4 className="font-bold text-white text-sm group-hover:text-teal-400">Quick Journal</h4>
                        <p className="text-xs text-gray-400 mt-1">Writing it down removes it from your looping thoughts.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};