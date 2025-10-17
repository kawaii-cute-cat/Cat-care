import React, { useState } from 'react';
import { useReminderContext } from '../contexts/ReminderContext';
import { useCatContext } from '../contexts/CatContext';
import { format, isToday, isTomorrow, isYesterday, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';
import { Calendar, Plus, Filter, ChevronLeft, ChevronRight, Clock, CalendarDays } from 'lucide-react';
import ReminderForm from '../components/ReminderForm';
import ReminderCard from '../components/ReminderCard';
import toast from 'react-hot-toast';

const Schedule: React.FC = () => {
  const { state: reminderState, addReminder } = useReminderContext();
  const { state: catState, getCatById } = useCatContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const reminderTypes = [
    { value: 'feeding', label: 'Feeding', icon: '🍽️' },
    { value: 'medication', label: 'Medication', icon: '💊' },
    { value: 'vet', label: 'Vet Appointment', icon: '🏥' },
    { value: 'grooming', label: 'Grooming', icon: '✂️' },
    { value: 'other', label: 'Other', icon: '📝' },
  ];

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM dd, yyyy');
  };

  const filteredReminders = reminderState.reminders.filter(reminder => {
    const cat = getCatById(reminder.catId);
    const matchesType = filterType === 'all' || reminder.type === filterType;
    const matchesCat = filterCat === 'all' || reminder.catId === filterCat;
    return matchesType && matchesCat;
  });

  const handleSubmit = (reminder: any) => {
    addReminder(reminder);
    toast.success('Reminder scheduled successfully!');
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
    const end = endOfWeek(currentWeek, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const getRemindersForDate = (date: Date) => {
    return filteredReminders.filter(reminder => 
      format(reminder.scheduledTime, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const prevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className={`space-y-6 transition-all duration-300 ${showAddForm ? 'pr-96' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Schedule</h1>
          <p className="text-gray-600 dark:text-gray-400">Plan and view your cat care schedule</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Reminder</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field w-40"
            >
              <option value="all">All Types</option>
              {reminderTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="input-field w-40"
            >
              <option value="all">All Cats</option>
              {catState.cats.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                viewMode === 'week' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                viewMode === 'month' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Weekly Schedule</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={prevWeek}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-lg font-medium">
                {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM dd')} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM dd, yyyy')}
              </span>
              <button
                onClick={nextWeek}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4">
            {getWeekDays().map((date) => {
              const dayReminders = getRemindersForDate(date);
              const isCurrentDay = isToday(date);
              
              return (
                <div key={date.toISOString()} className="space-y-3">
                  <div className={`text-center p-2 rounded-lg ${
                    isCurrentDay ? 'bg-primary-100 text-primary-700' : 'bg-gray-50 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    <div className="text-sm font-medium">
                      {format(date, 'EEE')}
                    </div>
                    <div className="text-lg font-bold">
                      {format(date, 'd')}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {dayReminders.length === 0 ? (
                      <div className="text-center py-4 text-gray-400 dark:text-gray-500">
                        <Clock className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-xs">No reminders</p>
                      </div>
                    ) : (
                      dayReminders.map((reminder) => {
                        const cat = getCatById(reminder.catId);
                        return (
                          <ReminderCard
                            key={reminder.id}
                            reminder={reminder}
                            catName={cat?.name}
                            compact={true}
                          />
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Monthly Schedule</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-lg font-medium">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 rounded">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {(() => {
              const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
              const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
              const startDate = startOfWeek(startOfMonth, { weekStartsOn: 1 });
              const endDate = endOfWeek(endOfMonth, { weekStartsOn: 1 });
              const days = eachDayOfInterval({ start: startDate, end: endDate });
              
              return days.map((date) => {
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                const isCurrentDay = isToday(date);
                const dayReminders = getRemindersForDate(date);
                
                return (
                  <div
                    key={date.toISOString()}
                    className={`min-h-[120px] p-2 border border-gray-200 dark:border-gray-700 ${
                      isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
                    } ${isCurrentDay ? 'ring-2 ring-primary-500' : ''}`}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isCurrentMonth ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'
                    } ${isCurrentDay ? 'text-primary-700' : ''}`}>
                      {format(date, 'd')}
                    </div>
                    
                    <div className="space-y-1">
                      {dayReminders.slice(0, 3).map((reminder) => {
                        const cat = getCatById(reminder.catId);
                        return (
                          <div
                            key={reminder.id}
                            className={`text-xs p-1 rounded truncate ${
                              reminder.type === 'feeding' ? 'bg-orange-100 text-orange-800' :
                              reminder.type === 'medication' ? 'bg-red-100 text-red-800' :
                              reminder.type === 'vet' ? 'bg-blue-100 text-blue-800' :
                              reminder.type === 'grooming' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                            title={`${reminder.title} - ${cat?.name}`}
                          >
                            {reminder.title}
                          </div>
                        );
                      })}
                      {dayReminders.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayReminders.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Upcoming Reminders */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Reminders</h2>
        {filteredReminders.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reminders scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReminders
              .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())
              .slice(0, 5)
              .map((reminder) => {
                const cat = getCatById(reminder.catId);
                return (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    catName={cat?.name}
                  />
                );
              })}
          </div>
        )}
      </div>

      {/* Add Reminder Form */}
      <ReminderForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleSubmit}
        title="Schedule New Reminder"
        submitText="Schedule Reminder"
      />
    </div>
  );
};

export default Schedule; 