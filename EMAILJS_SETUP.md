# EmailJS Setup Instructions

## 🚀 Setting Up Real Email Notifications

Your CatCare app is now configured to send real email notifications using EmailJS! Here's how to complete the setup:

### 1. Get Your EmailJS Public Key

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Sign in to your account
3. Go to **Account** → **API Keys**
4. Copy your **Public Key**

### 2. Create Email Template

1. In your EmailJS dashboard, go to **Email Templates**
2. Click **Create New Template**
3. Name it: `template_catcare`
4. Use this template content (or copy from `EMAILJS_TEMPLATE.html`):

```html
<!DOCTYPE html>
<html>
<head>
    <title>Cat Care Reminder</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 0;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🐱 Cat Care Reminder</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">{{app_name}}</p>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0; font-size: 24px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">{{subject}}</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <p style="margin: 0; font-size: 16px; color: #555; line-height: 1.6;">{{message}}</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border: 1px solid #bbdefb;">
                <strong style="color: #1976d2; display: block; margin-bottom: 5px;">🐾 Cat Name:</strong>
                <p style="margin: 0; color: #555; font-size: 16px;">{{cat_name}}</p>
            </div>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border: 1px solid #c8e6c9;">
                <strong style="color: #388e3c; display: block; margin-bottom: 5px;">📋 Type:</strong>
                <p style="margin: 0; color: #555; font-size: 16px; text-transform: capitalize;">{{reminder_type}}</p>
            </div>
        </div>
        
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffcc02;">
            <strong style="color: #f57c00; display: block; margin-bottom: 5px;">⏰ Scheduled for:</strong>
            <p style="margin: 0; color: #555; font-size: 16px; font-weight: 500;">{{scheduled_time}}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f0f8ff; border-radius: 8px; border: 1px solid #b3d9ff;">
            <p style="color: #1976d2; font-style: italic; margin: 0; font-size: 16px;">
                💡 Don't forget to mark this as complete in your CatCare app!
            </p>
        </div>
    </div>
    
    <div style="text-align: center; color: #999; font-size: 12px; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="margin: 0;">This email was sent from your CatCare Scheduler app</p>
        <p style="margin: 5px 0 0 0; font-size: 11px;">Keep your furry friends happy and healthy! 🐱❤️</p>
    </div>
</body>
</html>
```

### 3. Update Configuration

1. Open `src/config/emailjs.ts`
2. Replace `YOUR_PUBLIC_KEY_HERE` with your actual EmailJS public key
3. Save the file

### 4. Test Email Notifications

1. Go to your app's Settings page
2. Enable Email Notifications
3. Enter your email address
4. Click "Send Test Notification"
5. Check your email for the test notification!

## 📧 Template Variables

The email template uses these variables:
- `{{to_email}}` - Recipient's email address
- `{{to_name}}` - Recipient's name
- `{{subject}}` - Email subject
- `{{message}}` - Reminder message
- `{{cat_name}}` - Cat's name
- `{{scheduled_time}}` - Scheduled time
- `{{reminder_type}}` - Type of reminder (feeding, medication, etc.)
- `{{app_name}}` - App name

## 🔧 Troubleshooting

If emails aren't sending:
1. Check your EmailJS dashboard for any errors
2. Verify your public key is correct
3. Make sure your email template is published
4. Check the browser console for any error messages

## 🎉 Success!

Once configured, your app will send beautiful, formatted email notifications for all cat care reminders! 