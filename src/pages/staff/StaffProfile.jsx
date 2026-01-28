import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { User, LogOut, History, ChevronRight, Mail, Phone, Shield, Camera, Lock, CheckCircle2, X, ArrowRight } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function StaffProfile() {
  const navigate = useNavigate();
  const { type } = useOutletContext();
  const { user, setUser, logout } = useData(); // Use global user state
  const [showDetails, setShowDetails] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize local edit state from global user
  // We use useEffect to sync if global user changes (e.g. initial load)
  // But for inputs we might want local state that commits on blur/save? 
  // The current code uses local state 'name', 'email', 'mobile' and commits them via setIsEditing...
  // I will wire these directly to update global context or keep local and update global on save.
  // Current implementation: has local state initialized from constants.
  // I will initialize local state from `user`.

  // Portal-specific profile data (only used if context is empty/reset? No, context has priority)
  // Actually, let's just use the context 'user' as the source of truth.

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [mobile, setMobile] = useState(user.mobile);
  // Images handled by context user.image

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // Sync state when entering (if needed) but useState initial value covers it if component remounts.
  // If we navigation back and forth, component remounts.

  // Mobile Verification State
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [mobileStep, setMobileStep] = useState('verify-email');
  const [emailOtp, setEmailOtp] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');

  // Handle profile photo upload
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMobileUpdate = () => {
    setUser({ ...user, mobile: newMobile });
    setMobile(newMobile);
    setMobileStep('success');
    setTimeout(() => {
      setShowMobileModal(false);
      setMobileStep('verify-email');
      setNewMobile('');
      setEmailOtp('');
      setMobileOtp('');
    }, 2000);
  };

  // Update global state when name/email editing finishes
  const saveName = () => {
    setIsEditingName(false);
    setUser({ ...user, name: name });
  };

  const saveEmail = () => {
    setIsEditingEmail(false);
    setUser({ ...user, email: email });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filtered menu items as requested
  const menuItems = [
    { icon: History, label: 'Payment History', path: type === 'visitor' ? '/visitor/history' : '/staff/history' },
  ];

  return (
    <div className="p-6 pb-32 space-y-8 relative">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      </header>

      <div className="flex items-center gap-4">
        <div className="relative">
          <img src={user.image} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg bg-white" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-brand-900 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-950 transition-colors"
          >
            <Camera size={16} className="text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
        {/* Personal Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
              <User size={20} />
            </div>
            <span className="font-medium text-gray-900">Personal Details</span>
          </div>
          <ChevronRight size={20} className={`text-gray-400 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
        </button>

        {/* Expanded Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gray-50 px-5 pb-5 overflow-hidden"
            >
              <div className="space-y-4 pt-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between group">
                  <div className="flex items-center gap-3 flex-1">
                    <Shield size={18} className="text-brand-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 font-bold uppercase">Full Name</p>
                      {isEditingName ? (
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onBlur={saveName}
                          className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 mt-1 font-medium text-gray-900 outline-none focus:border-brand-500"
                          autoFocus
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{user.name}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (isEditingName) saveName();
                      else setIsEditingName(true);
                    }}
                    className="p-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    {isEditingName ? 'Save' : 'Edit'}
                  </button>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between group">
                  <div className="flex items-center gap-3 flex-1">
                    <Mail size={18} className="text-brand-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 font-bold uppercase">Email Address</p>
                      {isEditingEmail ? (
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={saveEmail}
                          className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 mt-1 font-medium text-gray-900 outline-none focus:border-brand-500"
                          autoFocus
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{user.email}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (isEditingEmail) saveEmail();
                      else setIsEditingEmail(true);
                    }}
                    className="p-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    {isEditingEmail ? 'Save' : 'Edit'}
                  </button>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-brand-500" />
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Mobile Number</p>
                      <p className="font-medium text-gray-900">{user.mobile}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setShowMobileModal(true); setMobileStep('verify-email'); }}
                    className="p-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => item.path && navigate(item.path)}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                <item.icon size={20} />
              </div>
              <span className="font-medium text-gray-900">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{item.badge}</span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-50 text-red-600 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <LogOut size={20} />
        Sign Out
      </button>

      {/* Mobile Update Modal */}
      <AnimatePresence>
        {showMobileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              <button onClick={() => setShowMobileModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>

              <AnimatePresence mode="wait">
                {mobileStep === 'verify-email' && (
                  <motion.div
                    key="verify-email"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-2">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Verify Email</h3>
                      <p className="text-sm text-gray-500 mt-1">We sent a code to <span className="font-medium text-gray-900">{email}</span></p>
                    </div>
                    <Input
                      label="Enter Code"
                      placeholder="123456"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value)}
                      className="text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                    <Button
                      onClick={() => setMobileStep('verify-new')}
                      disabled={emailOtp.length < 6}
                      className="w-full mt-2"
                    >
                      Verify & Continue <ArrowRight size={18} className="ml-2" />
                    </Button>
                  </motion.div>
                )}

                {mobileStep === 'verify-new' && (
                  <motion.div
                    key="verify-new"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-2">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">New Number</h3>
                      <p className="text-sm text-gray-500 mt-1">Enter your new mobile number and the verification code.</p>
                    </div>
                    <Input
                      label="Mobile Number"
                      placeholder="+1 (555) 000-0000"
                      value={newMobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 10) setNewMobile(val);
                      }}
                      maxLength={10}
                    />
                    <div className="flex justify-between text-xs text-gray-400 px-1">
                      <span>Enter 7-10 digits</span>
                      <span className={`${newMobile.length >= 7 ? 'text-green-500' : ''}`}>{newMobile.length}/10</span>
                    </div>
                    <Input
                      label="Verification Code (SMS)"
                      placeholder="123456"
                      value={mobileOtp}
                      onChange={(e) => setMobileOtp(e.target.value)}
                      className="text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                    <Button
                      onClick={handleMobileUpdate}
                      disabled={newMobile.length < 7 || newMobile.length > 10 || mobileOtp.length < 6}
                      className="w-full mt-2"
                    >
                      Verify & Update Number
                    </Button>
                  </motion.div>
                )}

                {mobileStep === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-center py-6"
                  >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-100">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Success!</h3>
                    <p className="text-gray-500 mt-2">Your mobile number has been securely updated.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
