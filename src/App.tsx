// @ts-nocheck - Type definitions will be available after npm install
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Appointments } from './pages/Appointments';
import { PetRecords } from './pages/PetRecords';
import { LandingPage } from './pages/LandingPage';
import { useRoleStore } from './stores/roleStore';
import { useEffect } from 'react';

export default function App() {
  const { role, setRole } = useRoleStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role') as 'vet' | 'staff' | 'owner' | null;
    if (roleParam && ['vet', 'staff', 'owner'].includes(roleParam)) {
      setRole(roleParam);
    }
  }, [setRole]);

  const hasFullAccess = role === 'vet' || role === 'staff';

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            {hasFullAccess ? (
              <Route path="/inventory" element={<Inventory />} />
            ) : (
              <Route path="/pet-records" element={<PetRecords />} />
            )}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}
