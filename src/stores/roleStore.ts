import { create } from 'zustand';

interface RoleState {
  role: 'vet' | 'staff' | 'owner' | 'veterinarian' | 'clinicStaff';
  setRole: (role: 'vet' | 'staff' | 'owner' | 'veterinarian' | 'clinicStaff') => void;
}

export const useRoleStore = create<RoleState>((set: (partial: Partial<RoleState> | ((state: RoleState) => Partial<RoleState>)) => void) => ({
  role: 'owner',
  setRole: (role: 'vet' | 'staff' | 'owner' | 'veterinarian' | 'clinicStaff') => set({ role }),
}));
