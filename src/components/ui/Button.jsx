import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ children, variant = 'primary', className, ...props }) {
  const baseStyles = "w-full py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";
  
  const variants = {
    primary: "bg-brand-900 text-white shadow-lg shadow-brand-900/20 hover:bg-brand-950",
    secondary: "bg-white text-brand-900 border border-brand-100 shadow-sm hover:bg-brand-50",
    ghost: "bg-transparent text-brand-900 hover:bg-brand-50/50",
    outline: "border-2 border-white/20 text-white hover:bg-white/10"
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      className={twMerge(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
