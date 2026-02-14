import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './LegalPage.css'

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  return (
    <div className="legal-page">
      <div className="legal-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <ArrowLeft size={24} />
        </button>
        <h1>Política de Privacidad</h1>
      </div>

      <div className="legal-container">
        <div className="legal-updated">
          Última actualización: 14 de febrero de 2026
        </div>

        <section>
          <h2>1. Introducción</h2>
          <p>
            En Kindred, nos tomamos muy en serio tu privacidad. Esta Política de Privacidad explica
            cómo recopilamos, usamos, compartimos y protegemos tu información personal cuando usas
            nuestra aplicación.
          </p>
        </section>

        <section>
          <h2>2. Información que Recopilamos</h2>

          <h3>2.1 Información que Proporcionas</h3>
          <ul>
            <li><strong>Información de cuenta:</strong> Nombre, edad, correo electrónico, contraseña</li>
            <li><strong>Información de perfil:</strong> Fotos, biografía, theriotype, intereses</li>
            <li><strong>Preferencias:</strong> Género de interés, rango de edad, distancia</li>
            <li><strong>Contenido generado:</strong> Mensajes, matches, likes</li>
          </ul>

          <h3>2.2 Información Recopilada Automáticamente</h3>
          <ul>
            <li><strong>Ubicación:</strong> Ubicación aproximada para mostrar usuarios cercanos</li>
            <li><strong>Datos de uso:</strong> Interacciones, tiempo de uso, funciones utilizadas</li>
            <li><strong>Información del dispositivo:</strong> Tipo de dispositivo, sistema operativo, navegador</li>
            <li><strong>Información de red:</strong> Dirección IP, proveedor de servicios</li>
          </ul>

          <h3>2.3 Información de Terceros</h3>
          <ul>
            <li>Información de autenticación si usas login social (Google, Facebook)</li>
            <li>Información de procesadores de pago para suscripciones</li>
          </ul>
        </section>

        <section>
          <h2>3. Cómo Usamos tu Información</h2>
          <p>Usamos tu información para:</p>
          <ul>
            <li>Crear y mantener tu cuenta</li>
            <li>Mostrarte perfiles de otros usuarios compatibles</li>
            <li>Facilitar matches y comunicación entre usuarios</li>
            <li>Procesar pagos y suscripciones</li>
            <li>Enviar notificaciones sobre matches, mensajes y actividad</li>
            <li>Mejorar y personalizar tu experiencia</li>
            <li>Prevenir fraude y garantizar la seguridad</li>
            <li>Cumplir con obligaciones legales</li>
            <li>Realizar análisis y mejoras del servicio</li>
          </ul>
        </section>

        <section>
          <h2>4. Compartir tu Información</h2>

          <h3>4.1 Con Otros Usuarios</h3>
          <p>
            Tu perfil (fotos, nombre, edad, theriotype, biografía) es visible para otros usuarios de
            la aplicación según tus preferencias de búsqueda y las de ellos.
          </p>

          <h3>4.2 Con Proveedores de Servicios</h3>
          <p>Compartimos información con:</p>
          <ul>
            <li>Servicios de hosting y almacenamiento (Supabase, Netlify)</li>
            <li>Procesadores de pago (Stripe, PayPal, etc.)</li>
            <li>Servicios de análisis y métricas</li>
            <li>Servicios de notificaciones push</li>
          </ul>

          <h3>4.3 Por Razones Legales</h3>
          <p>Podemos divulgar información si:</p>
          <ul>
            <li>Es requerido por ley o proceso legal</li>
            <li>Es necesario para proteger nuestros derechos</li>
            <li>Es necesario para prevenir fraude o actividad ilegal</li>
            <li>Es necesario para proteger la seguridad de usuarios</li>
          </ul>

          <h3>4.4 Nunca Vendemos tus Datos</h3>
          <p>
            No vendemos, alquilamos ni compartimos tu información personal con terceros para sus
            propósitos de marketing.
          </p>
        </section>

        <section>
          <h2>5. Tus Derechos y Opciones</h2>

          <h3>5.1 Acceso y Actualización</h3>
          <p>
            Puedes acceder y actualizar tu información de perfil en cualquier momento desde la
            configuración de tu cuenta.
          </p>

          <h3>5.2 Eliminación de Cuenta</h3>
          <p>
            Puedes eliminar tu cuenta en cualquier momento. Esto eliminará permanentemente:
          </p>
          <ul>
            <li>Tu perfil e información personal</li>
            <li>Tus fotos y contenido</li>
            <li>Tus matches y conversaciones</li>
            <li>Tu historial de actividad</li>
          </ul>

          <h3>5.3 Control de Notificaciones</h3>
          <p>
            Puedes controlar qué notificaciones recibes desde la configuración de la aplicación.
          </p>

          <h3>5.4 Control de Privacidad</h3>
          <p>Puedes controlar:</p>
          <ul>
            <li>Quién puede ver tu perfil</li>
            <li>Si tu distancia es visible</li>
            <li>Si tu estado en línea es visible</li>
            <li>Configuraciones de búsqueda y descubrimiento</li>
          </ul>
        </section>

        <section>
          <h2>6. Seguridad de Datos</h2>
          <p>Implementamos medidas de seguridad incluyendo:</p>
          <ul>
            <li>Encriptación de datos en tránsito (HTTPS/SSL)</li>
            <li>Encriptación de contraseñas</li>
            <li>Autenticación segura</li>
            <li>Monitoreo de actividad sospechosa</li>
            <li>Acceso limitado a datos personales por empleados</li>
          </ul>
          <p>
            Sin embargo, ningún sistema es 100% seguro. Te recomendamos usar contraseñas seguras
            y no compartir información sensible en mensajes.
          </p>
        </section>

        <section>
          <h2>7. Retención de Datos</h2>
          <p>
            Mantenemos tu información mientras tu cuenta esté activa. Si eliminas tu cuenta:
          </p>
          <ul>
            <li>La información de perfil se elimina inmediatamente</li>
            <li>Algunos datos pueden conservarse por razones legales o de seguridad</li>
            <li>Los mensajes en conversaciones pueden permanecer en cuentas de otros usuarios</li>
            <li>Datos de transacciones se conservan según requerimientos legales</li>
          </ul>
        </section>

        <section>
          <h2>8. Menores de Edad</h2>
          <p>
            Kindred es solo para usuarios de 18 años o más. No recopilamos intencionalmente información
            de menores de 18 años. Si descubrimos que un menor ha creado una cuenta, la eliminaremos
            inmediatamente.
          </p>
        </section>

        <section>
          <h2>9. Cookies y Tecnologías Similares</h2>
          <p>Usamos cookies y tecnologías similares para:</p>
          <ul>
            <li>Mantener tu sesión activa</li>
            <li>Recordar tus preferencias</li>
            <li>Analizar el uso de la aplicación</li>
            <li>Mejorar el rendimiento</li>
          </ul>
          <p>
            Puedes controlar las cookies desde la configuración de tu navegador, aunque esto puede
            afectar la funcionalidad de la aplicación.
          </p>
        </section>

        <section>
          <h2>10. Transferencias Internacionales</h2>
          <p>
            Tu información puede ser transferida y almacenada en servidores ubicados fuera de tu país
            de residencia. Al usar Kindred, consientes estas transferencias.
          </p>
        </section>

        <section>
          <h2>11. Cambios a esta Política</h2>
          <p>
            Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos de cambios
            importantes a través de la aplicación o por correo electrónico. El uso continuado después
            de los cambios constituye tu aceptación de la nueva política.
          </p>
        </section>

        <section>
          <h2>12. Tus Derechos Legales (GDPR/CCPA)</h2>
          <p>
            Dependiendo de tu ubicación, puedes tener derechos adicionales incluyendo:
          </p>
          <ul>
            <li>Derecho a acceder a tus datos personales</li>
            <li>Derecho a rectificar datos inexactos</li>
            <li>Derecho a eliminar tus datos</li>
            <li>Derecho a limitar el procesamiento</li>
            <li>Derecho a la portabilidad de datos</li>
            <li>Derecho a oponerte al procesamiento</li>
          </ul>
          <p>
            Para ejercer estos derechos, contáctanos en privacy@kindredapp.com
          </p>
        </section>

        <section>
          <h2>13. Contacto</h2>
          <p>
            Si tienes preguntas sobre esta Política de Privacidad o sobre cómo manejamos tus datos:
          </p>
          <p className="contact-info">
            Email: <a href="mailto:privacy@kindredapp.com">privacy@kindredapp.com</a><br />
            Soporte: <a href="mailto:support@kindredapp.com">support@kindredapp.com</a>
          </p>
        </section>

        <div className="legal-footer">
          <p>Al usar Kindred, confirmas que has leído y entendido esta Política de Privacidad.</p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
