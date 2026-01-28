import React from 'react';
import { useData } from '../../context/DataContext';
import { ChevronLeft, MapPin, Clock, CreditCard, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StaffHistory() {
  const navigate = useNavigate();
  const { bookings } = useData();

  return (
    <div className="p-6 pb-32 space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">History</h1>
          <p className="text-gray-500">Past Parking Sessions</p>
        </div>
      </header>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No booking history</p>
          </div>
        ) : (
          bookings.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                  <Calendar size={14} />
                  {item.date} {item.time}
                </div>
                <span className="font-bold text-lg text-gray-900">Booked</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                    <MapPin size={16} />
                  </div>
                  <span className="font-medium text-gray-900">{item.location} - {item.spot}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Clock size={16} />
                  </div>
                  <span className="text-gray-600">{item.duration}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
