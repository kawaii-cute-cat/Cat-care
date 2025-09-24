import React from 'react';
import { useCatContext } from '../contexts/CatContext';
import { useReminderContext } from '../contexts/ReminderContext';
import { format, isToday, isTomorrow } from 'date-fns';
import { 
  Cat, 
  Bell, 
  Calendar, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { state: catState } = useCatContext();
  const { getUpcomingReminders } = useReminderContext();

  const upcomingReminders = getUpcomingReminders(24);
  const todayReminders = upcomingReminders.filter(reminder => 
    isToday(reminder.scheduledTime)
  );
  const tomorrowReminders = upcomingReminders.filter(reminder => 
    isTomorrow(reminder.scheduledTime)
  );

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'feeding':
        return '🍽️';
      case 'medication':
        return '💊';
      case 'vet':
        return '🏥';
      case 'grooming':
        return '✂️';
      default:
        return '📝';
    }
  };

  const getReminderColor = (type: string) => {
    switch (type) {
      case 'feeding':
        return 'bg-orange-100 text-orange-800';
      case 'medication':
        return 'bg-red-100 text-red-800';
      case 'vet':
        return 'bg-blue-100 text-blue-800';
      case 'grooming':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your cats today.</p>
        </div>
        <Link
          to="/cats"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Cat</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Cat className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cats</p>
              <p className="text-2xl font-bold text-gray-900">{catState.cats.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-secondary-100 rounded-lg">
              <Bell className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Reminders</p>
              <p className="text-2xl font-bold text-gray-900">{todayReminders.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayReminders.filter(r => r.isCompleted).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {todayReminders.filter(r => !r.isCompleted).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
            <Link to="/schedule" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          {todayReminders.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reminders scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    reminder.isCompleted 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getReminderIcon(reminder.type)}</span>
                    <div>
                      <p className={`font-medium ${
                        reminder.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {reminder.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(reminder.scheduledTime, 'h:mm a')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getReminderColor(reminder.type)}`}>
                    {reminder.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tomorrow's Preview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Tomorrow's Preview</h2>
            <Link to="/schedule" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          {tomorrowReminders.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reminders scheduled for tomorrow</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tomorrowReminders.slice(0, 3).map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getReminderIcon(reminder.type)}</span>
                    <div>
                      <p className="font-medium text-gray-900">{reminder.title}</p>
                      <p className="text-sm text-gray-500">
                        {format(reminder.scheduledTime, 'h:mm a')}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getReminderColor(reminder.type)}`}>
                    {reminder.type}
                  </span>
                </div>
              ))}
              {tomorrowReminders.length > 3 && (
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-500">
                    +{tomorrowReminders.length - 3} more reminders
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/cats"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Cat className="w-6 h-6 text-primary-600 mr-3" />
            <span className="font-medium text-gray-900">Manage Cats</span>
          </Link>
          
          <Link
            to="/schedule"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Calendar className="w-6 h-6 text-primary-600 mr-3" />
            <span className="font-medium text-gray-900">View Schedule</span>
          </Link>
          
          <Link
            to="/reminders"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Bell className="w-6 h-6 text-primary-600 mr-3" />
            <span className="font-medium text-gray-900">All Reminders</span>
          </Link>
          
          <Link
            to="/settings"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Calendar className="w-6 h-6 text-primary-600 mr-3" />
            <span className="font-medium text-gray-900">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 