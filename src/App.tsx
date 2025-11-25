// @ts-nocheck - Type definitions will be available after npm install
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Reports } from './pages/Reports';
import { Appointments } from './pages/Appointments';
import { PetRecords } from './pages/PetRecords';
import { LandingPage } from './pages/LandingPage';
import { ScheduleManagement } from './pages/ScheduleManagement';
import { MyAppointments } from './pages/MyAppointments';
import { PaymentTimeline } from './pages/PaymentTimeline';
import { Services } from './pages/Services';
import { StaffManagement } from './pages/StaffManagement';
import { VetDashboard } from './pages/VetDashboard';
import { VetMyAppointments } from './pages/VetMyAppointments';
import { VetManageAvailability } from './pages/VetManageAvailability';
import { VetAppointmentHistory } from './pages/VetAppointmentHistory';
import { VetProfileSettings } from './pages/VetProfileSettings';
import { StaffDashboard } from './pages/StaffDashboard';
import { StaffManageAvailability } from './pages/StaffManageAvailability';
import { StaffProfileSettings } from './pages/StaffProfileSettings';
import { StaffInventory } from './pages/StaffInventory';
import { OwnerProfileSettings } from './pages/OwnerProfileSettings';
import { useRoleStore } from './stores/roleStore';
import { useEffect } from 'react';

export default function App() {
  const { role, setRole } = useRoleStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role') as 'vet' | 'staff' | 'owner' | 'veterinarian' | 'clinicStaff' | null;
    if (roleParam && ['vet', 'staff', 'owner', 'veterinarian', 'clinicStaff'].includes(roleParam)) {
      setRole(roleParam);
    }
  }, [setRole]);

  const hasFullAccess = role === 'vet' || role === 'staff';
  const isVeterinarian = role === 'veterinarian';
  const isClinicStaff = role === 'clinicStaff';

  // Show landing page if no role is selected
  if (!role || window.location.pathname === '/') {
    return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/dashboard" element={
              isVeterinarian ? <VetDashboard /> : 
              isClinicStaff ? <StaffDashboard /> : 
              <Dashboard />} />
            {isClinicStaff ? (
              <>
                <Route path="/staff-manage-availability" element={<StaffManageAvailability />} />
                <Route path="/staff-inventory" element={<StaffInventory />} />
                <Route path="/staff-profile-settings" element={<StaffProfileSettings />} />
              </>
            ) : isVeterinarian ? (
              <>
                <Route path="/vet-my-appointments" element={<VetMyAppointments />} />
                <Route path="/vet-manage-availability" element={<VetManageAvailability />} />
                <Route path="/pet-records" element={<PetRecords />} />
                <Route path="/vet-appointment-history" element={<VetAppointmentHistory />} />
                <Route path="/vet-profile-settings" element={<VetProfileSettings />} />
              </>
            ) : hasFullAccess ? (
              <>
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/schedule-management" element={<ScheduleManagement />} />
                <Route path="/services" element={<Services />} />
                <Route path="/staff-management" element={<StaffManagement />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/reports" element={<Reports />} />
              </>
            ) : (
              <>
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/my-appointments" element={<MyAppointments />} />
                <Route path="/payment-timeline" element={<PaymentTimeline />} />
                <Route path="/pet-records" element={<PetRecords />} />
                <Route path="/owner-profile-settings" element={<OwnerProfileSettings />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}
