import React from 'react';
import { Reminder } from '../types';
import { format } from 'date-fns';
import { CheckCircle, Clock, Trash2, Edit } from 'lucide-react';

interface ReminderCardProps {
  reminder: Reminder;
  catName?: string;
  showActions?: boolean;
  onToggle?: (id: string) => void;
  onDelete?: (id: string, title: string) => void;
  onEdit?: (reminder: Reminder) => void;
  compact?: boolean;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  catName,
  showActions = false,
  onToggle,
  onDelete,
  onEdit,
  compact = false
}) => {
  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'feeding': return '🍽️';
      case 'medication': return '💊';
      case 'vet': return '🏥';
      case 'grooming': return '✂️';
      default: return '📝';
    }
  };

  const getReminderColor = (type: string) => {
    switch (type) {
      case 'feeding': return 'bg-orange-100 text-orange-800';
      case 'medication': return 'bg-red-100 text-red-800';
      case 'vet': return 'bg-blue-100 text-blue-800';
      case 'grooming': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isCompleted: boolean) => {
    return isCompleted
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  if (compact) {
    return (
      <div className={`p-3 rounded-lg border ${
        reminder.isCompleted
          ? 'bg-gray-50 border-gray-200'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-start space-x-3 mb-2">
          <span className="text-2xl flex-shrink-0 mt-0.5">{getReminderIcon(reminder.type)}</span>
          <div className="flex-1 min-w-0">
            <p className={`font-medium text-sm ${
              reminder.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {reminder.title}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {format(reminder.scheduledTime, 'h:mm a')}
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getReminderColor(reminder.type)}`}>
            {reminder.type}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-4">
        <span className="text-2xl">{getReminderIcon(reminder.type)}</span>
        <div>
          <h4 className="font-medium text-gray-900">{reminder.title}</h4>
          <p className="text-sm text-gray-500">
            {catName && `${catName} • `}{format(reminder.scheduledTime, 'h:mm a')}
          </p>
          {reminder.description && (
            <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getReminderColor(reminder.type)}`}>
          {reminder.type}
        </span>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(reminder.isCompleted)}`}>
          {reminder.isCompleted ? 'Completed' : 'Pending'}
        </span>
        {showActions && (
          <div className="flex items-center space-x-2">
            {onToggle && (
              <button
                onClick={() => onToggle(reminder.id)}
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
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(reminder)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                title="Edit reminder"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(reminder.id, reminder.title)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                title="Delete reminder"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderCard; 