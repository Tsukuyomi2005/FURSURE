import { useState, type ChangeEvent, type FormEvent } from 'react';
import { X, CreditCard } from 'lucide-react';
import { useAppointmentStore } from '../stores/appointmentStore';
import { PaymentModal } from './PaymentModal';
import { toast } from 'sonner';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  time: string;
}

export function AppointmentModal({ isOpen, onClose, date, time }: AppointmentModalProps) {
  const { addAppointment } = useAppointmentStore();
  const [formData, setFormData] = useState({
    petName: '',
    ownerName: '',
    phone: '',
    email: '',
    reason: '',
    serviceType: 'consultation',
    vet: 'Dr. Smith'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPayment, setShowPayment] = useState(false);

  const serviceTypes = [
    { value: 'consultation', label: 'Consultation', price: 75 },
    { value: 'grooming', label: 'Grooming', price: 50 },
    { value: 'vaccination', label: 'Vaccination', price: 40 },
    { value: 'checkup', label: 'General Checkup', price: 60 },
    { value: 'surgery', label: 'Surgery Consultation', price: 150 }
  ];

  const selectedService = serviceTypes.find(service => service.value === formData.serviceType);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.petName.trim()) {
      newErrors.petName = 'Pet name is required';
    }
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Show payment modal for down payment
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      await addAppointment({
        ...formData,
        date,
        time,
        status: 'pending',
        serviceType: formData.serviceType,
        price: selectedService?.price || 0,
        paymentStatus: 'down_payment_paid',
        paymentData
      });

      toast.success('Appointment booked successfully! Down payment processed. You will receive a confirmation email.');
      
      setFormData({
        petName: '',
        ownerName: '',
        phone: '',
        email: '',
        reason: '',
        serviceType: 'consultation',
        vet: 'Dr. Smith'
      });
      setErrors({});
      setShowPayment(false);
      onClose();
    } catch (error) {
      console.error('Failed to book appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Book Appointment
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Date:</strong> {new Date(date).toLocaleDateString()}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Time:</strong> {time}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Name *
                </label>
                <input
                  type="text"
                  value={formData.petName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, petName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.petName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter pet's name"
                />
                {errors.petName && <p className="text-red-500 text-sm mt-1">{errors.petName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Name *
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, ownerName: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.ownerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your name"
                />
                {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type *
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {serviceTypes.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label} - ${service.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the reason for the visit (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Veterinarian
                </label>
                <select
                  value={formData.vet}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, vet: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Dr. Smith">Dr. Smith</option>
                  <option value="Dr. Johnson">Dr. Johnson</option>
                  <option value="Dr. Williams">Dr. Williams</option>
                  <option value="Dr. Brown">Dr. Brown</option>
                </select>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Payment Information</span>
                </div>
                <p className="text-sm text-green-800">
                  Service: {selectedService?.label} - ${selectedService?.price}
                </p>
                <p className="text-sm text-green-800">
                  Down Payment Required: ${Math.round((selectedService?.price || 0) * 0.3)}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={Math.round((selectedService?.price || 0) * 0.3)}
        serviceType={selectedService?.label || ''}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}
