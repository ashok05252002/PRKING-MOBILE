import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

export function BottomNav({ items }) {
  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      {/* Enhanced Glassmorphism Container */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-soft shadow-brand-900/10 p-2 flex justify-between items-center ring-1 ring-white/50">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center w-full py-3 rounded-2xl transition-all duration-300
              ${isActive ? 'text-brand-700' : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="relative z-10 transition-transform duration-300">
                  <item.icon 
                    size={24} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`mb-1 ${isActive ? 'scale-110' : 'scale-100'}`}
                  />
                </div>
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-0 bg-white/80 shadow-sm rounded-2xl -z-0 border border-white/50"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="text-[10px] font-bold z-10 tracking-wide">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
