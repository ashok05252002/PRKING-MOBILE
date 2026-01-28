import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ScanLine, FileText, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { slots } = useData();
  const [selectedLocation, setSelectedLocation] = useState('A');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Calculate stats from global slots
  const calculateStats = (locationSlots) => {
    const total = locationSlots.length;
    const occupied = locationSlots.filter(s => s.status === 'occupied').length;
    const reserved = locationSlots.filter(s => s.status === 'reserved').length;
    const available = locationSlots.filter(s => s.status === 'available').length;
    return { total, occupied, reserved, available };
  };

  const stats = calculateStats(slots[selectedLocation] || []);
  const occupiedPercentage = (stats.occupied / stats.total) * 100;
  const reservedPercentage = (stats.reserved / stats.total) * 100;
  const availablePercentage = (stats.available / stats.total) * 100;
  const totalOccupancyPercentage = ((stats.occupied + stats.reserved) / stats.total) * 100;

  const data = [
    { name: 'Occupied', value: stats.occupied, color: '#0c4a6e' }, // brand-900
    { name: 'Reserved', value: stats.reserved, color: '#38bdf8' }, // brand-400
    { name: 'Available', value: stats.available, color: '#f1f5f9' }, // slate-100
  ];

  return (
    <div className="p-6 pb-32 space-y-8 overflow-x-hidden">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 font-medium">Overview & Quick Actions</p>
        </div>
        <button
          onClick={() => navigate('/admin/settings')}
          className="w-16 h-16 bg-white rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 hover:scale-105 transition-transform active:scale-95"
        >
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRX0v92XEuKpPKzmaKuMKpaZmHix6v6NSWNA&s" alt="Admin" className="w-full h-full object-cover" />
        </button>
      </header>

      {/* Main Metric - Location Specific */}
      <div className="bg-brand-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-brand-900/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-colors duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <p className="text-brand-200 font-medium uppercase tracking-wider text-xs">Available Slots</p>

            {/* Location Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="bg-white/20 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-white/30 transition-colors"
              >
                Location {selectedLocation}
                <ChevronDown size={12} className={`transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showLocationDropdown && (
                <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl overflow-hidden z-50 min-w-[120px]">
                  {Object.keys(locationData).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm font-bold hover:bg-brand-50 transition-colors
                        ${selectedLocation === loc ? 'bg-brand-100 text-brand-900' : 'text-gray-700'}
                      `}
                    >
                      Location {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-8">
            <h2 className="text-7xl font-bold tracking-tighter">{stats.available}</h2>
            <span className="text-brand-400 text-2xl font-medium">/ {stats.total}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-brand-200 text-[10px] uppercase tracking-wider font-bold mb-1">Occupied</p>
              <p className="text-2xl font-bold">{stats.occupied}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-brand-200 text-[10px] uppercase tracking-wider font-bold mb-1">Reserved</p>
              <p className="text-2xl font-bold">{stats.reserved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 text-lg">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/admin/scanner')}
            className="bg-white p-5 rounded-3xl shadow-soft flex flex-col items-center gap-3 hover:shadow-lg transition-all active:scale-95 border border-gray-100"
          >
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <ScanLine size={28} />
            </div>
            <span className="font-bold text-gray-700">Scan & Verify</span>
          </button>
          <button
            onClick={() => navigate('/admin/transactions')}
            className="bg-white p-5 rounded-3xl shadow-soft flex flex-col items-center gap-3 hover:shadow-lg transition-all active:scale-95 border border-gray-100"
          >
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <FileText size={28} />
            </div>
            <span className="font-bold text-gray-700">Transactions</span>
          </button>
        </div>
      </div>

      {/* Live Occupancy */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-soft border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Live Occupancy</h3>
            <p className="text-gray-400 text-sm">Real-time status</p>
          </div>
          <span className="flex items-center gap-2 text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-bold">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-40 h-40 relative flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                  paddingAngle={5}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell - ${index} `} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-gray-900">71%</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Full</span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-900"></div>
                <span className="text-sm font-medium text-gray-600">Occupied</span>
              </div>
              <span className="font-bold text-gray-900">85%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-400"></div>
                <span className="text-sm font-medium text-gray-600">Reserved</span>
              </div>
              <span className="font-bold text-gray-900">15%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-100"></div>
                <span className="text-sm font-medium text-gray-600">Free</span>
              </div>
              <span className="font-bold text-gray-900">20%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
