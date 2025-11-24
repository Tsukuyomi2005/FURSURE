import { useState } from 'react';
import { Filter, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useAvailabilityStore } from '../stores/availabilityStore';
import { useStaffStore } from '../stores/staffStore';
import { useAppointmentStore } from '../stores/appointmentStore';

export function ScheduleManagement() {
  const { allAvailability } = useAvailabilityStore();
  const { staff } = useStaffStore();
  const { appointments } = useAppointmentStore();
  const [filterStaff, setFilterStaff] = useState<string>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('this-week');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    return monday;
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get veterinarians from staff
  const veterinarians = staff.filter(s => s.position === 'Veterinarian' && s.status === 'active');

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

  // Get day name from date
  const getDayName = (date: Date): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  // Get appointments for a vet on a specific date
  const getAppointmentsForVetOnDate = (vetName: string, date: Date) => {
    const dateStr = formatDateForComparison(date);
    return appointments.filter(apt => apt.vet === vetName && apt.date === dateStr);
  };

  // Generate time slots based on availability
  const generateTimeSlots = (availability: typeof allAvailability[0] | undefined) => {
    if (!availability) return [];
    
    const slots = [];
    const [startHour, startMin] = availability.startTime.split(':').map(Number);
    const [endHour, endMin] = availability.endTime.split(':').map(Number);
    const duration = availability.appointmentDuration;
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      slots.push(timeStr);
      
      currentMin += duration;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
    }
    
    return slots;
  };

  // Filter veterinarians
  const filteredVets = veterinarians.filter(vet => {
    if (filterStaff !== 'all' && vet.name !== filterStaff) return false;
    if (filterPosition !== 'all' && vet.position !== filterPosition) return false;
    return true;
  });

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

  // Get week range
  const getWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[start.getMonth()]} ${start.getDate()} - ${months[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`;
  };

  const formatTime12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handleResetFilters = () => {
    setFilterStaff('all');
    setFilterPosition('all');
    setFilterDateRange('this-week');
    setFilterStatus('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Schedules</h1>
          <p className="text-gray-600 mt-2">Manage and view staff schedules</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Schedules</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Staff Member</label>
              <select
                value={filterStaff}
                onChange={(e) => setFilterStaff(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Staff</option>
                {veterinarians.map(vet => (
                  <option key={vet.id} value={vet.name}>{vet.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Positions</option>
                <option value="Veterinarian">Veterinarian</option>
                <option value="Vet Staff">Vet Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="this-week">This Week</option>
                <option value="next-week">Next Week</option>
                <option value="this-month">This Month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Weekly Schedule */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Weekly Schedule</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousWeek}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <span className="text-sm font-medium text-gray-700">{getWeekRange()}</span>
                <button
                  onClick={goToNextWeek}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Staff / Veterinarians
                </th>
                {weekDates.map((date, index) => (
                  <th key={index} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    <div>{getDayName(date).substring(0, 3)}</div>
                    <div className="text-gray-900 font-normal mt-1">
                      {date.getDate()} {date.toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVets.map((vet) => {
                const vetAvailability = allAvailability.find(av => av.veterinarianName === vet.name);
                return (
                  <tr key={vet.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {vet.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{vet.name}</div>
                          <div className="text-sm text-gray-500">{vet.position}</div>
                        </div>
                      </div>
                    </td>
                    {weekDates.map((date, dayIndex) => {
                      const dayName = getDayName(date);
                      const isWorkingDay = vetAvailability?.workingDays.includes(dayName);
                      const dayAppointments = getAppointmentsForVetOnDate(vet.name, date);
                      
                      return (
                        <td key={dayIndex} className="px-2 py-4 align-top">
                          {isWorkingDay ? (
                            <div className="space-y-1">
                              {dayAppointments.map((apt, aptIndex) => (
                                <div
                                  key={apt.id}
                                  className="bg-green-100 border border-green-300 rounded p-2 text-xs"
                                >
                                  <div className="flex items-center gap-1 mb-1">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center">
                                      {aptIndex + 1}
                                    </div>
                                    <span className="font-medium">{formatTime12Hour(apt.time)}</span>
                                  </div>
                                  <div className="text-gray-700 truncate">{apt.petName}</div>
                                  {apt.serviceType && (
                                    <div className="text-gray-600 text-[10px] truncate">{apt.serviceType}</div>
                                  )}
                                </div>
                              ))}
                              {dayAppointments.length === 0 && (
                                <div className="text-xs text-gray-400 text-center py-2">
                                  Available
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 text-center py-2">Off</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredVets.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No veterinarians found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
