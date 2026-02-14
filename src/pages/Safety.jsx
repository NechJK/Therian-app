import { useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Flag, UserX, Lock, Shield } from 'lucide-react'
import './Safety.css'

const Safety = () => {
  const navigate = useNavigate()

  return (
    <div className="safety-page">
      <div className="safety-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <ArrowLeft size={24} />
        </button>
        <h1>Centro de Seguridad</h1>
      </div>

      <div className="safety-container">
        {/* Hero Section */}
        <div className="safety-hero">
          <Shield size={64} color="var(--gold)" />
          <h2>Tu Seguridad es Nuestra Prioridad</h2>
          <p>
            Kindred está comprometido en crear un espacio seguro y respetuoso para la comunidad therian.
            Aquí encontrarás recursos y herramientas para protegerte.
          </p>
        </div>

        {/* Safety Tips */}
        <section className="safety-section">
          <h3>
            <Lock size={24} />
            Consejos de Seguridad
          </h3>

          <div className="safety-card">
            <h4>🔒 Protege tu Información Personal</h4>
            <ul>
              <li>No compartas tu dirección, número de teléfono o redes sociales inmediatamente</li>
              <li>Mantén conversaciones dentro de la app al principio</li>
              <li>Nunca compartas información financiera</li>
              <li>Ten cuidado con fotos que muestren ubicaciones identificables</li>
            </ul>
          </div>

          <div className="safety-card">
            <h4>👤 Conoce a Nuevas Personas de Forma Segura</h4>
            <ul>
              <li>Tómate tu tiempo para conocer a alguien antes de encontrarse en persona</li>
              <li>Si decides encontrarte, hazlo en un lugar público</li>
              <li>Informa a un amigo o familiar sobre tu plan</li>
              <li>Organiza tu propio transporte</li>
              <li>Confía en tus instintos - si algo no se siente bien, cancela</li>
            </ul>
          </div>

          <div className="safety-card">
            <h4>🚩 Señales de Alerta</h4>
            <ul>
              <li>Personas que insisten en salir de la aplicación inmediatamente</li>
              <li>Solicitudes de dinero o ayuda financiera</li>
              <li>Historias inconsistentes o que no cuadran</li>
              <li>Presión para compartir fotos o información personal</li>
              <li>Comportamiento agresivo, controlador o irrespetuoso</li>
              <li>Perfiles que parecen demasiado buenos para ser verdad</li>
            </ul>
          </div>

          <div className="safety-card">
            <h4>💬 Conversaciones Seguras</h4>
            <ul>
              <li>Sé respetuoso y amable en tus mensajes</li>
              <li>Si alguien te hace sentir incómodo, detén la conversación</li>
              <li>No te sientas obligado a responder</li>
              <li>Establece límites claros sobre lo que estás dispuesto a compartir</li>
            </ul>
          </div>
        </section>

        {/* Report Tools */}
        <section className="safety-section">
          <h3>
            <Flag size={24} />
            Herramientas de Reporte
          </h3>

          <div className="tool-card">
            <div className="tool-icon" style={{ background: 'rgba(248, 113, 113, 0.2)' }}>
              <Flag size={24} color="#f87171" />
            </div>
            <div className="tool-content">
              <h4>Reportar Usuario</h4>
              <p>
                Si alguien viola nuestras normas comunitarias, repórtalo. Revisaremos todos los
                reportes y tomaremos acción apropiada.
              </p>
              <button className="tool-btn">
                Cómo Reportar
              </button>
            </div>
          </div>

          <div className="tool-card">
            <div className="tool-icon" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
              <UserX size={24} color="#8b5cf6" />
            </div>
            <div className="tool-content">
              <h4>Bloquear Usuario</h4>
              <p>
                Puedes bloquear a cualquier usuario en cualquier momento. No podrán ver tu perfil
                ni contactarte.
              </p>
              <button className="tool-btn">
                Cómo Bloquear
              </button>
            </div>
          </div>

          <div className="tool-card">
            <div className="tool-icon" style={{ background: 'rgba(251, 146, 60, 0.2)' }}>
              <AlertTriangle size={24} color="#fb923c" />
            </div>
            <div className="tool-content">
              <h4>Unmatch</h4>
              <p>
                Si cambias de opinión sobre un match, puedes deshacerlo. La otra persona no será
                notificada.
              </p>
              <button className="tool-btn">
                Cómo Hacer Unmatch
              </button>
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="safety-section">
          <h3>Normas de la Comunidad</h3>

          <div className="guideline-card">
            <h4>❌ Comportamiento Prohibido</h4>
            <ul>
              <li>Acoso, intimidación o amenazas</li>
              <li>Discurso de odio o discriminación</li>
              <li>Contenido sexual explícito no solicitado</li>
              <li>Spam o publicidad no autorizada</li>
              <li>Suplantación de identidad</li>
              <li>Compartir información privada de otros</li>
              <li>Actividad ilegal</li>
            </ul>
          </div>

          <div className="guideline-card positive">
            <h4>✅ Comportamiento Esperado</h4>
            <ul>
              <li>Trata a otros con respeto y amabilidad</li>
              <li>Sé honesto en tu perfil</li>
              <li>Respeta los límites de otros</li>
              <li>Comunícate de manera clara y respetuosa</li>
              <li>Acepta el rechazo con gracia</li>
              <li>Celebra la diversidad de la comunidad therian</li>
            </ul>
          </div>
        </section>

        {/* Get Help */}
        <section className="safety-section">
          <h3>¿Necesitas Ayuda?</h3>

          <div className="help-card emergency">
            <AlertTriangle size={32} color="#f87171" />
            <h4>Emergencia</h4>
            <p>
              Si estás en peligro inmediato, contacta a las autoridades locales:
            </p>
            <p className="emergency-number">🚨 911 o tu número de emergencia local</p>
          </div>

          <div className="help-card">
            <h4>Reportar a Kindred</h4>
            <p>
              Para reportar comportamiento inapropiado o violaciones de seguridad:
            </p>
            <a href="mailto:safety@kindredapp.com" className="help-link">
              safety@kindredapp.com
            </a>
          </div>

          <div className="help-card">
            <h4>Soporte General</h4>
            <p>
              Para preguntas o asistencia general:
            </p>
            <button
              className="help-link-btn"
              onClick={() => navigate('/help')}
            >
              Ir a Centro de Ayuda
            </button>
          </div>
        </section>

        {/* Resources */}
        <section className="safety-section">
          <h3>Recursos Adicionales</h3>

          <div className="resource-list">
            <a href="#" className="resource-item">
              📖 Guía Completa de Seguridad en Citas Online
            </a>
            <a href="#" className="resource-item">
              🛡️ Cómo Reconocer y Evitar Estafas
            </a>
            <a href="#" className="resource-item">
              💬 Consejos para Primeras Citas
            </a>
            <a href="#" className="resource-item">
              🔐 Configuración de Privacidad Recomendada
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Safety
