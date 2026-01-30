import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Initial Mock Data ---

const INITIAL_NOTIFICATIONS = [
    {
        id: 'init-1',
        type: 'web-booking',
        title: 'New Web Booking',
        message: 'Booking received from the Web Portal for Location A at 09:30 AM. Status: Confirmed.',
        time: '1 hour ago',
        unread: true,
        action: true,
        actionLabel: 'View Pass',
        actionPath: '/staff/booking'
    },
    {
        id: 'init-2',
        type: 'web-booking',
        title: 'New Web Booking',
        message: 'Booking received from the Web Portal for Block B at 08:00 AM. Status: Confirmed.',
        time: '3 hours ago',
        unread: true,
        action: true,
        actionLabel: 'View Pass',
        actionPath: '/staff/booking'
    }
];

const INITIAL_BOOKINGS = [
    { id: 1, location: 'Location A', spot: 'A-05', date: 'Dec 25, 2026', time: '10:00 AM', duration: '2h' },
];

const INITIAL_VEHICLES = [
    { id: 1, make: 'Tesla', model: 'Model 3', plate: 'ABC-1234', color: 'White', status: 'Verified' },
    { id: 2, make: 'Toyota', model: 'Camry', plate: 'XYZ-9876', color: 'Silver', status: 'Verified' },
];

const INITIAL_BARRIERS = {
    'A': [
        { id: 1, name: 'Entry Barrier', location: 'Section A - North', status: 'closed', progress: 0 },
        { id: 2, name: 'Exit Barrier', location: 'Section A - South', status: 'closed', progress: 0 },
    ],
    'B': [
        { id: 3, name: 'Main Barrier', location: 'Section B - Gate 1', status: 'closed', progress: 0 },
        { id: 4, name: 'Side Barrier', location: 'Section B - Gate 2', status: 'closed', progress: 0 },
    ],
    'C': [
        { id: 5, name: 'Service Entry', location: 'Section C - Dock', status: 'closed', progress: 0 },
        { id: 6, name: 'Emergency Exit', location: 'Section C - Exit', status: 'closed', progress: 0 },
    ],
};

const INITIAL_USER = {
    name: 'Dakota Whitecloud',
    email: 'dakotawhitecloud@lotgridsystems.com',
    mobile: '+1 (555) 123-4567',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF2yaox2cALIq_yyd-9qEyovEsficJr7X9QQ&s'
};

// Generate initial slots
const generateInitialSlots = () => {
    const allSlots = { A: [], B: [], C: [] };
    const locations = ['A', 'B', 'C'];
    const plates = ['ABC-1234', 'XYZ-9876', 'LMN-4567', 'PQR-1122', 'STU-9988', 'JKL-5544', 'MNO-7788', 'DEF-3344'];

    // Distributions
    const distributions = {
        'A': { occupied: 24, reserved: 10, available: 16 },
        'B': { occupied: 28, reserved: 7, available: 15 },
        'C': { occupied: 20, reserved: 12, available: 18 }
    };

    locations.forEach(location => {
        const dist = distributions[location];
        let slotIndex = 1;
        const slots = [];

        // Add occupied slots
        for (let i = 0; i < dist.occupied; i++) {
            slots.push({
                id: `${location}-${slotIndex}`,
                slotNumber: `${location}-${String(slotIndex).padStart(2, '0')}`,
                plate: plates[i % plates.length],
                entry: `${8 + (i % 4)}:${(i % 6) * 10} AM`,
                duration: `${Math.floor(i / 10)}h ${(i % 6) * 10}m`,
                status: 'occupied'
            });
            slotIndex++;
        }

        // Add reserved slots
        for (let i = 0; i < dist.reserved; i++) {
            slots.push({
                id: `${location}-${slotIndex}`,
                slotNumber: `${location}-${String(slotIndex).padStart(2, '0')}`,
                plate: plates[i % plates.length],
                entry: `${9 + (i % 3)}:${(i % 4) * 15} AM`,
                duration: `${Math.floor(i / 8)}h ${(i % 4) * 15}m`,
                status: 'reserved'
            });
            slotIndex++;
        }

        // Add available slots
        for (let i = 0; i < dist.available; i++) {
            slots.push({
                id: `${location}-${slotIndex}`,
                slotNumber: `${location}-${String(slotIndex).padStart(2, '0')}`,
                plate: null,
                entry: null,
                duration: null,
                status: 'available'
            });
            slotIndex++;
        }
        allSlots[location] = slots;
    });
    return allSlots;
};

