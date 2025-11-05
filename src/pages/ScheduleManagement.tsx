import { useState, type ChangeEvent } from 'react';
import { Plus, Calendar, Clock, User, Edit, Trash2, Filter } from 'lucide-react';
import { useScheduleStore } from '../stores/scheduleStore';
import { CreateScheduleModal } from '../components/CreateScheduleModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { toast } from 'sonner';
import type { Schedule } from '../types';

export function ScheduleManagement() {
  const { schedules, addSchedule, updateSchedule, removeSchedule } = useScheduleStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [deletingSchedule, setDeletingSchedule] = useState<Schedule | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterVet, setFilterVet] = useState('all');

  // Get unique list of veterinarians from all schedules
  const allVets = Array.from(
    new Set(schedules.flatMap(s => s.veterinarians))
  ).sort();

  // Filter schedules
  let filteredSchedules = schedules;
  if (filterDate) {
    filteredSchedules = filteredSchedules.filter(s => s.date === filterDate);
  }
  if (filterVet !== 'all') {
    filteredSchedules = filteredSchedules.filter(s => 
      s.veterinarians.includes(filterVet)
    );
  }

  // Sort by date and start time
  filteredSchedules = [...filteredSchedules].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  const handleCreate = async (scheduleData: Omit<Schedule, 'id'>) => {
    await addSchedule(scheduleData);
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async () => {
    if (deletingSchedule) {
      await removeSchedule(deletingSchedule.id);
      toast.success('Schedule deleted successfully');
      setDeletingSchedule(null);
    }
  };

  const handleUpdate = async (scheduleData: Omit<Schedule, 'id'>) => {
    if (editingSchedule) {
      await updateSchedule(editingSchedule.id, scheduleData);
      toast.success('Schedule updated successfully');
      setEditingSchedule(null);
      setIsCreateModalOpen(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (schedule: Schedule) => {
    const today = new Date().toISOString().split('T')[0];
    if (schedule.date < today) {
      return 'bg-gray-100 text-gray-800';
    }
    if (schedule.date === today) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (schedule: Schedule) => {
    const today = new Date().toISOString().split('T')[0];
    if (schedule.date < today) {
      return 'Past';
    }
    if (schedule.date === today) {
      return 'Today';
    }
    return 'Upcoming';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
          <p className="text-gray-600 mt-1">
            Create and manage appointment time slots for different services.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingSchedule(null);
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Create Schedule
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={filterDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Veterinarian
            </label>
            <div className="relative">
              <select
                value={filterVet}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterVet(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Veterinarians</option>
                {allVets.map(vet => (
                  <option key={vet} value={vet}>{vet}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {(filterDate || filterVet !== 'all') && (
            <button
              onClick={() => {
                setFilterDate('');
                setFilterVet('all');
              }}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Schedule Cards */}
      {filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm border">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">
            {schedules.length === 0 
              ? 'No schedules created yet' 
              : 'No schedules match your filters'}
          </p>
          <p className="text-gray-400 text-sm">
            {schedules.length === 0 
              ? 'Click "Create Schedule" to add a new schedule' 
              : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
            >
              {/* Date and Time */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(schedule.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(schedule)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit schedule"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingSchedule(schedule)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete schedule"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(schedule)}`}>
                  {getStatusText(schedule)}
                </span>
              </div>

              {/* Veterinarians */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700">Veterinarians:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {schedule.veterinarians.map((vet) => (
                    <span
                      key={vet}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
                    >
                      {vet}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {schedule.notes && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-600">
                    <strong>Notes:</strong> {schedule.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <CreateScheduleModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingSchedule(null);
        }}
        onSubmit={editingSchedule ? handleUpdate : handleCreate}
        schedule={editingSchedule}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deletingSchedule !== null}
        onClose={() => setDeletingSchedule(null)}
        onConfirm={handleDelete}
        title="Delete Schedule"
        message={`Are you sure you want to delete the schedule for ${deletingSchedule ? formatDate(deletingSchedule.date) : ''} (${deletingSchedule?.startTime} - ${deletingSchedule?.endTime})?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

