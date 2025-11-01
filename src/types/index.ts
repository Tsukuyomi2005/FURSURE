export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  expiryDate: string;
}

export interface Appointment {
  id: string;
  petName: string;
  ownerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  reason?: string;
  vet: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'rescheduled';
  notes?: string;
  serviceType?: string;
  price?: number;
  paymentStatus?: 'pending' | 'down_payment_paid' | 'fully_paid';
  paymentData?: any;
}

export interface PetRecord {
  id: string;
  petName: string;
  breed: string;
  age: number;
  weight: number;
  gender: 'male' | 'female';
  color: string;
  recentIllness?: string;
  vaccinations?: { name: string; date: string }[];
  allergies?: string[];
  notes?: string;
}

export type Role = 'vet' | 'staff' | 'owner';
