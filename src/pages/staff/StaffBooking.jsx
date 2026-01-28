import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, ArrowRight, Check, Clock, CreditCard, ChevronLeft, Wifi, PenTool, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ApplePayLogo, GooglePayLogo, VisaLogo, MastercardLogo, PayPalLogo, WaiverLogo, TapLogo } from '../../components/ui/PaymentLogos';

import { useData } from '../../context/DataContext';

// Initial mock data removed - now in DataContext

export default function StaffBooking() {
  const [view, setView] = useState('list'); // list, wizard
  const [step, setStep] = useState(1);
  const [paymentSubView, setPaymentSubView] = useState('method'); // method, process

  // Persistence Logic via DataContext
  const { bookings, setBookings } = useData();

  const [bookingData, setBookingData] = useState({
    location: null,
    date: '',
    time: '',
    duration: '1',
    spot: null,
    paymentMethod: null
  });

  // Payment Form States
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletStep, setWalletStep] = useState('scan'); // scan, pin
  const [pin, setPin] = useState('');

  const handleStartBooking = () => {
    setView('wizard');
    setStep(1);
    setPaymentSubView('method');
    setWalletStep('scan');
    setPin('');
    setBookingData({
      location: null,
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: '1',
      spot: null,
      paymentMethod: null
    });
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);

      // Save booking to persistence
      const newBooking = {
        id: Date.now(), // Minimalist ID using timestamp
        location: `Location ${bookingData.location}`,
        spot: bookingData.spot || 'Auto-Assign',
        date: bookingData.date,
        time: bookingData.time,
        duration: `${bookingData.duration}h`
      };

      setBookings([newBooking, ...bookings]);

      setStep(5); // Success step
    }, 2000);
  };

  const startPaymentProcess = (method) => {
    setBookingData({ ...bookingData, paymentMethod: method });
    setPaymentSubView('process');
  };

  // --- Sub-View Renderers ---

  const renderCardForm = () => (
    <div className="space-y-6">
      {/* Saved Card Section */}
      <div className="bg-brand-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group active:scale-[0.98] transition-transform cursor-pointer">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-colors"></div>
        <div className="flex justify-between items-start mb-8 relative z-10">
          <VisaLogo className="h-4 brightness-0 invert" />
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
            <Check size={16} className="text-brand-400" strokeWidth={3} />
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-xl font-mono tracking-widest mb-1">**** **** **** 4421</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Card Holder</p>
              <p className="text-sm font-bold">Alex Johnson</p>
            </div>
            <p className="text-sm font-bold opacity-80">12/28</p>
          </div>
        </div>
      </div>

      <div className="relative flex items-center gap-4 py-2">
        <div className="h-[1px] flex-1 bg-gray-100"></div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or enter new card</span>
        <div className="h-[1px] flex-1 bg-gray-100"></div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium text-gray-500">Card Details</span>
          <div className="flex gap-2">
            <VisaLogo className="h-3 w-auto fill-brand-900" />
            <MastercardLogo className="h-3 w-auto" />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Card Number</label>
          <div className="relative mt-1">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 font-mono outline-none focus:border-brand-500"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Expiry</label>
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-4 text-center outline-none focus:border-brand-500"
              maxLength={5}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">CVC</label>
            <input
              type="password"
              placeholder="123"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-4 text-center outline-none focus:border-brand-500"
              maxLength={3}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <input type="checkbox" id="save-card-booking" className="w-5 h-5 rounded-lg border-gray-300 text-brand-600 focus:ring-brand-500" />
          <label htmlFor="save-card-booking" className="text-sm font-medium text-gray-600">Save this card for future use</label>
        </div>
      </div>
      <div className="flex gap-4">
        <Button variant="secondary" onClick={() => setPaymentSubView('method')}>Back</Button>
        <Button onClick={handleConfirmPayment}>Pay ${(5 + parseInt(bookingData.duration) * 2).toFixed(2)}</Button>
      </div>
    </div >
  );

  const renderPayPalFlow = () => (
    <div className="space-y-6 text-left">
      <div className="bg-[#f7f8f9] rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="bg-[#003087] p-4 flex justify-between items-center">
          <PayPalLogo className="h-5 brightness-0 invert" />
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
            <Lock size={14} className="text-white" />
          </div>
        </div>
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">Pay with PayPal</h2>
            <p className="text-gray-500 text-sm mt-1">Safe, secure and faster way to pay</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">Account Email</label>
              <Input placeholder="Email or mobile number" className="bg-white border-gray-200" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 ml-1">Password</label>
              <Input type="password" placeholder="Password" className="bg-white border-gray-200" />
            </div>
            <Button onClick={handleConfirmPayment} className="bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold rounded-full py-4 shadow-none">
              Log In & Pay
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
            <span>Terms</span>
            <span>•</span>
            <span>Privacy</span>
            <span>•</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
      <Button variant="secondary" onClick={() => setPaymentSubView('method')} className="border-none text-gray-500">Cancel and return</Button>
    </div>
  );

  const renderWaiverFlow = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 space-y-6">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Reason for Waiver</label>
          <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-4 outline-none mt-2 appearance-none">
            <option>VIP Guest</option>
            <option>Staff Validation</option>
            <option>Maintenance Issue</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Signature Required</label>
          <div className="h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl mt-2 flex flex-col items-center justify-center text-gray-400 relative group cursor-crosshair">
            <PenTool size={32} className="mb-2 opacity-20 group-hover:opacity-40 transition-opacity" />
            <span className="text-xs font-bold uppercase tracking-widest opacity-40">Sign here</span>
            <div className="absolute bottom-4 left-4 right-4 h-[1px] bg-gray-200"></div>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <Button variant="secondary" onClick={() => setPaymentSubView('method')}>Back</Button>
        <Button onClick={handleConfirmPayment} className="bg-brand-900 border-none">Validate Waiver</Button>
      </div>
    </div>
  );

  const renderTapFlow = () => (
    <div className="space-y-10 flex flex-col items-center py-8">
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-brand-400 rounded-full blur-3xl"
        />
        <div className="w-48 h-48 bg-brand-900 rounded-full flex items-center justify-center relative z-10 border-8 border-white/10 shadow-[0_0_60px_rgba(12,74,110,0.3)]">
          <Wifi size={80} className="text-white rotate-90" />
        </div>
        <motion.div
          animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -top-4 -right-4 w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-white border-4 border-white z-20"
        >
          <Check size={24} strokeWidth={3} />
        </motion.div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Hold Near Reader</h3>
        <p className="text-gray-500 font-medium">Position your card or device near the NFC area</p>
      </div>
      <EffectSimulator onComplete={handleConfirmPayment} delay={3500} />
      <Button variant="secondary" onClick={() => setPaymentSubView('method')} className="max-w-[200px]">Cancel Tap</Button>
    </div>
  );

  const renderWalletFlow = () => (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {walletStep === 'scan' ? (
          <motion.div
            key="wallet-scan"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col items-center"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="w-full flex justify-between items-start mb-16 relative z-10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Payment Profile</span>
                <span className="text-xl font-bold tracking-tight">Main Account • 8829</span>
              </div>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                {bookingData.paymentMethod === 'Apple Pay' ? <ApplePayLogo className="h-7" /> : <GooglePayLogo className="h-7" />}
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 py-4 relative z-10">
              <motion.div
                animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-brand-500/20 flex items-center justify-center border-2 border-brand-500/50"
              >
                <Wifi size={40} className="text-brand-400 rotate-90" />
              </motion.div>
              <div className="text-center">
                <p className="font-bold text-xl mb-1">Scanning FaceID...</p>
                <p className="text-sm text-gray-400 font-medium italic">Hold still for authentication</p>
              </div>
            </div>
            <EffectSimulator onComplete={() => setWalletStep('pin')} delay={2500} />
          </motion.div>
        ) : (
          <motion.div
            key="wallet-pin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-gray-100 flex flex-col items-center"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                {bookingData.paymentMethod === 'Apple Pay' ? <ApplePayLogo className="h-4" /> : <GooglePayLogo className="h-4" />}
              </div>
              <h3 className="font-bold text-gray-900 uppercase tracking-widest text-[10px]">Enter Wallet PIN</h3>
            </div>

            <div className="flex gap-4 mb-10">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length >= i ? 'bg-brand-500 border-brand-500 scale-125 shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'border-gray-200'}`}></div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'delete'].map((num, i) => (
                <button
                  key={i}
                  disabled={num === ''}
                  onClick={() => {
                    if (num === 'delete') setPin(pin.slice(0, -1));
                    else if (pin.length < 4) {
                      const newPin = pin + num;
                      setPin(newPin);
                      if (newPin.length === 4) {
                        setTimeout(handleConfirmPayment, 500);
                      }
                    }
                  }}
                  className={`h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all active:scale-95
                    ${num === '' ? 'opacity-0 cursor-default' : 'bg-gray-50 border border-gray-100 text-gray-900 hover:bg-gray-100 active:bg-brand-50 active:text-brand-600 active:border-brand-200'}`}
                >
                  {num === 'delete' ? <ChevronLeft size={24} className="opacity-40" /> : num}
                </button>
              ))}
            </div>
            <button onClick={() => setWalletStep('scan')} className="mt-8 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-brand-500">Back to Scan</button>
          </motion.div>
        )}
      </AnimatePresence>
      <Button variant="secondary" onClick={() => setPaymentSubView('method')}>Cancel Verification</Button>
    </div>
  );

  const renderProcessing = () => (
    <div className="flex flex-col items-center justify-center py-20 space-y-8">
      <div className="relative">
        <div className="w-24 h-24 border-8 border-brand-50 rounded-full"></div>
        <div className="w-24 h-24 border-8 border-brand-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900">Finalizing Booking</h3>
        <p className="text-gray-500 font-medium">Please do not refresh the page...</p>
        <div className="flex items-center gap-2 justify-center mt-4 text-xs font-bold text-brand-600 bg-brand-50 px-4 py-2 rounded-full">
          <Lock size={12} />
          <span>Secure {bookingData.paymentMethod} Transaction</span>
        </div>
      </div>
    </div>
  );

  const renderPaymentMethod = (name, Logo) => (
    <button
      onClick={() => startPaymentProcess(name)}
      className="w-full p-4 rounded-2xl border border-gray-100 bg-white hover:border-brand-200 flex items-center justify-between transition-all group active:scale-[0.98] shadow-sm hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 px-2 group-hover:bg-white transition-colors">
          <Logo className={name === 'Visa' ? "h-3 w-auto fill-brand-900" : name === 'Mastercard' ? "h-3 w-auto" : "h-6 w-auto"} />
        </div>
        <span className="font-bold text-gray-900">{name}</span>
      </div>
      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-50 transition-colors">
        <ArrowRight size={16} className="text-gray-300 group-hover:text-brand-600 transition-colors" />
      </div>
    </button>
  );

  if (view === 'list') {
    return (
      <div className="p-6 pb-32 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 font-medium">Manage your reservations</p>
        </header>

        {/* Upcoming Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Upcoming</h2>
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map((booking, index) => (
                <div key={booking.id || index} className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 flex justify-between items-center transition-transform active:scale-[0.98]">
                  <div>
                    <h3 className="font-bold text-gray-900">{booking.location} • Spot {booking.spot}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Calendar size={14} className="text-brand-500" /> {booking.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Clock size={14} className="text-brand-500" /> {booking.time} ({booking.duration})
                    </div>
                  </div>
                  <div className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1.5">
                    <Check size={12} strokeWidth={3} />
                    Confirmed
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
              No upcoming bookings
            </div>
          )}
        </div>

        <Button onClick={handleStartBooking} className="mt-4 shadow-xl shadow-brand-900/10">
          New Booking <ArrowRight size={20} />
        </Button>
      </div>
    );
  }

  // Wizard View
  return (
    <div className="p-6 pb-32 space-y-6 bg-gray-50/50 min-h-screen">
      <header className="flex items-center gap-2">
        <button onClick={() => setView('list')} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-gray-900 shadow-soft border border-gray-100">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Booking</h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest opacity-60">Step {step} of 4</p>
        </div>
      </header>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.3)]' : 'bg-gray-200'}`}></div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
              <MapPin size={22} className="text-brand-500" /> Select Location
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {['A', 'B', 'C'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => setBookingData({ ...bookingData, location: loc })}
                  className={`p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all group active:scale-[0.98]
                    ${bookingData.location === loc
                      ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-lg shadow-brand-500/10'
                      : 'border-gray-100 bg-white text-gray-500 hover:border-brand-200 shadow-soft'}`}
                >
                  <div className="text-left">
                    <span className="block text-xl font-bold">Location {loc}</span>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${bookingData.location === loc ? 'border-brand-500 bg-brand-500' : 'border-gray-200 group-hover:border-brand-300'}`}>
                    {bookingData.location === loc && <Check size={18} className="text-white" strokeWidth={3} />}
                  </div>
                </button>
              ))}
            </div>
            <Button disabled={!bookingData.location} onClick={() => setStep(2)} className="mt-8 shadow-xl">Next Step</Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
              <Clock size={22} className="text-brand-500" /> Date & Time
            </h3>

            <div className="space-y-5">
              <div className="bg-white p-6 rounded-[2rem] shadow-soft border border-gray-100 flex flex-col gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Arrival Date</label>
                  <input
                    type="date"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-brand-500 font-bold text-gray-900"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Start Time</label>
                    <input
                      type="time"
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-brand-500 font-bold text-gray-900"
                      value={bookingData.time}
                      onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Duration</label>
                    <select
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-brand-500 appearance-none font-bold text-gray-900"
                      value={bookingData.duration}
                      onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 8, 12, 24].map(h => (
                        <option key={h} value={h}>{h} Hour{h > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button variant="secondary" onClick={() => setStep(1)} className="rounded-2xl">Back</Button>
              <Button onClick={() => setStep(3)} className="rounded-2xl">Next Step</Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
              <Check size={22} className="text-brand-500" /> Availability Status
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50/50 backdrop-blur-md p-6 rounded-[2rem] border border-blue-100 shadow-soft transition-all hover:border-blue-200">
                <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-2">Total Slots</p>
                <p className="text-4xl font-bold text-blue-900 tracking-tight">100</p>
              </div>

              <button
                onClick={() => setBookingData({ ...bookingData, spot: 'Auto-Assign' })}
                className={`p-6 rounded-[2rem] border transition-all text-left relative overflow-hidden group active:scale-[0.98] ${bookingData.spot === 'Auto-Assign'
                  ? 'bg-green-100 border-green-500 shadow-lg shadow-green-100'
                  : 'bg-green-50/50 backdrop-blur-md border-green-100 shadow-soft hover:border-green-300'
                  }`}
              >
                <p className="text-green-600 text-[10px] font-bold uppercase tracking-widest mb-2">Available</p>
                <p className="text-4xl font-bold text-green-700 tracking-tight">40</p>
                {bookingData.spot === 'Auto-Assign' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 bg-green-500 rounded-full p-1.5 shadow-lg border-2 border-white">
                    <Check size={14} className="text-white" strokeWidth={4} />
                  </motion.div>
                )}
              </button>

              <div className="bg-amber-50/50 backdrop-blur-md p-6 rounded-[2rem] border border-amber-100 shadow-soft transition-all hover:border-amber-200">
                <p className="text-amber-600 text-[10px] font-bold uppercase tracking-widest mb-2">Reserved</p>
                <p className="text-4xl font-bold text-amber-900 tracking-tight">20</p>
              </div>

              <div className="bg-red-50/50 backdrop-blur-md p-6 rounded-[2rem] border border-red-100 shadow-soft transition-all hover:border-red-200">
                <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest mb-2">Occupied</p>
                <p className="text-4xl font-bold text-red-900 tracking-tight">40</p>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
              <Button
                onClick={() => {
                  if (!bookingData.spot) {
                    setBookingData({ ...bookingData, spot: 'Auto-Assign' });
                  }
                  setStep(4);
                }}
              >
                Proceed to Pay
              </Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
              <CreditCard size={22} className="text-brand-500" />
              {paymentSubView === 'method' ? 'Choose Payment' : `Payment: ${bookingData.paymentMethod}`}
            </h3>

            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {renderProcessing()}
                </motion.div>
              ) : paymentSubView === 'method' ? (
                <motion.div key="method" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-6 group transition-all hover:shadow-md">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Parking details</span>
                      <span className="text-gray-900 font-bold text-xs uppercase tracking-wider">{bookingData.location} • {bookingData.duration}h</span>
                    </div>
                    <div className="border-t border-gray-50 my-3 pt-3 flex justify-between items-baseline">
                      <span className="text-gray-500 font-bold">Total to Pay</span>
                      <span className="text-3xl font-bold text-brand-900 tracking-tight">${(5 + parseInt(bookingData.duration) * 2).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar pb-6">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">Digital Express</h4>
                    {renderPaymentMethod('Apple Pay', ApplePayLogo)}
                    {renderPaymentMethod('Google Pay', GooglePayLogo)}
                    {renderPaymentMethod('PayPal', PayPalLogo)}

                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-2 ml-2">Cards & Manual</h4>
                    {renderPaymentMethod('Visa', VisaLogo)}
                    {renderPaymentMethod('Mastercard', MastercardLogo)}
                    {renderPaymentMethod('Tap to Pay', TapLogo)}
                    {renderPaymentMethod('Waiver', WaiverLogo)}
                  </div>

                  <Button variant="secondary" onClick={() => setStep(3)} className="mt-4 border-none text-gray-400 text-xs font-bold uppercase">Back to Spot Selection</Button>
                </motion.div>
              ) : (
                <motion.div key="process" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="w-full">
                  {bookingData.paymentMethod === 'Visa' || bookingData.paymentMethod === 'Mastercard' ? renderCardForm() : null}
                  {bookingData.paymentMethod === 'PayPal' ? renderPayPalFlow() : null}
                  {bookingData.paymentMethod === 'Waiver' ? renderWaiverFlow() : null}
                  {bookingData.paymentMethod === 'Tap to Pay' ? renderTapFlow() : null}
                  {(bookingData.paymentMethod === 'Apple Pay' || bookingData.paymentMethod === 'Google Pay') ? renderWalletFlow() : null}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="step5" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center text-center space-y-8 py-10">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-green-100 rounded-full blur-2xl"
              />
              <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center text-white relative z-10 shadow-xl shadow-green-500/20 border-4 border-white">
                <Check size={56} strokeWidth={3} />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Booking Confirmed!</h2>
              <p className="text-gray-500 font-medium">Your parking spot has been reserved successfully.</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-soft w-full max-w-xs space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Position</span>
                <span className="font-bold text-gray-900">{bookingData.location}, Spot {bookingData.spot}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Time</span>
                <span className="font-bold text-gray-900">{bookingData.date} • {bookingData.time}</span>
              </div>
            </div>
            <Button onClick={() => setView('list')} variant="secondary" className="mt-8 rounded-full px-12 border-none bg-gray-100 text-gray-600 font-bold">Back to Bookings</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper to simulate time delays in wizard sub-steps
function EffectSimulator({ onComplete, delay }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, delay);
    return () => clearTimeout(timer);
  }, [onComplete, delay]);
  return null;
}
