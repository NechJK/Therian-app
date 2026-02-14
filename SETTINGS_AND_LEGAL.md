# 📱 Configuración y Páginas Legales - Kindred

Este documento describe todas las nuevas páginas de configuración y legales agregadas a Kindred.

---

## 🆕 Nuevas Páginas Agregadas

### 1. ⚙️ **Configuración** (`/settings`)

Página completa de configuración con múltiples secciones:

#### **Región e Idioma**
- 🌍 **País**: Selector con 8 países (Ecuador, USA, México, Colombia, Argentina, España, Perú, Chile)
- 🗣️ **Idioma**: Español, English, Português

#### **Notificaciones**
Controles de toggle para:
- Nuevos matches
- Mensajes
- Likes
- Super Likes

#### **Privacidad**
Controles para mostrar/ocultar:
- Estado en línea
- Distancia
- Edad en perfil

#### **Apariencia**
- Selector de tema: Oscuro / Claro / Automático

#### **Cuenta**
- Botón para eliminar cuenta (con advertencia)

**Características técnicas:**
- Guarda configuraciones en tabla `user_settings` de Supabase
- Valores por defecto automáticos al crear cuenta
- Interfaz con toggles interactivos y selectores

---

### 2. 📜 **Términos y Condiciones** (`/terms`)

Documento legal completo con 15 secciones:

1. Aceptación de los Términos
2. Requisitos de Edad (18+)
3. Creación de Cuenta
4. Conducta del Usuario
5. Contenido del Usuario
6. Suscripciones y Pagos
7. Política de Reembolsos
8. Suspensión y Terminación
9. Propiedad Intelectual
10. Limitación de Responsabilidad
11. Seguridad
12. Modificaciones a los Términos
13. Ley Aplicable (Ecuador)
14. Contacto
15. Severabilidad

**Características:**
- Scroll largo con diseño legible
- Secciones con títulos dorados
- Lista de conductas prohibidas
- Información de contacto: legal@kindredapp.com

---

### 3. 🔒 **Política de Privacidad** (`/privacy`)

Política de privacidad completa y conforme a GDPR/CCPA:

**Secciones principales:**
1. Introducción
2. Información que Recopilamos (perfil, ubicación, uso)
3. Cómo Usamos tu Información
4. Compartir tu Información (nunca vendemos datos)
5. Tus Derechos y Opciones
6. Seguridad de Datos (encriptación)
7. Retención de Datos
8. Menores de Edad (prohibido)
9. Cookies y Tecnologías
10. Transferencias Internacionales
11. Cambios a la Política
12. Derechos GDPR/CCPA
13. Contacto: privacy@kindredapp.com

**Características:**
- Transparente sobre recopilación de datos
- Explica derechos del usuario
- Opciones de eliminación de cuenta
- Conforme a regulaciones internacionales

---

### 4. 🛡️ **Centro de Seguridad** (`/safety`)

Página educativa sobre seguridad en citas online:

#### **Consejos de Seguridad**
- 🔒 Protege tu información personal
- 👤 Conoce personas de forma segura
- 🚩 Señales de alerta (scams, comportamiento sospechoso)
- 💬 Conversaciones seguras

#### **Herramientas de Reporte**
- 🚩 Reportar usuario
- ⛔ Bloquear usuario
- ❌ Unmatch

#### **Normas de la Comunidad**
- ❌ Comportamiento prohibido (acoso, spam, odio)
- ✅ Comportamiento esperado (respeto, honestidad)

#### **Obtener Ayuda**
- 🚨 Emergencias: 911
- 📧 Reportar: safety@kindredapp.com
- 💬 Link a centro de ayuda

#### **Recursos**
- Guías de seguridad en citas
- Reconocer estafas
- Consejos para primeras citas
- Configuración de privacidad

---

### 5. 💬 **Ayuda y Soporte** (`/help`)

Centro de ayuda completo con FAQs y soporte:

#### **Búsqueda de FAQs**
- Buscador en tiempo real
- Filtra preguntas por palabra clave

#### **Acceso Rápido**
Botones a:
- Centro de Seguridad
- Términos y Condiciones
- Política de Privacidad
- Planes Premium

#### **Preguntas Frecuentes por Categoría**

**Cuenta y Perfil**
- Crear cuenta
- Cambiar foto
- Cambiar theriotype
- Eliminar cuenta

**Matches y Likes**
- Cómo funcionan matches
- Qué es Super Like
- Límites de likes diarios
- Deshacer swipes
- Ver quién te dio like

