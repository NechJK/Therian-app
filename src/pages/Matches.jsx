import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { supabase } from '../config/supabase'
import { MessageCircle, Star, Lock, Crown } from 'lucide-react'
import { THERIOTYPES } from '../utils/constants'
import './Matches.css'

const Matches = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { plan } = useSubscription()
  const [matches, setMatches] = useState([])
  const [newMatches, setNewMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('messages') // 'messages' or 'matches'

  const canSeeMatches = plan?.features?.seeWhoLikedYou || false

  useEffect(() => {
    loadMatches()

    // Suscribirse a nuevos matches en tiempo real
    const matchSubscription = supabase
      .channel('matches_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `or(user_a_id.eq.${user.id},user_b_id.eq.${user.id})`
        },
        (payload) => {
          handleNewMatch(payload.new)
        }
      )
      .subscribe()

    return () => {
      matchSubscription.unsubscribe()
    }
  }, [])

  const handleNewMatch = async (match) => {
    const otherUserId = match.user_a_id === user.id ? match.user_b_id : match.user_a_id

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', otherUserId)
      .single()

    if (profile) {
      const newMatchData = {
        ...profile,
        matchId: match.id,
        lastMessage: null,
        lastMessageTime: match.created_at,
        isNew: true
      }
      setNewMatches(prev => [newMatchData, ...prev])
    }
  }

  const loadMatches = async () => {
    try {
      // Obtener matches del usuario
      const { data: matchData, error } = await supabase
        .from('matches')
        .select('*')
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Separar matches nuevos (sin mensajes) de matches con conversación
      const matchProfiles = await Promise.all(
        matchData.map(async (match) => {
          const otherUserId = match.user_a_id === user.id ? match.user_b_id : match.user_a_id

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', otherUserId)
            .single()

          // Obtener último mensaje
          const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .eq('match_id', match.id)
            .order('created_at', { ascending: false })
            .limit(1)

          const lastMessage = messages?.[0]

          return {
            ...profile,
            matchId: match.id,
            lastMessage: lastMessage,
            lastMessageTime: lastMessage?.created_at || match.created_at,
            matchCreatedAt: match.created_at,
            isNew: !lastMessage
          }
        })
      )

      const validMatches = matchProfiles.filter(Boolean)

      // Separar en nuevos y con mensajes
      const newMatchesList = validMatches.filter(m => m.isNew)
      const matchesWithMessages = validMatches.filter(m => !m.isNew)

      setNewMatches(newMatchesList)
      setMatches(matchesWithMessages)
      setLoading(false)
    } catch (error) {
      console.error('Error cargando matches:', error)
      setLoading(false)
    }
  }

  const getTheriotype = (theriotypeName) => {
    return THERIOTYPES.find(t => t.id === theriotypeName || t.name === theriotypeName)
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diff = Math.floor((now - time) / 1000)

    if (diff < 60) return 'Ahora'
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`
    return new Date(timestamp).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="matches-page">
        <div className="spinner"></div>
      </div>
    )
  }

  const hasMatches = matches.length > 0 || newMatches.length > 0

  return (
    <div className="matches-page">
      <div className="matches-container">
        <h1 className="matches-title">Matches</h1>

        {!hasMatches ? (
          <div className="no-matches">
            <MessageCircle size={64} strokeWidth={1.5} color="var(--text-secondary)" />
            <h2>Aún no tienes matches</h2>
            <p>Cuando des y recibas like, aparecerán aquí</p>
            <button
              className="btn-primary"
              onClick={() => navigate('/discover')}
            >
              Empezar a explorar
            </button>
          </div>
        ) : (
          <>
            {/* Tabs like Tinder */}
            <div className="matches-tabs">
              <button
                className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
                onClick={() => setActiveTab('messages')}
              >
                Mensajes {matches.length > 0 && `(${matches.length})`}
              </button>
              <button
                className={`tab-btn ${activeTab === 'matches' ? 'active' : ''}`}
                onClick={() => setActiveTab('matches')}
              >
                Matches {newMatches.length > 0 && `(${newMatches.length})`}
              </button>
            </div>

            {/* New Matches Grid (like Tinder) */}
            {activeTab === 'matches' && (
              <div className="new-matches-section">
                {!canSeeMatches ? (
                  // Usuario gratuito - mostrar solo contador con upgrade prompt
                  <div className="matches-locked">
                    <div className="lock-icon">
                      <Lock size={64} color="var(--gold)" />
                    </div>
                    <h2>Tienes {newMatches.length} {newMatches.length === 1 ? 'match' : 'matches'}</h2>
                    <p>Mejora a Plus para ver quién te dio like</p>
                    <button
                      className="btn-primary upgrade-button"
                      onClick={() => navigate('/subscription')}
                    >
                      <Crown size={20} />
                      Ver planes Premium
                    </button>
                  </div>
                ) : newMatches.length === 0 ? (
                  <div className="no-new-matches">
                    <Star size={48} color="var(--text-secondary)" />
                    <p>Los nuevos matches aparecerán aquí</p>
                  </div>
                ) : (
                  <div className="new-matches-grid">
                    {newMatches.map((match) => {
                      const theriotype = getTheriotype(match.theriotype)
                      return (
                        <div
                          key={match.matchId}
                          className="new-match-card"
                          onClick={() => navigate(`/chat/${match.matchId}`)}
                        >
                          <div className="new-match-photo">
                            <img src={match.photos[0]} alt={match.name} />
                            <div className="new-match-overlay">
                              <MessageCircle size={24} />
                            </div>
                          </div>
                          <div className="new-match-info">
                            <h4>{match.name}</h4>
                            {theriotype && (
                              <span className="new-match-theriotype">
                                {theriotype.emoji}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Messages List (like Tinder) */}
            {activeTab === 'messages' && (
              <div className="messages-section">
                {matches.length === 0 ? (
                  <div className="no-messages">
                    <MessageCircle size={48} color="var(--text-secondary)" />
                    <p>Aún no has enviado mensajes</p>
                    <p className="helper-text">Envía el primer mensaje a tus matches</p>
                  </div>
                ) : (
                  <div className="messages-list">
                    {matches.map((match) => {
                      const theriotype = getTheriotype(match.theriotype)
                      const isUnread = match.lastMessage &&
                                      match.lastMessage.sender_id !== user.id &&
                                      !match.lastMessage.read_at

                      return (
                        <div
                          key={match.matchId}
                          className={`message-card ${isUnread ? 'unread' : ''}`}
                          onClick={() => navigate(`/chat/${match.matchId}`)}
                        >
                          <div className="message-photo">
                            <img src={match.photos[0]} alt={match.name} />
                            {isUnread && <div className="unread-indicator"></div>}
                          </div>

                          <div className="message-info">
                            <div className="message-header">
                              <h3>{match.name}</h3>
                              <span className="message-time">
                                {getTimeAgo(match.lastMessageTime)}
                              </span>
                            </div>
                            <div className="message-preview">
                              {match.lastMessage ? (
                                <p className={isUnread ? 'unread-text' : ''}>
                                  {match.lastMessage.sender_id === user.id && 'Tú: '}
                                  {match.lastMessage.content}
                                </p>
                              ) : (
                                <p className="new-match-text">
                                  <Star size={14} /> Nuevo match
                                </p>
                              )}
                            </div>
                          </div>

                          {theriotype && (
                            <div className="message-badge">
                              {theriotype.emoji}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Matches
