import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useSubscription } from '../hooks/useSubscription'
import { supabase } from '../config/supabase'
import { Settings, Crown, Shield, HelpCircle, FileText, LogOut, ChevronRight } from 'lucide-react'
import { THERIOTYPES } from '../utils/constants'
import './Profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { plan } = useSubscription()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data, error} = await supabase
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
    if (confirm('¿Cerrar sesión?')) {
      const { error } = await signOut()
      if (!error) {
        navigate('/')
      }
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
  const isPremium = plan?.id !== 'free'

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header Card */}
        <div className="profile-header-card">
          <div className="profile-photo-large">
            <img src={profile.photos[0]} alt={profile.name} />
            {isPremium && plan?.badge && (
              <div className="premium-badge" style={{ background: plan.badge.color }}>
                <Crown size={16} />
                <span>{plan.badge.text}</span>
              </div>
            )}
          </div>

          <div className="profile-header-info">
            <h1>{profile.name}, {profile.age}</h1>
            {theriotype && (
              <div className="theriotype-tag">
                <span>{theriotype.emoji}</span>
                <span>{theriotype.name}</span>
              </div>
            )}
          </div>

          <button
            className="edit-profile-btn"
            onClick={() => navigate('/edit-profile')}
          >
            Editar perfil
          </button>
        </div>

        {/* Premium Upgrade Card (if free) */}
        {!isPremium && (
          <div className="premium-promo-card" onClick={() => navigate('/subscription')}>
            <div className="promo-icon">
              <Crown size={32} color="var(--gold)" />
            </div>
            <div className="promo-content">
              <h3>Mejora a Premium</h3>
              <p>Likes ilimitados, ver quién te dio like y más</p>
            </div>
            <ChevronRight size={24} color="var(--text-secondary)" />
          </div>
        )}

        {/* Settings Menu */}
        <div className="settings-menu">
          <h2 className="menu-section-title">Configuración</h2>

          <div className="menu-section">
            {isPremium && (
              <div className="menu-item" onClick={() => navigate('/subscription')}>
                <div className="menu-item-icon" style={{ background: 'rgba(200, 169, 110, 0.2)' }}>
                  <Crown size={20} color="var(--gold)" />
                </div>
                <div className="menu-item-content">
                  <div className="menu-item-title">Mi Suscripción</div>
                  <div className="menu-item-subtitle">{plan.name} • ${plan.price}/mes</div>
                </div>
                <ChevronRight size={20} color="var(--text-secondary)" />
              </div>
            )}

            <div className="menu-item" onClick={() => navigate('/edit-profile')}>
              <div className="menu-item-icon" style={{ background: 'rgba(96, 165, 250, 0.2)' }}>
                <Settings size={20} color="#60A5FA" />
              </div>
              <div className="menu-item-content">
                <div className="menu-item-title">Configuración</div>
                <div className="menu-item-subtitle">Privacidad, notificaciones</div>
              </div>
              <ChevronRight size={20} color="var(--text-secondary)" />
            </div>
          </div>

          <h2 className="menu-section-title">Legal</h2>

          <div className="menu-section">
            <div className="menu-item">
              <div className="menu-item-icon" style={{ background: 'rgba(74, 222, 128, 0.2)' }}>
                <Shield size={20} color="#4ade80" />
              </div>
              <div className="menu-item-content">
                <div className="menu-item-title">Seguridad</div>
                <div className="menu-item-subtitle">Centro de seguridad</div>
              </div>
              <ChevronRight size={20} color="var(--text-secondary)" />
            </div>

            <div className="menu-item">
              <div className="menu-item-icon" style={{ background: 'rgba(251, 146, 60, 0.2)' }}>
                <FileText size={20} color="#fb923c" />
              </div>
              <div className="menu-item-content">
                <div className="menu-item-title">Términos y Condiciones</div>
              </div>
              <ChevronRight size={20} color="var(--text-secondary)" />
            </div>

            <div className="menu-item">
              <div className="menu-item-icon" style={{ background: 'rgba(251, 146, 60, 0.2)' }}>
                <FileText size={20} color="#fb923c" />
              </div>
              <div className="menu-item-content">
                <div className="menu-item-title">Política de Privacidad</div>
              </div>
              <ChevronRight size={20} color="var(--text-secondary)" />
            </div>

            <div className="menu-item">
              <div className="menu-item-icon" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
                <HelpCircle size={20} color="#8b5cf6" />
              </div>
              <div className="menu-item-content">
                <div className="menu-item-title">Ayuda y Soporte</div>
              </div>
              <ChevronRight size={20} color="var(--text-secondary)" />
            </div>
          </div>

          {/* Sign Out Button */}
          <button className="sign-out-btn" onClick={handleSignOut}>
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>

          {/* App Version */}
          <div className="app-version">
            Kindred v1.0.0
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
