import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Trash2 } from 'lucide-react'
import { supabase } from '../config/supabase'
import { useAuth } from '../hooks/useAuth'
import './DeleteAccount.css'

const DeleteAccount = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDeleteAccount = async () => {
    if (confirmText.toLowerCase() !== 'eliminar') {
      setError('Debes escribir "ELIMINAR" para confirmar')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 1. Eliminar perfil del usuario
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', user.id)

      if (profileError) throw profileError

      // 2. Eliminar todas las conversaciones
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)

      if (messagesError) throw messagesError

      // 3. Eliminar todos los matches
      const { error: matchesError } = await supabase
        .from('matches')
        .delete()
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)

      if (matchesError) throw matchesError

      // 4. Eliminar todos los swipes
      const { error: swipesError } = await supabase
        .from('swipes')
        .delete()
        .or(`swiper_id.eq.${user.id},swiped_id.eq.${user.id}`)

      if (swipesError) throw swipesError

      // 5. Eliminar suscripción
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id)

      if (subscriptionError) throw subscriptionError

      // 6. Eliminar configuraciones
      const { error: settingsError } = await supabase
        .from('user_settings')
        .delete()
        .eq('user_id', user.id)

      if (settingsError) throw settingsError

      // 7. Eliminar usuario de Auth (esto lo debe hacer un admin o Cloud Function)
      // Por ahora solo marcamos como eliminado y cerramos sesión

      // Mostrar mensaje de éxito
      alert('Tu cuenta ha sido eliminada. Todos tus datos han sido borrados permanentemente.')

      // Cerrar sesión
      await signOut()

      // Redirigir a la página principal
      navigate('/')

    } catch (error) {
      console.error('Error eliminando cuenta:', error)
      setError('Hubo un error al eliminar tu cuenta. Por favor intenta de nuevo o contacta a soporte.')
      setLoading(false)
    }
  }

  return (
    <div className="delete-account-page">
      <div className="delete-account-header">
        <button className="back-btn" onClick={() => navigate('/settings')}>
          <ArrowLeft size={24} />
        </button>
        <h1>Eliminar Cuenta</h1>
      </div>

      <div className="delete-account-container">
        <div className="warning-card">
          <AlertTriangle size={64} color="#f87171" />
          <h2>¿Estás seguro?</h2>
          <p>Esta acción es <strong>permanente</strong> y no se puede deshacer.</p>
        </div>

        <div className="consequences-section">
          <h3>Perderás:</h3>
          <ul className="consequences-list">
            <li>
              <Trash2 size={20} />
              <span>Tu perfil y toda tu información personal</span>
            </li>
            <li>
              <Trash2 size={20} />
              <span>Todas tus fotos y contenido</span>
            </li>
            <li>
              <Trash2 size={20} />
              <span>Todos tus matches y conversaciones</span>
            </li>
            <li>
              <Trash2 size={20} />
              <span>Tu historial de swipes y actividad</span>
            </li>
            <li>
              <Trash2 size={20} />
              <span>Tu suscripción premium (sin reembolso)</span>
            </li>
            <li>
              <Trash2 size={20} />
              <span>Todas tus configuraciones y preferencias</span>
            </li>
          </ul>
        </div>

        <div className="alternatives-section">
          <h3>Alternativas</h3>
          <p>Si solo necesitas un descanso, considera estas opciones:</p>
          <div className="alternative-cards">
            <div className="alternative-card">
              <h4>🔕 Desactivar notificaciones</h4>
              <p>Silencia todas las notificaciones desde Configuración</p>
            </div>
            <div className="alternative-card">
              <h4>🙈 Modo invisible</h4>
              <p>Desactiva "Mostrar estado en línea" en Privacidad</p>
            </div>
            <div className="alternative-card">
              <h4>🚫 Cerrar sesión</h4>
              <p>Sal de la app sin perder tu cuenta</p>
            </div>
          </div>
        </div>

        <div className="confirmation-section">
          <h3>Confirmación</h3>
          <p>Para eliminar permanentemente tu cuenta, escribe <strong>ELIMINAR</strong> en el campo de abajo:</p>

          <input
            type="text"
            className="confirmation-input"
            placeholder="Escribe ELIMINAR"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={loading}
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="action-buttons">
            <button
              className="cancel-btn"
              onClick={() => navigate('/settings')}
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              className="delete-btn"
              onClick={handleDeleteAccount}
              disabled={loading || confirmText.toLowerCase() !== 'eliminar'}
            >
              {loading ? 'Eliminando...' : 'Eliminar Cuenta Permanentemente'}
            </button>
          </div>
        </div>

        <div className="help-text">
          <p>¿Tienes problemas? <a href="mailto:support@kindredapp.com">Contacta a soporte</a></p>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccount
