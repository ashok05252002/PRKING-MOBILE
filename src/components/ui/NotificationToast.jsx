import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Globe, Calendar, ArrowRight } from 'lucide-react';

export const NotificationToast = ({ show, booking, onClose, onView }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: -100, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -100, opacity: 0, scale: 0.9 }}
                    className="fixed top-6 left-4 right-4 z-[100] pointer-events-none"
                >
                    <div className="max-w-md mx-auto bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl shadow-brand-900/20 overflow-hidden pointer-events-auto">
                        <div className="p-1 min-w-0">
                            <div className="bg-brand-900/5 rounded-[1.4rem] p-4 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-brand-900 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-900/20">
                                    <Globe className="text-white" size={24} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest bg-brand-100 px-2 py-0.5 rounded-full">
                                            New Web Booking
                                        </span>
                                        <button
                                            onClick={onClose}
                                            className="text-gray-400 hover:text-gray-600 p-1"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <h3 className="font-bold text-gray-900 text-lg truncate mb-1">
                                        {booking?.location || 'Location A'}
                                    </h3>

                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-4">
                                        <Calendar size={14} className="text-brand-500" />
                                        <span>Today • {booking?.time || '10:30 AM'}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={onView}
                                            className="flex-1 bg-brand-900 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                                        >
                                            View Pass <ArrowRight size={14} />
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="px-4 bg-gray-100 text-gray-600 text-xs font-bold py-3 rounded-xl active:scale-95 transition-all"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
