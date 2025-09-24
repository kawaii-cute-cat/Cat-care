import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Reminder } from '../types';
import { addDays, addWeeks, addMonths, isBefore, startOfDay } from 'date-fns';
import { notificationService } from '../services/NotificationService';

interface ReminderState {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
}

type ReminderAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_REMINDERS'; payload: Reminder[] }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'UPDATE_REMINDER'; payload: Reminder }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'TOGGLE_REMINDER'; payload: string }
  | { type: 'GENERATE_RECURRING_INSTANCES' };

const initialState: ReminderState = {
  reminders: [],
  loading: false,
  error: null,
};

const reminderReducer = (state: ReminderState, action: ReminderAction): ReminderState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_REMINDERS':
      return { ...state, reminders: action.payload };
    case 'ADD_REMINDER':
      return { ...state, reminders: [...state.reminders, action.payload] };
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(reminder =>
          reminder.id === action.payload.id ? action.payload : reminder
        ),
      };
    case 'DELETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.filter(reminder => reminder.id !== action.payload),
      };
    case 'TOGGLE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(reminder =>
          reminder.id === action.payload
            ? { ...reminder, isCompleted: !reminder.isCompleted }
            : reminder
        ),
      };
    case 'GENERATE_RECURRING_INSTANCES':
      return {
        ...state,
        reminders: generateRecurringInstances(state.reminders),
      };
    default:
      return state;
  }
};

// Function to generate recurring instances
const generateRecurringInstances = (reminders: Reminder[]): Reminder[] => {
  const now = new Date();
  const futureDate = addMonths(now, 3); // Generate instances for next 3 months
  const newInstances: Reminder[] = [];

  reminders.forEach(reminder => {
    if (reminder.frequency === 'once' || !reminder.isActive) {
      return; // Skip one-time reminders and inactive ones
    }

    // Find the latest instance of this recurring reminder
    const existingInstances = reminders.filter(r => 
      r.title === reminder.title && 
      r.catId === reminder.catId && 
      r.type === reminder.type &&
      r.frequency === reminder.frequency
    );

    const latestInstance = existingInstances.reduce((latest, current) => 
      current.scheduledTime > latest.scheduledTime ? current : latest
    );

    let nextDate = new Date(latestInstance.scheduledTime);
    
    // Generate next instances based on frequency
    while (isBefore(nextDate, futureDate)) {
      let newDate: Date;
      
      switch (reminder.frequency) {
        case 'daily':
          newDate = addDays(nextDate, 1);
          break;
        case 'weekly':
          newDate = addWeeks(nextDate, 1);
          break;
        case 'monthly':
          newDate = addMonths(nextDate, 1);
          break;
        default:
          return;
      }

      // Check if this instance already exists
      const instanceExists = reminders.some(r => 
        r.title === reminder.title &&
        r.catId === reminder.catId &&
        r.type === reminder.type &&
        r.frequency === reminder.frequency &&
        startOfDay(r.scheduledTime).getTime() === startOfDay(newDate).getTime()
      );

      if (!instanceExists) {
        const newInstance: Reminder = {
          ...reminder,
          id: crypto.randomUUID(),
          scheduledTime: newDate,
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        newInstances.push(newInstance);
      }

      nextDate = newDate;
    }
  });

  return [...reminders, ...newInstances];
};

interface ReminderContextType {
  state: ReminderState;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  getRemindersByCat: (catId: string) => Reminder[];
  getUpcomingReminders: (hours?: number) => Reminder[];
  generateRecurringInstances: () => void;
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const useReminderContext = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminderContext must be used within a ReminderProvider');
  }
  return context;
};

interface ReminderProviderProps {
  children: ReactNode;
}

export const ReminderProvider: React.FC<ReminderProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reminderReducer, initialState);

  const addReminder = (reminderData: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_REMINDER', payload: newReminder });

    // Schedule notification for the new reminder
    if (newReminder.notificationEnabled) {
      notificationService.scheduleNotification({
        title: newReminder.title,
        message: newReminder.description || `Time for ${newReminder.title}`,
        type: newReminder.type,
        scheduledTime: newReminder.scheduledTime
      }, -15); // Send 15 minutes before
    }
  };

  const updateReminder = (reminder: Reminder) => {
    const updatedReminder = { ...reminder, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_REMINDER', payload: updatedReminder });
  };

  const deleteReminder = (id: string) => {
    dispatch({ type: 'DELETE_REMINDER', payload: id });
  };

  const toggleReminder = (id: string) => {
    dispatch({ type: 'TOGGLE_REMINDER', payload: id });
  };

  const getRemindersByCat = (catId: string) => {
    return state.reminders.filter(reminder => reminder.catId === catId);
  };

  const getUpcomingReminders = (hours: number = 24) => {
    const now = new Date();
    const future = new Date(now.getTime() + hours * 60 * 60 * 1000);
    return state.reminders.filter(reminder =>
      reminder.scheduledTime >= now &&
      reminder.scheduledTime <= future &&
      reminder.isActive &&
      !reminder.isCompleted
    );
  };

  const generateRecurringInstances = () => {
    dispatch({ type: 'GENERATE_RECURRING_INSTANCES' });
  };

  // Auto-generate recurring instances when the app loads
  useEffect(() => {
    generateRecurringInstances();
  }, []);

  const value: ReminderContextType = {
    state,
    addReminder,
    updateReminder,
    deleteReminder,
    toggleReminder,
    getRemindersByCat,
    getUpcomingReminders,
    generateRecurringInstances,
  };

  return <ReminderContext.Provider value={value}>{children}</ReminderContext.Provider>;
}; 