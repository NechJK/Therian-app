import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, ChevronDown, ChevronUp, Mail, MessageCircle } from 'lucide-react'
import './Help.css'

const Help = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const faqs = [
    {
      category: 'Cuenta y Perfil',
      questions: [
        {
          q: '¿Cómo creo una cuenta en Kindred?',
          a: 'Descarga la app, haz clic en "Registrarse", ingresa tu correo y crea una contraseña. Luego completa tu perfil con fotos, información sobre tu theriotype y preferencias.'
        },
        {
          q: '¿Cómo cambio mi foto de perfil?',
          a: 'Ve a tu Perfil → Editar perfil → toca tu foto actual → selecciona una nueva foto de tu galería.'
        },
        {
          q: '¿Puedo cambiar mi theriotype después de crear mi perfil?',
          a: 'Sí, ve a Perfil → Editar perfil → selecciona un nuevo theriotype de la lista. Los cambios se guardan automáticamente.'
        },
        {
          q: '¿Cómo elimino mi cuenta?',
          a: 'Ve a Perfil → Configuración → Cuenta → Eliminar cuenta. Esta acción es permanente y eliminará todos tus datos, matches y conversaciones.'
        }
      ]
    },
    {
      category: 'Matches y Likes',
      questions: [
        {
          q: '¿Cómo funcionan los matches?',
          a: 'Cuando tú y otra persona se dan like mutuamente, se crea un match. Puedes ver tus matches en la pestaña "Matches" y comenzar a chatear.'
        },
        {
          q: '¿Qué es un Super Like?',
          a: 'Un Super Like muestra interés especial. La persona recibirá una notificación de que le diste Super Like, haciendo que tu perfil se destaque.'
        },
        {
          q: '¿Cuántos likes tengo por día?',
          a: 'Plan Gratis: 20 likes diarios. Plus/Gold/Platinum: Likes ilimitados. Los likes se restablecen cada 24 horas.'
        },
        {
          q: '¿Puedo deshacer un swipe?',
          a: 'Sí, usa el botón de Rewind (flecha circular) para deshacer tu último swipe. Esta función es ilimitada para todos los usuarios.'
        },
        {
          q: '¿Cómo puedo ver quién me dio like?',
          a: 'Esta función está disponible para usuarios Plus, Gold y Platinum. Ve a Matches → pestaña "Matches" para ver quién te dio like.'
        }
      ]
    },
    {
      category: 'Suscripciones y Pagos',
      questions: [
        {
          q: '¿Qué incluyen los planes premium?',
          a: 'Plus ($4.99): Likes ilimitados, ver quién te dio like, 5 Super Likes diarios. Gold ($8.99): Todo lo de Plus + 10 Super Likes, 2 Boosts mensuales. Platinum ($14.99): Todo ilimitado + funciones exclusivas.'
        },
        {
          q: '¿Cómo cancelo mi suscripción?',
          a: 'Ve a Perfil → Mi Suscripción → Cancelar suscripción. Conservarás el acceso premium hasta el final del período pagado.'
        },
        {
          q: '¿Ofrecen reembolsos?',
          a: 'No ofrecemos reembolsos por períodos ya facturados. Si cancelas, conservarás el acceso hasta el final del período actual.'
        },
        {
          q: '¿Cómo actualizo mi método de pago?',
          a: 'Ve a Perfil → Mi Suscripción → Método de pago → Actualizar. Los cambios se aplicarán en tu próxima facturación.'
        }
      ]
    },
    {
      category: 'Privacidad y Seguridad',
      questions: [
        {
          q: '¿Quién puede ver mi perfil?',
          a: 'Tu perfil es visible para usuarios que coincidan con tus preferencias de búsqueda (edad, género, distancia) y tú con las suyas.'
        },
        {
          q: '¿Cómo bloqueo a alguien?',
          a: 'En el perfil del usuario, toca los tres puntos (⋯) → Bloquear. La persona no podrá ver tu perfil ni contactarte.'
        },
        {
          q: '¿Cómo reporto a un usuario?',
          a: 'En el perfil o chat del usuario, toca los tres puntos (⋯) → Reportar → selecciona la razón. Revisaremos todos los reportes.'
        },
        {
          q: '¿Pueden otros ver si estoy en línea?',
          a: 'Puedes controlar esto en Configuración → Privacidad → Mostrar estado en línea.'
        },
        {
          q: '¿Es segura mi información personal?',
          a: 'Sí, usamos encriptación y medidas de seguridad estrictas. Nunca compartimos tu información con terceros sin tu consentimiento. Lee nuestra Política de Privacidad para más detalles.'
        }
      ]
    },
    {
      category: 'Mensajería',
      questions: [
        {
          q: '¿Cómo envío un mensaje?',
          a: 'Solo puedes enviar mensajes a tus matches. Ve a Matches → selecciona un match → escribe tu mensaje.'
        },
        {
          q: '¿Por qué desaparecieron mis mensajes?',
          a: 'Si la otra persona eliminó el match o su cuenta, los mensajes desaparecerán.'
        },
        {
          q: '¿Puedo enviar fotos en el chat?',
          a: 'Esta función estará disponible próximamente. Por ahora, solo mensajes de texto.'
        },
        {
          q: '¿Las notificaciones de mensajes funcionan?',
          a: 'Sí, asegúrate de tener las notificaciones activadas en Configuración → Notificaciones → Mensajes.'
        }
      ]
    },
    {
      category: 'Problemas Técnicos',
      questions: [
        {
          q: 'La app está lenta o se congela',
          a: 'Intenta cerrar y reabrir la app. Si el problema persiste, limpia la caché de tu navegador o reinstala la app.'
        },
        {
          q: 'No puedo subir fotos',
          a: 'Verifica que las fotos sean menores de 5MB y en formato JPG, PNG o WEBP. Asegúrate de tener buena conexión a internet.'
        },
        {
          q: 'No recibo notificaciones',
          a: 'Ve a Configuración del dispositivo → Notificaciones → Kindred → asegúrate de que estén activadas. También verifica en Configuración de la app.'
        },
        {
          q: 'Olvidé mi contraseña',
          a: 'En la pantalla de inicio de sesión, toca "¿Olvidaste tu contraseña?" → ingresa tu correo → recibirás un link para restablecerla.'
        }
      ]
    }
  ]

  const toggleFaq = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`
    setExpandedFaq(expandedFaq === key ? null : key)
  }

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(faq =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="help-page">
      <div className="help-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <ArrowLeft size={24} />
        </button>
        <h1>Ayuda y Soporte</h1>
      </div>

      <div className="help-container">
        {/* Search */}
        <div className="help-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar preguntas frecuentes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <h2>Acceso Rápido</h2>
          <div className="quick-links-grid">
            <button
              className="quick-link-card"
              onClick={() => navigate('/safety')}
            >
              🛡️ Centro de Seguridad
            </button>
            <button
              className="quick-link-card"
              onClick={() => navigate('/terms')}
            >
              📜 Términos y Condiciones
            </button>
            <button
              className="quick-link-card"
              onClick={() => navigate('/privacy')}
            >
              🔒 Política de Privacidad
            </button>
            <button
              className="quick-link-card"
              onClick={() => navigate('/subscription')}
            >
              👑 Planes Premium
            </button>
          </div>
        </div>

        {/* FAQs */}
        <div className="faq-section">
          <h2>Preguntas Frecuentes</h2>

          {filteredFaqs.length === 0 ? (
            <div className="no-results">
              <p>No se encontraron resultados para "{searchQuery}"</p>
              <p className="no-results-hint">Intenta con otras palabras clave</p>
            </div>
          ) : (
            filteredFaqs.map((category, catIndex) => (
              <div key={catIndex} className="faq-category">
                <h3>{category.category}</h3>

                {category.questions.map((faq, qIndex) => {
                  const isExpanded = expandedFaq === `${catIndex}-${qIndex}`

                  return (
                    <div
                      key={qIndex}
                      className={`faq-item ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleFaq(catIndex, qIndex)}
                    >
                      <div className="faq-question">
                        <span>{faq.q}</span>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                      {isExpanded && (
                        <div className="faq-answer">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Contact Support */}
        <div className="contact-support">
          <h2>¿Aún necesitas ayuda?</h2>
          <p>Nuestro equipo está aquí para ayudarte</p>

          <div className="contact-options">
            <a href="mailto:support@kindredapp.com" className="contact-card">
              <div className="contact-icon">
                <Mail size={24} />
              </div>
              <div className="contact-content">
                <h4>Email</h4>
                <p>support@kindredapp.com</p>
                <span className="response-time">Respuesta en 24-48h</span>
              </div>
            </a>

            <div className="contact-card">
              <div className="contact-icon">
                <MessageCircle size={24} />
              </div>
              <div className="contact-content">
                <h4>Chat en vivo</h4>
                <p>Próximamente</p>
                <span className="response-time">Lun-Vie 9am-6pm</span>
              </div>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="app-info">
          <p>Kindred v1.0.0</p>
          <p>© 2026 Kindred. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}

export default Help
