import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Mail, Smartphone, Save, TestTube, AlertTriangle, CheckCircle, ExternalLink, Copy, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import { notificationService, NotificationConfig } from '../services/NotificationService';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [config, setConfig] = useState<NotificationConfig>({
    email: { enabled: false, address: '' },
    sms: { enabled: false, phoneNumber: '' },
    push: { enabled: false }
  });

  const [permissionStatus, setPermissionStatus] = useState<string>('default');
  const [emailJSSetup, setEmailJSSetup] = useState<{ isValid: boolean; issues: string[]; recommendations: string[] }>({ isValid: false, issues: [], recommendations: [] });
  const [showSetupInstructions, setShowSetupInstructions] = useState<boolean>(false);

  useEffect(() => {
    // Load current configuration
    setConfig(notificationService.getConfig());
    setPermissionStatus(notificationService.getPermissionStatus());
    setEmailJSSetup(notificationService.checkEmailJSSetup());
  }, []);

  const handleSave = () => {
    notificationService.updateConfig(config);
    toast.success('Notification settings saved successfully!');
  };

  const handleTestNotification = async () => {
    try {
      // Save current configuration first
      notificationService.updateConfig(config);
      console.log('📧 Current config saved:', config);
      
      await notificationService.testNotification();
      toast.success('Test notification sent! Check your email and browser notifications.');
    } catch (error: any) {
      console.error('Test notification failed:', error);
      toast.error(`Failed to send test notification: ${error.message}`);
    }
  };

  const handleRefreshSetup = () => {
    setEmailJSSetup(notificationService.checkEmailJSSetup());
    toast.success('EmailJS setup status refreshed!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      setPermissionStatus('granted');
      setConfig(prev => ({ ...prev, push: { enabled: true } }));
      toast.success('Notification permission granted!');
    } else {
      toast.error('Notification permission denied');
    }
  };

  const handleReinitializeEmailJS = () => {
    notificationService.reinitializeEmailJS();
    toast.success('EmailJS reinitialized!');
  };

  const handleResetPermissions = () => {
    notificationService.resetPermissionState();
    toast.success('Permission state reset! Please refresh the page.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure your notification preferences and app settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
          </div>

          <div className="space-y-6">
            {/* Push Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-500">
                      {permissionStatus === 'granted' ? 'Notifications enabled' : 
                       permissionStatus === 'denied' ? 'Notifications blocked' : 
                       'Click to enable notifications'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {permissionStatus === 'default' && (
                    <button
                      onClick={handleRequestPermission}
                      className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Enable
                    </button>
                  )}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.push.enabled}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        push: { enabled: e.target.checked } 
                      }))}
                      disabled={permissionStatus !== 'granted'}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 peer-disabled:opacity-50"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Email Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive reminders via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.email.enabled}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      email: { ...prev.email, enabled: e.target.checked } 
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              {config.email.enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={config.email.address}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      email: { ...prev.email, address: e.target.value } 
                    }))}
                    className="input-field"
                    placeholder="Enter your email address"
                  />
                  {config.email.address && (
                    <p className="text-sm text-green-600 mt-1">
                      ✅ Email address: {config.email.address}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* SMS Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive reminders via text message</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.sms.enabled}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      sms: { ...prev.sms, enabled: e.target.checked } 
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              {config.sms.enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={config.sms.phoneNumber}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      sms: { ...prev.sms, phoneNumber: e.target.value } 
                    }))}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>
              )}
            </div>

            {/* EmailJS Setup Status */}
            <div className="pt-4 border-t border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">EmailJS Setup Status</h3>
                <button
                  onClick={handleRefreshSetup}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Refresh
                </button>
              </div>
              
              <div className={`p-4 rounded-lg border ${
                emailJSSetup.isValid 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center space-x-2 mb-3">
                  {emailJSSetup.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  )}
                  <span className={`font-medium ${
                    emailJSSetup.isValid ? 'text-green-800' : 'text-yellow-800'
                  }`}>
                    {emailJSSetup.isValid ? 'EmailJS Setup Complete!' : 'EmailJS Setup Issues Found'}
                  </span>
                </div>
                
                {emailJSSetup.issues.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-yellow-800 mb-2">Issues:</p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {emailJSSetup.issues.map((issue, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-yellow-600 mt-1">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {emailJSSetup.recommendations.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-yellow-800 mb-2">Recommendations:</p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {emailJSSetup.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-yellow-600 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowSetupInstructions(!showSetupInstructions)}
                    className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{showSetupInstructions ? 'Hide' : 'Show'} Setup Guide</span>
                  </button>
                  <button
                    onClick={() => window.open('https://dashboard.emailjs.com/', '_blank')}
                    className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open EmailJS Dashboard</span>
                  </button>
                </div>
              </div>
              
              {showSetupInstructions && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Setup Instructions:</h4>
                  <ol className="text-sm text-gray-700 space-y-2">
                    {notificationService.getSetupInstructions().map((step, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-gray-500 mt-1">{index + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                    <h5 className="font-medium text-blue-900 mb-2">Quick Copy Template:</h5>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-white px-2 py-1 rounded border flex-1">
                        template_catcare
                      </code>
                      <button
                        onClick={() => copyToClipboard('template_catcare')}
                        className="p-1 text-blue-600 hover:text-blue-700"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Test Notification Button */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <button
                onClick={handleTestNotification}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <TestTube className="w-4 h-4" />
                <span>Send Test Notification</span>
              </button>
              
              {/* Debug Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={handleReinitializeEmailJS}
                  className="flex items-center space-x-2 px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                >
                  <span>Reinit EmailJS</span>
                </button>
                <button
                  onClick={handleResetPermissions}
                  className="flex items-center space-x-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  <span>Reset Permissions</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <SettingsIcon className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">App Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Reminder Time
              </label>
              <select className="input-field">
                <option value={5}>5 minutes before</option>
                <option value={10}>10 minutes before</option>
                <option value={15} selected>15 minutes before</option>
                <option value={30}>30 minutes before</option>
                <option value={60}>1 hour before</option>
                <option value={120}>2 hours before</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Auto-generate Recurring</p>
                <p className="text-sm text-gray-500">Automatically create recurring reminders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-gray-500" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-500" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Settings; 