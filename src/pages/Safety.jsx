import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Flag, UserX, Lock, Shield, X } from 'lucide-react'
import './Safety.css'

const Safety = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(null)

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
              <button className="tool-btn" onClick={() => setShowModal('report')}>
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
              <button className="tool-btn" onClick={() => setShowModal('block')}>
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
              <button className="tool-btn" onClick={() => setShowModal('unmatch')}>
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
            <div className="resource-item" onClick={() => setShowModal('dating-safety')}>
              📖 Guía Completa de Seguridad en Citas Online
            </div>
            <div className="resource-item" onClick={() => setShowModal('scams')}>
              🛡️ Cómo Reconocer y Evitar Estafas
            </div>
            <div className="resource-item" onClick={() => setShowModal('first-dates')}>
              💬 Consejos para Primeras Citas
            </div>
            <div className="resource-item" onClick={() => navigate('/settings')}>
              🔐 Configuración de Privacidad Recomendada
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(null)}>
              <X size={24} />
            </button>

            {showModal === 'report' && (
              <>
                <h2>🚩 Cómo Reportar un Usuario</h2>
                <div className="modal-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Desde el perfil o chat</h4>
                      <p>Ve al perfil del usuario que quieres reportar o abre su conversación</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Toca los tres puntos</h4>
                      <p>En la esquina superior derecha, toca el ícono ⋯ (más opciones)</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Selecciona "Reportar"</h4>
                      <p>En el menú que aparece, selecciona la opción "Reportar usuario"</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h4>Elige la razón</h4>
                      <p>Selecciona el motivo del reporte (spam, acoso, contenido inapropiado, etc.)</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <h4>Envía el reporte</h4>
                      <p>Confirma el reporte. Nuestro equipo lo revisará en 24-48 horas</p>
                    </div>
                  </div>
                </div>
                <div className="modal-note">
                  <strong>Nota:</strong> Los reportes son confidenciales. El usuario no sabrá que lo reportaste.
                </div>
              </>
            )}

            {showModal === 'block' && (
              <>
                <h2>⛔ Cómo Bloquear un Usuario</h2>
                <div className="modal-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Abre el perfil</h4>
                      <p>Ve al perfil del usuario que quieres bloquear</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Toca los tres puntos</h4>
                      <p>En la esquina superior derecha, toca el ícono ⋯</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Selecciona "Bloquear"</h4>
                      <p>Toca "Bloquear usuario" en el menú</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h4>Confirma</h4>
                      <p>Confirma que quieres bloquear al usuario</p>
                    </div>
                  </div>
                </div>
                <div className="modal-note">
                  <strong>Efecto del bloqueo:</strong>
                  <ul>
                    <li>El usuario no podrá ver tu perfil</li>
                    <li>No podrá enviarte mensajes</li>
                    <li>No aparecerá en tus búsquedas</li>
                    <li>El match se deshará automáticamente</li>
                  </ul>
                </div>
              </>
            )}

            {showModal === 'unmatch' && (
              <>
                <h2>❌ Cómo Hacer Unmatch</h2>
                <div className="modal-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Ve a Matches</h4>
                      <p>Abre la sección de Matches desde el menú inferior</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Selecciona el match</h4>
                      <p>Toca la conversación del match que quieres deshacer</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Abre opciones</h4>
                      <p>Toca los tres puntos ⋯ en la parte superior</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h4>Selecciona "Unmatch"</h4>
                      <p>Toca "Deshacer match" en el menú</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <h4>Confirma</h4>
                      <p>Confirma que quieres deshacer el match</p>
                    </div>
                  </div>
                </div>
                <div className="modal-note">
                  <strong>Importante:</strong> Esta acción no se puede deshacer. Los mensajes se eliminarán y la persona no será notificada.
                </div>
              </>
            )}

            {showModal === 'dating-safety' && (
              <>
                <h2>📖 Guía de Seguridad en Citas Online</h2>
                <div className="guide-content">
                  <h3>Antes de Conocerse</h3>
                  <ul>
                    <li>Tómate tu tiempo para conocer a la persona en la app</li>
                    <li>Investiga un poco (búsqueda de Google, redes sociales)</li>
                    <li>Ten una videollamada antes de encontrarte en persona</li>
                    <li>Si algo se siente mal, confía en tu instinto</li>
                  </ul>

                  <h3>Durante la Primera Cita</h3>
                  <ul>
                    <li>Reúnanse en un lugar público durante el día</li>
                    <li>Dile a un amigo dónde estarás y con quién</li>
                    <li>Lleva tu propio transporte</li>
                    <li>No dejes tu bebida sin supervisión</li>
                    <li>Mantén tu teléfono cargado</li>
                  </ul>

                  <h3>Banderas Rojas</h3>
                  <ul>
                    <li>Presión para encontrarse de inmediato</li>
                    <li>Historias inconsistentes</li>
                    <li>Comportamiento controlador o agresivo</li>
                    <li>Solicitud de dinero o información financiera</li>
                    <li>Negativa a hacer videollamada</li>
                  </ul>
                </div>
              </>
            )}

            {showModal === 'scams' && (
              <>
                <h2>🛡️ Cómo Reconocer Estafas</h2>
                <div className="guide-content">
                  <h3>Tipos Comunes de Estafas</h3>

                  <h4>Romance Scam</h4>
                  <ul>
                    <li>Perfil con fotos de modelo o militar</li>
                    <li>Declaran amor muy rápidamente</li>
                    <li>Siempre tienen una excusa para no encontrarse</li>
                    <li>Eventualmente piden dinero (emergencia, viaje, etc.)</li>
                  </ul>

                  <h4>Catfishing</h4>
                  <ul>
                    <li>Fotos que parecen de stock o muy profesionales</li>
                    <li>Se niegan a hacer videollamada</li>
                    <li>Historia de vida dramática o increíble</li>
                    <li>Perfiles en redes sociales recientes o vacíos</li>
                  </ul>

                  <h4>Phishing</h4>
                  <ul>
                    <li>Envían links sospechosos</li>
                    <li>Piden que descargues apps extrañas</li>
                    <li>Quieren que salgas de la app inmediatamente</li>
                  </ul>

                  <h3>Cómo Protegerte</h3>
                  <ul>
                    <li>Nunca envíes dinero a alguien que no conoces en persona</li>
                    <li>No compartas información financiera</li>
                    <li>Haz búsqueda reversa de imágenes en Google</li>
                    <li>Reporta perfiles sospechosos</li>
                  </ul>
                </div>
              </>
            )}

            {showModal === 'first-dates' && (
              <>
                <h2>💬 Consejos para Primeras Citas</h2>
                <div className="guide-content">
                  <h3>Planificación</h3>
                  <ul>
                    <li>Elige un lugar público y concurrido</li>
                    <li>Prefiere horarios diurnos o vespertinos</li>
                    <li>Café, parque o museo son buenas opciones</li>
                    <li>Evita lugares aislados o tu casa</li>
                  </ul>

                  <h3>Seguridad</h3>
                  <ul>
                    <li>Comparte tu ubicación con un amigo</li>
                    <li>Establece una "hora de check-in" con alguien</li>
                    <li>Lleva efectivo para emergencias</li>
                    <li>Ten un plan de salida si te sientes incómodo</li>
                  </ul>

                  <h3>Durante la Cita</h3>
                  <ul>
                    <li>Mantén el alcohol al mínimo</li>
                    <li>Paga tu parte (no te sientas obligado)</li>
                    <li>Escucha tu intuición</li>
                    <li>No te sientas presionado a ir a otro lugar</li>
                  </ul>

                  <h3>Después</h3>
                  <ul>
                    <li>Avisa a tu amigo que llegaste bien</li>
                    <li>No compartas tu dirección todavía</li>
                    <li>Tómate tiempo para decidir si quieres una segunda cita</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Safety
