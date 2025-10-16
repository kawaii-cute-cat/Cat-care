export default class CalendarService {
  // Generates a simple ICS file for an appointment
  static generateICS({ title, description, location, startISO, endISO }: { title: string; description?: string; location?: string; startISO: string; endISO: string; }) {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CatCare//Scheduling//EN',
      'BEGIN:VEVENT',
      `UID:${crypto.randomUUID()}@catcare`,
      `DTSTAMP:${CalendarService.formatICSDate(new Date().toISOString())}`,
      `DTSTART:${CalendarService.formatICSDate(startISO)}`,
      `DTEND:${CalendarService.formatICSDate(endISO)}`,
      `SUMMARY:${title}`,
      description ? `DESCRIPTION:${description}` : '',
      location ? `LOCATION:${location}` : '',
      'END:VEVENT',
      'END:VCALENDAR'
    ].filter(Boolean).join('\r\n')

    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'appointment.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  private static formatICSDate(iso: string) {
    const d = new Date(iso)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  }
}

