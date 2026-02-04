import React, { useState, useEffect } from 'react';
import { UserProfile, LanguageCode } from '../types';
import { t } from '../translations';
import { AudioService } from '../services/audioService';

interface AuthProps {
    onLogin: (user: UserProfile) => void;
    currentLang: LanguageCode;
}

const MOTIVATIONAL_MSGS = [
    "Calibrating your career trajectory...",
    "Aligning skills with market demand...",
    "Preparing your financial roadmap...",
    "Defining your legacy...",
    "Connecting to global opportunities...",
    "Your future is waiting. Let's build it."
];

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const Auth: React.FC<AuthProps> = ({ onLogin, currentLang }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [isForgotPass, setIsForgotPass] = useState(false);
    const [requirePasskey, setRequirePasskey] = useState(false);
    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    
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

        // Motivation Rotation
        const interval = setInterval(() => {
            setCurrentMsgIndex((prev) => (prev + 1) % MOTIVATIONAL_MSGS.length);
        }, 3000);

        // Google Auth Message Listener
        const handleGoogleMessage = (event: MessageEvent) => {
            // In production, validate event.origin
            if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' && event.data?.user) {
                const user = event.data.user;
                setIsGoogleLoading(true);
                
                // Simulate verification delay
                setTimeout(() => {
                    localStorage.setItem('skillfi_user', JSON.stringify(user));
                    onLogin(user);
                    setIsGoogleLoading(false);
                }, 1500);
            }
        };
        window.addEventListener('message', handleGoogleMessage);

        return () => {
            clearInterval(interval);
            window.removeEventListener('message', handleGoogleMessage);
        };
    }, [onLogin]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isForgotPass) {
            alert("Reset link sent to secure inbox.");
            setIsForgotPass(false);
            return;
        }

        if (requirePasskey) {
            const storedKey = localStorage.getItem('skillfi_passkey');
            if (passkeyInput !== storedKey) {
                alert("Incorrect Protocol Key");
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

    const handleGoogleLogin = () => {
        AudioService.playProcessing();
        
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            '',
            'GoogleSignIn',
            `width=${width},height=${height},left=${left},top=${top}`
        );

        if (popup) {
            const html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Sign in - Google Accounts</title>
                    <style>
                        body { font-family: 'Roboto', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #fff; color: #202124; }
                        .container { width: 100%; max-width: 400px; padding: 40px; border: 1px solid #dadce0; border-radius: 8px; text-align: center; }
                        .logo { margin-bottom: 10px; }
                        h1 { font-size: 24px; font-weight: 400; margin: 0 0 10px; }
                        p { margin: 0 0 40px; font-size: 16px; letter-spacing: 0.1px; }
                        .account { display: flex; align-items: center; padding: 12px 10px; border-bottom: 1px solid #f1f3f4; cursor: pointer; text-align: left; border-radius: 4px; }
                        .account:hover { background-color: #f5f5f5; }
                        .avatar { width: 40px; height: 40px; border-radius: 50%; color: white; display: flex; justify-content: center; align-items: center; font-size: 18px; margin-right: 15px; font-weight: 500; }
                        .text .name { font-size: 14px; font-weight: 500; color: #3c4043; }
                        .text .email { font-size: 12px; color: #5f6368; }
                        .disclaimer { margin-top: 30px; font-size: 12px; color: #5f6368; line-height: 1.5; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="logo">
                            <svg viewBox="0 0 75 24" width="75" height="24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                        </div>
                        <h1>Choose an account</h1>
                        <p>to continue to Skillfi</p>
                        
                        <div class="account" onclick="login('user@gmail.com', 'Google User', 'G', '#7e57c2')">
                            <div class="avatar" style="background: #7e57c2">G</div>
                            <div class="text">
                                <div class="name">Google User</div>
                                <div class="email">user@gmail.com</div>
                            </div>
                        </div>

                        <div class="account" onclick="login('dev.alex@gmail.com', 'Alex Dev', 'A', '#0288d1')">
                            <div class="avatar" style="background: #0288d1">A</div>
                            <div class="text">
                                <div class="name">Alex Dev</div>
                                <div class="email">dev.alex@gmail.com</div>
                            </div>
                        </div>

                        <div class="account" onclick="alert('Feature unavailable in demo.')">
                            <div class="avatar" style="background: #f1f3f4; color: #5f6368">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                            </div>
                            <div class="text">
                                <div class="name">Use another account</div>
                            </div>
                        </div>

                        <div class="disclaimer">
                            To continue, Google will share your name, email address, and language preference with Skillfi.
                        </div>
                    </div>
                    <script>
                        function login(email, name, initial, color) {
                            const user = {
                                id: 'GOOG-' + Date.now(),
                                username: name,
                                email: email,
                                netWorth: 0,
                                xp: 0,
                                level: 'ROOKIE',
                                skills: [],
                                credits: 0,
                                isElite: false
                            };
                            window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', user: user }, '*');
                            window.close();
                        }
                    </script>
                </body>
                </html>
            `;
            popup.document.write(html);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-transparent font-sans p-4 relative z-40">
            <div className={`glass-panel w-full max-w-lg p-8 rounded-3xl relative transition-all duration-500 overflow-hidden border border-skillfi-neon/20 shadow-2xl ${isRegister ? 'mt-10 mb-10' : ''}`}>
                
                {/* Motivation Ticker */}
                <div className="absolute top-0 left-0 w-full bg-skillfi-neon/10 border-b border-skillfi-neon/20 py-2 text-center">
                    <p className="text-[10px] font-bold text-skillfi-neon uppercase tracking-widest animate-pulse">
                        {MOTIVATIONAL_MSGS[currentMsgIndex]}
                    </p>
                </div>

                <div className="text-center mb-8 mt-6 relative z-10">
                    <h2 className="text-5xl font-bold font-display text-white tracking-tighter mb-2 drop-shadow-lg kinetic-type">
                        Skillfi<span className="text-skillfi-neon">.</span>
                    </h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] font-mono">
                        The Career and Financial Guidance Counselor
                    </p>
                </div>

                {!requirePasskey && !isForgotPass && (
                    <div className="mb-6">
                        <button 
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading}
                            className="w-full bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 font-bold py-3 rounded-xl flex items-center justify-center transition-all shadow-sm hover:shadow-md mb-4"
                        >
                            {isGoogleLoading ? (
                                <span className="flex items-center gap-2 text-sm">
                                    <span className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
                                    Authenticating...
                                </span>
                            ) : (
                                <>
                                    <GoogleIcon />
                                    <span className="text-sm">Continue with Google</span>
                                </>
                            )}
                        </button>
                        
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-700"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-500 text-[10px] uppercase tracking-widest">Or enter manually</span>
                            <div className="flex-grow border-t border-gray-700"></div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    
                    {!requirePasskey ? (
                        <>
                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t('username', currentLang)}</label>
                                <input 
                                    required
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#080808] border border-gray-700 p-4 rounded-xl text-white focus:border-skillfi-neon focus:bg-black/50 outline-none transition-all duration-300 text-sm placeholder-gray-600"
                                    placeholder="Agent Name"
                                />
                            </div>
                            
                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t('email', currentLang)}</label>
                                <input 
                                    required
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#080808] border border-gray-700 p-4 rounded-xl text-white focus:border-skillfi-neon focus:bg-black/50 outline-none transition-all duration-300 text-sm placeholder-gray-600"
                                    placeholder="secure@uplink.com"
                                />
                            </div>

                            {!isRegister && (
                                <div className="group">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('password', currentLang)}</label>
                                    </div>
                                    <input 
                                        required
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-[#080808] border border-gray-700 p-4 rounded-xl text-white focus:border-skillfi-neon focus:bg-black/50 outline-none transition-all duration-300 text-sm placeholder-gray-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-5">
                            <div className="text-center text-skillfi-neon mb-4 font-mono text-xs uppercase animate-pulse">Encryption Active</div>
                             <div className="group">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Security PIN</label>
                                <input 
                                    required
                                    type="password" 
                                    value={passkeyInput}
                                    onChange={(e) => setPasskeyInput(e.target.value)}
                                    className="w-full bg-[#080808] border border-skillfi-neon p-4 rounded-xl text-white text-center text-2xl tracking-[0.5em] focus:bg-black/50 outline-none transition-all duration-300 shadow-glow"
                                    placeholder="••••"
                                    maxLength={6}
                                />
                            </div>
                        </div>
                    )}

                    {isRegister && !requirePasskey && (
                        <div className="space-y-5 pt-4 border-t border-white/5 animate-fade-in">
                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" onClick={() => setUserType('CHILD')} className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${userType === 'CHILD' ? 'bg-skillfi-neon/10 border-skillfi-neon' : 'bg-[#080808] border-gray-700 hover:border-gray-500'}`}>
                                    <span className="text-2xl">🎓</span>
                                    <span className="text-[10px] font-bold uppercase">{t('student', currentLang)}</span>
                                </button>
                                <button type="button" onClick={() => setUserType('ADULT')} className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${userType === 'ADULT' ? 'bg-skillfi-neon/10 border-skillfi-neon' : 'bg-[#080808] border-gray-700 hover:border-gray-500'}`}>
                                    <span className="text-2xl">💼</span>
                                    <span className="text-[10px] font-bold uppercase">{t('professional', currentLang)}</span>
                                </button>
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t('age', currentLang)} *</label>
                                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-[#080808] border border-gray-700 p-4 rounded-xl text-white outline-none focus:border-skillfi-neon" required />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">{t('qual', currentLang)} *</label>
                                <input type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} className="w-full bg-[#080808] border border-gray-700 p-4 rounded-xl text-white outline-none focus:border-skillfi-neon" required />
                            </div>
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full py-4 bg-skillfi-neon text-black font-bold font-display text-sm tracking-widest uppercase rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] mt-4 relative overflow-hidden group"
                    >
                        <span className="relative z-10">{isRegister ? t('init_btn', currentLang) : (requirePasskey ? 'AUTHENTICATE' : t('login_btn', currentLang))}</span>
                    </button>
                </form>

                {!requirePasskey && (
                    <div className="mt-6 text-center pt-4 border-t border-white/5">
                        <button onClick={() => setIsRegister(!isRegister)} className="text-gray-500 text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">
                            {isRegister ? t('switch_login', currentLang) : t('switch_reg', currentLang)}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};