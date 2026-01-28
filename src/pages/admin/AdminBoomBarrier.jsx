import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    MapPin,
    Power,
    Clock,
    CheckCircle2,
    AlertTriangle,
    ChevronDown
} from 'lucide-react';

import { useData } from '../../context/DataContext';

// --- Data Configuration ---
// Removed hardcoded barriersByLocation - now in DataContext

export default function AdminBoomBarrier() {
    const navigate = useNavigate();
    const { barriers: globalBarriers, setBarriers: setGlobalBarriers } = useData();
    const [selectedLocation, setSelectedLocation] = useState('A');
    // We derive 'barriers' from global state. We don't need local state for it, but for compatibility with existing code we might need to map it.
    // Actually simplicity is better: just use globalBarriers[selectedLocation].
    const barriers = globalBarriers[selectedLocation] || [];

    // We use a local map for timer display only
    const [timerDisplay, setTimerDisplay] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const activeIntervals = useRef({});

    useEffect(() => {
        return () => {
            Object.values(activeIntervals.current).forEach(clearInterval);
        };
    }, []);

    // Helper to update a specific barrier in the global state
    const updateBarrierState = (barrierId, updates) => {
        setGlobalBarriers(prev => {
            const locationBarriers = prev[selectedLocation].map(b =>
                b.id === barrierId ? { ...b, ...updates } : b
            );
            return { ...prev, [selectedLocation]: locationBarriers };
        });
    };

    const closeBarrier = (barrierId) => {
        if (activeIntervals.current[barrierId]) {
            clearInterval(activeIntervals.current[barrierId]);
        }

        updateBarrierState(barrierId, { status: 'closing' });

        setTimerDisplay(prev => {
            const newState = { ...prev };
            delete newState[barrierId];
            return newState;
        });

        const startTime = Date.now();
        const duration = 2000;

        const closeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.max(100 - (elapsed / duration) * 100, 0);

            updateBarrierState(barrierId, { progress: newProgress });

            if (newProgress <= 0) {
                clearInterval(closeInterval);
                delete activeIntervals.current[barrierId];
                updateBarrierState(barrierId, { status: 'closed', progress: 0 });
            }
        }, 16);

        activeIntervals.current[barrierId] = closeInterval;
    };

    const openBarrier = (barrierId) => {
        if (activeIntervals.current[barrierId]) {
            clearInterval(activeIntervals.current[barrierId]);
        }

        updateBarrierState(barrierId, { status: 'opening', progress: 0 });

        const startTime = Date.now();
        const duration = 2000;

        const openInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / duration) * 100, 100);

            updateBarrierState(barrierId, { progress: newProgress });

            if (newProgress >= 100) {
                clearInterval(openInterval);
                updateBarrierState(barrierId, { status: 'open', progress: 100 });

                let countdown = 5;
                setTimerDisplay(prev => ({ ...prev, [barrierId]: 5 }));

                const countdownInterval = setInterval(() => {
                    countdown--;
                    setTimerDisplay(prev => ({ ...prev, [barrierId]: countdown }));
                    if (countdown <= 0) {
                        clearInterval(countdownInterval);
                        closeBarrier(barrierId);
                    }
                }, 1000);
                activeIntervals.current[barrierId] = countdownInterval;
            }
        }, 16);

        activeIntervals.current[barrierId] = openInterval;
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900 pb-20">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                            <ArrowLeft size={22} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-gray-900">Barrier Control</h1>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                System Online
                            </div>
                        </div>
                    </div>

                    {/* Location Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 bg-brand-900 text-white pl-4 pr-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-950 transition-all shadow-lg shadow-gray-200"
                        >
                            <MapPin size={16} className="text-gray-300" />
                            <span>Location {selectedLocation}</span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                                >
                                    <div className="p-1">
                                        {['A', 'B', 'C'].map(loc => (
                                            <button
                                                key={loc}
                                                onClick={() => { setSelectedLocation(loc); setIsDropdownOpen(false); }}
                                                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${selectedLocation === loc ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                Location {loc.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {barriers.map(barrier => {
                        const countdownValue = timerDisplay[barrier.id];
                        const isOpen = barrier.status === 'open';
                        const isClosed = barrier.status === 'closed';
                        const isMoving = barrier.status === 'opening' || barrier.status === 'closing';

                        return (
                            <motion.div key={barrier.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/60 relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{barrier.name}</h3>
                                        <p className="text-sm text-gray-400 font-medium flex items-center gap-1">{barrier.location}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${isOpen ? 'bg-emerald-100 text-emerald-700' :
                                        isClosed ? 'bg-gray-100 text-gray-600' :
                                            'bg-brand-100 text-brand-700'
                                        }`}>
                                        {isMoving ? <span className="animate-spin text-[10px]">⏳</span> : null}
                                        {barrier.status}
                                    </div>
                                </div>

                                {/* Animation Region */}
                                <div className="h-40 relative bg-gray-50 rounded-2xl border border-gray-100 mb-6 flex items-end px-8 overflow-hidden">
                                    <div className="absolute bottom-0 left-0 w-full h-4 bg-gray-200 border-t border-gray-300"></div>

                                    {/* Base Post */}
                                    <div className="w-12 h-20 bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-xl relative z-30 mb-0 shadow-lg border-x border-t border-gray-600">
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse border-2 border-red-400"></div>
                                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-800 rounded-full border border-gray-600"></div>
                                    </div>

                                    {/* Rotating Arm */}
                                    <motion.div
                                        className="h-4 origin-left absolute left-[56px] bottom-[28px] rounded-r-lg z-20 shadow-2xl border border-white/20"
                                        style={{
                                            width: 'calc(100% - 90px)',
                                            background: 'repeating-linear-gradient(90deg, #dc2626, #dc2626 20px, #ffffff 20px, #ffffff 40px)'
                                        }}
                                        initial={false}
                                        animate={{ rotate: isClosed ? 0 : isMoving && barrier.status === 'opening' ? -80 : isOpen ? -90 : -10 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 80,
                                            damping: 15,
                                            mass: 1.2
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                                    </motion.div>

                                    {/* Timer/Status Badge */}
                                    <AnimatePresence>
                                        {countdownValue > 0 && isOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="absolute top-4 right-4 z-40 bg-brand-900 text-white px-3 py-1.5 rounded-lg text-sm font-black flex items-center gap-2 shadow-xl border border-brand-800"
                                            >
                                                <Clock size={16} className="animate-pulse" />
                                                <span>{countdownValue}s</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button
                                    onClick={() => !isOpen && !isMoving && openBarrier(barrier.id)}
                                    disabled={isOpen || isMoving}
                                    className={`relative overflow-hidden w-full py-4 rounded-xl font-bold text-sm tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg
                                        ${isOpen ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-brand-900 text-white hover:bg-brand-950 active:scale-95 shadow-brand-900/10'}
                                        ${isMoving ? 'opacity-90 cursor-wait' : ''}
                                    `}
                                >
                                    {isMoving ? (
                                        <><span className="animate-spin">⏳</span> PROCESSING...</>
                                    ) : isOpen ? (
                                        <><CheckCircle2 size={18} /> BARRIER OPEN</>
                                    ) : (
                                        <><Power size={18} /> OPEN BARRIER</>
                                    )}
                                    {isMoving && (
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-1 bg-white/30"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${barrier.progress}%` }}
                                        />
                                    )}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
