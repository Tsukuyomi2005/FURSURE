import { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Stethoscope, 
  Calendar, 
  Package, 
  BarChart3, 
  Users,
  Menu,
  X,
  Clock,
  CheckCircle,
  Shield,
  FileText,
  UserCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');

  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  // Smooth scroll handler
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  // Scroll detection to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for better detection

      const sections = [
        { id: 'about', ref: aboutRef },
        { id: 'services', ref: servicesRef },
        { id: 'features', ref: featuresRef },
        { id: 'faq', ref: faqRef },
      ];

      // Find which section is currently in view
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            if (activeSection !== section.id) {
              setActiveSection(section.id);
            }
            return;
          }
        }
      }

      // If scrolled to top, clear active section
      if (window.scrollY < 100) {
        if (activeSection !== '') {
          setActiveSection('');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // FAQ data
  const faqs = [
    {
      question: "How do I book an appointment?",
      answer: "Simply click 'Sign Up' to create an account, then navigate to 'Book Appointment'. Choose your preferred service, select an available date and time, choose a veterinarian, and complete the booking. You can pay a deposit online or choose to pay at the clinic."
    },
    {
      question: "Can I view my pet's medical history?",
      answer: "Yes! Once you're logged in, you can access your pet's complete medical history including vaccinations, treatments, allergies, and past appointments through the 'Pet Records' section."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept online payments through our secure payment gateway. For appointments, you can pay a 30% deposit online and the remaining balance at the clinic, or pay in full at the clinic. All payments are processed securely."
    },
    {
      question: "Can I cancel or reschedule an appointment?",
      answer: "Yes, you can manage your appointments through the 'My Appointments' section. You can view pending, confirmed, and past appointments, and contact the clinic to reschedule if needed."
    },
    {
      question: "How do I track my pet's vaccinations?",
      answer: "All vaccination records are stored in your pet's medical history. You can view upcoming vaccinations, past vaccinations, and set reminders for future doses in the 'Pet Records' section."
    },
    {
      question: "Is my information secure?",
      answer: "Absolutely! We use enterprise-grade security measures to protect all personal and medical information. Your data is encrypted and stored securely, and we comply with all healthcare data protection regulations."
    }
  ];

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
              <button 
                onClick={() => handleScrollTo('about')} 
                className={`relative font-medium transition-all duration-300 ease-in-out pb-1 ${
                  activeSection === 'about'
                    ? 'text-purple-600'
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                Who We Are
                <span 
                  className={`absolute bottom-0 left-0 h-0.5 bg-purple-600 transition-all duration-300 ease-in-out ${
                    activeSection === 'about' ? 'w-full opacity-100' : 'w-0 opacity-0'
                  }`}
                ></span>
              </button>
              <button 
                onClick={() => handleScrollTo('services')} 
                className={`relative font-medium transition-all duration-300 ease-in-out pb-1 ${
                  activeSection === 'services'
                    ? 'text-purple-600'
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                Our Services
                <span 
                  className={`absolute bottom-0 left-0 h-0.5 bg-purple-600 transition-all duration-300 ease-in-out ${
                    activeSection === 'services' ? 'w-full opacity-100' : 'w-0 opacity-0'
                  }`}
                ></span>
              </button>
              <button 
                onClick={() => handleScrollTo('features')} 
                className={`relative font-medium transition-all duration-300 ease-in-out pb-1 ${
                  activeSection === 'features'
                    ? 'text-purple-600'
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                Features
                <span 
                  className={`absolute bottom-0 left-0 h-0.5 bg-purple-600 transition-all duration-300 ease-in-out ${
                    activeSection === 'features' ? 'w-full opacity-100' : 'w-0 opacity-0'
                  }`}
                ></span>
              </button>
              <button 
                onClick={() => handleScrollTo('faq')} 
                className={`relative font-medium transition-all duration-300 ease-in-out pb-1 ${
                  activeSection === 'faq'
                    ? 'text-purple-600'
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                FAQs
                <span 
                  className={`absolute bottom-0 left-0 h-0.5 bg-purple-600 transition-all duration-300 ease-in-out ${
                    activeSection === 'faq' ? 'w-full opacity-100' : 'w-0 opacity-0'
                  }`}
                ></span>
              </button>
            </nav>

            {/* Login and Sign Up Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md"
              >
                Sign Up
              </Link>
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
            <button 
              onClick={() => handleScrollTo('about')} 
              className={`block py-2 w-full text-left transition-all duration-300 ease-in-out ${
                activeSection === 'about'
                  ? 'text-purple-600 font-semibold'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Who We Are
            </button>
            <button 
              onClick={() => handleScrollTo('services')} 
              className={`block py-2 w-full text-left transition-all duration-300 ease-in-out ${
                activeSection === 'services'
                  ? 'text-purple-600 font-semibold'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Our Services
            </button>
            <button 
              onClick={() => handleScrollTo('features')} 
              className={`block py-2 w-full text-left transition-all duration-300 ease-in-out ${
                activeSection === 'features'
                  ? 'text-purple-600 font-semibold'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              Features
            </button>
            <button 
              onClick={() => handleScrollTo('faq')} 
              className={`block py-2 w-full text-left transition-all duration-300 ease-in-out ${
                activeSection === 'faq'
                  ? 'text-purple-600 font-semibold'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              FAQs
            </button>
            <div className="pt-2 border-t border-gray-200 flex flex-col gap-2">
              <Link
                to="/login"
                className="block text-purple-600 hover:text-purple-700 py-2 font-semibold"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="block bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg py-2 px-4 text-center font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all"
              >
                Sign Up
              </Link>
            </div>
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
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
                <button
                  onClick={() => handleScrollTo('services')}
                  className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                >
                  Learn More
                </button>
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

      {/* Who We Are Section */}
      <section id="about" ref={aboutRef} className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Who We Are</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              FURSURE is a modern veterinary clinic management system designed to bridge the gap between pet owners and veterinary care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-800">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  At FURSURE, we believe that caring for your pet should be simple, stress-free, and accessible. 
                  We've created a comprehensive platform that allows pet owners to manage their pet's healthcare 
                  journey with ease, while providing veterinary clinics with powerful tools to streamline operations.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-800">What We Offer</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Online appointment booking system with real-time availability</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Complete pet medical records and history tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Secure payment processing with flexible options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Comprehensive clinic management tools for staff</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-purple-100 rounded-xl">
                      <Heart className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Pet-Owner Centric</h4>
                      <p className="text-sm text-gray-600">Designed with your convenience in mind</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-xl">
                      <Stethoscope className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Clinic-Friendly</h4>
                      <p className="text-sm text-gray-600">Streamlined operations for veterinary staff</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-100 rounded-xl">
                      <Shield className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Secure & Reliable</h4>
                      <p className="text-sm text-gray-600">Your data is protected with enterprise-grade security</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" ref={servicesRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive veterinary care management for both pet owners and clinic staff
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Service 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="p-4 bg-purple-100 rounded-xl w-fit mb-4">
                <Stethoscope className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">General Consultation</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive health check-ups and consultations with licensed veterinarians for your pet's wellness.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Health assessments</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Treatment planning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Follow-up care</span>
                </li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="p-4 bg-blue-100 rounded-xl w-fit mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Vaccination Services</h3>
              <p className="text-gray-600 mb-4">
                Complete vaccination programs to keep your pets protected against common diseases and infections.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Core vaccines</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Booster shots</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Vaccination records</span>
                </li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="p-4 bg-indigo-100 rounded-xl w-fit mb-4">
                <Calendar className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Emergency Care</h3>
              <p className="text-gray-600 mb-4">
                Immediate veterinary attention for urgent situations and emergency medical needs.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>24/7 availability</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Urgent consultations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>Critical care support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pet Owner vs Clinic Staff Services */}
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
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Access appointment history anytime</span>
                </li>
              </ul>
            </div>

            {/* Clinic Staff Services */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="h-8 w-8 text-blue-600" />
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
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Schedule management for staff</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Why Choose FURSURE?</h2>
            <p className="text-xl text-gray-600">Modern, efficient, and user-friendly veterinary management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-white hover:shadow-lg transition-all">
              <div className="inline-flex p-4 bg-purple-100 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Smart Scheduling</h3>
              <p className="text-gray-600">Real-time availability and automated notifications for seamless appointment booking.</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white hover:shadow-lg transition-all">
              <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your pet's medical data is protected with enterprise-grade security measures.</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white hover:shadow-lg transition-all">
              <div className="inline-flex p-4 bg-indigo-100 rounded-full mb-4">
                <BarChart3 className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Comprehensive insights to optimize clinic operations and improve pet care.</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white hover:shadow-lg transition-all">
              <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">24/7 Access</h3>
              <p className="text-gray-600">Manage appointments, view records, and access services anytime, anywhere.</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white hover:shadow-lg transition-all">
              <div className="inline-flex p-4 bg-yellow-100 rounded-full mb-4">
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Complete Records</h3>
              <p className="text-gray-600">Digital pet medical records with vaccination history, treatments, and more.</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white hover:shadow-lg transition-all">
              <div className="inline-flex p-4 bg-pink-100 rounded-full mb-4">
                <Package className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Inventory Management</h3>
              <p className="text-gray-600">Efficient stock tracking and inventory control for clinic operations.</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white hover:shadow-lg transition-all">
              <div className="inline-flex p-4 bg-teal-100 rounded-full mb-4">
                <UserCheck className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Staff Management</h3>
              <p className="text-gray-600">Comprehensive tools for managing veterinarians, schedules, and staff.</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white hover:shadow-lg transition-all">
              <div className="inline-flex p-4 bg-red-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">User-Friendly</h3>
              <p className="text-gray-600">Intuitive interface designed for ease of use by both pet owners and staff.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faq" ref={faqRef} className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about FURSURE</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-8">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Join FURSURE today and experience the future of veterinary care management
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Log In
            </Link>
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
