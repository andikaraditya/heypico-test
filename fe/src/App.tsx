import { useState, type FormEvent } from 'react'
import './App.css'

interface Location {
  name: string
  address: string
  rating: number | null
  totalRatings: number
  placeId: string
  location: { lat: number; lng: number } | null
  mapsUrl: string
}

interface Message {
  role: 'user' | 'assistant'
  text?: string
  locations?: Location[]
}

function LocationCard({ location }: { location: Location }) {
  return (
    <a
      className="location-card"
      href={location.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="location-name">{location.name}</div>
      <div className="location-address">{location.address}</div>
      {location.rating !== null && (
        <div className="location-rating">
          ★ {location.rating} ({location.totalRatings} ratings)
        </div>
      )}
    </a>
  )
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`message ${isUser ? 'user' : 'assistant'}`}>
      <div className="bubble">
        {message.text && <p>{message.text}</p>}
        {message.locations && message.locations.length > 0 && (
          <div className="locations">
            {message.locations.map((loc) => (
              <LocationCard key={loc.placeId} location={loc} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!query.trim() || loading) return

    const userMessage: Message = { role: 'user', text: query }
    setMessages((prev) => [...prev, userMessage])
    setQuery('')
    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${await res.text()}`)
      }

      const data = await res.json()
      const assistantMessage: Message = {
        role: 'assistant',
        text: data.recommendation,
        locations: data.locations,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage: Message = {
        role: 'assistant',
        text: err instanceof Error ? err.message : 'Something went wrong',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.length === 0 && (
          <div className="welcome">
            <h1>Location Recommendations</h1>
            <p>Ask me for location suggestions!</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {loading && (
          <div className="message assistant">
            <div className="bubble typing">Thinking...</div>
          </div>
        )}
      </div>
      <form className="input-bar" onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. coffee shops in downtown"
          disabled={loading}
        />
        <button type="submit" disabled={!query.trim() || loading}>
          Send
        </button>
      </form>
    </div>
  )
}

export default App
