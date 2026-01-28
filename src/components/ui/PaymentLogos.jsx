import React from 'react';
import { Wifi } from 'lucide-react';

export const VisaLogo = ({ className }) => (
  <svg viewBox="0 0 48 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.533 0.600098L12.217 15.4001H8.11703L4.98303 3.6331C4.81703 2.9661 4.63303 2.6661 4.05003 2.3161C2.96703 1.7331 1.41703 1.1831 0.133026 0.933098L0.233026 0.600098H6.76703C7.60003 0.600098 8.35003 1.1661 8.53303 2.1331L10.167 10.9661L14.367 0.600098H18.533ZM34.783 10.5171C34.800 6.5501 29.367 6.3331 29.400 4.5661C29.417 4.0331 29.933 3.4661 31.067 3.3161C31.633 3.2331 33.183 3.1831 34.800 3.9331L35.467 0.833098C34.567 0.516098 33.400 0.233098 31.967 0.233098C28.333 0.233098 25.733 2.1661 25.717 4.9331C25.683 7.0331 27.667 8.2161 29.150 8.9501C30.683 9.7001 31.200 10.1661 31.183 10.8661C31.167 11.9331 29.900 12.4161 28.733 12.4161C27.683 12.4161 26.033 12.1161 25.067 11.6661L24.333 14.8831C25.267 15.3161 27.000 15.6831 28.933 15.6831C32.750 15.6831 35.300 13.7831 34.783 10.5171ZM45.033 15.4001H48.133L45.417 0.600098H42.400C41.650 0.600098 40.967 1.0331 40.683 1.7661L34.733 15.4001H38.600L39.367 13.2661H44.383L44.833 15.4001ZM40.450 10.3331L42.500 4.6831L43.700 10.3331H40.450ZM24.317 0.600098L21.133 15.4001H17.433L20.617 0.600098H24.317Z" fill="#1A1F71"/>
  </svg>
);

export const MastercardLogo = ({ className }) => (
  <svg viewBox="0 0 24 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="8" r="7" fill="#EB001B"/>
    <circle cx="17" cy="8" r="7" fill="#F79E1B"/>
    <path d="M12 12.6285C13.5674 11.5307 14.5882 9.7046 14.5882 7.64706C14.5882 5.58952 13.5674 3.76343 12 2.66553C10.4326 3.76343 9.41176 5.58952 9.41176 7.64706C9.41176 9.7046 10.4326 11.5307 12 12.6285Z" fill="#FF5F00"/>
  </svg>
);

export const ApplePayLogo = ({ className }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <img 
      src="https://download.logo.wine/logo/Apple_Pay/Apple_Pay-Logo.wine.png" 
      alt="Apple Pay" 
      className="h-8 w-auto object-contain"
    />
  </div>
);

export const GooglePayLogo = ({ className }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <img 
      src="https://images.financemagnates.com/images/google%20pay_id_d9614ea1-31f6-4cdd-8cb7-e72e343b738e_size900.jpg" 
      alt="Google Pay" 
      className="h-8 w-auto object-contain rounded-md"
    />
  </div>
);

export const PayPalLogo = ({ className }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <span className="text-blue-800 font-bold italic text-xl">PayPal</span>
  </div>
);

export const WaiverLogo = ({ className }) => (
  <div className={`flex items-center justify-center ${className}`}>
     <span className="text-gray-600 font-serif font-bold italic text-lg">Signature</span>
  </div>
);

export const TapLogo = ({ className }) => (
  <div className={`flex items-center justify-center ${className}`}>
     <Wifi className="text-brand-900 rotate-90" size={24} />
  </div>
);
