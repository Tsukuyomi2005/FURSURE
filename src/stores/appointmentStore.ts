import { create } from 'zustand';
import type { Appointment } from '../types';

interface AppointmentState {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
}

// Mock data - generate appointments for the next 30 days
const generateMockAppointments = (): Appointment[] => {
  const appointments: Appointment[] = [];
  const statuses: Appointment['status'][] = ['pending', 'approved', 'rejected', 'cancelled', 'rescheduled'];
  const vets = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown'];
  const pets = [
    { name: 'Buddy', owner: 'John Doe', phone: '555-0101', email: 'john@example.com' },
    { name: 'Luna', owner: 'Jane Smith', phone: '555-0102', email: 'jane@example.com' },
    { name: 'Max', owner: 'Bob Wilson', phone: '555-0103', email: 'bob@example.com' },
    { name: 'Bella', owner: 'Alice Brown', phone: '555-0104', email: 'alice@example.com' },
    { name: 'Charlie', owner: 'Mike Davis', phone: '555-0105', email: 'mike@example.com' },
  ];
  const reasons = [
    'Annual checkup',
    'Vaccination',
    'Dental cleaning',
    'Skin condition',
    'Limping',
    'Follow-up visit',
    'Emergency visit'
  ];

  for (let i = 0; i < 25; i++) {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 30));
    const pet = pets[Math.floor(Math.random() * pets.length)];
    
    appointments.push({
      id: `APT${String(i + 1).padStart(3, '0')}`,
      date: date.toISOString().split('T')[0],
      time: ['08:00', '09:30', '11:00', '14:00', '16:30'][Math.floor(Math.random() * 5)],
      petName: pet.name,
      ownerName: pet.owner,
      phone: pet.phone,
      email: pet.email,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      vet: vets[Math.floor(Math.random() * vets.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      notes: Math.random() > 0.7 ? 'Follow-up required' : undefined
    });
  }

  return appointments;
};

export const useAppointmentStore = create<AppointmentState>((set: (partial: Partial<AppointmentState> | ((state: AppointmentState) => Partial<AppointmentState>)) => void) => ({
  appointments: generateMockAppointments(),
  addAppointment: (appointment: Omit<Appointment, 'id'>) =>
    set((state: AppointmentState) => ({
      appointments: [
        ...state.appointments,
        {
          ...appointment,
          id: `APT${String(state.appointments.length + 1).padStart(3, '0')}`,
        },
      ],
    })),
  updateAppointment: (id: string, updates: Partial<Appointment>) =>
    set((state: AppointmentState) => ({
      appointments: state.appointments.map((appointment: Appointment) =>
        appointment.id === id ? { ...appointment, ...updates } : appointment
      ),
    })),
  deleteAppointment: (id: string) =>
    set((state: AppointmentState) => ({
      appointments: state.appointments.filter((appointment: Appointment) => appointment.id !== id),
    })),
}));