const INITIAL_SLOTS = generateInitialSlots();

const INITIAL_TRANSACTIONS = [
    // TODAY (2026-01-12) - Multiple entries per method/dept combination
    { id: 1, method: 'Apple Pay', amount: '12.50', time: '2:30 PM', date: '2026-01-12', vehicle: 'ABC-1234', dept: 'Visitor', status: 'success' },
    { id: 2, method: 'Apple Pay', amount: '14.00', time: '1:45 PM', date: '2026-01-12', vehicle: 'DEF-5678', dept: 'Staff', status: 'success' },
    { id: 3, method: 'Apple Pay', amount: '16.50', time: '12:30 PM', date: '2026-01-12', vehicle: 'GHI-9012', dept: 'VIP', status: 'success' },

    { id: 4, method: 'Google Pay', amount: '15.50', time: '11:30 AM', date: '2026-01-12', vehicle: 'PQR-1122', dept: 'Visitor', status: 'success' },
    { id: 5, method: 'Google Pay', amount: '13.00', time: '10:15 AM', date: '2026-01-12', vehicle: 'STU-3344', dept: 'Staff', status: 'success' },
    { id: 6, method: 'Google Pay', amount: '17.00', time: '9:45 AM', date: '2026-01-12', vehicle: 'VWX-5566', dept: 'VIP', status: 'success' },

    { id: 7, method: 'Cash', amount: '8.00', time: '2:15 PM', date: '2026-01-12', vehicle: 'XYZ-9876', dept: 'Staff', status: 'success' },
    { id: 8, method: 'Cash', amount: '10.00', time: '1:30 PM', date: '2026-01-12', vehicle: 'YZA-1111', dept: 'Visitor', status: 'success' },
    { id: 9, method: 'Cash', amount: '7.50', time: '11:00 AM', date: '2026-01-12', vehicle: 'BCD-2222', dept: 'Staff', status: 'success' },

    { id: 10, method: 'Visa', amount: '24.00', time: '1:55 PM', date: '2026-01-12', vehicle: 'LMN-4567', dept: 'Visitor', status: 'success' },
    { id: 11, method: 'Visa', amount: '22.00', time: '12:20 PM', date: '2026-01-12', vehicle: 'EFG-7788', dept: 'Staff', status: 'success' },
    { id: 12, method: 'Visa', amount: '26.00', time: '10:30 AM', date: '2026-01-12', vehicle: 'HIJ-9900', dept: 'VIP', status: 'success' },

    { id: 13, method: 'Mastercard', amount: '10.00', time: '10:45 AM', date: '2026-01-12', vehicle: 'STU-9988', dept: 'Visitor', status: 'success' },
    { id: 14, method: 'Mastercard', amount: '12.00', time: '9:30 AM', date: '2026-01-12', vehicle: 'KLM-1122', dept: 'Staff', status: 'success' },
    { id: 15, method: 'Mastercard', amount: '14.00', time: '8:45 AM', date: '2026-01-12', vehicle: 'NOP-3344', dept: 'VIP', status: 'success' },

    { id: 16, method: 'Card', amount: '18.00', time: '9:30 AM', date: '2026-01-12', vehicle: 'DEF-5678', dept: 'Visitor', status: 'success' },
    { id: 17, method: 'Card', amount: '20.00', time: '8:15 AM', date: '2026-01-12', vehicle: 'QRS-5566', dept: 'Staff', status: 'success' },
    { id: 18, method: 'Card', amount: '22.00', time: '7:30 AM', date: '2026-01-12', vehicle: 'TUV-7788', dept: 'VIP', status: 'success' },

    { id: 19, method: 'Waiver', amount: '0.00', time: '10:00 AM', date: '2026-01-12', vehicle: 'VIP-100', dept: 'VIP', status: 'success' },
    { id: 20, method: 'Waiver', amount: '0.00', time: '9:00 AM', date: '2026-01-12', vehicle: 'VIP-101', dept: 'VIP', status: 'success' },

    // YESTERDAY (2026-01-11) - Multiple entries per combination
    { id: 21, method: 'Apple Pay', amount: '18.00', time: '3:15 PM', date: '2026-01-11', vehicle: 'MNO-7788', dept: 'Visitor', status: 'success' },
    { id: 22, method: 'Apple Pay', amount: '19.00', time: '2:30 PM', date: '2026-01-11', vehicle: 'WXY-1234', dept: 'Staff', status: 'success' },
    { id: 23, method: 'Google Pay', amount: '14.00', time: '11:00 AM', date: '2026-01-11', vehicle: 'GHI-6677', dept: 'Staff', status: 'success' },
    { id: 24, method: 'Google Pay', amount: '15.00', time: '10:15 AM', date: '2026-01-11', vehicle: 'ZAB-5678', dept: 'Visitor', status: 'success' },
    { id: 25, method: 'Cash', amount: '5.00', time: '4:30 PM', date: '2026-01-11', vehicle: 'JKL-5544', dept: 'Staff', status: 'success' },
    { id: 26, method: 'Cash', amount: '6.00', time: '3:45 PM', date: '2026-01-11', vehicle: 'CDE-9012', dept: 'Visitor', status: 'success' },
    { id: 27, method: 'Visa', amount: '22.00', time: '12:30 PM', date: '2026-01-11', vehicle: 'DEF-3344', dept: 'Visitor', status: 'success' },
    { id: 28, method: 'Visa', amount: '23.00', time: '11:45 AM', date: '2026-01-11', vehicle: 'FGH-3456', dept: 'Staff', status: 'success' },
    { id: 29, method: 'Mastercard', amount: '16.00', time: '10:15 AM', date: '2026-01-11', vehicle: 'JKL-8899', dept: 'Visitor', status: 'success' },
    { id: 30, method: 'Mastercard', amount: '17.00', time: '9:30 AM', date: '2026-01-11', vehicle: 'IJK-4567', dept: 'Staff', status: 'success' },
    { id: 31, method: 'Card', amount: '20.00', time: '9:00 AM', date: '2026-01-11', vehicle: 'QRS-1234', dept: 'Staff', status: 'success' },
    { id: 32, method: 'Card', amount: '21.00', time: '8:15 AM', date: '2026-01-11', vehicle: 'LMN-6789', dept: 'Visitor', status: 'success' },
    { id: 33, method: 'Waiver', amount: '0.00', time: '2:00 PM', date: '2026-01-11', vehicle: 'VIP-001', dept: 'VIP', status: 'success' },
    { id: 34, method: 'Waiver', amount: '0.00', time: '1:15 PM', date: '2026-01-11', vehicle: 'VIP-002', dept: 'VIP', status: 'success' },

    // THIS WEEK (2026-01-06 to 2026-01-10) - Comprehensive coverage
    { id: 35, method: 'Google Pay', amount: '14.50', time: '5:00 PM', date: '2026-01-10', vehicle: 'GHI-6677', dept: 'Visitor', status: 'success' },
    { id: 36, method: 'Apple Pay', amount: '16.00', time: '11:00 AM', date: '2026-01-09', vehicle: 'ZAB-6688', dept: 'Visitor', status: 'success' },
    { id: 37, method: 'Cash', amount: '7.00', time: '3:45 PM', date: '2026-01-10', vehicle: 'TUV-2233', dept: 'Staff', status: 'success' },
    { id: 38, method: 'Cash', amount: '6.50', time: '4:15 PM', date: '2026-01-08', vehicle: 'CDE-9900', dept: 'Staff', status: 'success' },
    { id: 39, method: 'Cash', amount: '9.00', time: '3:00 PM', date: '2026-01-06', vehicle: 'LMN-5566', dept: 'Staff', status: 'success' },
    { id: 40, method: 'Mastercard', amount: '20.00', time: '1:20 PM', date: '2026-01-09', vehicle: 'WXY-4455', dept: 'Visitor', status: 'success' },
    { id: 41, method: 'Mastercard', amount: '12.00', time: '1:45 PM', date: '2026-01-06', vehicle: 'NOP-7788', dept: 'Visitor', status: 'success' },
    { id: 42, method: 'Visa', amount: '25.00', time: '2:30 PM', date: '2026-01-08', vehicle: 'FGH-1122', dept: 'Visitor', status: 'success' },
    { id: 43, method: 'Google Pay', amount: '13.00', time: '10:15 AM', date: '2026-01-07', vehicle: 'IJK-3344', dept: 'Visitor', status: 'success' },
    { id: 44, method: 'Card', amount: '15.00', time: '11:30 AM', date: '2026-01-07', vehicle: 'TUV-9999', dept: 'VIP', status: 'success' },
    { id: 45, method: 'Card', amount: '16.00', time: '10:45 AM', date: '2026-01-09', vehicle: 'OPQ-8888', dept: 'Visitor', status: 'success' },
    { id: 46, method: 'Waiver', amount: '0.00', time: '10:30 AM', date: '2026-01-09', vehicle: 'VIP-200', dept: 'VIP', status: 'success' },
    { id: 47, method: 'Waiver', amount: '0.00', time: '9:45 AM', date: '2026-01-08', vehicle: 'VIP-201', dept: 'VIP', status: 'success' },

    // EARLIER (before 2026-01-06) - All methods and departments
    { id: 48, method: 'Apple Pay', amount: '11.50', time: '2:45 PM', date: '2026-01-05', vehicle: 'OPQ-7788', dept: 'Visitor', status: 'success' },
    { id: 49, method: 'Apple Pay', amount: '12.50', time: '1:30 PM', date: '2026-01-04', vehicle: 'RST-1111', dept: 'Staff', status: 'success' },
    { id: 50, method: 'Mastercard', amount: '19.00', time: '1:30 PM', date: '2026-01-04', vehicle: 'RST-9900', dept: 'Visitor', status: 'success' },
    { id: 51, method: 'Mastercard', amount: '18.00', time: '12:45 PM', date: '2026-01-03', vehicle: 'UVW-2222', dept: 'Staff', status: 'success' },
    { id: 52, method: 'Cash', amount: '8.50', time: '11:45 AM', date: '2026-01-03', vehicle: 'UVW-1122', dept: 'Staff', status: 'success' },
    { id: 53, method: 'Cash', amount: '7.50', time: '10:30 AM', date: '2026-01-05', vehicle: 'XYZ-3333', dept: 'Visitor', status: 'success' },
    { id: 54, method: 'Visa', amount: '23.00', time: '4:00 PM', date: '2026-01-02', vehicle: 'XYZ-3344', dept: 'Visitor', status: 'success' },
    { id: 55, method: 'Visa', amount: '24.00', time: '3:15 PM', date: '2026-01-01', vehicle: 'ABC-4444', dept: 'Staff', status: 'success' },
    { id: 56, method: 'Google Pay', amount: '17.50', time: '2:15 PM', date: '2026-01-01', vehicle: 'ABC-5566', dept: 'Visitor', status: 'failed' },
    { id: 57, method: 'Google Pay', amount: '16.50', time: '1:00 PM', date: '2026-01-02', vehicle: 'DEF-5555', dept: 'Staff', status: 'success' },
    { id: 58, method: 'Card', amount: '21.00', time: '10:00 AM', date: '2026-01-03', vehicle: 'WXY-7777', dept: 'Visitor', status: 'success' },
    { id: 59, method: 'Card', amount: '22.00', time: '9:15 AM', date: '2026-01-05', vehicle: 'GHI-6666', dept: 'Staff', status: 'success' },
    { id: 60, method: 'Waiver', amount: '0.00', time: '12:00 PM', date: '2026-01-01', vehicle: 'VIP-300', dept: 'VIP', status: 'success' },
    { id: 61, method: 'Waiver', amount: '0.00', time: '11:15 AM', date: '2026-01-04', vehicle: 'VIP-301', dept: 'VIP', status: 'success' },
];

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    // --- State Initialization ---

    // Helper to load from localStorage or fallback
    // Includes migration from old pro_parking_ keys to new lotgrid_ keys
    const loadState = (key, fallback) => {
        try {
            // Try loading from new key first
            let saved = localStorage.getItem(key);
            
            // If not found, try migrating from old key
            if (!saved) {
                const oldKey = key.replace('lotgrid_', 'pro_parking_');
                const oldData = localStorage.getItem(oldKey);
                if (oldData) {
                    // Migrate data to new key
                    localStorage.setItem(key, oldData);
                    localStorage.removeItem(oldKey);
                    saved = oldData;
                }
            }
            
            return saved ? JSON.parse(saved) : fallback;
        } catch (e) {
            console.error(`Error loading ${key}`, e);
            return fallback;
        }
    };


    const [notifications, setNotifications] = useState(() => loadState('lotgrid_notifications', INITIAL_NOTIFICATIONS));
    const [bookings, setBookings] = useState(() => loadState('lotgrid_bookings', INITIAL_BOOKINGS));
    const [vehicles, setVehicles] = useState(() => loadState('lotgrid_vehicles', INITIAL_VEHICLES));
    const [barriers, setBarriers] = useState(() => loadState('lotgrid_barriers', INITIAL_BARRIERS));
    const [slots, setSlots] = useState(() => loadState('lotgrid_slots', INITIAL_SLOTS));
    const [transactions, setTransactions] = useState(() => loadState('lotgrid_transactions', INITIAL_TRANSACTIONS));
    const [user, setUser] = useState(() => loadState('lotgrid_user', INITIAL_USER));

    // --- Persistence Effects ---

    useEffect(() => {
        localStorage.setItem('lotgrid_notifications', JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem('lotgrid_bookings', JSON.stringify(bookings));
    }, [bookings]);

    useEffect(() => {
        localStorage.setItem('lotgrid_vehicles', JSON.stringify(vehicles));
    }, [vehicles]);

    useEffect(() => {
        localStorage.setItem('lotgrid_barriers', JSON.stringify(barriers));
    }, [barriers]);

    useEffect(() => {
        localStorage.setItem('lotgrid_slots', JSON.stringify(slots));
    }, [slots]);

    useEffect(() => {
        localStorage.setItem('lotgrid_transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('lotgrid_user', JSON.stringify(user));
    }, [user]);

    // --- Actions ---

    const logout = () => {
        localStorage.removeItem('lotgrid_notifications');
        localStorage.removeItem('lotgrid_bookings');
        localStorage.removeItem('lotgrid_vehicles');
        localStorage.removeItem('lotgrid_barriers');
        localStorage.removeItem('lotgrid_slots');
        localStorage.removeItem('lotgrid_transactions');
        localStorage.removeItem('lotgrid_user');

        // Reset to initial
        setNotifications(INITIAL_NOTIFICATIONS);
        setBookings(INITIAL_BOOKINGS);
        setVehicles(INITIAL_VEHICLES);
        setBarriers(INITIAL_BARRIERS);
        setSlots(INITIAL_SLOTS);
        setTransactions(INITIAL_TRANSACTIONS);
        setUser(INITIAL_USER);
    };

    const values = {
        notifications,
        setNotifications,
        bookings,
        setBookings,
        vehicles,
        setVehicles,
        barriers,
        setBarriers,
        slots,
        setSlots,
        transactions,
        setTransactions,
        user,
        setUser,
        logout
    };

    return (
        <DataContext.Provider value={values}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
