import { useState, type ChangeEvent } from 'react';
import Calendar from 'react-calendar';
import { Clock, ChevronRight, ChevronLeft, CreditCard, Smartphone, User, Phone, Mail, FileText, Building2 } from 'lucide-react';
import { useAppointmentStore } from '../stores/appointmentStore';
import { useScheduleStore } from '../stores/scheduleStore';
import { useRoleStore } from '../stores/roleStore';
import { usePetRecordsStore } from '../stores/petRecordsStore';
import { PaymentModal } from '../components/PaymentModal';
import { AppointmentActions } from '../components/AppointmentActions';
import { toast } from 'sonner';
import type { Appointment } from '../types';
import 'react-calendar/dist/Calendar.css';

type BookingStep = 1 | 2 | 3 | 4;

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

const services: Service[] = [
  { id: 'vaccination-deworming', name: 'Vaccination & Deworming', description: 'Complete vaccination and deworming services', price: 500 },
  { id: 'surgery', name: 'Surgery', description: 'Surgical procedures and operations', price: 5000 },
  { id: 'consultation-treatment', name: 'Consultation Treatment & Confinement', description: 'Medical consultation and treatment with confinement', price: 2000 },
  { id: 'boarding', name: 'Boarding', description: 'Pet boarding and accommodation services', price: 800 },
  { id: 'laboratory', name: 'Laboratory', description: 'Laboratory tests and diagnostics', price: 1500 },
  { id: 'grooming', name: 'Grooming', description: 'Professional pet grooming services', price: 600 },
  { id: 'pet-accessories', name: 'Pet Accessories', description: 'Pet accessories and supplies', price: 300 },
  { id: 'pet-foods', name: 'Pet Foods', description: 'Premium pet food and nutrition', price: 400 },
];

