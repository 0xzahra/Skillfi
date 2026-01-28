import React, { useState } from 'react';
import { UserProfile } from '../types';
import { AudioService } from '../services/audioService';

interface SettingsProps {
    user: UserProfile;
    onUpdateUser: (updatedUser: UserProfile) => void;
    onClearActivity: () => void;
    onDeleteAccount: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, onClearActivity, onDeleteAccount }) => {
    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email,
        twitter: user.socials?.twitter || '',
        linkedin: user.socials?.linkedin || '',
        github: user.socials?.github || ''
    });
    const [isSaved, setIsSaved] = useState(false);
    const [passkey, setPasskey] = useState('');
    const [parentalControl, setParentalControl] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setIsSaved(false);
    };

    const handleSave = () => {
        const updatedUser: UserProfile = {
            ...user,
            username: formData.username,
            email: formData.email,
            socials: {
                twitter: formData.twitter,
                linkedin: formData.linkedin,
                github: formData.github
            }
        };
        onUpdateUser(updatedUser);
        setIsSaved(true);
        AudioService.playSuccess();
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleExportData = () => {
        const dataStr = JSON.stringify(user, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'skillfi_data.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        AudioService.playSuccess();
    };

    const handleSetPasskey = () => {
        if(passkey.length < 4) {
            alert("Passkey must be at least 4 digits");
            return;
        }
        localStorage.setItem('skillfi_passkey', passkey);
        setPasskey('');
        alert("Passkey enabled. You will need this to login.");
        AudioService.playSuccess();
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans animate-fade-in overflow-y-auto h-full pb-20">
            <header className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-bold font-display text-white tracking-tight kinetic-type">System Configuration</h1>
                <p className="text-gray-500 text-sm mt-1">Manage identity, security, and data protocols.</p>
            </header>

            <div className="space-y-8">
                {/* IDENTITY SECTION */}
                <section className="glass-panel rounded-2xl p-6">
                    <h2 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-skillfi-neon">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        Agent Identity
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Username</label>
                            <input 
                                name="username"
                                type="text" 
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-[#080808] border border-gray-700 p-3 rounded-xl text-white focus:border-skillfi-neon outline-none transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Secure Link (Email)</label>
                            <input 
                                name="email"
                                type="email" 
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-[#080808] border border-gray-700 p-3 rounded-xl text-white focus:border-skillfi-neon outline-none transition-colors"
                            />
                        </div>
                    </div>
                </section>

                {/* SECURITY SECTION */}
                <section className="glass-panel rounded-2xl p-6">
                    <h2 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        Security & Controls
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Set Passkey (PIN)</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="password" 
                                        value={passkey}
                                        onChange={(e) => setPasskey(e.target.value)}
                                        placeholder="Enter PIN"
                                        className="flex-1 bg-[#080808] border border-gray-700 p-3 rounded-xl text-white focus:border-skillfi-neon outline-none"
                                        maxLength={6}
                                    />
                                    <button onClick={handleSetPasskey} className="bg-white/10 hover:bg-white/20 px-4 rounded-xl text-sm font-bold uppercase">Set</button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between bg-[#080808] p-3 rounded-xl border border-gray-700">
                                <div>
                                    <div className="text-sm font-bold text-white">Parental Control</div>
                                    <div className="text-[10px] text-gray-500">Restricts Finance/Trading modules</div>
                                </div>
                                <button 
                                    onClick={() => { setParentalControl(!parentalControl); localStorage.setItem('skillfi_parental', (!parentalControl).toString()); }}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${parentalControl ? 'bg-skillfi-neon' : 'bg-gray-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-black rounded-full transition-transform ${parentalControl ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center space-y-4">
                             <button 
                                onClick={handleExportData}
                                className="w-full py-3 bg-blue-900/20 border border-blue-500/30 text-blue-400 font-bold uppercase text-xs rounded-xl hover:bg-blue-900/40 transition-all flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                Export User Data (JSON)
                            </button>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <button 
                        onClick={handleSave}
                        className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-skillfi-neon transition-all flex items-center gap-2 shadow-lg"
                    >
                        {isSaved ? 'Saved Successfully' : 'Save Changes'}
                    </button>
                </div>

                {/* DANGER ZONE */}
                <section className="bg-red-900/10 border border-red-900/30 rounded-2xl p-6 mt-12 backdrop-blur-sm">
                    <h2 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
                        Danger Zone
                    </h2>
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-red-900/20">
                        <div>
                            <h3 className="font-bold text-red-400">Delete Account</h3>
                            <p className="text-xs text-gray-500">Wipe all data and terminate access immediately.</p>
                        </div>
                        <button 
                            onClick={onDeleteAccount}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};