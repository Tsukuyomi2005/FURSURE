import { useState, type ChangeEvent } from 'react';
import Calendar from 'react-calendar';
import { Clock, Plus, User, Phone, Mail, FileText } from 'lucide-react';
import { useAppointmentStore } from '../stores/appointmentStore';
import { useScheduleStore } from '../stores/scheduleStore';
import { useRoleStore } from '../stores/roleStore';
import { AppointmentModal } from '../components/AppointmentModal';
import { AppointmentActions } from '../components/AppointmentActions';
import { sendEmail } from '../utils/emailService';
import { toast } from 'sonner';
import type { Appointment } from '../types';
import 'react-calendar/dist/Calendar.css';

export function Appointments() {
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

  // Helper function to convert 24-hour time to 12-hour AM/PM format
  const formatTime12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Helper function to format date as YYYY-MM-DD without timezone issues
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to parse YYYY-MM-DD to Date in local timezone
  const parseDateLocal = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const selectedDateStr = selectedDate.toDateString();
  const selectedDateISO = formatDateLocal(selectedDate);
  const dayAppointments = appointments.filter(apt => {
    // Parse appointment date and compare
    const aptDate = parseDateLocal(apt.date);
    return aptDate.toDateString() === selectedDateStr;
  });

  const isSlotBooked = (time: string) => {
    return dayAppointments.some(apt => apt.time === time);
  };

  const isSlotScheduled = (time: string) => {
    // For pet owners, check if time is available in schedules
    if (!hasFullAccess) {
      return isTimeSlotAvailable(selectedDateISO, time);
    }
    // For staff/vet, show all slots (they can override)
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

      // Send email notification
      let emailType = '';
      let emailData = {};

      switch (status) {
        case 'approved':
          emailType = 'approved';
          emailData = {
            date: appointment.date,
            time: appointment.time,
            petName: appointment.petName,
            vet: appointment.vet
          };
          break;
        case 'rejected':
          emailType = 'rejected';
          emailData = {
            reason: notes || 'No reason provided',
            petName: appointment.petName
          };
          break;
        case 'cancelled':
          emailType = 'cancelled';
          emailData = {
            reason: notes || 'No reason provided',
            petName: appointment.petName
          };
          break;
        case 'rescheduled':
          emailType = 'rescheduled';
          emailData = {
            oldDate: appointment.date,
            oldTime: appointment.time,
            newDate: newDate || appointment.date,
            newTime: newTime || appointment.time,
            petName: appointment.petName,
            vet: appointment.vet
          };
          break;
      }

      await sendEmail(appointment.email, emailType, emailData);
      toast.success(`Appointment ${status} and email notification sent`);
    } catch (error) {
      console.error('Failed to update appointment or send email:', error);
      toast.error('Failed to update appointment or send email notification');
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
          {hasFullAccess ? 'Manage clinic appointments' : 'Book appointments for your pets'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
          <Calendar
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate}
            className="w-full"
            minDate={new Date()}
          />
        </div>

        {/* Time Slots */}
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
                  title={
                    !isAvailable
                      ? isBooked
                        ? 'This slot is already booked'
                        : 'This slot is not available in the schedule'
                      : 'Click to book this slot'
                  }
                >
                  <Clock className="h-4 w-4 inline mr-1" />
                  {!hasFullAccess ? formatTime12Hour(time) : time}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Appointments for {selectedDate.toLocaleDateString()}
          </h3>
        </div>
        <div className="p-6">
          {dayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                          <User className="h-4 w-4" />
                          {appointment.ownerName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {appointment.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {appointment.email}
                        </div>
                      </div>
                      {appointment.reason && (
                        <div className="flex items-start gap-1 mt-2 text-sm text-gray-600">
                          <FileText className="h-4 w-4 mt-0.5" />
                          <span>{appointment.reason}</span>
                        </div>
                      )}
                      {appointment.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <strong>Notes:</strong> {appointment.notes}
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

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSlot(null);
        }}
        date={selectedDateISO}
        time={selectedSlot || ''}
      />
    </div>
  );
}
