import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './LegalPage.css'

const TermsAndConditions = () => {
  const navigate = useNavigate()

  return (
    <div className="legal-page">
      <div className="legal-header">
        <button className="back-btn" onClick={() => navigate('/profile')}>
          <ArrowLeft size={24} />
        </button>
        <h1>Términos y Condiciones</h1>
      </div>

      <div className="legal-container">
        <div className="legal-updated">
          Última actualización: 14 de febrero de 2026
        </div>

        <section>
          <h2>1. Aceptación de los Términos</h2>
          <p>
            Al acceder y usar Kindred, aceptas estar legalmente vinculado por estos Términos y Condiciones.
            Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestra aplicación.
          </p>
        </section>

        <section>
          <h2>2. Requisitos de Edad</h2>
          <p>
            Debes tener al menos 18 años para usar Kindred. Al crear una cuenta, confirmas que tienes
            la edad legal requerida y que toda la información proporcionada es veraz y precisa.
          </p>
        </section>

        <section>
          <h2>3. Creación de Cuenta</h2>
          <p>Para usar Kindred, debes:</p>
          <ul>
            <li>Proporcionar información precisa y completa durante el registro</li>
            <li>Mantener actualizada tu información de perfil</li>
            <li>Mantener la confidencialidad de tu cuenta</li>
            <li>Notificarnos inmediatamente de cualquier uso no autorizado</li>
            <li>Ser responsable de todas las actividades en tu cuenta</li>
          </ul>
        </section>

        <section>
          <h2>4. Conducta del Usuario</h2>
          <p>Al usar Kindred, te comprometes a NO:</p>
          <ul>
            <li>Acosar, intimidar o amenazar a otros usuarios</li>
            <li>Publicar contenido ofensivo, violento o inapropiado</li>
            <li>Hacerte pasar por otra persona o entidad</li>
            <li>Usar la plataforma con fines comerciales no autorizados</li>
            <li>Intentar acceder a cuentas de otros usuarios</li>
            <li>Compartir contenido que viole derechos de terceros</li>
            <li>Usar bots, scripts o herramientas automatizadas</li>
            <li>Solicitar dinero o información financiera a otros usuarios</li>
          </ul>
        </section>

        <section>
          <h2>5. Contenido del Usuario</h2>
          <p>
            Eres responsable del contenido que publicas en Kindred. Al subir fotos, escribir biografías
            o enviar mensajes, garantizas que:
          </p>
          <ul>
            <li>Tienes los derechos necesarios sobre el contenido</li>
            <li>El contenido no viola leyes ni derechos de terceros</li>
            <li>El contenido es apropiado y no ofensivo</li>
          </ul>
          <p>
            Nos reservamos el derecho de eliminar cualquier contenido que consideremos inapropiado
            sin previo aviso.
          </p>
        </section>

        <section>
          <h2>6. Suscripciones y Pagos</h2>
          <h3>6.1 Planes de Suscripción</h3>
          <p>
            Kindred ofrece planes de suscripción premium (Plus, Gold, Platinum) con diferentes beneficios.
            Los precios están disponibles en la página de suscripciones.
          </p>

          <h3>6.2 Facturación</h3>
          <ul>
            <li>Las suscripciones se renuevan automáticamente cada mes</li>
            <li>Se te cobrará en la fecha de renovación</li>
            <li>Los precios pueden cambiar con notificación previa de 30 días</li>
          </ul>

          <h3>6.3 Cancelación</h3>
          <ul>
            <li>Puedes cancelar tu suscripción en cualquier momento</li>
            <li>La cancelación será efectiva al final del período de facturación actual</li>
            <li>No se otorgan reembolsos por períodos parciales</li>
          </ul>
        </section>

        <section>
          <h2>7. Política de Reembolsos</h2>
          <p>
            No ofrecemos reembolsos por períodos de suscripción ya facturados. Si cancelas tu suscripción,
            conservarás el acceso premium hasta el final del período pagado.
          </p>
        </section>

        <section>
          <h2>8. Suspensión y Terminación de Cuenta</h2>
          <p>
            Nos reservamos el derecho de suspender o terminar tu cuenta si:
          </p>
          <ul>
            <li>Violas estos Términos y Condiciones</li>
            <li>Recibes múltiples reportes de otros usuarios</li>
            <li>Detectamos actividad fraudulenta o sospechosa</li>
            <li>Usas la plataforma de manera que perjudique a otros</li>
          </ul>
          <p>
            La terminación puede ser inmediata y sin previo aviso en casos graves.
          </p>
        </section>

        <section>
          <h2>9. Propiedad Intelectual</h2>
          <p>
            Kindred y todos sus elementos (logos, diseño, código, contenido) son propiedad de Kindred
            o de sus licenciantes. No puedes copiar, modificar, distribuir o crear obras derivadas
            sin nuestro permiso expreso.
          </p>
        </section>

        <section>
          <h2>10. Limitación de Responsabilidad</h2>
          <p>
            Kindred se proporciona "tal cual" sin garantías de ningún tipo. No somos responsables de:
          </p>
          <ul>
            <li>Interacciones entre usuarios fuera de la plataforma</li>
            <li>Exactitud de la información de perfil de otros usuarios</li>
            <li>Pérdida de datos o contenido</li>
            <li>Daños directos, indirectos o consecuentes</li>
          </ul>
        </section>

        <section>
          <h2>11. Seguridad</h2>
          <p>
            Aunque implementamos medidas de seguridad, no podemos garantizar la seguridad absoluta.
            Tú eres responsable de:
          </p>
          <ul>
            <li>Mantener segura tu contraseña</li>
            <li>Usar la plataforma de manera responsable</li>
            <li>Reportar comportamientos sospechosos</li>
            <li>Proteger tu información personal</li>
          </ul>
        </section>

        <section>
          <h2>12. Modificaciones a los Términos</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios
            importantes serán notificados a través de la aplicación. El uso continuado después de
            los cambios constituye tu aceptación de los nuevos términos.
          </p>
        </section>

        <section>
          <h2>13. Ley Aplicable</h2>
          <p>
            Estos términos se rigen por las leyes de Ecuador. Cualquier disputa será resuelta en
            los tribunales competentes de Ecuador.
          </p>
        </section>

        <section>
          <h2>14. Contacto</h2>
          <p>
            Si tienes preguntas sobre estos Términos y Condiciones, contáctanos en:
          </p>
          <p className="contact-info">
            Email: <a href="mailto:legal@kindredapp.com">legal@kindredapp.com</a><br />
            Soporte: <a href="mailto:support@kindredapp.com">support@kindredapp.com</a>
          </p>
        </section>

        <section>
          <h2>15. Severabilidad</h2>
          <p>
            Si alguna disposición de estos términos se considera inválida o inaplicable, las demás
            disposiciones permanecerán en pleno vigor y efecto.
          </p>
        </section>

        <div className="legal-footer">
          <p>Al usar Kindred, confirmas que has leído, entendido y aceptado estos Términos y Condiciones.</p>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions
