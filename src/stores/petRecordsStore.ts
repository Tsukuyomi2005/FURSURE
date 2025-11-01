import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PetRecord } from '../types';

interface PetRecordsState {
  records: PetRecord[];
  addRecord: (record: Omit<PetRecord, 'id'>) => void;
  updateRecord: (id: string, updates: Partial<PetRecord>) => void;
  deleteRecord: (id: string) => void;
}

export const usePetRecordsStore = create<PetRecordsState>()(
  persist(
    (set: (partial: Partial<PetRecordsState> | ((state: PetRecordsState) => Partial<PetRecordsState>)) => void) => ({
      records: [
        {
          id: '1',
          petName: 'Buddy',
          breed: 'Golden Retriever',
          age: 3,
          weight: 25.5,
          gender: 'male',
          color: 'Golden',
          recentIllness: 'Kennel cough',
          vaccinations: [
            { name: 'Rabies', date: '2024-01-15' },
            { name: 'DHPP', date: '2024-02-10' }
          ],
          allergies: ['Chicken', 'Pollen'],
          notes: 'Very friendly and energetic. Loves to play fetch.'
        },
        {
          id: '2',
          petName: 'Whiskers',
          breed: 'Persian Cat',
          age: 2,
          weight: 4.2,
          gender: 'female',
          color: 'White',
          vaccinations: [
            { name: 'FVRCP', date: '2024-03-05' }
          ],
          allergies: ['Dust'],
          notes: 'Indoor cat, very calm and loves to sleep.'
        }
      ],
      addRecord: (record: Omit<PetRecord, 'id'>) =>
        set((state: PetRecordsState) => ({
          records: [...state.records, { ...record, id: Date.now().toString() }],
        })),
      updateRecord: (id: string, updates: Partial<PetRecord>) =>
        set((state: PetRecordsState) => ({
          records: state.records.map((record: PetRecord) =>
            record.id === id ? { ...record, ...updates } : record
          ),
        })),
      deleteRecord: (id: string) =>
        set((state: PetRecordsState) => ({
          records: state.records.filter((record: PetRecord) => record.id !== id),
        })),
    }),
    {
      name: 'pet-records-storage',
    }
  )
);
