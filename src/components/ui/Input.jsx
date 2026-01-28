import React from 'react';

export function Input({ icon: Icon, label, ...props }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-gray-600 ml-1">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors">
            <Icon size={20} />
          </div>
        )}
        <input 
          className={`w-full bg-white border border-gray-200 text-gray-900 rounded-2xl py-4 ${Icon ? 'pl-12' : 'pl-4'} pr-4 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all shadow-sm placeholder:text-gray-400`}
          {...props}
        />
      </div>
    </div>
  );
}
