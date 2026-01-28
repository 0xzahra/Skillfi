import React, { useState } from 'react';
import { UserProfile } from '../types';

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
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans animate-fade-in overflow-y-auto h-full pb-20">
            <header className="mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-bold font-display text-white tracking-tight kinetic-type">System Configuration</h1>
                <p className="text-gray-500 text-sm mt-1">Manage identity, integrations, and data protocols.</p>
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
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Codename / Username</label>
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

                {/* SOCIALS SECTION */}
                <section className="glass-panel rounded-2xl p-6">
                    <h2 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                        Network Integrations
                    </h2>
                    <div className="space-y-4">
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-gray-500 text-sm">𝕏 (Twitter)</span>
                            <input 
                                name="twitter"
                                type="text" 
                                placeholder="@username"
                                value={formData.twitter}
                                onChange={handleChange}
                                className="w-full bg-[#080808] border border-gray-700 p-3 pl-24 rounded-xl text-white focus:border-skillfi-neon outline-none transition-colors"
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-gray-500 text-sm">LinkedIn</span>
                            <input 
                                name="linkedin"
                                type="text" 
                                placeholder="Profile URL"
                                value={formData.linkedin}
                                onChange={handleChange}
                                className="w-full bg-[#080808] border border-gray-700 p-3 pl-24 rounded-xl text-white focus:border-skillfi-neon outline-none transition-colors"
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-gray-500 text-sm">GitHub</span>
                            <input 
                                name="github"
                                type="text" 
                                placeholder="Username"
                                value={formData.github}
                                onChange={handleChange}
                                className="w-full bg-[#080808] border border-gray-700 p-3 pl-24 rounded-xl text-white focus:border-skillfi-neon outline-none transition-colors"
                            />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <button 
                        onClick={handleSave}
                        className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-skillfi-neon transition-all flex items-center gap-2 shadow-lg"
                    >
                        {isSaved ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-600">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                                Saved
                            </>
                        ) : 'Save Changes'}
                    </button>
                </div>

                {/* DANGER ZONE */}
                <section className="bg-red-900/10 border border-red-900/30 rounded-2xl p-6 mt-12 backdrop-blur-sm">
                    <h2 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        Danger Zone
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-red-900/20">
                            <div>
                                <h3 className="font-bold text-gray-200">Clear Activity Logs</h3>
                                <p className="text-xs text-gray-500">Permanently delete all recent activity history.</p>
                            </div>
                            <button 
                                onClick={onClearActivity}
                                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Clear History
                            </button>
                        </div>

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
                    </div>
                </section>
            </div>
        </div>
    );
};