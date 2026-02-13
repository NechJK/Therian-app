# Guía de Configuración de Kindred

## ✅ Pasos Completados

El código de la aplicación está 100% completo. Ahora necesitas configurar los servicios externos.

## 🔧 Pasos Finales de Configuración

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita si no tienes una
3. Haz click en "New Project"
4. Completa:
   - **Name**: Kindred
   - **Database Password**: (guarda esta contraseña)
   - **Region**: Selecciona el más cercano a tu ubicación
   - **Pricing Plan**: Free

5. Espera 2-3 minutos mientras se crea el proyecto

### 2. Configurar Variables de Entorno

1. En tu proyecto de Supabase, ve a **Settings** > **API**
2. Copia estos dos valores:
   - **Project URL** (ejemplo: https://xxxxx.supabase.co)
   - **anon public** key (una llave larga)

3. Crea un archivo `.env` en la raíz del proyecto `/Users/jinkunchen/Therian app/kindred/`:

```env
VITE_SUPABASE_URL=tu_project_url_aqui
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

**IMPORTANTE**: Reemplaza los valores con los que copiaste de Supabase.

### 3. Configurar Base de Datos

1. En Supabase, ve a **SQL Editor**
2. Haz click en "+ New query"
3. Abre el archivo `supabase-schema.sql` de este proyecto
4. Copia TODO el contenido del archivo
5. Pégalo en el editor SQL de Supabase
6. Haz click en "Run" (botón verde en la esquina inferior derecha)
7. Deberías ver "Success. No rows returned" ✅

Esto creará:
- 5 tablas: `profiles`, `swipes`, `matches`, `messages`, `theriotypes`
- Todas las políticas de seguridad (RLS)
- Índices para mejor performance
- 21 theriotypes predefinidos

### 4. Configurar Storage para Fotos

1. En Supabase, ve a **Storage**
2. Haz click en "Create a new bucket"
3. Completa:
   - **Name**: `photos`
   - **Public bucket**: ✅ (marca esta opción)
4. Haz click en "Create bucket"

5. Configura las políticas de storage:
   - Ve a **Storage** > **Policies** (en la parte de arriba)
   - Haz click en "New Policy" para el bucket `photos`
   - Selecciona "Create a custom policy"

**Política 1: Permitir subir fotos**
```sql
CREATE POLICY "Usuarios autenticados pueden subir fotos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos');
```

**Política 2: Permitir ver fotos públicamente**
```sql
CREATE POLICY "Las fotos son públicamente visibles"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'photos');
```

### 5. Configurar Autenticación de Google (Opcional pero Recomendado)

#### 5.1 Crear Proyecto en Google Cloud Console

1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. Crea un nuevo proyecto llamado "Kindred"
3. Ve a **APIs & Services** > **OAuth consent screen**
4. Completa:
   - **User Type**: External
   - **App name**: Kindred
   - **User support email**: tu email
   - **Developer contact**: tu email
5. Guarda

#### 5.2 Crear OAuth Client ID

1. Ve a **Credentials** > **Create Credentials** > **OAuth Client ID**
2. Completa:
   - **Application type**: Web application
   - **Name**: Kindred Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (para desarrollo)
     - `https://tu-dominio.vercel.app` (cuando hagas deploy)
   - **Authorized redirect URIs**:
     - `https://xxxxx.supabase.co/auth/v1/callback` (usa tu URL de Supabase)

3. Copia:
   - **Client ID**
   - **Client Secret**

#### 5.3 Configurar en Supabase

1. En Supabase, ve a **Authentication** > **Providers**
2. Busca "Google" y haz click
3. Habilita el toggle
4. Pega tu Client ID y Client Secret de Google
5. Guarda

### 6. Habilitar Realtime para Chat

1. En Supabase, ve a **Database** > **Replication**
2. Busca la tabla `messages`
3. Habilita el toggle de "Enable Realtime" ✅

### 7. Ejecutar la Aplicación

Ahora que todo está configurado:

```bash
cd "/Users/jinkunchen/Therian app/kindred"
npm run dev
```

La app debería abrir en `http://localhost:5173`

### 8. Verificar que Todo Funciona

✅ **Prueba esto:**

1. Abre `http://localhost:5173`
2. Deberías ver la pantalla de bienvenida con el logo de Kindred
3. Haz click en "Unirme a la manada"
4. Registra una cuenta con email y contraseña
5. Completa el onboarding:
   - Ingresa nombre y edad
   - Selecciona un theriotype
   - Sube una foto (esto guardará en Supabase Storage)
   - Escribe una bio
   - Selecciona intenciones
6. Deberías llegar a la pantalla de descubrimiento

Si llegaste hasta aquí sin errores: **¡Felicidades! 🎉 La app funciona correctamente.**

## 🚀 Deploy a Producción (Vercel)

### Opción 1: Desde GitHub

1. Sube tu código a GitHub:
```bash
cd "/Users/jinkunchen/Therian app/kindred"
git init
git add .
git commit -m "Initial commit - Kindred MVP"
git branch -M main
git remote add origin <tu-repo-url>
git push -u origin main
```

2. Ve a [vercel.com](https://vercel.com)
3. Haz click en "New Project"
4. Importa tu repositorio de GitHub
5. Configura las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy!

### Opción 2: Deploy Directo

```bash
npm install -g vercel
vercel
```

Sigue las instrucciones y configura las variables de entorno cuando te las pida.

## 🐛 Solución de Problemas

### Error: "Invalid API key"
- Verifica que copiaste correctamente las keys de Supabase
- Verifica que el archivo `.env` esté en la raíz del proyecto
- Reinicia el servidor de desarrollo (`npm run dev`)

### Error al subir fotos
- Verifica que el bucket `photos` esté marcado como público
- Verifica que las políticas de storage estén creadas correctamente

### Chat no funciona en tiempo real
- Verifica que Realtime esté habilitado para la tabla `messages`
- Verifica en la consola del navegador si hay errores de WebSocket

### No aparecen perfiles para swipear
- Necesitas crear múltiples cuentas de prueba
- O pide a amigos que se registren para probar

## 📊 Siguiente Paso: Lanzamiento

Una vez que la app funcione en producción:

1. **Marketing**:
   - Post en r/therian
   - Video en TikTok explicando la app
   - Servidor de Discord para la comunidad

2. **Monitoreo**:
   - Ve a Supabase > Database > Tables para ver los usuarios registrados
   - Monitorea los matches y mensajes

3. **Feedback**:
   - Crea un canal de Discord para reportar bugs
   - Itera basándote en feedback de usuarios

## 📞 Ayuda

Si tienes problemas con la configuración, verifica:
1. Los logs del navegador (F12 > Console)
2. Los logs de Supabase (Dashboard > Logs)
3. Que todas las variables de entorno estén correctas

---

¡Buena suerte con el lanzamiento de Kindred! 🐺✨
