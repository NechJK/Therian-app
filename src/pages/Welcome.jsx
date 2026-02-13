import { useNavigate } from 'react-router-dom'
import './Welcome.css'

const Welcome = () => {
  const navigate = useNavigate()

  return (
    <div className="welcome-page">
      <div className="welcome-content fade-in">
        <div className="logo-section">
          <h1 className="app-title">KINDRED</h1>
          <p className="app-subtitle">Therian Connect</p>
          <div className="logo-emoji">🐺</div>
        </div>

        <div className="tagline">
          <p>Encuentra tu manada.</p>
          <p className="text-secondary">
            La primera app de conexiones diseñada para la comunidad therian
          </p>
        </div>

        <div className="welcome-actions">
          <button
            className="btn-primary"
            onClick={() => navigate('/register')}
          >
            Unirme a la manada
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate('/login')}
          >
            Ya tengo cuenta
          </button>
        </div>

        <p className="welcome-disclaimer">
          Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad
        </p>
      </div>
    </div>
  )
}

export default Welcome
