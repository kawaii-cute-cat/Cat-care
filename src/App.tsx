import { Routes, Route } from 'react-router-dom'
import { CatProvider } from './contexts/CatContext'
import { ReminderProvider } from './contexts/ReminderContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import CatProfiles from './pages/CatProfiles'
import Schedule from './pages/Schedule'
import Reminders from './pages/Reminders'
import Settings from './pages/Settings'

function App() {
  return (
    <ThemeProvider>
      <CatProvider>
        <ReminderProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app/*" element={
              <Layout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="cats" element={<CatProfiles />} />
                  <Route path="schedule" element={<Schedule />} />
                  <Route path="reminders" element={<Reminders />} />
                  <Route path="settings" element={<Settings />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </ReminderProvider>
      </CatProvider>
    </ThemeProvider>
  )
}

export default App 