import React, { useState } from 'react';
import { initializeChat, sendMessageToSkillfi } from '../services/geminiService';

export const MentalHealth: React.FC = () => {
    const [entry, setEntry] = useState('');
    const [response, setResponse] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [severity, setSeverity] = useState(0); // 0-10 scale simulation

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
            1. Validate their feelings (e.g., "It sounds like you are carrying a heavy burden").
            2. Summarize what they said to show you listened.
            3. Offer a grounding technique (breathing, 5-4-3-2-1 method, or journaling prompt).
            4. ASSESS SEVERITY: If the user mentions self-harm, deep depression, or inability to function, strongly urge them to see a professional.
            
            CRITICAL DISCLAIMER: You MUST end with "I am an AI, not a doctor. Please see a professional for medical diagnosis."
            Keep it under 100 words. Gentle tone.
            `;
            
            const text = await sendMessageToSkillfi(chat, prompt);
            setResponse(text);
            setSeverity(Math.floor(Math.random() * 5) + 1); // Mock severity tracking
        } catch (error) {
            setResponse("I am having trouble connecting. Please write your thoughts down offline for now.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="h-full overflow-y-auto p-4 md:p-8 font-sans pb-24 touch-pan-y animate-fade-in">
            <header className="mb-6 text-center">
                <h1 className="text-3xl font-bold font-display text-white mb-2">Mental Wellness Space</h1>
                <p className="text-gray-400 text-sm max-w-lg mx-auto">Trauma affects career and growth. This is a safe space to unload your mind.</p>
            </header>

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

                {/* Healing Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="text-2xl mb-2">🌬️</div>
                        <h4 className="font-bold text-white text-sm">Breathe</h4>
                        <p className="text-xs text-gray-400 mt-1">Box breathing: Inhale 4s, Hold 4s, Exhale 4s, Hold 4s.</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="text-2xl mb-2">📝</div>
                        <h4 className="font-bold text-white text-sm">Journal</h4>
                        <p className="text-xs text-gray-400 mt-1">Writing it down removes it from your looping thoughts.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};