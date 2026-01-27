import React, { useState } from 'react';
import { UserProfile } from '../types';

interface AuthProps {
    onLogin: (user: UserProfile) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate Backend Login
        const mockUser: UserProfile = {
            id: `SKF-${Math.floor(Math.random() * 9000) + 1000}`,
            username: username || 'User',
            email: email,
            netWorth: 0,
            xp: 0,
            level: 'ROOKIE'
        };
        localStorage.setItem('skillfi_user', JSON.stringify(mockUser));
        onLogin(mockUser);
    };

    return (
        <div className="flex items-center justify-center h-full bg-[#050505] font-sans p-4">
            <div className="w-full max-w-md p-8 bg-[#111] border border-gray-800 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-skillfi-neon to-skillfi-accent"></div>
                
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-white tracking-tight mb-2">
                        Skillfi<span className="text-skillfi-neon">.</span>
                    </h2>
                    <p className="text-gray-500 text-sm font-medium">
                        Your Tactical Career & Wealth OS
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Username / Codename</label>
                        <input 
                            required
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-[#080808] border border-gray-700 p-4 rounded-xl text-white focus:border-skillfi-neon outline-none transition-colors text-base"
                            placeholder="Enter your alias"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Secure Link (Email)</label>
                        <input 
                            required
                            type="text" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#080808] border border-gray-700 p-4 rounded-xl text-white focus:border-skillfi-neon outline-none transition-colors text-base"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full py-4 bg-skillfi-neon text-black font-bold text-lg rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] mt-4"
                    >
                        {isRegister ? 'Initialize Account' : 'Access System'}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-gray-800">
                    <button 
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-gray-500 text-sm font-medium hover:text-white transition-colors"
                    >
                        {isRegister ? 'Already have an ID? Login' : 'New to Skillfi? Create ID'}
                    </button>
                </div>
            </div>
        </div>
    );
};