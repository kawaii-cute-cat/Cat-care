export interface Cat {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  color: string;
  photo?: string;
  photos?: string[];
  microchip?: string;
  vetInfo?: {
    name: string;
    phone: string;
    address: string;
  };
  medicalHistory?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Reminder {
  id: string;
  catId: string;
  title: string;
  description?: string;
  type: 'feeding' | 'medication' | 'vet' | 'grooming' | 'other';
  scheduledTime: Date;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  isCompleted: boolean;
  notificationEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedingSchedule {
  id: string;
  catId: string;
  foodType: string;
  amount: string;
  time: string;
  days: string[];
  isActive: boolean;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  reminderTime: number; // minutes before event
} 