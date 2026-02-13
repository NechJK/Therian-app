# Kindred - Therian Connect

![Kindred Logo](https://img.shields.io/badge/Kindred-Therian%20Connect-C8A96E?style=for-the-badge)

La primera Progressive Web App (PWA) de conexiones sociales diseñada exclusivamente para la comunidad therian.

## 🐺 Descripción

Kindred es una app tipo Tinder pero para la comunidad therian, permitiendo conexiones genuinas basadas en afinidad animal, experiencias compartidas y compatibilidad de espíritu.

## 🚀 Stack Tecnológico

- **Frontend**: React + Vite
- **Backend as a Service**: Supabase (Auth, Database, Storage, Realtime)
- **Estilo**: CSS personalizado con tema dark mode
- **Iconos**: Lucide React
- **Routing**: React Router v6
- **PWA**: Vite PWA Plugin
- **Deploy**: Vercel (recomendado)

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase (tier gratuito)
- Cuenta de Vercel (opcional, para deploy)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
cd kindred
npm install
```

### 2. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. Ve a Settings > API y copia:
   - Project URL
   - Anon public key

3. Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 3. Configurar la base de datos

1. Ve a SQL Editor en tu dashboard de Supabase
2. Copia y ejecuta todo el contenido de `supabase-schema.sql`
3. Esto creará todas las tablas, políticas RLS e índices necesarios

### 4. Configurar Storage

1. Ve a Storage en Supabase
2. Crea un nuevo bucket llamado `photos`
3. Hazlo público:
   - Settings > Make public
4. Agrega una política de storage:

```sql
-- Permitir subir fotos autenticadas
CREATE POLICY "Usuarios autenticados pueden subir fotos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos');

-- Permitir lectura pública
CREATE POLICY "Las fotos son públicamente visibles"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'photos');
```

### 5. Configurar OAuth de Google (opcional)

1. Ve a Authentication > Providers en Supabase
2. Habilita Google OAuth
3. Configura las credenciales de Google Cloud Console
4. Agrega `http://localhost:5173` a las URLs autorizadas

## 🎯 Ejecutar en desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`

## 📦 Build para producción

```bash
npm run build
npm run preview
```

## 🚀 Deploy en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automático desde la rama main

## 📱 Características Principales

### MVP (v1.0)

- ✅ Autenticación (email/password + Google OAuth)
- ✅ Onboarding de 5 pasos
- ✅ Perfil therian completo
- ✅ Motor de swipe con gestos táctiles
- ✅ Sistema de matches
- ✅ Chat en tiempo real
- ✅ Filtros básicos (theriotype, distancia, edad)
- ✅ PWA instalable
- ✅ Dark mode nativo

### Futuras versiones

- 🔲 Super Likes
- 🔲 Verificación de identidad
- 🔲 Suscripción Kindred Gold
- 🔲 Feed comunitario
- 🔲 Eventos presenciales
- 🔲 Internacionalización

## 🗂️ Estructura del proyecto

```
kindred/
├── src/
│   ├── components/     # Componentes reutilizables
│   │   └── BottomNav.jsx
│   ├── pages/          # Páginas principales
│   │   ├── Welcome.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Onboarding.jsx
│   │   ├── Discover.jsx
│   │   ├── Matches.jsx
│   │   ├── Chat.jsx
│   │   └── Profile.jsx
│   ├── hooks/          # Custom hooks
│   │   └── useAuth.js
│   ├── config/         # Configuración
│   │   └── supabase.js
│   ├── utils/          # Utilidades
│   │   └── constants.js
│   ├── App.jsx         # Componente principal
│   └── main.jsx        # Entry point
├── public/             # Assets estáticos
├── supabase-schema.sql # Schema de la base de datos
└── README.md
```

## 🎨 Paleta de Colores

- **Primario**: `#C8A96E` (Dorado cálido)
- **Background**: `#0F0F12` (Negro profundo)
- **Like**: `#4ADE80` (Verde)
- **Nope**: `#F87171` (Rojo)
- **Super Like**: `#60A5FA` (Azul)

## 🔐 Seguridad

- Row Level Security (RLS) habilitado en todas las tablas
- Políticas estrictas de acceso a datos
- Validación de edad (18+)
- Sistema de reporte y bloqueo

## 📊 Métricas de Éxito

Objetivo para las primeras 4 semanas:

- 200+ registros
- 60% completación de onboarding
- 30% retención D7
- 10% match rate
- 40% de matches con al menos 1 mensaje

## 🤝 Contribuir

Este es un proyecto MVP. Las contribuciones son bienvenidas después del lanzamiento inicial.

## 📄 Licencia

Propiedad de Kindred. Todos los derechos reservados.

## 📞 Contacto

Para soporte y feedback:
- Discord: [Próximamente]
- TikTok: @kindredapp
- Email: hola@kindredapp.com

---

Hecho con 🐺 para la comunidad therian
