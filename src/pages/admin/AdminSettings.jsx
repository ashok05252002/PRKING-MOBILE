import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { User, LogOut, ChevronRight, Mail, Phone, Shield, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSettings() {
  const navigator = useNavigate(); // Renaming to avoid conflict if any (though useNavigate is fine)
  const { user, setUser, logout } = useData();
  const [view, setView] = useState('settings'); // 'settings', 'change-password'
  const [showDetails, setShowDetails] = useState(false);
  const fileInputRef = useRef(null);

  // Use user.image from context
  const profileImage = user.image;

  // Change Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleLogout = () => {
    logout();
    navigator('/');
  };

  return (
    <div className="p-6 pb-32 space-y-8">
      <AnimatePresence mode="wait">
        {view === 'settings' ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <header>
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-500">Manage your profile</p>
            </header>

            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg bg-white" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-brand-900 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-950 transition-colors"
                >
                  <Camera size={14} className="text-white" />
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
                <p className="text-gray-500">Manager Role</p>
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
                    className="bg-gray-50 px-5 pb-5 overflow-hidden border-b border-gray-50"
                  >
                    <div className="space-y-4 pt-2">
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                        <Shield size={18} className="text-brand-500" />
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase">Full Name</p>
                          <p className="font-medium text-gray-900">{user.name}</p>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                        <Mail size={18} className="text-brand-500" />
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase">Email Address</p>
                          <p className="font-medium text-gray-900">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password Flow Option */}
              <button
                onClick={() => setView('change-password')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                    <Shield size={20} />
                  </div>
                  <span className="font-medium text-gray-900">Change Password</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-50 text-red-600 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="change-password"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <header className="flex items-center gap-4">
              <button onClick={() => setView('settings')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                <ChevronRight size={24} className="rotate-180" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
            </header>

            {!isSuccess ? (
              <div className="bg-white rounded-3xl shadow-soft p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-gray-600 ml-1">Old Password</label>
                    <div className="relative mt-2">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Shield size={18} />
                      </div>
                      <input
                        type="password"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brand-500 transition-all font-medium"
                        placeholder="••••••••"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-600 ml-1">New Password</label>
                    <div className="relative mt-2">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Shield size={18} />
                      </div>
                      <input
                        type="password"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brand-500 transition-all font-medium"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-gray-600 ml-1">Confirm New Password</label>
                    <div className="relative mt-2">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Shield size={18} />
                      </div>
                      <input
                        type="password"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-brand-500 transition-all font-medium"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <button
                  disabled={!oldPassword || !newPassword || isChanging}
                  onClick={() => {
                    setIsChanging(true);
                    setTimeout(() => {
                      setIsChanging(false);
                      setIsSuccess(true);
                      setTimeout(() => {
                        setView('settings');
                        setIsSuccess(false);
                        setOldPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }, 2000);
                    }, 1500);
                  }}
                  className={`w-full font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2
                    ${isChanging ? 'bg-gray-100 text-gray-400' : 'bg-brand-900 text-white hover:bg-brand-800'}`}
                >
                  {isChanging ? 'Changing Password...' : 'Update Password'}
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl shadow-soft p-12 text-center"
              >
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-xl">
                  <Shield size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Password Changed!</h2>
                <p className="text-gray-500 font-medium">Your security settings have been updated.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
