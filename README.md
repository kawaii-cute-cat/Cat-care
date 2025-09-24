# Cat Care Scheduler & Reminder

A comprehensive web application for managing your cat's care schedule, including feeding, medications, vet appointments, and grooming reminders.

## Features

### 🐱 Cat Profile Management
- Create and manage detailed profiles for multiple cats
- Store information like breed, age, weight, color, and microchip number
- Add veterinary information and medical history

### 📅 Scheduling & Reminders
- Schedule reminders for:
  - **Feeding**: Set up regular feeding times and food types
  - **Medications**: Track medication schedules and dosages
  - **Vet Appointments**: Never miss important veterinary visits
  - **Grooming**: Schedule regular grooming sessions
  - **Other**: Custom reminders for any cat care needs

### 🔔 Notification System
- **Push Notifications**: Receive alerts on your device
- **Email Notifications**: Get beautiful, formatted reminders via email using EmailJS
- **SMS Notifications**: Text message reminders (future feature)
- Customizable reminder timing (5 minutes to 2 hours before events)
- Sound and vibration settings
- **Real-time EmailJS Integration**: Professional email templates with cat-themed design

### 📊 Dashboard Overview
- Real-time overview of today's schedule
- Statistics on total cats, reminders, and completion status
- Quick access to upcoming tasks
- Visual indicators for different reminder types

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Email Service**: EmailJS for email notifications
- **Build Tool**: Vite
- **Routing**: React Router DOM

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cat-care-scheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Set up EmailJS (Optional but Recommended)**
   - Follow the instructions in `EMAILJS_SETUP.md` to enable email notifications
   - Or use the built-in setup guide in the app's Settings page

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with navigation
├── contexts/           # React contexts for state management
│   ├── CatContext.tsx  # Cat profile state management
│   └── ReminderContext.tsx # Reminder state management
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── CatProfiles.tsx # Cat management
│   ├── Schedule.tsx    # Schedule view
│   ├── Reminders.tsx   # Reminders management
│   └── Settings.tsx    # App settings
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types
├── App.tsx             # Main app component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Features in Detail

### Dashboard
- Overview of all cats and their current status
- Today's schedule with visual indicators
- Quick statistics and completion tracking
- Tomorrow's preview for planning ahead

### Cat Profiles
- Add new cats with comprehensive information
- Edit existing cat profiles
- Delete cat profiles (with confirmation)
- View all cat details in organized cards

### Schedule Management
- View all scheduled reminders in chronological order
- Filter by cat, type, or date
- Mark reminders as completed
- Visual indicators for different reminder types

### Reminders
- Manage all active and completed reminders
- Toggle completion status
- View detailed reminder information
- Sort by date, type, or status

### Settings
- Configure notification preferences
- Set reminder timing
- Enable/disable sound and vibration
- Email and SMS notification settings
- **EmailJS Setup Diagnostics**: Built-in setup checker and troubleshooting
- **Real-time Setup Status**: Visual indicators for EmailJS configuration
- **One-click Setup Guide**: Step-by-step instructions with copy-paste templates

## 📧 EmailJS Setup Guide

### Quick Setup (5 minutes)

1. **Create EmailJS Account**
   - Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
   - Sign up for a free account (200 emails/month)

2. **Create Email Template**
   - Go to **Email Templates** → **Create New Template**
   - Name it exactly: `template_catcare`
   - Copy the HTML from `EMAILJS_TEMPLATE.html` or use the template in `EMAILJS_SETUP.md`
   - Save and Publish the template

3. **Get Your Public Key**
   - Go to **Account** → **API Keys**
   - Copy your Public Key

4. **Update Configuration**
   - Open `src/config/emailjs.ts`
   - Replace the public key with your actual key
   - Your service ID and template ID are already configured

5. **Test in App**
   - Go to Settings page
   - Enable email notifications
   - Enter your email address
   - Click "Send Test Notification"

### Built-in Diagnostics

The app includes comprehensive EmailJS diagnostics:
- **Setup Status Checker**: Automatically detects configuration issues
- **Real-time Validation**: Validates email addresses and API keys
- **Error Messages**: Specific error messages for common issues
- **Setup Guide**: Built-in step-by-step instructions
- **One-click Testing**: Test notifications with detailed logging

### Troubleshooting

**Common Issues:**
- **Template not found**: Create the `template_catcare` template in EmailJS dashboard
- **Invalid public key**: Check your public key in EmailJS dashboard
- **Service not found**: Verify your service ID is correct
- **Email not sending**: Check your email address and spam folder

**Debug Tools:**
- Open browser console (F12) to see detailed logs
- Use the "Reinit EmailJS" button in Settings
- Check the EmailJS setup status in Settings page

For detailed troubleshooting, see `EMAILJS_TROUBLESHOOTING.md`.

## Future Enhancements

### Planned Features
- **Mobile App**: Native iOS and Android applications
- **Cloud Sync**: Synchronize data across devices
- **Photo Upload**: Add photos to cat profiles
- **Vet Integration**: Direct integration with veterinary systems
- **Health Tracking**: Monitor weight, vaccinations, and health metrics
- **Social Features**: Share cat care tips and connect with other cat owners
- **AI Recommendations**: Smart suggestions for care schedules

### Technical Improvements
- **Backend API**: Full backend with database integration
- **Authentication**: User accounts and data security
- **Offline Support**: Work without internet connection
- **Data Export**: Export cat care data and schedules
- **Calendar Integration**: Sync with Google Calendar, Apple Calendar
- **Voice Commands**: Voice-activated reminder creation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@catcarescheduler.com or create an issue in the repository.

---

**Made with ❤️ for cat lovers everywhere** 