import React, { useState } from 'react';
import { Car, Plus, ShieldCheck, X, Trash2, Edit2, Palette, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

import { useData } from '../../context/DataContext';

// Mock data removed - now in DataContext

export default function StaffVehicles() {
  const { vehicles, setVehicles } = useData();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState({ id: '', make: '', model: '', plate: '', color: '' });

  const resetForm = () => {
    setCurrentVehicle({ id: '', make: '', model: '', plate: '', color: '' });
    setIsEditing(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (vehicle) => {
    setCurrentVehicle(vehicle);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveVehicle = (e) => {
    e.preventDefault();
    if (isEditing) {
      setVehicles(vehicles.map(v => v.id === currentVehicle.id ? { ...currentVehicle, status: v.status } : v));
    } else {
      const newCar = {
        ...currentVehicle,
        id: Date.now(),
        status: 'Pending',
      };
      setVehicles([...vehicles, newCar]);
    }
    setShowModal(false);
    resetForm();
  };

  const handleDeleteVehicle = (id) => {
    if (window.confirm('Are you sure you want to remove this vehicle?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  return (
    <div className="p-6 pb-32 space-y-6 relative min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
          <p className="text-gray-500">Registered Cars</p>
        </div>
        <button
          onClick={openAddModal}
          className="w-10 h-10 bg-brand-900 text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-900/20 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="space-y-4">
        {vehicles.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <Car size={48} className="mx-auto mb-2 opacity-50" />
            <p>No vehicles added yet.</p>
          </div>
        )}
        {vehicles.map((car) => (
          <div key={car.id} className="bg-white p-5 rounded-3xl shadow-soft border border-gray-100 flex flex-col gap-4 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                  <Car size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{car.make} {car.model}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-semibold">{car.plate}</span>
                    <span>•</span>
                    <span>{car.color}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${car.status === 'Verified' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>
                  <ShieldCheck size={12} /> {car.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-50">
              <button
                onClick={() => openEditModal(car)}
                className="flex-1 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Edit2 size={14} /> Edit
              </button>
              <button
                onClick={() => handleDeleteVehicle(car.id)}
                className="flex-1 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Vehicle Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveVehicle} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    icon={Disc}
                    label="Make"
                    placeholder="e.g. Toyota"
                    value={currentVehicle.make}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, make: e.target.value })}
                    required
                  />
                  <Input
                    icon={Car}
                    label="Model"
                    placeholder="e.g. Camry"
                    value={currentVehicle.model}
                    onChange={(e) => setCurrentVehicle({ ...currentVehicle, model: e.target.value })}
                    required
                  />
                </div>

                <Input
                  icon={ShieldCheck}
                  label="License Plate"
                  placeholder="ABC-1234"
                  value={currentVehicle.plate}
                  onChange={(e) => setCurrentVehicle({ ...currentVehicle, plate: e.target.value })}
                  required
                />

                <Input
                  icon={Palette}
                  label="Color"
                  placeholder="e.g. Silver"
                  value={currentVehicle.color}
                  onChange={(e) => setCurrentVehicle({ ...currentVehicle, color: e.target.value })}
                  required
                />

                <Button type="submit" className="w-full mt-4 py-4 text-lg shadow-xl shadow-brand-900/20">
                  {isEditing ? 'Update Vehicle' : 'Register Vehicle'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
