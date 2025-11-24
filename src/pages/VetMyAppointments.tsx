import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, AlertCircle } from 'lucide-react';
import { useAppointmentStore } from '../stores/appointmentStore';
import { useRoleStore } from '../stores/roleStore';

// For now, using a placeholder vet name. In production, this would come from auth/profile
const VET_NAME = 'Dr. Smith'; // This should be dynamic based on logged-in vet

export function VetMyAppointments() {
  const { appointments } = useAppointmentStore();
  const { role } = useRoleStore();
  
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(today.setDate(diff));
    return monday;
  });
  
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filter appointments for this veterinarian
  const vetAppointments = appointments.filter(apt => apt.vet === VET_NAME);

  // Get week dates
  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  // Format date for comparison
  const formatDateForComparison = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = formatDateForComparison(date);
    let filtered = vetAppointments.filter(apt => apt.date === dateStr);
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === selectedStatus);
    }
    
    return filtered.sort((a, b) => a.time.localeCompare(b.time));
  };

  // Navigate weeks
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  // Format date display
  const formatDateDisplay = (date: Date): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Get week range
  const getWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[start.getMonth()]} ${start.getDate()}, ${start.getFullYear()} - ${months[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
  };

  // Format time to 12-hour
  const formatTime12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'rescheduled': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'approved': return 'Confirmed';
      case 'cancelled': return 'Cancelled';
      case 'rescheduled': return 'Completed';
      default: return status;
    }
  };

  // Count appointments by status
  const getStatusCounts = () => {
    return {
      pending: vetAppointments.filter(a => a.status === 'pending').length,
      approved: vetAppointments.filter(a => a.status === 'approved').length,
      cancelled: vetAppointments.filter(a => a.status === 'cancelled').length,
      rescheduled: vetAppointments.filter(a => a.status === 'rescheduled').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-gray-600 mt-2">Manage your appointments and availability</p>
      </div>

      {/* Weekly Schedule Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Weekly Schedule</h2>
            <p className="text-gray-600">{getWeekRange()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousWeek}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNextWeek}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Weekly Overview</h3>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              Pending ({statusCounts.pending})
            </button>
            <button
              onClick={() => setSelectedStatus('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Confirmed ({statusCounts.approved})
            </button>
            <button
              onClick={() => setSelectedStatus('rescheduled')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'rescheduled'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              Completed ({statusCounts.rescheduled})
            </button>
            <button
              onClick={() => setSelectedStatus('cancelled')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'cancelled'
                  ? 'bg-red-500 text-white'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              Cancelled ({statusCounts.cancelled})
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const dayAppointments = getAppointmentsForDate(date);
              const isToday = formatDateForComparison(date) === formatDateForComparison(new Date());
              
              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border rounded-lg ${
                    isToday ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    {formatDateDisplay(date)}
                  </div>
                  <div className="space-y-2">
                    {dayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className={`p-2 rounded border text-xs ${getStatusColor(apt.status)}`}
                      >
                        <div className="font-medium">{formatTime12Hour(apt.time)}</div>
                        <div className="mt-1 truncate">{apt.ownerName}</div>
                        <div className="text-xs opacity-75 truncate">{apt.petName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Appointments List */}
        {selectedStatus === 'all' || selectedStatus === 'pending' ? (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Pending Appointments</h3>
            </div>
            <div className="space-y-2">
              {vetAppointments
                .filter(apt => apt.status === 'pending')
                .sort((a, b) => {
                  const dateCompare = a.date.localeCompare(b.date);
                  if (dateCompare !== 0) return dateCompare;
                  return a.time.localeCompare(b.time);
                })
                .map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(apt.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} {formatTime12Hour(apt.time)}
                      </div>
                      <div className="text-sm text-gray-700">{apt.ownerName}</div>
                      <div className="text-sm text-gray-600">{apt.petName}</div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </div>
                ))}
              {vetAppointments.filter(apt => apt.status === 'pending').length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No pending appointments</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

