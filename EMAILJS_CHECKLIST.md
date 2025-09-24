# 🔍 EmailJS Setup Checklist

## ✅ **Verify These in Your EmailJS Dashboard:**

### 1. **Service Setup**
- [ ] Go to https://dashboard.emailjs.com/
- [ ] Check if you have a service with ID: `service_sg3gmqr`
- [ ] If not, create a new email service (Gmail, Outlook, etc.)

### 2. **Template Creation**
- [ ] Go to **Email Templates**
- [ ] Look for template named: `template_catcare`
- [ ] If missing, create it with this exact name
- [ ] Copy HTML from `EMAILJS_TEMPLATE.html`
- [ ] **IMPORTANT**: Click **Save** then **Publish**

### 3. **API Key Verification**
- [ ] Go to **Account** → **API Keys**
- [ ] Verify your Public Key is: `_ahCs4nrRIIr_1d6n`
- [ ] If different, update `src/config/emailjs.ts`

### 4. **Service Limits**
- [ ] Check if you've exceeded 200 emails/month (free limit)
- [ ] Verify your account is active

## 🧪 **Test Methods:**

### Method 1: Direct Test
1. Open `test-emailjs.html` in your browser
2. Replace `your-email@example.com` with your actual email
3. Click "Test EmailJS"
4. Check console for detailed logs

### Method 2: App Test
1. Open your app (should be running on http://localhost:5173)
2. Go to Settings page
3. Enable email notifications
4. Enter your email address
5. Click "Send Test Notification"
6. Check browser console (F12) for logs

### Method 3: EmailJS Dashboard Test
1. Go to EmailJS dashboard
2. Click on your `template_catcare` template
3. Click **Test** button
4. Enter your email address
5. Click **Send Test Email**

## 🚨 **Common Issues & Solutions:**

### Issue: "Template not found"
**Solution**: Create the `template_catcare` template in EmailJS dashboard

### Issue: "Service not found"
**Solution**: Check if service ID `service_sg3gmqr` exists in your dashboard

### Issue: "Invalid public key"
**Solution**: Verify your public key in Account → API Keys

### Issue: "Email not sending"
**Solution**: Check spam folder, verify email address, check service limits

## 📧 **Quick Fix Steps:**

1. **Create Template** (Most Important):
   - EmailJS Dashboard → Email Templates → Create New Template
   - Name: `template_catcare`
   - Copy HTML from `EMAILJS_TEMPLATE.html`
   - Save and Publish

2. **Test Directly**:
   - Use `test-emailjs.html` to test outside the app
   - Check browser console for detailed error messages

3. **Check App Logs**:
   - Open app → Settings → Send Test Notification
   - Open browser console (F12) → Console tab
   - Look for detailed error messages

## 🎯 **Most Likely Issue:**

**90% of the time, the issue is that the email template `template_catcare` hasn't been created in the EmailJS dashboard yet.**

Go create it now and the emails will start working! 🐱✨
