import { create } from 'zustand';
import type { InventoryItem } from '../types';

interface InventoryState {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
}

// Mock data
const mockItems: InventoryItem[] = [
  {
    id: 'INV001',
    name: 'Amoxicillin 500mg',
    category: 'Medication',
    stock: 5,
    price: 25.99,
    expiryDate: '2024-12-31'
  },
  {
    id: 'INV002',
    name: 'Surgical Gloves',
    category: 'Supplies',
    stock: 150,
    price: 0.75,
    expiryDate: '2025-06-30'
  },
  {
    id: 'INV003',
    name: 'X-Ray Film',
    category: 'Diagnostic',
    stock: 8,
    price: 45.00,
    expiryDate: '2024-08-15'
  },
  {
    id: 'INV004',
    name: 'Insulin Syringes',
    category: 'Supplies',
    stock: 75,
    price: 1.25,
    expiryDate: '2025-03-20'
  },
  {
    id: 'INV005',
    name: 'Heartworm Prevention',
    category: 'Medication',
    stock: 3,
    price: 89.99,
    expiryDate: '2024-11-30'
  },
  {
    id: 'INV006',
    name: 'Bandages',
    category: 'Supplies',
    stock: 200,
    price: 2.50,
    expiryDate: '2026-01-15'
  },
  {
    id: 'INV007',
    name: 'Anesthesia Mask',
    category: 'Equipment',
    stock: 12,
    price: 125.00,
    expiryDate: '2027-05-10'
  },
  {
    id: 'INV008',
    name: 'Flea Treatment',
    category: 'Medication',
    stock: 25,
    price: 35.75,
    expiryDate: '2025-02-28'
  },
  {
    id: 'INV009',
    name: 'Blood Test Kit',
    category: 'Diagnostic',
    stock: 6,
    price: 78.50,
    expiryDate: '2024-09-30'
  },
  {
    id: 'INV010',
    name: 'Thermometer',
    category: 'Equipment',
    stock: 18,
    price: 15.99,
    expiryDate: '2028-12-31'
  },
  {
    id: 'INV011',
    name: 'Expired Vaccine',
    category: 'Medication',
    stock: 10,
    price: 55.00,
    expiryDate: '2024-01-15'
  },
  {
    id: 'INV012',
    name: 'Old Antibiotics',
    category: 'Medication',
    stock: 7,
    price: 42.00,
    expiryDate: '2023-12-01'
  }
];

export const useInventoryStore = create<InventoryState>((set: (partial: Partial<InventoryState> | ((state: InventoryState) => Partial<InventoryState>)) => void) => ({
  items: mockItems,
  addItem: (item: Omit<InventoryItem, 'id'>) =>
    set((state: InventoryState) => ({
      items: [
        ...state.items,
        {
          ...item,
          id: `INV${String(state.items.length + 1).padStart(3, '0')}`,
        },
      ],
    })),
  updateItem: (id: string, updates: Partial<InventoryItem>) =>
    set((state: InventoryState) => ({
      items: state.items.map((item: InventoryItem) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),
  deleteItem: (id: string) =>
    set((state: InventoryState) => ({
      items: state.items.filter((item: InventoryItem) => item.id !== id),
    })),
}));
