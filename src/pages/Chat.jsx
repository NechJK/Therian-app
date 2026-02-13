import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../config/supabase'
import { ArrowLeft, Send } from 'lucide-react'
import './Chat.css'

const Chat = () => {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [otherUser, setOtherUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadMatch()
    loadMessages()
    subscribeToMessages()
  }, [matchId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMatch = async () => {
    try {
      const { data: match } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single()

      if (!match) {
        navigate('/matches')
        return
      }

      const otherUserId = match.user_a_id === user.id ? match.user_b_id : match.user_a_id

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', otherUserId)
        .single()

      setOtherUser(profile)
    } catch (error) {
      console.error('Error cargando match:', error)
    }
  }

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true })

      if (error) throw error

      setMessages(data || [])
      setLoading(false)

      // Marcar mensajes como leídos
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('match_id', matchId)
        .neq('sender_id', user.id)
        .is('read_at', null)
    } catch (error) {
      console.error('Error cargando mensajes:', error)
      setLoading(false)
    }
  }

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          match_id: matchId,
          sender_id: user.id,
          content: newMessage.trim()
        })

      if (error) throw error

      setNewMessage('')
    } catch (error) {
      console.error('Error enviando mensaje:', error)
      alert('Error enviando mensaje')
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="chat-page">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <button className="back-button" onClick={() => navigate('/matches')}>
          <ArrowLeft size={24} />
        </button>

        {otherUser && (
          <div className="chat-user-info">
            <img src={otherUser.photos[0]} alt={otherUser.name} />
            <div>
              <h3>{otherUser.name}</h3>
              <p className="text-secondary">{otherUser.theriotype}</p>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>¡Envía el primer mensaje!</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender_id === user.id ? 'sent' : 'received'}`}
              >
                <div className="message-bubble">
                  <p>{message.content}</p>
                  <span className="message-time">
                    {formatTime(message.created_at)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form className="message-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="send-button"
          disabled={!newMessage.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}

export default Chat
