import React, { useState } from 'react';
import { useCatContext } from '../contexts/CatContext';
import { Reminder } from '../types';
import toast from 'react-hot-toast';

interface ReminderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  title: string;
  submitText: string;
  initialData?: Partial<Reminder>;
}

interface FormData {
  catId: string;
  title: string;
  description: string;
  type: 'feeding' | 'medication' | 'vet' | 'grooming' | 'other';
  scheduledTime: string;
  scheduledDate: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
}

const ReminderForm: React.FC<ReminderFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitText,
  initialData
}) => {
  const { state: catState } = useCatContext();
  
  // Load saved form data from localStorage
  const getSavedFormData = (): FormData => {
    const saved = localStorage.getItem('reminderFormData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.log('Failed to parse saved form data');
      }
    }
    return {
      catId: initialData?.catId || '',
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || 'feeding',
      scheduledTime: initialData?.scheduledTime ? 
        new Date(initialData.scheduledTime).toTimeString().slice(0, 5) : '',
      scheduledDate: initialData?.scheduledTime ? 
        new Date(initialData.scheduledTime).toISOString().split('T')[0] : '',
      frequency: initialData?.frequency || 'once',
    };
  };

  const [formData, setFormData] = useState<FormData>(getSavedFormData());

  // Save form data to localStorage whenever it changes
  const updateFormData = (newData: Partial<FormData>) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);
    localStorage.setItem('reminderFormData', JSON.stringify(updatedData));
  };

  const reminderTypes = [
    { value: 'feeding', label: 'Feeding', icon: '🍽️' },
    { value: 'medication', label: 'Medication', icon: '💊' },
    { value: 'vet', label: 'Vet Appointment', icon: '🏥' },
    { value: 'grooming', label: 'Grooming', icon: '✂️' },
    { value: 'other', label: 'Other', icon: '📝' },
  ];

  const frequencies = [
    { value: 'once', label: 'Once' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.catId || !formData.title || !formData.scheduledTime || !formData.scheduledDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
    
    onSubmit({
      catId: formData.catId,
      title: formData.title,
      description: formData.description,
      type: formData.type,
      scheduledTime: scheduledDateTime,
      frequency: formData.frequency,
      isActive: true,
      isCompleted: false,
      notificationEnabled: true,
    });

    // Clear saved form data after successful submission
    localStorage.removeItem('reminderFormData');
    setFormData({
      catId: '',
      title: '',
      description: '',
      type: 'feeding',
      scheduledTime: '',
      scheduledDate: '',
      frequency: 'once',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Semi-transparent backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={onClose}
      />
      
      {/* Side panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-gray-700">
        <div className="h-full overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cat *
            </label>
            <select
              value={formData.catId}
              onChange={(e) => updateFormData({ catId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select a cat</option>
              {catState.cats.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              className="input-field"
              placeholder="e.g., Morning Feeding"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              className="input-field"
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => updateFormData({ type: e.target.value as FormData['type'] })}
              className="input-field"
              required
            >
              {reminderTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => updateFormData({ scheduledDate: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time *
              </label>
              <input
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => updateFormData({ scheduledTime: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => updateFormData({ frequency: e.target.value as FormData['frequency'] })}
              className="input-field"
            >
              {frequencies.map(freq => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {submitText}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
};

export default ReminderForm; 