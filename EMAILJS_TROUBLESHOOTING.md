# EmailJS Troubleshooting Guide

## 🚨 **Why Your Test Notification Isn't Working**

Based on your setup, here are the most likely issues and how to fix them:

### **Issue 1: Missing Email Template** ⚠️
**Most Likely Cause**: You haven't created the email template in EmailJS yet.

**Solution**:
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Click **Email Templates** in the left sidebar
3. Click **Create New Template**
4. Name it exactly: `template_catcare`
5. Copy the HTML template from `EMAILJS_SETUP.md`
6. Click **Save** and **Publish**

### **Issue 2: Check Browser Console** 🔍
**To see what's happening**:
1. Open your app in the browser
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Try sending a test notification
5. Look for error messages

**Common Error Messages**:
- `"Template not found"` → You need to create the template
- `"Service not found"` → Check your service ID
- `"Invalid public key"` → Check your public key

### **Issue 3: Verify Your Setup** ✅

**Check these in your EmailJS dashboard**:

1. **Service ID**: Should be `service_sg3gmqr` ✅ (You have this)
2. **Public Key**: Should be `_ahCs4nrRIIr_1d6n` ✅ (You have this)
3. **Template ID**: Should be `template_catcare` ❓ (You need to create this)

### **Issue 4: Test EmailJS Directly** 🧪

**Quick Test**:
1. Go to your EmailJS dashboard
2. Click **Email Templates**
3. If you see `template_catcare`, click on it
4. Click **Test** button
5. Enter your email address
6. Click **Send Test Email**

If this works, the issue is in your app. If it doesn't work, the issue is in EmailJS setup.

### **Issue 5: Check EmailJS Limits** 📧

**Free Plan Limits**:
- 200 emails per month
- 2 email templates
- 1 email service

**Check your usage**:
1. Go to EmailJS dashboard
2. Look for usage statistics
3. Make sure you haven't exceeded limits

## 🔧 **Step-by-Step Fix**

1. **Create the Template** (Most Important):
   ```
   Dashboard → Email Templates → Create New Template
   Name: template_catcare
   ```

2. **Test in Browser Console**:
   ```javascript
   // Open browser console and run this:
   emailjs.send('service_sg3gmqr', 'template_catcare', {
     to_email: 'your-email@example.com',
     to_name: 'Test User',
     subject: 'Test',
     message: 'Test message',
     cat_name: 'Test Cat',
     scheduled_time: new Date().toLocaleString(),
     reminder_type: 'test',
     app_name: 'CatCare Scheduler'
   }, '_ahCs4nrRIIr_1d6n')
   ```

3. **Check App Settings**:
   - Make sure Email Notifications are enabled
   - Make sure you entered a valid email address
   - Try the test notification button again

## 📞 **Still Not Working?**

If you've tried everything above and it's still not working:

1. **Check EmailJS Dashboard** for any error messages
2. **Look at Browser Console** for detailed error logs
3. **Try a different email address** (sometimes spam filters block test emails)
4. **Check your spam folder** for the test email

## 🎯 **Most Common Fix**

**90% of the time, the issue is that you haven't created the email template yet.** 

Go to EmailJS → Email Templates → Create New Template → Name it `template_catcare` → Copy the HTML from the setup guide → Save and Publish.

That should fix it! 🐱✨ 