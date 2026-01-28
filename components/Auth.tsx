import React, { useState } from 'react';
import { UserProfile, LanguageCode } from '../types';
import { t } from '../translations';

interface AuthProps {
    onLogin: (user: UserProfile) => void;
    currentLang: LanguageCode;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, currentLang }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [isForgotPass, setIsForgotPass] = useState(false);
    
    // Form State
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState<string>('');
    const [userType, setUserType] = useState<'ADULT' | 'CHILD'>('ADULT');
    const [qualification, setQualification] = useState('');
    const [isTechie, setIsTechie] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isForgotPass) {
            if (!email) {
                alert("Please enter email to recover account.");
                return;
            }
            alert(`${t('reset_link', currentLang)} ${email}`);
            setIsForgotPass(false);
            return;
        }

        if (isRegister) {
            if (!age) {
                alert(t('age', currentLang) + " is required.");
                return;
            }
            if (!qualification) {
                alert(t('qual', currentLang) + " is required.");
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

    if (isForgotPass) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-transparent font-sans p-4 relative z-50">
                <div className="glass-panel w-full max-w-lg p-8 rounded-3xl relative">
                    <h2 className="text-xl font-bold font-display text-white mb-6 text-center kinetic-type">{t('forgot_pass', currentLang)}</h2>
                    <div className="space-y-4">
                         <div className="group">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{t('email', currentLang)}</label>
                            <input 
                                required
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-skillfi-neon transition-colors backdrop-blur-sm"
                            />
                        </div>
                        <button 
                            onClick={handleSubmit}
                            className="w-full py-4 bg-skillfi-neon text-black font-bold uppercase rounded-xl hover:bg-white transition-all shadow-lg font-display tracking-widest"
                        >
                            {t('reset_link', currentLang)}
                        </button>
                        <button 
                            onClick={() => setIsForgotPass(false)}
                            className="w-full text-center text-gray-500 text-sm hover:text-white mt-2 font-medium"
                        >
                            Cancel Operation
                        </button>
                    </div>
                </div>
             </div>
        );
    }

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
                    
                    {/* Common Fields */}
                    <div className="space-y-5">
                        <div className="group">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-skillfi-neon transition-colors">{t('username', currentLang)}</label>
                            <input 
                                required
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-skillfi-neon/50 focus:bg-white/10 outline-none transition-all duration-300 text-sm placeholder-gray-600 backdrop-blur-sm"
                            />
                        </div>
                        
                        <div className="group">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 group-focus-within:text-skillfi-neon transition-colors">{t('email', currentLang)}</label>
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
                                    <button type="button" onClick={() => setIsForgotPass(true)} className="text-[10px] text-skillfi-neon hover:text-white transition-colors font-bold tracking-wide">
                                        {t('forgot_pass', currentLang)}
                                    </button>
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

                    {isRegister && (
                        <div className="space-y-6 pt-6 border-t border-white/5 animate-fade-in">
                            
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setUserType('CHILD')}
                                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${userType === 'CHILD' ? 'bg-skillfi-neon/10 border-skillfi-neon/50 text-white shadow-[0_0_15px_rgba(0,255,255,0.1)]' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'}`}
                                >
                                    <span className="text-2xl">🎓</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('student', currentLang)}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUserType('ADULT')}
                                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${userType === 'ADULT' ? 'bg-skillfi-neon/10 border-skillfi-neon/50 text-white shadow-[0_0_15px_rgba(0,255,255,0.1)]' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'}`}
                                >
                                    <span className="text-2xl">💼</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('professional', currentLang)}</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{t('age', currentLang)} *</label>
                                    <input 
                                        type="number" 
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-skillfi-neon/50 outline-none transition-all font-mono"
                                        placeholder="00"
                                        min="5"
                                        max="100"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col justify-end">
                                     <button
                                        type="button"
                                        onClick={() => setIsTechie(!isTechie)}
                                        className={`w-full p-4 rounded-xl border font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${isTechie ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'}`}
                                     >
                                         {isTechie ? `💻 ${t('techie', currentLang)}` : `📄 ${t('non_techie', currentLang)}`}
                                     </button>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                                    {t('qual', currentLang)} *
                                </label>
                                <input 
                                    type="text" 
                                    value={qualification}
                                    onChange={(e) => setQualification(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:border-skillfi-neon/50 outline-none transition-all"
                                    placeholder={userType === 'CHILD' ? 'e.g., 10th Grade' : 'e.g., BSc Comp Sci'}
                                    required
                                />
                            </div>

                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full py-4 bg-skillfi-neon text-black font-bold font-display text-sm tracking-widest uppercase rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] mt-6 relative overflow-hidden group"
                    >
                        <span className="relative z-10">{isRegister ? t('init_btn', currentLang) : t('login_btn', currentLang)}</span>
                        <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-white/5">
                    <button 
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-gray-500 text-xs font-bold uppercase tracking-wider hover:text-white transition-colors"
                    >
                        {isRegister ? t('switch_login', currentLang) : t('switch_reg', currentLang)}
                    </button>
                </div>
            </div>
        </div>
    );
};