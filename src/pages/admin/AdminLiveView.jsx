import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Clock, Car, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Input } from '../../components/ui/Input';

// Generate location-specific slot data removed - in DataContext
export default function AdminLiveView() {
  const { slots: globalSlots } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState('A');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const itemsPerPage = 10;

  // Get slots for selected location from global state
  const slots = globalSlots[selectedLocation] || [];

  // Calculate stats dynamically from current state
  const calculateStats = (locationSlots) => {
    const total = locationSlots.length;
    const occupied = locationSlots.filter(s => s.status === 'occupied').length;
    const reserved = locationSlots.filter(s => s.status === 'reserved').length;
    const available = locationSlots.filter(s => s.status === 'available').length;
    return { total, occupied, reserved, available };
  };

  const stats = calculateStats(slots);

  const filteredSlots = slots.filter(slot =>
    slot.slotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (slot.plate && slot.plate.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredSlots.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSlots = filteredSlots.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-6 pb-32 space-y-6">
      {/* Header with Location Dropdown */}
      <div className="flex items-center justify-between">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Live Parking</h1>
          <p className="text-gray-500">Real-time Vehicle Status</p>
        </header>

        {/* Location Filter */}
        <div className="relative">
          <button
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="bg-brand-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-brand-950 transition-colors"
          >
            Location {selectedLocation}
            <ChevronDown size={16} className={`transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showLocationDropdown && (
            <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl overflow-hidden z-50 min-w-[140px]">
              {['A', 'B', 'C'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setShowLocationDropdown(false);
                    setCurrentPage(1); // Reset to page 1 when changing location
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

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Total Slots */}
        <div className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Total Slots</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>

        {/* Available - Green */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 shadow-soft border border-green-200">
          <p className="text-xs text-green-700 font-bold uppercase tracking-wider mb-2">Available</p>
          <p className="text-3xl font-bold text-green-900">{stats.available}</p>
        </div>

        {/* Reserved - Sandal/Orange */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 shadow-soft border border-orange-200">
          <p className="text-xs text-orange-700 font-bold uppercase tracking-wider mb-2">Reserved</p>
          <p className="text-3xl font-bold text-orange-900">{stats.reserved}</p>
        </div>

        {/* Occupied - Red */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-5 shadow-soft border border-red-200">
          <p className="text-xs text-red-700 font-bold uppercase tracking-wider mb-2">Occupied</p>
          <p className="text-3xl font-bold text-red-900">{stats.occupied}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search slot or license plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Slot List with Color Coding */}
      <div className="space-y-3">
        {currentSlots.map((slot) => (
          <div
            key={slot.id}
            className={`p-4 rounded-2xl shadow-soft flex items-center justify-between group border-2
              ${slot.status === 'occupied' ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-200' : ''}
              ${slot.status === 'reserved' ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200' : ''}
              ${slot.status === 'available' ? 'bg-white border-gray-100' : ''}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                ${slot.status === 'occupied' ? 'bg-red-200 text-red-700' : ''}
                ${slot.status === 'reserved' ? 'bg-orange-200 text-orange-700' : ''}
                ${slot.status === 'available' ? 'bg-gray-50 text-gray-400' : ''}
              `}>
                <Car size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{slot.slotNumber}</h3>
                {slot.plate ? (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="font-bold">{slot.plate}</span>
                    <span>•</span>
                    <span>Entry: {slot.entry}</span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">Empty Slot</p>
                )}
              </div>
            </div>
            <div className="text-right">
              {slot.duration && (
                <div className="flex items-center gap-1 justify-end text-sm font-bold text-gray-900">
                  <Clock size={14} className="text-gray-400" />
                  {slot.duration}
                </div>
              )}
              <p className={`text-xs font-bold mt-1 uppercase tracking-wider
                ${slot.status === 'occupied' ? 'text-red-600' : ''}
                ${slot.status === 'reserved' ? 'text-orange-600' : ''}
                ${slot.status === 'available' ? 'text-green-600' : ''}
              `}>
                {slot.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls - Improved Text Spacing */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-soft">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all
              ${currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-brand-900 text-white hover:bg-brand-950 active:scale-95'
              }
            `}
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-bold text-gray-900">
              Page {currentPage} of {totalPages}
            </span>
            <span className="text-xs text-gray-500">
              ({startIndex + 1}-{Math.min(endIndex, filteredSlots.length)} of {filteredSlots.length})
            </span>
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all
              ${currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-brand-900 text-white hover:bg-brand-950 active:scale-95'
              }
            `}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
