import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, Loader2, QrCode, CreditCard, ArrowRight, Lock, Wifi, PenTool, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ApplePayLogo, GooglePayLogo, VisaLogo, MastercardLogo, PayPalLogo, WaiverLogo, TapLogo } from '../../components/ui/PaymentLogos';

export default function AdminScanner() {
  const navigate = useNavigate();
  // Lifecycle: scanning -> detecting -> details -> qr-pass -> validating-exit -> success
  const [status, setStatus] = useState('scanning');

  useEffect(() => {
    let timeout;
    if (status === 'scanning') {
      timeout = setTimeout(() => setStatus('detecting'), 3000);
    } else if (status === 'detecting') {
      timeout = setTimeout(() => setStatus('details'), 1500);
    } else if (status === 'details') {
      timeout = setTimeout(() => setStatus('qr-pass'), 2500);
    } else if (status === 'qr-pass') {
      timeout = setTimeout(() => setStatus('validating-exit'), 4000);
    } else if (status === 'validating-exit') {
      timeout = setTimeout(() => setStatus('success'), 2500);
    } else if (status === 'success') {
      timeout = setTimeout(() => navigate('/admin/dashboard'), 4000);
    }
    return () => clearTimeout(timeout);
  }, [status]);

  // --- Sub-View Renderers ---

  return (
    <div className="h-screen bg-black relative flex flex-col overflow-hidden">
      {/* Header */}
      <div className="absolute top-6 left-4 z-50">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Camera View - Mocked as Black Background */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {/* Scanning Overlay */}
        <AnimatePresence>
          {status === 'scanning' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
            >
              <div className="w-72 h-72 border-2 border-white/30 rounded-3xl relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-500 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-500 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-500 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-500 rounded-br-xl"></div>

                <motion.div
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                  className="absolute left-0 right-0 h-0.5 bg-brand-400 shadow-[0_0_20px_rgba(56,189,248,1)]"
                />
              </div>
              <p className="text-white/80 mt-8 font-medium bg-black/40 px-6 py-2 rounded-full backdrop-blur-md border border-white/10">
                Align QR code within frame
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Overlays */}
        <AnimatePresence mode="wait">
          {status === 'detecting' && (
            <motion.div key="detecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-xs mx-4">
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 mx-auto mb-4">
                  <Loader2 size={32} className="animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Ticket Detected</h3>
                <p className="text-gray-500 mt-1">Fetching details...</p>
              </div>
            </motion.div>
          )}

          {status === 'details' && (
            <motion.div key="details" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md p-6">
              <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Ticket Details</h2>
                  <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-200">Processing</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between border-b border-gray-50 pb-3">
                    <span className="text-gray-400 font-medium">Vehicle</span>
                    <span className="font-bold text-gray-900 tracking-tight text-lg uppercase">ABC-1234</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-3">
                    <span className="text-gray-400 font-medium">Duration</span>
                    <span className="font-bold text-gray-900">4 Hours 12 Mins</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-900 font-bold">Amount Due</span>
                    <span className="text-2xl font-black text-brand-600">$18.50</span>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                      <CreditCard size={16} />
                    </div>
                    <p className="text-xs font-bold text-brand-800 uppercase tracking-widest">Automatic Payment Processing...</p>
                  </div>
                </div>
                <Loader2 className="animate-spin text-brand-500 mx-auto" />
              </div>
            </motion.div>
          )}

          {status === 'qr-pass' && (
            <motion.div key="qr-pass" initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-brand-900 p-6">
              <div className="bg-white w-full max-w-sm rounded-[3.5rem] p-10 text-center shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative z-10 py-6">
                  <div className="bg-white p-8 rounded-[3rem] border-2 border-gray-50 shadow-soft group relative overflow-hidden">
                    <QrCode size={200} className="mx-auto text-gray-900" />
                    <motion.div
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                      className="absolute left-0 right-0 h-1 bg-brand-500/30 blur-sm shadow-[0_0_15px_rgba(14,165,233,0.5)]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {status === 'validating-exit' && (
            <motion.div key="validating-exit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-xl">
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mx-auto mb-8"
                />
                <h3 className="text-2xl font-black text-white tracking-tight">Simulating Scan...</h3>
                <p className="text-gray-400 mt-2 font-medium tracking-wide">Validating exit pass with server</p>
              </div>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center bg-green-500 p-6">
              <div className="text-center text-white">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-green-500 mx-auto mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-8 border-white/20"
                >
                  <Check size={64} strokeWidth={4} />
                </motion.div>
                <h2 className="text-5xl font-black tracking-tight mb-4">Ticket Paid!</h2>
                <p className="text-xl font-bold opacity-80 max-w-xs mx-auto leading-relaxed">
                  Payment successful. Gate is now unlocked.
                </p>
                <div className="mt-16 text-[10px] font-black uppercase tracking-[0.5em] opacity-40">
                  Safe Journey!
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Label */}
      <div className="absolute bottom-10 left-0 right-0 text-center z-50 pointer-events-none">
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">LOTGRID Systems • Exit Scanner</p>
      </div>
    </div>
  );
}
