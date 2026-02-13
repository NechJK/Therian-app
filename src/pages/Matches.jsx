import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../config/supabase'
import { MessageCircle } from 'lucide-react'
import { THERIOTYPES } from '../utils/constants'
import './Matches.css'

const Matches = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      // Obtener matches del usuario
      const { data: matchData, error } = await supabase
        .from('matches')
        .select('*')
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .eq('is_active', true)

      if (error) throw error

      // Obtener los perfiles de los matches
      const matchProfiles = await Promise.all(
        matchData.map(async (match) => {
          const otherUserId = match.user_a_id === user.id ? match.user_b_id : match.user_a_id

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', otherUserId)
            .single()

          // Obtener último mensaje
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('*')
            .eq('match_id', match.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          return {
            ...profile,
            matchId: match.id,
            lastMessage: lastMessage?.content || 'Nuevo match',
            lastMessageTime: lastMessage?.created_at || match.created_at
          }
        })
      )

      setMatches(matchProfiles.filter(Boolean))
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
    return `${Math.floor(diff / 86400)}d`
  }

  if (loading) {
    return (
      <div className="matches-page">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="matches-page">
      <div className="matches-container">
        <h1 className="matches-title">Matches</h1>

        {matches.length === 0 ? (
          <div className="no-matches">
            <MessageCircle size={64} color="var(--text-secondary)" />
            <h2>Aún no tienes matches</h2>
            <p>Sigue explorando para encontrar tu manada</p>
            <button
              className="btn-primary"
              onClick={() => navigate('/discover')}
            >
              Descubrir perfiles
            </button>
          </div>
        ) : (
          <div className="matches-list">
            {matches.map((match) => {
              const theriotype = getTheriotype(match.theriotype)
              return (
                <div
                  key={match.matchId}
                  className="match-card"
                  onClick={() => navigate(`/chat/${match.matchId}`)}
                >
                  <div className="match-photo">
                    <img src={match.photos[0]} alt={match.name} />
                    {theriotype && (
                      <span className="match-badge">{theriotype.emoji}</span>
                    )}
                  </div>

                  <div className="match-info">
                    <div className="match-header">
                      <h3>{match.name}</h3>
                      <span className="match-time">
                        {getTimeAgo(match.lastMessageTime)}
                      </span>
                    </div>
                    <p className="match-message">{match.lastMessage}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Matches
