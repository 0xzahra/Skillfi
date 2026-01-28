import React, { useState } from 'react';
import { UserProfile } from '../types';

interface AuthProps {
    onLogin: (user: UserProfile) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    
    // Form State
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState<string>('');
    const [userType, setUserType] = useState<'ADULT' | 'CHILD'>('ADULT');
    const [qualification, setQualification] = useState('');
    const [isTechie, setIsTechie] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (isRegister && !age) {
            alert("Please enter your age.");
            return;
        }

        // Simulate Backend Login/Register
        const mockUser: UserProfile = {
            id: `SKF-${Math.floor(Math.random() * 9000) + 1000}`,
            username: username || 'User',
            email: email,
            netWorth: 0,
            xp: 0,
            level: 'ROOKIE',
            age: isRegister ? parseInt(age) : undefined,
            userType: isRegister ? userType : undefined,
            qualification: isRegister ? qualification : undefined,
            isTechie: isRegister ? isTechie : undefined
        };
        
        localStorage.setItem('skillfi_user', JSON.stringify(mockUser));
        onLogin(mockUser);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-transparent font-sans p-4">
            <div className={`w-full max-w-lg p-8 bg-[#111]/90 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl relative transition-all duration-500 ${isRegister ? 'mt-10 mb-10' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-skillfi-neon to-skillfi-accent"></div>
                
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-white tracking-tight mb-2">
                        Skillfi<span className="text-skillfi-neon">.</span>
                    </h2>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                        {isRegister ? 'New Operative Registration' : 'Secure System Access'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Common Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Codename / Username</label>
                            <input 
                                required
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#080808]/50 border border-gray-700 p-3.5 rounded-xl text-white focus:border-skillfi-neon outline-none transition-colors text-base placeholder-gray-600"
                                placeholder="Enter your alias"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Secure Link (Email)</label>
                            <input 
                                required
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#080808]/50 border border-gray-700 p-3.5 rounded-xl text-white focus:border-skillfi-neon outline-none transition-colors text-base placeholder-gray-600"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    {/* Extended Registration Fields */}
                    {isRegister && (
                        <div className="space-y-6 pt-4 border-t border-gray-800 animate-fade-in">
                            
                            {/* User Type Selection */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setUserType('CHILD')}
                                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${userType === 'CHILD' ? 'bg-skillfi-neon/10 border-skillfi-neon text-white' : 'bg-[#080808]/50 border-gray-700 text-gray-500 hover:border-gray-500'}`}
                                >
                                    <span className="text-2xl">🎓</span>
                                    <span className="text-xs font-bold uppercase">Student / Child</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUserType('ADULT')}
                                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${userType === 'ADULT' ? 'bg-skillfi-neon/10 border-skillfi-neon text-white' : 'bg-[#080808]/50 border-gray-700 text-gray-500 hover:border-gray-500'}`}
                                >
                                    <span className="text-2xl">💼</span>
                                    <span className="text-xs font-bold uppercase">Adult / Pro</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Age</label>
                                    <input 
                                        type="number" 
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="w-full bg-[#080808]/50 border border-gray-700 p-3.5 rounded-xl text-white focus:border-skillfi-neon outline-none transition-colors placeholder-gray-600"
                                        placeholder="Age"
                                        min="5"
                                        max="100"
                                    />
                                </div>
                                <div className="flex flex-col justify-end">
                                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Tech Status</label>
                                     <button
                                        type="button"
                                        onClick={() => setIsTechie(!isTechie)}
                                        className={`w-full p-3.5 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 ${isTechie ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-[#080808]/50 border-gray-700 text-gray-500'}`}
                                     >
                                         {isTechie ? '💻 Techie' : '📄 Non-Techie'}
                                     </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                                    {userType === 'CHILD' ? 'School / Grade Level' : 'Qualifications / Degree'}
                                </label>
                                <input 
                                    type="text" 
                                    value={qualification}
                                    onChange={(e) => setQualification(e.target.value)}
                                    className="w-full bg-[#080808]/50 border border-gray-700 p-3.5 rounded-xl text-white focus:border-skillfi-neon outline-none transition-colors placeholder-gray-600"
                                    placeholder={userType === 'CHILD' ? 'e.g., 10th Grade, High School' : 'e.g., BSc Computer Science, MBA'}
                                />
                            </div>

                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full py-4 bg-skillfi-neon text-black font-bold text-lg rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] mt-6 relative overflow-hidden group"
                    >
                        <span className="relative z-10">{isRegister ? 'Initialize Account' : 'Access System'}</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
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