import React, { useState } from 'react'

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hi! I can help schedule vet, grooming, or pet store appointments near you and answer questions.' },
  ])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setMessages(m => [...m, { role: 'user', content: trimmed }, { role: 'assistant', content: 'Thanks! I will search nearby options and propose times. (Stub)' }])
    setInput('')
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Assistant</h1>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3 bg-white dark:bg-gray-800">
          {messages.map((m, idx) => (
            <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <div className={
                'inline-block px-3 py-2 rounded-lg ' +
                (m.role === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100')
              }>
                {m.content}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 input-field"
            placeholder="Ask to book a vet/grooming or any question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage() }}
          />
          <button className="btn-primary" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Assistant

