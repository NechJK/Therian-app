import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../config/supabase'
import { X, Heart, Star, Info } from 'lucide-react'
import { THERIOTYPES, LIMITS } from '../utils/constants'
import './Discover.css'

const Discover = () => {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [swipeCount, setSwipeCount] = useState(0)
  const [showProfile, setShowProfile] = useState(false)
  const [matchModal, setMatchModal] = useState(null)
  const cardRef = useRef(null)
  const startX = useRef(0)
  const currentX = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    try {
      // Cargar perfiles que no hayan sido swipeados por este usuario
      const { data: swipedIds } = await supabase
        .from('swipes')
        .select('swiped_id')
        .eq('swiper_id', user.id)

      const swipedUserIds = swipedIds?.map(s => s.swiped_id) || []

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id)
        .eq('is_active', true)
        .not('user_id', 'in', `(${swipedUserIds.join(',')})`)
        .limit(20)

      if (error) throw error

      setProfiles(data || [])
    } catch (error) {
      console.error('Error cargando perfiles:', error)
    }
  }

  const currentProfile = profiles[currentIndex]

  const handleSwipe = async (direction) => {
    if (!currentProfile || swipeCount >= LIMITS.MAX_DAILY_LIKES) {
      alert('Has alcanzado el límite diario de likes')
      return
    }

    try {
      // Registrar swipe
      const { error: swipeError } = await supabase.from('swipes').insert({
        swiper_id: user.id,
        swiped_id: currentProfile.user_id,
        direction: direction
      })

      if (swipeError) {
        console.error('Error registrando swipe:', swipeError)
        alert('Error al registrar tu acción. Por favor intenta de nuevo.')
        return
      }

      setSwipeCount(swipeCount + 1)

      // Si es like, verificar si hay match
      if (direction === 'like') {
        const { data: reverseSwipe } = await supabase
          .from('swipes')
          .select('*')
          .eq('swiper_id', currentProfile.user_id)
          .eq('swiped_id', user.id)
          .eq('direction', 'like')
          .single()

        if (reverseSwipe) {
          // ¡Match! - Ordenar IDs correctamente
          const userAId = user.id < currentProfile.user_id ? user.id : currentProfile.user_id
          const userBId = user.id < currentProfile.user_id ? currentProfile.user_id : user.id

          const { error: matchError } = await supabase.from('matches').insert({
            user_a_id: userAId,
            user_b_id: userBId,
            is_active: true
          })

          if (matchError) {
            console.error('Error creando match:', matchError)
          } else {
            setMatchModal(currentProfile)
          }
        }
      }

      // Siguiente perfil
      setCurrentIndex(currentIndex + 1)
      setCurrentPhotoIndex(0)
    } catch (error) {
      console.error('Error en swipe:', error)
      alert('Error inesperado. Por favor recarga la página.')
    }
  }

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (!isDragging) return
    currentX.current = e.touches[0].clientX
    const diff = currentX.current - startX.current

    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`
      cardRef.current.style.transition = 'none'
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const diff = currentX.current - startX.current

    if (Math.abs(diff) > 100) {
      if (diff > 0) {
        handleSwipe('like')
      } else {
        handleSwipe('nope')
      }
    }

    if (cardRef.current) {
      cardRef.current.style.transform = ''
      cardRef.current.style.transition = 'transform 0.3s ease'
    }
  }

  const handleCardClick = () => {
    if (!currentProfile) return
    const nextIndex = (currentPhotoIndex + 1) % currentProfile.photos.length
    setCurrentPhotoIndex(nextIndex)
  }

  const getTheriotype = (theriotypeName) => {
    return THERIOTYPES.find(t => t.id === theriotypeName || t.name === theriotypeName)
  }

  if (!currentProfile) {
    return (
      <div className="discover-page">
        <div className="no-profiles">
          <h2>¡No hay más perfiles por ahora!</h2>
          <p>Vuelve más tarde para ver nuevos therians</p>
        </div>
      </div>
    )
  }

  const theriotype = getTheriotype(currentProfile.theriotype)

  return (
    <div className="discover-page">
      <div className="discover-container">
        <div
          ref={cardRef}
          className="profile-card"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleCardClick}
        >
          <div className="card-image">
            <img
              src={currentProfile.photos[currentPhotoIndex]}
              alt={currentProfile.name}
            />

            {/* Photo indicators */}
            <div className="photo-indicators">
              {currentProfile.photos.map((_, index) => (
                <div
                  key={index}
                  className={`indicator ${index === currentPhotoIndex ? 'active' : ''}`}
                />
              ))}
            </div>

            {/* Info button */}
            <button
              className="info-button"
              onClick={(e) => {
                e.stopPropagation()
                setShowProfile(true)
              }}
            >
              <Info size={24} />
            </button>
          </div>

          <div className="card-info">
            <div className="card-header">
              <div>
                <h2>{currentProfile.name}, {currentProfile.age}</h2>
                {theriotype && (
                  <div className="theriotype-badge">
                    <span>{theriotype.emoji}</span>
                    <span>{theriotype.name}</span>
                  </div>
                )}
              </div>
            </div>

            {currentProfile.bio && (
              <p className="card-bio">{currentProfile.bio}</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="action-buttons">
          <button
            className="action-btn nope-btn"
            onClick={() => handleSwipe('nope')}
          >
            <X size={32} />
          </button>

          <button
            className="action-btn super-btn"
            onClick={() => handleSwipe('super')}
          >
            <Star size={24} />
          </button>

          <button
            className="action-btn like-btn"
            onClick={() => handleSwipe('like')}
          >
            <Heart size={32} />
          </button>
        </div>
      </div>

      {/* Profile modal */}
      {showProfile && (
        <div className="profile-modal" onClick={() => setShowProfile(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowProfile(false)}>
              <X size={24} />
            </button>

            <div className="modal-photos">
              {currentProfile.photos.map((photo, index) => (
                <img key={index} src={photo} alt={`Foto ${index + 1}`} />
              ))}
            </div>

            <div className="modal-info">
              <h2>{currentProfile.name}, {currentProfile.age}</h2>

              {theriotype && (
                <div className="theriotype-badge large">
                  <span>{theriotype.emoji}</span>
                  <span>{theriotype.name}</span>
                </div>
              )}

              {currentProfile.bio && (
                <div className="modal-section">
                  <h3>Sobre mí</h3>
                  <p>{currentProfile.bio}</p>
                </div>
              )}

              {currentProfile.intentions && (
                <div className="modal-section">
                  <h3>Busco</h3>
                  <div className="intentions-tags">
                    {currentProfile.intentions.map(intention => (
                      <span key={intention} className="intention-tag">
                        {intention}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Match modal */}
      {matchModal && (
        <div className="match-modal">
          <div className="match-content">
            <h1>¡Es un Match!</h1>
            <p>Tú y {matchModal.name} se han dado like mutuamente</p>

            <div className="match-photos">
              <img src={matchModal.photos[0]} alt={matchModal.name} />
            </div>

            <div className="match-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  setMatchModal(null)
                  // Navegar al chat
                }}
              >
                Enviar mensaje
              </button>

              <button
                className="btn-secondary"
                onClick={() => setMatchModal(null)}
              >
                Seguir explorando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Discover
