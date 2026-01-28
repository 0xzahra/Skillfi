
import React from 'react';
import { Notification } from '../types';

export const Notifications: React.FC = () => {
    // Mock Data
    const notifications: Notification[] = [
        { id: '1', type: 'LIKE', text: 'CryptoKing liked your post in Web3 Builders.', time: '2m ago', isRead: false },
        { id: '2', type: 'FOLLOW', text: 'Alice_Web3 started following you.', time: '15m ago', isRead: false },
        { id: '3', type: 'SYSTEM', text: 'Welcome to Skillfi v2.5. Your profile is ready.', time: '1h ago', isRead: true },
        { id: '4', type: 'MENTION', text: 'DevOps_Dan mentioned you: "@User check this PR"', time: '3h ago', isRead: true },
        { id: '5', type: 'LIKE', text: 'DesignGuru liked your portfolio update.', time: '5h ago', isRead: true },
    ];

    return (
        <div className="h-full p-6 md:p-8 overflow-y-auto font-sans animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-display text-white tracking-tight kinetic-type">Notifications</h1>
                <p className="text-gray-500 text-sm mt-1">System alerts and community interactions.</p>
            </header>

            <div className="max-w-3xl mx-auto space-y-3">
                {notifications.map(notif => (
                    <div 
                        key={notif.id} 
                        className={`p-4 rounded-xl border flex items-start gap-4 transition-all hover:bg-white/5 ${
                            notif.isRead 
                            ? 'bg-transparent border-white/5 opacity-70' 
                            : 'bg-white/5 border-skillfi-neon/30 opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.3)]'
                        }`}
                    >
                        <div className={`p-2 rounded-full flex-shrink-0 ${
                            notif.type === 'LIKE' ? 'bg-red-500/10 text-red-400' :
                            notif.type === 'FOLLOW' ? 'bg-blue-500/10 text-blue-400' :
                            notif.type === 'MENTION' ? 'bg-skillfi-neon/10 text-skillfi-neon' :
                            'bg-gray-700/50 text-gray-400'
                        }`}>
                            {notif.type === 'LIKE' && '❤️'}
                            {notif.type === 'FOLLOW' && '👤'}
                            {notif.type === 'MENTION' && '@'}
                            {notif.type === 'SYSTEM' && '⚡'}
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-200 text-sm font-medium">{notif.text}</p>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider mt-1 block">{notif.time}</span>
                        </div>
                        {!notif.isRead && (
                            <div className="w-2 h-2 bg-skillfi-neon rounded-full mt-2"></div>
                        )}
                    </div>
                ))}

                {notifications.length === 0 && (
                     <div className="text-center py-20 text-gray-600">
                        <div className="text-4xl mb-2">🔕</div>
                        <p>No new notifications.</p>
                     </div>
                )}
            </div>
        </div>
    );
};
