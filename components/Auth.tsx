import React, { useState, useEffect } from 'react';
import { UserProfile, LanguageCode } from '../types';
import { t } from '../translations';
import { AudioService } from '../services/audioService';

interface AuthProps {
    onLogin: (user: UserProfile) => void;
    currentLang: LanguageCode;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, currentLang }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [isForgotPass, setIsForgotPass] = useState(false);
    const [requirePasskey, setRequirePasskey] = useState(false);
    
    // Form State
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passkeyInput, setPasskeyInput] = useState('');
    const [age, setAge] = useState<string>('');
    const [userType, setUserType] = useState<'ADULT' | 'CHILD'>('ADULT');
    const [qualification, setQualification] = useState('');
    const [isTechie, setIsTechie] = useState(false);

    useEffect(() => {
        // Check if a passkey exists in storage
        if (localStorage.getItem('skillfi_passkey')) {
            setRequirePasskey(true);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isForgotPass) {
            alert("Reset link sent.");
            setIsForgotPass(false);
            return;
        }

        if (requirePasskey) {
            const storedKey = localStorage.getItem('skillfi_passkey');
            if (passkeyInput !== storedKey) {
                alert("Incorrect Passkey");
                AudioService.playAlert();
                return;
            }
        }

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
            isTechie: isRegister ? isTechie : undefined,
            skills: [],
            credits: 0,
            isElite: false
        };
        
        localStorage.setItem('skillfi_user', JSON.stringify(mockUser));
        onLogin(mockUser);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-transparent font-sans p-4 relative z-40">
            <div className={`glass-panel w-full max-w-lg p-8 rounded-3xl relative transition-all duration-500 overflow-hidden ${isRegister ? 'mt-10 mb-10' : ''}`}>
                
                <div className="text-center mb-10 relative z-10">
                    <h2 className="text-5xl font-bold font-display text-white tracking-tighter mb-2 drop-shadow-lg kinetic-type">
                        Skillfi<span className="text-skillfi-neon">.</span>
                    </h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] font-mono">
                        {isRegister ? t('auth_reg_title', currentLang) : t('auth_title', currentLang)}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    
                    {!requirePasskey ? (
                        <div className="space-y-5">
                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{t('username', currentLang)}</label>
                                <input 
                                    required
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-skillfi-neon/50 focus:bg-white/10 outline-none transition-all duration-300 text-sm placeholder-gray-600 backdrop-blur-sm"
                                />
                            </div>
                            
                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{t('email', currentLang)}</label>
                                <input 
                                    required
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-skillfi-neon/50 focus:bg-white/10 outline-none transition-all duration-300 text-sm placeholder-gray-600 backdrop-blur-sm"
                                />
                            </div>

                            {!isRegister && (
                                <div className="group">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('password', currentLang)}</label>
                                    </div>
                                    <input 
                                        required
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-skillfi-neon/50 focus:bg-white/10 outline-none transition-all duration-300 text-sm placeholder-gray-600 backdrop-blur-sm"
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="text-center text-skillfi-neon mb-4 font-mono text-xs uppercase">Device Secured</div>
                             <div className="group">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Enter Passkey</label>
                                <input 
                                    required
                                    type="password" 
                                    value={passkeyInput}
                                    onChange={(e) => setPasskeyInput(e.target.value)}
                                    className="w-full bg-white/5 border border-skillfi-neon p-4 rounded-xl text-white text-center text-2xl tracking-widest focus:bg-white/10 outline-none transition-all duration-300"
                                    placeholder="••••"
                                    maxLength={6}
                                />
                            </div>
                        </div>
                    )}

                    {isRegister && !requirePasskey && (
                        <div className="space-y-6 pt-6 border-t border-white/5 animate-fade-in">
                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" onClick={() => setUserType('CHILD')} className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 ${userType === 'CHILD' ? 'bg-skillfi-neon/10 border-skillfi-neon/50' : 'bg-white/5 border-transparent'}`}>
                                    <span className="text-2xl">🎓</span>
                                    <span className="text-[10px] font-bold uppercase">{t('student', currentLang)}</span>
                                </button>
                                <button type="button" onClick={() => setUserType('ADULT')} className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 ${userType === 'ADULT' ? 'bg-skillfi-neon/10 border-skillfi-neon/50' : 'bg-white/5 border-transparent'}`}>
                                    <span className="text-2xl">💼</span>
                                    <span className="text-[10px] font-bold uppercase">{t('professional', currentLang)}</span>
                                </button>
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{t('age', currentLang)} *</label>
                                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none" required />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{t('qual', currentLang)} *</label>
                                <input type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none" required />
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full py-4 bg-skillfi-neon text-black font-bold font-display text-sm tracking-widest uppercase rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] mt-6 relative overflow-hidden group"
                    >
                        <span className="relative z-10">{isRegister ? t('init_btn', currentLang) : (requirePasskey ? 'UNLOCK PROTOCOL' : t('login_btn', currentLang))}</span>
                    </button>
                </form>

                {!requirePasskey && (
                    <div className="mt-8 text-center pt-6 border-t border-white/5">
                        <button onClick={() => setIsRegister(!isRegister)} className="text-gray-500 text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">
                            {isRegister ? t('switch_login', currentLang) : t('switch_reg', currentLang)}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};