**Suscripciones y Pagos**
- Planes premium
- Cancelar suscripción
- Reembolsos
- Actualizar método de pago

**Privacidad y Seguridad**
- Quién ve tu perfil
- Bloquear usuarios
- Reportar usuarios
- Estado en línea
- Seguridad de datos

**Mensajería**
- Enviar mensajes
- Mensajes desaparecidos
- Enviar fotos
- Notificaciones

**Problemas Técnicos**
- App lenta
- Subir fotos
- Notificaciones
- Olvidé contraseña

#### **Contacto con Soporte**
- 📧 Email: support@kindredapp.com (24-48h)
- 💬 Chat en vivo: Próximamente

---

## 🗄️ Base de Datos

### Nueva Tabla: `user_settings`

```sql
CREATE TABLE user_settings (
  id uuid PRIMARY KEY,
  user_id uuid UNIQUE REFERENCES auth.users(id),
  settings jsonb DEFAULT '{
    "country": "EC",
    "language": "es",
    "notifications": {...},
    "privacy": {...},
    "theme": "dark"
  }',
  created_at timestamp,
  updated_at timestamp
)
```

**Características:**
- Se crea automáticamente al registrarse
- Row Level Security (RLS) activado
- Trigger para actualizar `updated_at`
- Valores por defecto sensatos

**Para aplicar:**
```bash
# Ejecuta en Supabase SQL Editor
cat user-settings-schema.sql
```

---

## 🎨 Diseño

Todas las páginas siguen el diseño de Tinder:

- **Colores consistentes**: Gold (#C8A96E) para destacados
- **Backgrounds**: var(--bg-primary), var(--bg-secondary)
- **Tipografía**: Títulos grandes y claros
- **Responsive**: Mobile-first design
- **Navegación**: Botón de atrás en todas las páginas
- **Transiciones**: Hover y click feedback

**Componentes reutilizados:**
- `.back-btn`: Botón de navegación hacia atrás
- Toggles animados para configuraciones
- Cards con sombras y bordes
- Secciones con títulos icónicos

---

## 🔗 Rutas Agregadas

```javascript
/settings     → Configuración completa
/terms        → Términos y Condiciones
/privacy      → Política de Privacidad
/safety       → Centro de Seguridad
/help         → Ayuda y Soporte
```

Todas requieren autenticación (ProtectedRoute).

---

## 🚀 Cómo Usar

### 1. Aplicar Schema de Base de Datos

```bash
# En Supabase SQL Editor, ejecuta:
user-settings-schema.sql
```

### 2. Navegar desde Profile

El usuario puede acceder a todas las páginas desde:
- **Perfil** → **Configuración** → `/settings`
- **Perfil** → **Seguridad** → `/safety`
- **Perfil** → **Términos y Condiciones** → `/terms`
- **Perfil** → **Política de Privacidad** → `/privacy`
- **Perfil** → **Ayuda y Soporte** → `/help`

### 3. Cambios Automáticos

- Las configuraciones se guardan automáticamente en Supabase
- Los usuarios nuevos obtienen configuración por defecto
- Los toggles funcionan en tiempo real

---

## 📧 Contactos

Emails ficticios que deberías configurar:

- **Legal**: legal@kindredapp.com
- **Privacidad**: privacy@kindredapp.com
- **Seguridad**: safety@kindredapp.com
- **Soporte**: support@kindredapp.com

---

## ✅ Checklist de Implementación

- [x] Crear página Settings con controles funcionales
- [x] Crear Términos y Condiciones completos
- [x] Crear Política de Privacidad (GDPR compliant)
- [x] Crear Centro de Seguridad con guías
- [x] Crear Centro de Ayuda con FAQs
- [x] Agregar schema de user_settings
- [x] Actualizar rutas en App.jsx
- [x] Actualizar navegación en Profile.jsx
- [x] Crear estilos consistentes para todas las páginas
- [ ] Ejecutar user-settings-schema.sql en Supabase
- [ ] Configurar emails de contacto reales
- [ ] Traducir a otros idiomas (futuro)

---

## 🎯 Próximos Pasos Recomendados

1. **Ejecutar SQL**: Aplica `user-settings-schema.sql` en Supabase
2. **Configurar emails**: Crea cuentas de email reales o aliases
3. **Traducción**: Implementar i18n para español/inglés/portugués
4. **Chat en vivo**: Integrar sistema de soporte en tiempo real
5. **Legal review**: Revisar términos con abogado antes de producción
6. **GDPR compliance**: Agregar cookie banner si opera en EU

---

**Fecha**: 14 de febrero de 2026
**Versión**: Kindred v1.0.0
