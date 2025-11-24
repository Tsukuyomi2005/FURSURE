import { create } from 'zustand';

interface RoleState {
  role: 'vet' | 'staff' | 'owner' | 'veterinarian';
  setRole: (role: 'vet' | 'staff' | 'owner' | 'veterinarian') => void;
}

export const useRoleStore = create<RoleState>((set: (partial: Partial<RoleState> | ((state: RoleState) => Partial<RoleState>)) => void) => ({
  role: 'owner',
  setRole: (role: 'vet' | 'staff' | 'owner' | 'veterinarian') => set({ role }),
}));
