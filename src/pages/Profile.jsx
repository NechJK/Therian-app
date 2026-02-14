import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../config/supabase'
import { LogOut, Settings, Edit } from 'lucide-react'
import { THERIOTYPES } from '../utils/constants'
import './Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      setProfile(data)
      setLoading(false)
    } catch (error) {
      console.error('Error cargando perfil:', error)
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      navigate('/')
    }
  }

  const getTheriotype = (theriotypeName) => {
    return THERIOTYPES.find(t => t.id === theriotypeName || t.name === theriotypeName)
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="no-profile">
          <h2>Perfil no encontrado</h2>
          <button className="btn-primary" onClick={() => navigate('/onboarding')}>
            Completar perfil
          </button>
        </div>
      </div>
    )
  }

  const theriotype = getTheriotype(profile.theriotype)

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>Mi Perfil</h1>
          <div className="header-actions">
            <button className="icon-button">
              <Settings size={24} />
            </button>
            <button className="icon-button" onClick={handleSignOut}>
              <LogOut size={24} />
            </button>
          </div>
        </div>

        <div className="profile-photos">
          {profile.photos.map((photo, index) => (
            <img key={index} src={photo} alt={`Foto ${index + 1}`} />
          ))}
        </div>

        <div className="profile-info">
          <div className="info-section">
            <div className="info-header">
              <h2>{profile.name}, {profile.age}</h2>
              <button className="edit-button" onClick={() => navigate('/edit-profile')}>
                <Edit size={20} />
              </button>
            </div>

            {theriotype && (
              <div className="theriotype-display">
                <span className="theriotype-emoji">{theriotype.emoji}</span>
                <span className="theriotype-name">{theriotype.name}</span>
              </div>
            )}
          </div>

          {profile.bio && (
            <div className="info-section">
              <h3>Sobre mí</h3>
              <p>{profile.bio}</p>
            </div>
          )}

          {profile.intentions && (
            <div className="info-section">
              <h3>Busco</h3>
              <div className="intentions-display">
                {profile.intentions.map(intention => (
                  <span key={intention} className="intention-badge">
                    {intention}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="info-section">
            <h3>Género</h3>
            <p>{profile.gender}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-secondary" onClick={handleSignOut}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