export function Appointments() {
  const { appointments, addAppointment, updateAppointment } = useAppointmentStore();
  const { isTimeSlotAvailable, getSchedulesByDate } = useScheduleStore();
  const { role } = useRoleStore();
  const { records: petRecords } = usePetRecordsStore();
  
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedVet, setSelectedVet] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    petName: '',
    ownerName: '',
    phone: '',
    email: '',
    reason: '',
  });
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'at_clinic' | 'online'>('at_clinic');

  const hasFullAccess = role === 'vet' || role === 'staff';

  // If user has full access, show the old appointment management view
  if (hasFullAccess) {
    return <AppointmentManagementView />;
  }

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const formatTime12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get available vets for selected date and time
  const getAvailableVets = (): string[] => {
    if (!selectedDate || !selectedTime) {
      return ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown'];
    }

    const dateStr = formatDateLocal(selectedDate);
    const schedules = getSchedulesByDate(dateStr);
    const vetsInSchedule = new Set<string>();
    
    const parseTime = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const requestedTime = parseTime(selectedTime);
    
    schedules.forEach(schedule => {
      const startTime = parseTime(schedule.startTime);
      const endTime = parseTime(schedule.endTime);
      
      if (requestedTime >= startTime && requestedTime < endTime) {
        schedule.veterinarians.forEach(vet => vetsInSchedule.add(vet));
      }
    });
    
    if (vetsInSchedule.size === 0) {
      return ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown'];
    }
    
    return Array.from(vetsInSchedule).sort();
  };

  const availableVets = getAvailableVets();

  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedService) {
        toast.error('Please select a service');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedVet) {
        toast.error('Please select a veterinarian');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!selectedDate || !selectedTime) {
        toast.error('Please select a date and time');
        return;
      }
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as BookingStep);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const isSlotBooked = (time: string) => {
    if (!selectedDate) return false;
    const dateStr = formatDateLocal(selectedDate);
    return appointments.some(apt => apt.date === dateStr && apt.time === time);
  };

  const isSlotAvailable = (time: string) => {
    if (!selectedDate) return false;
    const dateStr = formatDateLocal(selectedDate);
    return !isSlotBooked(time) && isTimeSlotAvailable(dateStr, time);
  };

  const handleTimeSlotClick = (time: string) => {
    if (isSlotAvailable(time)) {
      setSelectedTime(time);
    }
  };

  const validateForm = () => {
    if (!formData.petName.trim()) {
      toast.error('Pet name is required');
      return false;
    }
    if (!formData.ownerName.trim()) {
      toast.error('Owner name is required');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('Phone number is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Email is invalid');
      return false;
    }
    return true;
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    if (!validateForm() || !selectedService || !selectedVet || !selectedDate || !selectedTime) {
      return;
    }

    try {
      await addAppointment({
        petName: formData.petName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        email: formData.email,
        date: formatDateLocal(selectedDate),
        time: selectedTime,
        reason: formData.reason,
        vet: selectedVet,
        status: 'pending',
        serviceType: selectedService.id,
        price: selectedService.price,
        paymentStatus: 'down_payment_paid',
        paymentData: {
          ...paymentData,
          method: 'online'
        }
      });

      toast.success('Appointment booked successfully!');
      
      // Reset form
      setCurrentStep(1);
      setSelectedService(null);
      setSelectedVet('');
      setSelectedDate(null);
      setSelectedTime('');
      setFormData({
        petName: '',
        ownerName: '',
        phone: '',
        email: '',
        reason: '',
      });
      setPaymentMethod('at_clinic');
      setShowPayment(false);
    } catch (error) {
      console.error('Failed to book appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) {
      return;
    }
    setShowPayment(true);
  };

  const handleBookAppointment = async () => {
    if (!validateForm() || !selectedService || !selectedVet || !selectedDate || !selectedTime) {
      return;
    }

    try {
      await addAppointment({
        petName: formData.petName,
        ownerName: formData.ownerName,
        phone: formData.phone,
        email: formData.email,
        date: formatDateLocal(selectedDate),
        time: selectedTime,
        reason: formData.reason,
        vet: selectedVet,
        status: 'pending',
        serviceType: selectedService.id,
        price: selectedService.price,
        paymentStatus: 'pending',
        paymentData: {
          method: 'at_clinic'
        }
      });

      toast.success('Appointment booked successfully!');
      
      // Reset form
      setCurrentStep(1);
      setSelectedService(null);
      setSelectedVet('');
      setSelectedDate(null);
      setSelectedTime('');
      setFormData({
        petName: '',
        ownerName: '',
        phone: '',
        email: '',
        reason: '',
      });
      setPaymentMethod('at_clinic');
    } catch (error) {
      console.error('Failed to book appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  const steps = [
    { number: 1, label: 'Select Service' },
    { number: 2, label: 'Choose Veterinarian' },
    { number: 3, label: 'Select Date and Time' },
    { number: 4, label: 'Payment Method' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Book Your Appointment</h1>
        <p className="text-gray-600 mt-2">
          Schedule your next visit with our professional veterinarians
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300 ${
                  currentStep === step.number
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50 ring-4 ring-purple-200'
                    : currentStep > step.number
                    ? 'bg-purple-200 text-purple-700'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.number}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep === step.number
                    ? 'text-purple-600'
                    : currentStep > step.number
                    ? 'text-purple-500'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                  currentStep > step.number ? 'bg-purple-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Service */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Your Service</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedService?.id === service.id
                    ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-200'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <p className="text-lg font-bold text-purple-600">₱{service.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!selectedService}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Choose Veterinarian */}
      {currentStep === 2 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose Veterinarian</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableVets.map((vet) => (
              <button
                key={vet}
                onClick={() => setSelectedVet(vet)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedVet === vet
                    ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-200'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <h3 className="font-semibold text-gray-900">{vet}</h3>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedVet}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Date and Time */}
      {currentStep === 3 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Date and Time</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
              <Calendar
                onChange={(value) => setSelectedDate(value as Date)}
                value={selectedDate}
                className="w-full"
                minDate={new Date()}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Available Times {selectedDate ? `- ${selectedDate.toLocaleDateString()}` : ''}
              </h3>
              {selectedDate ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((time) => {
                    const isBooked = isSlotBooked(time);
                    const isAvailable = isSlotAvailable(time);
                    
                    return (
                      <button
                        key={time}
                        onClick={() => handleTimeSlotClick(time)}
                        disabled={!isAvailable}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          selectedTime === time
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                            : !isAvailable
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                        }`}
                      >
                        <Clock className="h-4 w-4 inline mr-1" />
                        {formatTime12Hour(time)}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Please select a date first</p>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedDate || !selectedTime}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Payment Method */}
      {currentStep === 4 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          {/* Form Fields - Moved to top */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pet Name *
              </label>
              <select
                value={formData.petName}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, petName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a pet</option>
                {petRecords.map((pet) => (
                  <option key={pet.id} value={pet.petName}>
                    {pet.petName} {pet.breed ? `(${pet.breed})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner Name *
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Visit (Optional)
              </label>
              <textarea
                value={formData.reason}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="Describe the reason for the visit"
              />
            </div>
          </div>

          {/* Booking Summary Section - Moved to top */}
          {selectedService && (
            <div className="mb-8 relative">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
              
              {/* Decorative opacity lines */}
              <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <div className="flex gap-2">
                  <div className="w-1 h-16 bg-purple-500"></div>
                  <div className="w-1 h-12 bg-purple-500"></div>
                  <div className="w-1 h-20 bg-purple-500"></div>
                  <div className="w-1 h-14 bg-purple-500"></div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 relative overflow-hidden">
                {/* Additional decorative lines */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" className="text-purple-500" />
                  </svg>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm relative z-10">
                  <div>
                    <span className="text-gray-600">Service:</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{selectedService.name}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Veterinarian:</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{selectedVet}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Date:</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      {selectedDate ? formatDateLocal(selectedDate) : ''}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Time:</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      {selectedTime ? formatTime12Hour(selectedTime) : ''}
                    </span>
                  </div>
                  
                  <div className="col-span-2 border-t border-gray-200 pt-2 mt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="text-lg font-bold text-purple-600">
                          ₱{selectedService.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Down Payment Required:</span>
                        <span className="font-semibold text-purple-600">
                          ₱{Math.round(selectedService.price * 0.3).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Balance After Deposit:</span>
                        <span className="font-semibold text-gray-900">
                          ₱{(selectedService.price - Math.round(selectedService.price * 0.3)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Select Payment Method Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pay Balance at Clinic */}
              <button
                onClick={() => setPaymentMethod('at_clinic')}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  paymentMethod === 'at_clinic'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Building2 className={`h-6 w-6 mt-1 ${paymentMethod === 'at_clinic' ? 'text-blue-600' : 'text-gray-600'}`} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Pay Balance at Clinic</h3>
                    {selectedService && (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Pay the ₱{Math.round(selectedService.price * 0.3).toLocaleString()} deposit online now.</p>
                        <p>Pay the remaining ₱{(selectedService.price - Math.round(selectedService.price * 0.3)).toLocaleString()} at the clinic on the day of your appointment.</p>
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {/* Pay Online */}
              <button
                onClick={() => setPaymentMethod('online')}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  paymentMethod === 'online'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Smartphone className={`h-6 w-6 mt-1 ${paymentMethod === 'online' ? 'text-blue-600' : 'text-gray-600'}`} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">Pay Online</h3>
                    {selectedService && (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Pay the full amount or minimum ₱{Math.round(selectedService.price * 0.3).toLocaleString()} deposit via GCash/PayMaya and upload proof.</p>
                        <p className="text-xs text-gray-500">Remaining balance (₱{(selectedService.price - Math.round(selectedService.price * 0.3)).toLocaleString()}) can also be paid online if they choose.</p>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={paymentMethod === 'online' ? handleProceedToPayment : handleBookAppointment}
              disabled={!formData.petName || !formData.ownerName || !formData.phone || !formData.email}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={selectedService ? Math.round(selectedService.price * 0.3) : 0}
        serviceType={selectedService?.name || ''}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}

// Old appointment management view for staff/vet
function AppointmentManagementView() {
  const { appointments, updateAppointment } = useAppointmentStore();
  const { isTimeSlotAvailable } = useScheduleStore();
  const { role } = useRoleStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const hasFullAccess = role === 'vet' || role === 'staff';

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const formatTime12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateLocal = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const selectedDateStr = selectedDate.toDateString();
  const selectedDateISO = formatDateLocal(selectedDate);
  const dayAppointments = appointments.filter(apt => {
    const aptDate = parseDateLocal(apt.date);
    return aptDate.toDateString() === selectedDateStr;
  });

  const isSlotBooked = (time: string) => {
    return dayAppointments.some(apt => apt.time === time);
  };

  const isSlotScheduled = (time: string) => {
    if (!hasFullAccess) {
      return isTimeSlotAvailable(selectedDateISO, time);
    }
    return true;
  };

  const handleSlotClick = (time: string) => {
    if (isSlotBooked(time)) return;
    setSelectedSlot(time);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (appointmentId: string, status: Appointment['status'], notes?: string, newDate?: string, newTime?: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    const updates: Partial<Appointment> = { status };
    if (notes) updates.notes = notes;
    if (newDate && newTime) {
      updates.date = newDate;
      updates.time = newTime;
    }

    try {
      await updateAppointment(appointmentId, updates);
      toast.success(`Appointment ${status}`);
    } catch (error) {
      console.error('Failed to update appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'rescheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appointment Scheduling</h1>
        <p className="text-gray-600">
          Manage clinic appointments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
          <Calendar
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate}
            className="w-full"
            minDate={new Date()}
          />
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Available Times - {selectedDate.toLocaleDateString()}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {timeSlots.map((time) => {
              const isBooked = isSlotBooked(time);
              const isScheduled = isSlotScheduled(time);
              const isAvailable = !isBooked && (hasFullAccess || isScheduled);
              
              return (
                <button
                  key={time}
                  onClick={() => handleSlotClick(time)}
                  disabled={!isAvailable}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    !isAvailable
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <Clock className="h-4 w-4 inline mr-1" />
                  {!hasFullAccess ? formatTime12Hour(time) : time}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Appointments for {selectedDate.toLocaleDateString()}
          </h3>
        </div>
        <div className="p-6">
          {dayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No appointments scheduled for this date</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dayAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h4 className="font-semibold text-gray-900">{appointment.petName}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {appointment.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{appointment.ownerName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{appointment.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{appointment.email}</span>
                        </div>
                      </div>
                      {appointment.reason && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span>{appointment.reason}</span>
                        </div>
                      )}
                    </div>
                    {hasFullAccess && (
                      <AppointmentActions
                        appointment={appointment}
                        onStatusUpdate={handleStatusUpdate}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
