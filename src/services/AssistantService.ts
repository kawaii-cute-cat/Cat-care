export interface AssistantMessage {
  role: 'user' | 'assistant'
  content: string
}

import PlacesService from './PlacesService'
import CalendarService from './CalendarService'

class AssistantService {
  async reply(history: AssistantMessage[]): Promise<AssistantMessage> {
    try {
      const last = history[history.length - 1]?.content.toLowerCase()

      // Simple rule-based intent detection
      if (!last || last.length === 0) {
        return { role: 'assistant', content: 'How can I help today?' }
      }

    if (/(hi|hello|hey|yo)\b/.test(last)) {
      return { role: 'assistant', content: 'Hi! I can find nearby vets, groomers, or pet stores and book appointments. What do you need?' }
    }

    if (/book|schedule/.test(last) && /(vet|veterinary)/.test(last)) {
      const places = await PlacesService.findNearby('veterinary_care', 0, 0)
      const suggestion = places.slice(0, 2).map(p => `• ${p.name} (${Math.round(p.distanceMeters)}m) - ${p.address}`).join('\n')
      return { role: 'assistant', content: `Here are nearby vets:\n${suggestion}\nReply with a preferred date/time and I will create an .ics calendar invite.` }
    }

    if (/book|schedule/.test(last) && /(groom|grooming)/.test(last)) {
      const places = await PlacesService.findNearby('groomer', 0, 0)
      const suggestion = places.slice(0, 2).map(p => `• ${p.name} (${Math.round(p.distanceMeters)}m) - ${p.address}`).join('\n')
      return { role: 'assistant', content: `Here are nearby groomers:\n${suggestion}\nReply with a preferred date/time and I will create an .ics calendar invite.` }
    }

    if (/pet store|petstore|food|litter/.test(last)) {
      const places = await PlacesService.findNearby('pet_store', 0, 0)
      const suggestion = places.slice(0, 2).map(p => `• ${p.name} (${Math.round(p.distanceMeters)}m) - ${p.address}`).join('\n')
      return { role: 'assistant', content: `Nearby pet stores:\n${suggestion}` }
    }

    // Create calendar invite if date/time detected (very simple parse, expects YYYY-MM-DD HH:MM)
    const dateTimeMatch = last.match(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/)
    if (dateTimeMatch) {
      const startISO = `${dateTimeMatch[1]}T${dateTimeMatch[2]}:00Z`
      const start = new Date(startISO)
      const end = new Date(start.getTime() + 60 * 60 * 1000)
      CalendarService.generateICS({ title: 'Vet Appointment', startISO: start.toISOString(), endISO: end.toISOString(), description: 'Scheduled via CatCare Assistant' })
      return { role: 'assistant', content: 'I created an .ics calendar invite for your appointment and started a download. Add it to your calendar!' }
    }

    // Customer service fallback
    if (/help|support|problem|issue|bug|crash|not working/.test(last)) {
      return { role: 'assistant', content: 'I am your customer service assistant. Please describe the issue and steps to reproduce; I can also provide setup checklists for EmailJS and Supabase if you need.' }
    }

    return { role: 'assistant', content: 'I can book vet/grooming, find pet stores, create calendar invites, and answer support questions. Try: "Book me a vet appointment on 2025-11-01 10:00"' }
    } catch (error) {
      console.warn('Assistant error:', error)
      return { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
    }
  }
}

export default new AssistantService()

