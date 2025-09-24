// EmailJS Configuration
// Replace these with your actual EmailJS credentials

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_sg3gmqr',
  TEMPLATE_ID: 'template_catcare', // You'll need to create this template
  PUBLIC_KEY: '_ahCs4nrRIIr_1d6n' // Your EmailJS public key
};

// Template parameters that will be used for email notifications
export const EMAIL_TEMPLATE_PARAMS = {
  to_email: '',
  to_name: 'Cat Care User',
  subject: '',
  message: '',
  cat_name: '',
  scheduled_time: '',
  reminder_type: '',
  app_name: 'CatCare Scheduler'
}; 