import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Lock, ArrowRight, ShieldCheck, Mail, KeyRound, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import logo from '../assets/logo.png';

export default function Login() {
  // Modes: 'visitor', 'staff', 'admin'
  const [mode, setMode] = useState('visitor');
  const [step, setStep] = useState('input'); // 'input' or 'otp'
  const [adminStep, setAdminStep] = useState('login'); // 'login', 'forgot-input', 'forgot-otp', 'forgot-new'
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [adminForgotContact, setAdminForgotContact] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    // Simulate sending OTP
    setStep('otp');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    navigate('/visitor/home');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setStep('input');
    setAdminStep('login');
    setMobile('');
    setOtp('');
    setAdminForgotContact('');
    setNewPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden flex flex-col">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 right-0 h-[45vh] bg-brand-900 rounded-b-[3rem] z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-500 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-6 pt-16 pb-8">
        {/* Header */}
        <div className="text-center mb-10 text-white">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center mx-auto mb-6"
          >
            <img src={logo} alt="LotGrid Systems" className="w-48 h-auto" />
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div
          layout
          className="bg-white rounded-[2rem] shadow-xl shadow-brand-900/10 p-8 mb-auto"
        >
          {/* 2-Way Toggle - Visitor and Admin Only */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-xl flex w-full">
              <button
                onClick={() => switchMode('visitor')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'visitor' ? 'bg-white text-brand-900 shadow-sm' : 'text-gray-500'}`}
              >
                Visitor
              </button>
              <button
                onClick={() => switchMode('admin')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === 'admin' ? 'bg-white text-brand-900 shadow-sm' : 'text-gray-500'}`}
              >
                Staff
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'admin' ? (
              <motion.div
                key="admin-auth"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {adminStep === 'login' && (
                  <form onSubmit={handleAdminLogin} className="space-y-6">
                    <div className="mb-2">
                      <h2 className="text-xl font-bold text-gray-900">Admin Portal</h2>
                      <p className="text-gray-500 text-sm">Secure access for managers</p>
                    </div>
                    <Input
                      icon={Mail}
                      type="email"
                      placeholder="dakotawhitecloud@lotgridsystems.com"
                      defaultValue="dakotawhitecloud@lotgridsystems.com"
                    />
                    <Input
                      icon={Lock}
                      type="password"
                      placeholder="Password"
                      defaultValue="password"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setAdminStep('forgot-input')}
                        className="text-sm font-bold text-brand-600 hover:text-brand-700"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <Button type="submit" className="mt-4">
                      Access Portal <ArrowRight size={20} />
                    </Button>
                  </form>
                )}

                {adminStep === 'forgot-input' && (
                  <div className="space-y-6">
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => setAdminStep('login')} className="text-gray-400">
                          <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
                      </div>
                      <p className="text-gray-500 text-sm">Enter your registered mobile number</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 ml-1">Mobile Number</label>
                      <div className="relative group flex items-center">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold z-10 flex items-center gap-2">
                          <span className="text-xl">🇺🇸</span> +1
                        </div>
                        <input
                          className="w-full bg-white border border-gray-200 text-gray-900 rounded-2xl py-4 pl-20 pr-4 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all shadow-sm placeholder:text-gray-400 font-medium tracking-wide"
                          type="tel"
                          placeholder="555-012-3456"
                          value={adminForgotContact}
                          maxLength={10}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 10) setAdminForgotContact(val);
                          }}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-400 ml-1">Enter 7-10 digits (US Format)</p>
                    </div>

                    <Button
                      disabled={adminForgotContact.length < 7 || adminForgotContact.length > 10}
                      onClick={() => setAdminStep('forgot-otp')}
                      className="mt-4"
                    >
                      Send OTP <ArrowRight size={20} />
                    </Button>
                  </div>
                )}

                {adminStep === 'forgot-otp' && (
                  <div className="space-y-6">
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <button onClick={() => setAdminStep('forgot-input')} className="text-gray-400">
                          <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900">Verify OTP</h2>
                      </div>
                      <p className="text-gray-500 text-sm">Code sent to {adminForgotContact}</p>
                    </div>
                    <Input
                      icon={KeyRound}
                      type="text"
                      placeholder="1234"
                      maxLength={4}
                      className="text-center tracking-[1em] font-bold text-lg"
                      onChange={(e) => {
                        if (e.target.value === '1234') setAdminStep('forgot-new');
                      }}
                    />
                    <p className="text-center text-xs text-gray-400 mt-4">
                      Use <span className="font-bold text-gray-600">1234</span> as demo OTP
                    </p>
                  </div>
                )}

                {adminStep === 'forgot-new' && (
                  <div className="space-y-6">
                    <div className="mb-2">
                      <h2 className="text-xl font-bold text-gray-900">New Password</h2>
                      <p className="text-gray-500 text-sm">Create your new secure password</p>
                    </div>
                    <Input
                      icon={Lock}
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                      icon={Lock}
                      type="password"
                      placeholder="Confirm Password"
                    />
                    <Button
                      onClick={() => {
                        // Simulate save
                        setAdminStep('login');
                        setAdminForgotContact('');
                        setNewPassword('');
                      }}
                      className="mt-4"
                    >
                      Save Password <ShieldCheck size={20} />
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="user-auth"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {step === 'input' ? (
                  <form onSubmit={handleSendOtp} className="space-y-6">
                    <div className="mb-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        {mode === 'staff' ? 'Staff Login' : 'Visitor Access'}
                      </h2>
                      <p className="text-gray-500 text-sm">Enter your mobile number</p>
                    </div>

                    {/* US Mobile Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 ml-1">Mobile Number</label>
                      <div className="relative group flex items-center">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold z-10 flex items-center gap-2">
                          <span className="text-xl">🇺🇸</span> +1
                        </div>
                        <input
                          className="w-full bg-white border border-gray-200 text-gray-900 rounded-2xl py-4 pl-20 pr-4 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all shadow-sm placeholder:text-gray-400 font-medium tracking-wide"
                          type="tel"
                          placeholder="555-012-3456"
                          value={mobile}
                          maxLength={10}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 10) setMobile(val);
                          }}
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-400 ml-1">Enter 7-10 digits (US Format)</p>
                    </div>

                    <Button disabled={mobile.length < 7 || mobile.length > 10} type="submit" className="mt-4">
                      Send Code <ArrowRight size={20} />
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <button type="button" onClick={() => setStep('input')} className="text-gray-400 hover:text-gray-600">
                          <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900">Verify OTP</h2>
                      </div>
                      <p className="text-gray-500 text-sm">Code sent to +1 {mobile}</p>
                    </div>
                    <Input
                      icon={KeyRound}
                      type="text"
                      placeholder="1234"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={4}
                      className="text-center tracking-[1em] font-bold text-lg"
                      required
                    />
                    <Button type="submit" className="mt-4">
                      Verify & Sign In <ArrowRight size={20} />
                    </Button>
                    <p className="text-center text-xs text-gray-400 mt-4">
                      Use <span className="font-bold text-gray-600">1234</span> as demo OTP
                    </p>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div >
    </div >
  );
}
