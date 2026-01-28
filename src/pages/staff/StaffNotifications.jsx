import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ArrowLeft, Globe, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';

export default function StaffNotifications() {
    const navigate = useNavigate();
    const { notifications, setNotifications } = useData();
    // Removed local storage logic as it's handled in DataContext

    const clearAll = () => {
        setNotifications([]);
    };

    const removeNotification = (id) => {
        const updated = notifications.filter(n => n.id !== id);
        setNotifications(updated);
    };

    useEffect(() => {
        // Mark as read when entering the page
        const hasUnread = notifications.some(n => n.unread);
        if (hasUnread) {
            const read = notifications.map(n => ({ ...n, unread: false }));
            setNotifications(read);
        }
    }, []); // Only runs on mount - dependencies intentionally empty to run once or we can track unread count

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <header className="sticky top-0 bg-white/90 backdrop-blur-xl z-40 border-b border-gray-100/50 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                </div>
                {notifications.length > 0 && (
                    <button onClick={clearAll} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                    </button>
                )}
            </header>

            <div className="p-6">
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {notifications.length > 0 ? (
                            notifications.map((notif, index) => (
                                <motion.div
                                    key={notif.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`bg-white rounded-[2.5rem] p-1.5 shadow-soft border border-gray-100 flex items-start group transition-all hover:shadow-xl hover:scale-[1.01]
                                        ${notif.unread ? 'border-l-4 border-l-brand-600' : ''}`}
                                >
                                    <div className="bg-brand-900/5 rounded-[2.1rem] p-5 flex items-start gap-4 w-full">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg text-white
                                            ${notif.type === 'web-booking' ? 'bg-brand-900 shadow-brand-900/30' : 'bg-green-600 shadow-green-600/30'}`}>
                                            {notif.type === 'web-booking' ? <Globe size={28} /> : <CheckCircle2 size={28} />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full
                                                    ${notif.type === 'web-booking' ? 'bg-brand-100 text-brand-600' : 'bg-green-100 text-green-600'}`}>
                                                    {notif.type === 'web-booking' ? 'New Web Booking' : 'System Alert'}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{notif.time || 'Just now'}</span>
                                                    <button onClick={() => removeNotification(notif.id)} className="text-gray-300 hover:text-red-500 transition-colors bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-gray-900 text-xl mb-1 truncate">{notif.title}</h3>
                                            <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{notif.message}</p>

                                            {notif.action && (
                                                <button
                                                    onClick={() => navigate(notif.actionPath)}
                                                    className="w-full bg-brand-900 text-white font-bold py-4 rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-brand-800 active:scale-95 transition-all shadow-lg shadow-brand-900/20"
                                                >
                                                    {notif.actionLabel} <ChevronRight size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bell size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">All caught up!</h3>
                                <p className="text-gray-500 text-sm">No new notifications for you right now.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
