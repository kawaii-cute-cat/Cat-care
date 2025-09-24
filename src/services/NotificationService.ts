// Notification Service for Cat Care Scheduler
// This service handles SMS, Email, and Push notifications
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';

export interface NotificationConfig {
  email: {
    enabled: boolean;
    address: string;
  };
  sms: {
    enabled: boolean;
    phoneNumber: string;
  };
  push: {
    enabled: boolean;
  };
}

export interface NotificationData {
  title: string;
  message: string;
  type: 'feeding' | 'medication' | 'vet' | 'grooming' | 'other';
  catName?: string;
  scheduledTime: Date;
}

class NotificationService {
  private config: NotificationConfig = {
    email: {
      enabled: false,
      address: ''
    },
    sms: {
      enabled: false,
      phoneNumber: ''
    },
    push: {
      enabled: false
    }
  };

  // Initialize notification service
  async initialize(): Promise<void> {
    // Load saved configuration
    const savedConfig = localStorage.getItem('notificationConfig');
    if (savedConfig) {
      this.config = { ...this.config, ...JSON.parse(savedConfig) };
    }

    // Initialize EmailJS
    try {
      emailjs.init({
        publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
      });
      console.log('EmailJS initialized successfully');
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
    }

    // Check notification permissions and restore push notification state
    if ('Notification' in window) {
      const permission = Notification.permission;
      if (permission === 'granted') {
        this.config.push.enabled = true;
        this.saveConfig();
      } else if (permission === 'default') {
        // Only request permission if it hasn't been requested before
        const permissionRequested = localStorage.getItem('notificationPermissionRequested');
        if (!permissionRequested) {
          const newPermission = await Notification.requestPermission();
          if (newPermission === 'granted') {
            this.config.push.enabled = true;
            this.saveConfig();
          }
          localStorage.setItem('notificationPermissionRequested', 'true');
        }
      }
    }
  }

  // Save configuration to localStorage
  private saveConfig(): void {
    localStorage.setItem('notificationConfig', JSON.stringify(this.config));
  }

  // Update notification configuration
  updateConfig(newConfig: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  // Get current configuration
  getConfig(): NotificationConfig {
    return { ...this.config };
  }

  // Send notification through all enabled channels
  async sendNotification(data: NotificationData): Promise<void> {
    const promises: Promise<void>[] = [];

    // Send push notification
    if (this.config.push.enabled) {
      promises.push(this.sendPushNotification(data));
    }

    // Send email notification
    if (this.config.email.enabled && this.config.email.address) {
      promises.push(this.sendEmailNotification(data));
    }

    // Send SMS notification
    if (this.config.sms.enabled && this.config.sms.phoneNumber) {
      promises.push(this.sendSMSNotification(data));
    }

    // Wait for all notifications to be sent
    await Promise.allSettled(promises);
  }

  // Send push notification
  private async sendPushNotification(data: NotificationData): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(data.title, {
        body: data.message,
        icon: '/cat-icon.svg',
        badge: '/cat-icon.svg',
        tag: `cat-care-${data.type}`,
        requireInteraction: true
      });

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }

