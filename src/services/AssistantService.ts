export interface AssistantMessage {
  role: 'user' | 'assistant'
  content: string
}

class AssistantService {
  async reply(_history: AssistantMessage[]): Promise<AssistantMessage> {
    // TODO: Integrate OpenAI or another LLM provider. Stub response for now.
    return { role: 'assistant', content: 'I can help you find nearby vets and book appointments. What day works?' }
  }
}

export default new AssistantService()

