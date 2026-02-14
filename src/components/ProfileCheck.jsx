import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../config/supabase'

const ProfileCheck = ({ children }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [hasProfile, setHasProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkProfile()
  }, [user])

  const checkProfile = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (error || !data) {
        // No tiene perfil, redirigir a onboarding
        setHasProfile(false)
        navigate('/onboarding')
      } else {
        // Tiene perfil
        setHasProfile(true)
      }
    } catch (error) {
      console.error('Error verificando perfil:', error)
      setHasProfile(false)
      navigate('/onboarding')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--bg-primary)'
      }}>
        <div className="spinner"></div>
      </div>
    )
  }

  return hasProfile ? children : null
}

export default ProfileCheck