  // Send email notification using EmailJS
  private async sendEmailNotification(data: NotificationData): Promise<void> {
    try {
      // Check if EmailJS is properly configured
      if (!EMAILJS_CONFIG.PUBLIC_KEY || EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE' || EMAILJS_CONFIG.PUBLIC_KEY.length < 10) {
        console.log('❌ EmailJS not configured yet. Please follow the setup instructions in EMAILJS_SETUP.md');
        throw new Error('EmailJS not configured. Please set up your public key.');
      }

      // Validate email address
      if (!this.config.email.address || !this.isValidEmail(this.config.email.address)) {
        console.log('❌ Invalid email address:', this.config.email.address);
        throw new Error('Invalid email address. Please check your email settings.');
      }

      // Ensure EmailJS is initialized
      try {
        emailjs.init({
          publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
        });
        console.log('✅ EmailJS initialized successfully');
      } catch (initError) {
        console.log('⚠️ EmailJS already initialized or failed to initialize:', initError);
      }

      console.log('📧 Attempting to send email notification...');
      console.log('🔧 Service ID:', EMAILJS_CONFIG.SERVICE_ID);
      console.log('📄 Template ID:', EMAILJS_CONFIG.TEMPLATE_ID);
      console.log('🔑 Public Key:', EMAILJS_CONFIG.PUBLIC_KEY.substring(0, 8) + '...');
      console.log('📬 Email enabled:', this.config.email.enabled);
      console.log('📧 Email address:', this.config.email.address);

      const templateParams = {
        to_email: this.config.email.address,
        to_name: 'Cat Care User',
        subject: `Cat Care Reminder: ${data.title}`,
        message: data.message,
        cat_name: data.catName || 'Your cat',
        scheduled_time: data.scheduledTime.toLocaleString(),
        reminder_type: data.type,
        app_name: 'CatCare Scheduler'
      };

      console.log('📋 Template parameters:', templateParams);

      // Send email using EmailJS
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      console.log('✅ Email notification sent successfully via EmailJS:', result);
      
    } catch (error: any) {
      console.error('❌ Failed to send email notification:', error);
      console.error('🔍 Error details:', {
        message: error?.message,
        status: error?.status,
        text: error?.text,
        code: error?.code
      });
      
      // Provide more specific error messages
      if (error?.text?.includes('Template not found')) {
        console.error('🚨 TEMPLATE NOT FOUND: Please create the email template "template_catcare" in your EmailJS dashboard');
        throw new Error('Email template not found. Please create the template in EmailJS dashboard.');
      } else if (error?.text?.includes('Service not found')) {
        console.error('🚨 SERVICE NOT FOUND: Please check your service ID in EmailJS dashboard');
        throw new Error('Email service not found. Please check your service configuration.');
      } else if (error?.text?.includes('Invalid public key')) {
        console.error('🚨 INVALID PUBLIC KEY: Please check your public key in EmailJS dashboard');
        throw new Error('Invalid public key. Please check your EmailJS configuration.');
      } else {
        throw new Error(`Email sending failed: ${error?.message || 'Unknown error'}`);
      }
    }
  }

  // Validate email address
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Send SMS notification (using Twilio or similar service)
  private async sendSMSNotification(data: NotificationData): Promise<void> {
    try {
      // This would integrate with a service like Twilio, AWS SNS, or your own backend
      const smsData = {
        to: this.config.sms.phoneNumber,
        message: `🐱 CatCare: ${data.title} - ${data.message}${data.catName ? ` (${data.catName})` : ''}`
      };

      // For demo purposes, we'll simulate sending an SMS
      console.log('SMS notification sent:', smsData);
      
      // In a real implementation, you would call your SMS service here
      // Example with Twilio:
      // await fetch('/api/send-sms', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(smsData)
      // });
      
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
    }
  }

