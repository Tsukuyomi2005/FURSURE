import { useState, useEffect } from 'react';
import { Calendar, Clock, Save, X } from 'lucide-react';
import { useAvailabilityStore } from '../stores/availabilityStore';
import { toast } from 'sonner';

// For now, using a placeholder staff name. In production, this would come from auth/profile
const STAFF_NAME = 'Staff Member'; // This should be dynamic based on logged-in staff

export function StaffManageAvailability() {
  const { availability, upsertAvailability } = useAvailabilityStore(STAFF_NAME);
  const [activeTab, setActiveTab] = useState<'recurring' | 'custom'>('recurring');
  
  const [formData, setFormData] = useState({
    workingDays: [] as string[],
    startTime: '10:00',
    endTime: '17:00',
    appointmentDuration: 45,
    breakTime: 30,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing availability
  useEffect(() => {
    if (availability) {
      setFormData({
        workingDays: availability.workingDays,
        startTime: availability.startTime,
        endTime: availability.endTime,
        appointmentDuration: availability.appointmentDuration,
        breakTime: availability.breakTime,
      });
    }
  }, [availability]);

  const daysOfWeek = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' },
  ];

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.workingDays.length === 0) {
      newErrors.workingDays = 'Please select at least one working day';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    // Validate time range
    if (formData.startTime && formData.endTime) {
      const start = parseTime(formData.startTime);
      const end = parseTime(formData.endTime);
      if (start >= end) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    if (formData.appointmentDuration <= 0) {
      newErrors.appointmentDuration = 'Appointment duration must be greater than 0';
    }

    if (formData.breakTime < 0) {
      newErrors.breakTime = 'Break time cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    try {
      await upsertAvailability({
        veterinarianName: STAFF_NAME,
        workingDays: formData.workingDays,
        startTime: formData.startTime,
        endTime: formData.endTime,
        appointmentDuration: formData.appointmentDuration,
        breakTime: formData.breakTime,
      });
      toast.success('Availability saved successfully');
    } catch (error) {
      console.error('Failed to save availability:', error);
      toast.error('Failed to save availability. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Availability</h1>
        <p className="text-gray-600 mt-2">Set your working hours and manage your schedule</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('recurring')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'recurring'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Recurring Schedule
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'custom'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Custom Schedule
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'recurring' ? (
            <div className="space-y-6">
              {/* Weekly Schedule */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
                </div>

                {/* Working Days */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Working Days
                  </label>
                  <div className="space-y-2">
                    {daysOfWeek.map((day) => (
                      <label
                        key={day.value}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.workingDays.includes(day.value)}
                          onChange={() => handleDayToggle(day.value)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-900">{day.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.workingDays && (
                    <p className="text-red-500 text-sm mt-1">{errors.workingDays}</p>
                  )}
                </div>

                {/* Working Hours */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Working Hours
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.startTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                    <span className="text-gray-600 font-medium">to</span>
                    <div className="flex-1 relative">
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.endTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <Clock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  {(errors.startTime || errors.endTime) && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startTime || errors.endTime}
                    </p>
                  )}
                </div>

                {/* Appointment Duration */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Appointment Duration
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="15"
                      step="15"
                      value={formData.appointmentDuration}
                      onChange={(e) => setFormData({ ...formData, appointmentDuration: parseInt(e.target.value) || 0 })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.appointmentDuration ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <span className="absolute right-3 top-2.5 text-gray-500 text-sm">minutes</span>
                  </div>
                  {errors.appointmentDuration && (
                    <p className="text-red-500 text-sm mt-1">{errors.appointmentDuration}</p>
                  )}
                </div>

                {/* Break Time */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Break Time
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="15"
                      value={formData.breakTime}
                      onChange={(e) => setFormData({ ...formData, breakTime: parseInt(e.target.value) || 0 })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.breakTime ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <span className="absolute right-3 top-2.5 text-gray-500 text-sm">minutes</span>
                  </div>
                  {errors.breakTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.breakTime}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Custom schedule feature coming soon</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              onClick={() => {
                if (availability) {
                  setFormData({
                    workingDays: availability.workingDays,
                    startTime: availability.startTime,
                    endTime: availability.endTime,
                    appointmentDuration: availability.appointmentDuration,
                    breakTime: availability.breakTime,
                  });
                } else {
                  setFormData({
                    workingDays: [],
                    startTime: '10:00',
                    endTime: '17:00',
                    appointmentDuration: 45,
                    breakTime: 30,
                  });
                }
                setErrors({});
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

