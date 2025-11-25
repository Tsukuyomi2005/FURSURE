import { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  Stethoscope, 
  Calendar, 
  Package, 
  BarChart3, 
  Users,
  ChevronDown,
  Menu,
  X,
  Clock,
  CheckCircle,
  Shield,
  FileText,
  UserCheck
} from 'lucide-react';
import { useRoleStore } from '../stores/roleStore';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const { setRole } = useRoleStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePetOwnerAccess = () => {
    setRole('owner');
    setIsDropdownOpen(false);
    navigate('/dashboard');
  };

  const handleAdminAccess = () => {
    setRole('vet');
    setIsDropdownOpen(false);
    navigate('/dashboard');
  };

  const handleVeterinarianAccess = () => {
    setRole('veterinarian');
    setIsDropdownOpen(false);
    navigate('/dashboard');
  };

  const handleClinicStaffAccess = () => {
    setRole('clinicStaff');
    setIsDropdownOpen(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-600 rounded-full blur-sm opacity-30"></div>
                <div className="relative bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full p-2">
                  <Heart className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                FURSURE
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                Who We Are
              </a>
              <a href="#services" className="text-purple-600 hover:text-purple-700 transition-colors font-medium">
                Our Services
              </a>
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                Features
              </a>
              <a href="#faq" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                FAQs
              </a>
            </nav>

            {/* Sign Up/Log In Button with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors relative group"
              >
                <span className="hidden sm:inline">Sign Up or Log In</span>
                <span className="sm:hidden">Login</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                <span className="absolute -left-1 -top-1 h-2 w-2 bg-purple-600 rounded-full"></span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={handlePetOwnerAccess}
                    className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center gap-3 group"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <Heart className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Pet Owner</div>
                      <div className="text-sm text-gray-500">Book appointments & manage pets</div>
                    </div>
                  </button>
                  <button
                    onClick={handleAdminAccess}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 group border-t border-gray-100"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <Stethoscope className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Admin</div>
                      <div className="text-sm text-gray-500">Manage clinic operations</div>
                    </div>
                  </button>
                  <button
                    onClick={handleVeterinarianAccess}
                    className="w-full px-4 py-3 text-left hover:bg-green-50 transition-colors flex items-center gap-3 group border-t border-gray-100"
                  >
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Veterinarian</div>
                      <div className="text-sm text-gray-500">Manage your schedule & appointments</div>
                    </div>
                  </button>
                  <button
                    onClick={handleClinicStaffAccess}
                    className="w-full px-4 py-3 text-left hover:bg-teal-50 transition-colors flex items-center gap-3 group border-t border-gray-100"
                  >
                    <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                      <Users className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Clinic Staff</div>
                      <div className="text-sm text-gray-500">Manage inventory & availability</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-purple-600"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 px-4 space-y-3">
            <a href="#about" className="block text-gray-700 hover:text-purple-600 py-2">Who We Are</a>
            <a href="#services" className="block text-purple-600 hover:text-purple-700 py-2">Our Services</a>
            <a href="#features" className="block text-gray-700 hover:text-purple-600 py-2">Features</a>
            <a href="#faq" className="block text-gray-700 hover:text-purple-600 py-2">FAQs</a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-serif font-bold text-slate-800 leading-tight">
                Veterinary care{' '}
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  redefined.
                </span>
              </h1>
              
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  Difficulty with getting an appointment, stress of traveling to the clinic, long waiting times – 
                  some of the reasons why our pets don't see their vet often enough.
                </p>
                <p>
                  With <strong className="text-slate-800">FURSURE</strong>, our days of facing these issues are over. 
                  Simply manage your pet's care from the comfort of your home, book appointments seamlessly, 
                  and access comprehensive veterinary services when you need them most.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Get Started
                  <ChevronDown className="h-4 w-4" />
                </button>
                <a
                  href="#services"
                  className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                >
                  Learn More
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-purple-600">24/7</div>
                  <div className="text-sm text-gray-600">Access</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-gray-600">Secure</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">Fast</div>
                  <div className="text-sm text-gray-600">Booking</div>
                </div>
              </div>
            </div>

            {/* Right: Visual Content */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 shadow-2xl">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-50"></div>
                
                {/* Main Visual */}
                <div className="relative bg-white rounded-2xl p-6 shadow-lg">
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Calendar className="h-16 w-16 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-600 font-medium">Online Appointment Booking</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Book Instantly</div>
                      <div className="text-sm text-gray-500">Available 24/7</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive veterinary care management for both pet owners and clinic staff
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Pet Owner Services */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">For Pet Owners</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Book & manage appointments effortlessly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">View complete pet medical history</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Track vaccinations and treatments</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Secure payment processing</span>
                </li>
              </ul>
            </div>

            {/* Clinic Staff Services */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Stethoscope className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">For Clinic Staff</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Complete appointment management system</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Inventory & stock control</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Analytics & revenue tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Patient records management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Why Choose FURSURE?</h2>
            <p className="text-xl text-gray-600">Modern, efficient, and user-friendly veterinary management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="inline-flex p-4 bg-purple-100 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Smart Scheduling</h3>
              <p className="text-gray-600">Real-time availability and automated notifications for seamless appointment booking.</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your pet's medical data is protected with enterprise-grade security measures.</p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="inline-flex p-4 bg-indigo-100 rounded-full mb-4">
                <BarChart3 className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Comprehensive insights to optimize clinic operations and improve pet care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full p-2">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">FURSURE</span>
            </div>
            <p className="text-gray-400 text-sm">
              &copy; 2024 FURSURE Veterinary Clinic Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
