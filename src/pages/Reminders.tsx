import React, { useState } from 'react';
import { useReminderContext } from '../contexts/ReminderContext';
import { useCatContext } from '../contexts/CatContext';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import { Bell, Plus, CheckCircle, Clock, Filter, SortAsc, Trash2, Edit, Target, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import ReminderForm from '../components/ReminderForm';
import ReminderCard from '../components/ReminderCard';
import toast from 'react-hot-toast';

const Reminders: React.FC = () => {
  const { state: reminderState, toggleReminder, deleteReminder, addReminder, updateReminder, generateRecurringInstances } = useReminderContext();
  const { state: catState, getCatById } = useCatContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [editingReminder, setEditingReminder] = useState<any>(null);

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

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'once': return 'One-time';
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      default: return frequency;
    }
  };

  const handleSubmit = (reminder: any) => {
    if (editingReminder) {
      // Update existing reminder
      const updatedReminder = { ...editingReminder, ...reminder };
      updateReminder(updatedReminder);
      toast.success('Reminder updated successfully!');
      setEditingReminder(null);
    } else {
      // Add new reminder
      addReminder(reminder);
      toast.success('Reminder created successfully!');
    }
  };

  const handleToggleReminder = (id: string) => {
    toggleReminder(id);
    toast.success('Reminder status updated!');
  };

  const handleDeleteReminder = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteReminder(id);
      toast.success('Reminder deleted successfully!');
    }
  };

  const handleEditReminder = (reminder: any) => {
    setEditingReminder(reminder);
    setShowAddForm(true);
  };

  const handleGenerateRecurring = () => {
    generateRecurringInstances();
    toast.success('Recurring instances generated!');
  };

  const filteredReminders = reminderState.reminders.filter(reminder => {
    const matchesType = filterType === 'all' || reminder.type === filterType;
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'completed' && reminder.isCompleted) ||
      (filterStatus === 'pending' && !reminder.isCompleted);
    const matchesCat = filterCat === 'all' || reminder.catId === filterCat;
    return matchesType && matchesStatus && matchesCat;
  });

  const sortedReminders = [...filteredReminders].sort((a, b) => {
    switch (sortBy) {
      case 'date': return a.scheduledTime.getTime() - b.scheduledTime.getTime();
      case 'type': return a.type.localeCompare(b.type);
      case 'status': return a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1;
      default: return 0;
    }
  });

  const groupedReminders = sortedReminders.reduce((groups, reminder) => {
    const dateLabel = getDateLabel(reminder.scheduledTime);
    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(reminder);
    return groups;
  }, {} as Record<string, typeof sortedReminders>);

  // Statistics
  const totalReminders = reminderState.reminders.length;
  const completedReminders = reminderState.reminders.filter(r => r.isCompleted).length;
  const pendingReminders = totalReminders - completedReminders;
  const todayReminders = reminderState.reminders.filter(r => isToday(r.scheduledTime));
  const overdueReminders = reminderState.reminders.filter(r => 
    r.scheduledTime < new Date() && !r.isCompleted
  );
  const recurringReminders = reminderState.reminders.filter(r => r.frequency !== 'once');

  return (
    <div className={`space-y-6 transition-all duration-300 ${showAddForm ? 'pr-96' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
          <p className="text-gray-600">Manage and track your cat care tasks</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleGenerateRecurring}
            className="btn-secondary flex items-center space-x-2"
            title="Generate recurring instances"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate Recurring</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reminder</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalReminders}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedReminders}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingReminders}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overdueReminders.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recurring</p>
              <p className="text-2xl font-bold text-gray-900">{recurringReminders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field w-32"
            >
              <option value="all">All Types</option>
              {reminderTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field w-32"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="input-field w-32"
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
            <SortAsc className="w-5 h-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-32"
            >
              <option value="date">Sort by Date</option>
              <option value="type">Sort by Type</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reminders Content */}
      {sortedReminders.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders yet</h3>
          <p className="text-gray-500 mb-4">Create your first reminder to get started</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Create Your First Reminder
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedReminders).map(([dateLabel, reminders]) => (
            <div key={dateLabel} className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                {dateLabel}
              </h3>
              <div className="space-y-3">
                {reminders.map((reminder) => {
                  const cat = getCatById(reminder.catId);
                  return (
                    <div key={reminder.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{reminder.type === 'feeding' ? '🍽️' : 
                          reminder.type === 'medication' ? '💊' : 
                          reminder.type === 'vet' ? '🏥' : 
                          reminder.type === 'grooming' ? '✂️' : '📝'}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{reminder.title}</h4>
                          <p className="text-sm text-gray-500">
                            {cat?.name} • {format(reminder.scheduledTime, 'h:mm a')}
                          </p>
                          {reminder.description && (
                            <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            Frequency: {getFrequencyLabel(reminder.frequency)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          reminder.type === 'feeding' ? 'bg-orange-100 text-orange-800' :
                          reminder.type === 'medication' ? 'bg-red-100 text-red-800' :
                          reminder.type === 'vet' ? 'bg-blue-100 text-blue-800' :
                          reminder.type === 'grooming' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {reminder.type}
                        </span>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          reminder.isCompleted
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {reminder.isCompleted ? 'Completed' : 'Pending'}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleReminder(reminder.id)}
                            className={`p-2 rounded-full ${
                              reminder.isCompleted
                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title={reminder.isCompleted ? 'Mark as pending' : 'Mark as completed'}
                          >
                            {reminder.isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Clock className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditReminder(reminder)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                            title="Edit reminder"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteReminder(reminder.id, reminder.title)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                            title="Delete reminder"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Reminder Form */}
      <ReminderForm
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setEditingReminder(null);
        }}
        onSubmit={handleSubmit}
        title={editingReminder ? "Edit Reminder" : "Create New Reminder"}
        submitText={editingReminder ? "Update Reminder" : "Create Reminder"}
        initialData={editingReminder}
      />
    </div>
  );
};

export default Reminders; 