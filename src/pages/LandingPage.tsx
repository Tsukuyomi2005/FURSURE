import { Heart, Stethoscope, Calendar, Package, BarChart3, Users } from 'lucide-react';
import { useRoleStore } from '../stores/roleStore';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const { setRole } = useRoleStore();
  const navigate = useNavigate();

  const handleVetStaffAccess = () => {
    setRole('vet');
    navigate('/dashboard');
  };

  const handleOwnerAccess = () => {
    setRole('owner');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <Heart className="h-10 w-10 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-blue-600">FURSURE</h1>
          </div>
          <p className="text-center text-gray-600 mt-2">Veterinary Clinic Management System</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to FURSURE Veterinary Clinic
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your interface to access the appropriate features and manage your veterinary clinic operations efficiently.
          </p>
        </div>

        {/* Interface Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Veterinary Staff Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-transparent hover:border-blue-200 transition-all duration-300">
            <div className="text-center mb-6">
              <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Stethoscope className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Veterinary Staff Interface</h3>
              <p className="text-gray-600">Complete clinic management for veterinarians and staff members</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                <span>Appointment Management & Scheduling</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Package className="h-5 w-5 text-blue-600 mr-3" />
                <span>Inventory Management & Stock Control</span>
              </div>
              <div className="flex items-center text-gray-700">
                <BarChart3 className="h-5 w-5 text-blue-600 mr-3" />
                <span>Analytics & Revenue Tracking</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Users className="h-5 w-5 text-blue-600 mr-3" />
                <span>Patient Records & Medical History</span>
              </div>
            </div>

            <button
              onClick={handleVetStaffAccess}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Access Staff Interface
            </button>
          </div>

          {/* Pet Owner Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-transparent hover:border-green-200 transition-all duration-300">
            <div className="text-center mb-6">
              <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pet Owner Interface</h3>
              <p className="text-gray-600">Easy appointment booking and pet care management</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 text-green-600 mr-3" />
                <span>Book & Manage Appointments</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Heart className="h-5 w-5 text-green-600 mr-3" />
                <span>View Pet Medical History</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Users className="h-5 w-5 text-green-600 mr-3" />
                <span>Contact Veterinary Team</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Package className="h-5 w-5 text-green-600 mr-3" />
                <span>Prescription & Treatment Tracking</span>
              </div>
            </div>

            <button
              onClick={handleOwnerAccess}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Access Owner Interface
            </button>
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Choose FURSURE?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Smart Scheduling</h4>
              <p className="text-gray-600">Efficient appointment management with real-time availability and automated notifications.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-orange-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Inventory Control</h4>
              <p className="text-gray-600">Track medical supplies, medications, and equipment with low-stock alerts.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="bg-teal-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-teal-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h4>
              <p className="text-gray-600">Comprehensive reporting and analytics to optimize clinic operations and revenue.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 FURSURE Veterinary Clinic Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