  // Schedule a notification for a specific time
  scheduleNotification(data: NotificationData, delayMinutes: number = 0): void {
    const scheduledTime = new Date(data.scheduledTime.getTime() + (delayMinutes * 60 * 1000));
    const now = new Date();
    const delay = scheduledTime.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        this.sendNotification(data);
      }, delay);
    } else {
      // Send immediately if the time has already passed
      this.sendNotification(data);
    }
  }

  // Test notification
  async testNotification(): Promise<void> {
    const testData: NotificationData = {
      title: 'Test Notification',
      message: 'This is a test notification from CatCare! If you receive this, your email setup is working perfectly! 🐱✨',
      type: 'other',
      catName: 'Test Cat',
      scheduledTime: new Date()
    };

    console.log('🧪 === TEST NOTIFICATION START ===');
    console.log('📋 Current config:', this.config);
    console.log('📧 Email enabled:', this.config.email.enabled);
    console.log('📧 Email address:', this.config.email.address);
    console.log('⚙️ EmailJS config:', {
      SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID,
      TEMPLATE_ID: EMAILJS_CONFIG.TEMPLATE_ID,
      PUBLIC_KEY: EMAILJS_CONFIG.PUBLIC_KEY.substring(0, 8) + '...'
    });
    console.log('📝 Test data:', testData);
    
    // Check if any notifications are enabled
    const hasEnabledNotifications = this.config.email.enabled || this.config.push.enabled || this.config.sms.enabled;
    if (!hasEnabledNotifications) {
      throw new Error('No notification methods are enabled. Please enable at least one notification method in settings.');
    }

    // Check email configuration specifically
    if (this.config.email.enabled) {
      if (!this.config.email.address) {
        throw new Error('Email notifications are enabled but no email address is provided.');
      }
      if (!this.isValidEmail(this.config.email.address)) {
        throw new Error('Invalid email address format.');
      }
    }
    
    await this.sendNotification(testData);
    
    console.log('✅ === TEST NOTIFICATION END ===');
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window || this.config.email.enabled || this.config.sms.enabled;
  }

  // Get notification permission status
  getPermissionStatus(): string {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  }

  // Request notification permissions
  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.config.push.enabled = permission === 'granted';
      this.saveConfig();
      localStorage.setItem('notificationPermissionRequested', 'true');
      return permission === 'granted';
    }
    return false;
  }

  // Reinitialize EmailJS (useful if there are issues)
  reinitializeEmailJS(): void {
    try {
      emailjs.init({
        publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
      });
      console.log('EmailJS reinitialized successfully');
    } catch (error) {
      console.error('Failed to reinitialize EmailJS:', error);
    }
  }

  // Reset notification permission state (for testing)
  resetPermissionState(): void {
    localStorage.removeItem('notificationPermissionRequested');
    console.log('Notification permission state reset');
  }

  // Check EmailJS setup status
  checkEmailJSSetup(): { isValid: boolean; issues: string[]; recommendations: string[] } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check public key
    if (!EMAILJS_CONFIG.PUBLIC_KEY || EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE') {
      issues.push('Public key not configured');
      recommendations.push('Set your EmailJS public key in src/config/emailjs.ts');
    } else if (EMAILJS_CONFIG.PUBLIC_KEY.length < 10) {
      issues.push('Public key appears to be invalid (too short)');
      recommendations.push('Check your EmailJS public key in the dashboard');
    }

    // Check service ID
    if (!EMAILJS_CONFIG.SERVICE_ID || EMAILJS_CONFIG.SERVICE_ID === 'YOUR_SERVICE_ID_HERE') {
      issues.push('Service ID not configured');
      recommendations.push('Set your EmailJS service ID in src/config/emailjs.ts');
    }

    // Check template ID
    if (!EMAILJS_CONFIG.TEMPLATE_ID || EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID_HERE') {
      issues.push('Template ID not configured');
      recommendations.push('Create email template "template_catcare" in EmailJS dashboard');
    }

    // Check email configuration
    if (this.config.email.enabled) {
      if (!this.config.email.address) {
        issues.push('Email address not provided');
        recommendations.push('Enter your email address in settings');
      } else if (!this.isValidEmail(this.config.email.address)) {
        issues.push('Invalid email address format');
        recommendations.push('Enter a valid email address');
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    };
  }

  // Get detailed setup instructions
  getSetupInstructions(): string[] {
    return [
      '1. Go to https://dashboard.emailjs.com/',
      '2. Sign in to your EmailJS account',
      '3. Go to Email Templates → Create New Template',
      '4. Name it exactly: template_catcare',
      '5. Copy the HTML template from EMAILJS_SETUP.md',
      '6. Save and Publish the template',
      '7. Go to Account → API Keys',
      '8. Copy your Public Key',
      '9. Update src/config/emailjs.ts with your public key',
      '10. Enable email notifications in app settings',
      '11. Enter your email address',
      '12. Test the notification!'
    ];
  }
}

// Create and export a singleton instance
export const notificationService = new NotificationService();

// Initialize the service when the module is loaded
notificationService.initialize().catch(console.error); 