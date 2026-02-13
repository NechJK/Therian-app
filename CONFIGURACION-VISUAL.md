# 📸 Guía Visual de Configuración

Esta guía te muestra exactamente dónde hacer click en Supabase.

---

## 🎯 Paso 1: Crear Proyecto Supabase

### 1.1 Ir a Supabase
```
🔗 https://supabase.com
```
- Click en **"Start your project"** o **"Sign In"**
- Crea cuenta con GitHub o email

### 1.2 Crear nuevo proyecto
```
Dashboard → Click en "New Project"
```

Rellena el formulario:
```
┌─────────────────────────────────────┐
│ Organization: Tu organización       │
│ Name: Kindred                       │
│ Database Password: ●●●●●●●●●●       │  ← GUÁRDALA
│ Region: South America (São Paulo)   │  ← O el más cercano
│ Pricing Plan: Free                  │
└─────────────────────────────────────┘
         [Create new project]
```

⏰ **Espera 2-3 minutos** mientras se crea...

---

## 🔑 Paso 2: Copiar Credenciales

### 2.1 Ir a Settings
```
Dashboard de tu proyecto
└─ Sidebar izquierdo
   └─ ⚙️ Settings (abajo)
      └─ API
```

### 2.2 Copiar las 2 credenciales importantes

**Project URL:**
```
┌────────────────────────────────────────────┐
│ Project URL                                │
│ https://abcdefghijklmnop.supabase.co      │  ← COPIAR ESTO
│ [Copy]                                     │
└────────────────────────────────────────────┘
```

**Anon Key (la key pública):**
```
┌────────────────────────────────────────────┐
│ Project API keys                           │
│                                            │
│ anon public                                │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  │  ← COPIAR ESTO
│ [Copy]                                     │
│                                            │
│ service_role secret ⚠️                     │  ← NO USES ESTA
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  │
└────────────────────────────────────────────┘
```

### 2.3 Crear archivo .env

Crea este archivo en la raíz del proyecto:
```
/Users/jinkunchen/Therian app/kindred/.env
```

Contenido:
```env
VITE_SUPABASE_URL=https://tuproyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ IMPORTANTE: Reemplaza con TUS valores copiados**

---

## 🗄️ Paso 3: Crear Base de Datos

### 3.1 Ir al SQL Editor
```
Dashboard
└─ Sidebar izquierdo
   └─ </> SQL Editor
      └─ [+ New query]
```

### 3.2 Ejecutar el schema

1. **Abrir el archivo** `supabase-schema.sql` del proyecto
2. **Seleccionar todo** (Cmd+A en Mac / Ctrl+A en Windows)
3. **Copiar** (Cmd+C / Ctrl+C)
4. **Pegar** en el SQL Editor de Supabase (Cmd+V / Ctrl+V)
5. **Ejecutar** (Click en el botón verde "Run" abajo a la derecha)

Deberías ver:
```
┌────────────────────────────────────┐
│ ✓ Success. No rows returned       │
└────────────────────────────────────┘
```

### 3.3 Verificar que se crearon las tablas

```
Dashboard
└─ Table Editor
   └─ Deberías ver estas tablas:
      ✓ profiles
      ✓ swipes
      ✓ matches
      ✓ messages
      ✓ theriotypes
```

---

## 📦 Paso 4: Configurar Storage

### 4.1 Crear bucket
```
Dashboard
└─ Sidebar izquierdo
   └─ 📦 Storage
      └─ [Create a new bucket]
```

Formulario:
```
┌─────────────────────────────────────┐
│ Name of bucket: photos              │
│ ✓ Public bucket                     │  ← IMPORTANTE: Activar
│ File size limit: 5 MB               │
│ Allowed MIME types: image/*         │
└─────────────────────────────────────┘
         [Create bucket]
```

### 4.2 Configurar políticas del bucket

```
Storage
└─ Click en "photos"
   └─ Pestaña "Policies" (arriba)
      └─ [New Policy]
         └─ [For full customization]
```

**Crear 2 políticas:**

#### Política 1: INSERT (subir fotos)
```
Policy name: Usuarios pueden subir fotos
Allowed operation: INSERT
Target roles: authenticated

Policy definition:
┌─────────────────────────────────────────────┐
│ WITH CHECK (bucket_id = 'photos')           │
└─────────────────────────────────────────────┘
```

Click **[Review]** → **[Save policy]**

#### Política 2: SELECT (ver fotos)
```
Policy name: Fotos públicas
Allowed operation: SELECT
Target roles: public

Policy definition:
┌─────────────────────────────────────────────┐
│ USING (bucket_id = 'photos')                │
└─────────────────────────────────────────────┘
```

Click **[Review]** → **[Save policy]**

---

## 💬 Paso 5: Habilitar Realtime

### 5.1 Ir a Replication
```
Dashboard
└─ Database
   └─ Replication
      └─ Buscar tabla "messages"
```

### 5.2 Activar Realtime
```
┌─────────────────────────────────────────────┐
│ Source: 1   Schema: public                  │
│                                             │
│ Table         Realtime                      │
│ ─────────────────────────────────────────── │
│ profiles      ○ OFF                         │
│ swipes        ○ OFF                         │
│ matches       ○ OFF                         │
│ messages      ● ON  ← ACTIVAR ESTE         │
│ theriotypes   ○ OFF                         │
└─────────────────────────────────────────────┘
```

**Activa el toggle de "messages"** para que quede en ON (azul)

---

## ✅ Paso 6: Verificar Todo

### Checklist final:

- [ ] ✅ Proyecto Supabase creado
- [ ] ✅ Archivo `.env` creado con credenciales correctas
- [ ] ✅ SQL ejecutado (5 tablas creadas)
- [ ] ✅ Bucket "photos" creado y público
- [ ] ✅ 2 políticas de storage creadas
- [ ] ✅ Realtime habilitado para "messages"

---

## 🚀 Paso 7: Ejecutar la App

Abre tu terminal y ejecuta:

```bash
cd "/Users/jinkunchen/Therian app/kindred"
npm run dev
```

Deberías ver:
```
  VITE v7.3.1  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Abre tu navegador en:** `http://localhost:5173`

---

## 🎉 ¡Funciona!

Si ves la pantalla de bienvenida de Kindred con el logo del lobo 🐺, ¡todo está bien!

### Prueba el flujo completo:

1. **Click en "Unirme a la manada"**
2. **Registrar cuenta** (email + contraseña)
3. **Completar onboarding:**
   - Nombre: Tu nombre
   - Edad: 18-45
   - Theriotype: Selecciona uno (ej: Lobo 🐺)
   - Foto: Sube una foto
   - Bio: Escribe algo sobre ti
   - Intenciones: Marca lo que buscas
4. **Llegar a pantalla de descubrimiento** ✅

---

## 🐛 Solución de Problemas

### Error: "Invalid API key"
```
Problema: Las credenciales en .env están mal
Solución:
1. Verifica que copiaste bien las keys
2. Verifica que no hay espacios extras
3. Reinicia el servidor (Ctrl+C y npm run dev)
```

### Error: "Failed to fetch"
```
Problema: Supabase no responde
Solución:
1. Verifica que tu proyecto esté activo en Supabase
2. Verifica tu conexión a internet
3. Verifica que la URL en .env sea correcta
```

### Error al subir fotos: "new row violates row-level security"
```
Problema: Políticas de storage mal configuradas
Solución:
1. Ve a Storage > photos > Policies
2. Verifica que existan las 2 políticas
3. Verifica que el bucket sea público
```

### Chat no actualiza en tiempo real
```
Problema: Realtime no está habilitado
Solución:
1. Ve a Database > Replication
2. Activa el toggle de la tabla "messages"
```

---

## 📞 Ayuda Extra

Si después de seguir todos los pasos algo no funciona:

1. **Revisa la consola del navegador:**
   - F12 → Pestaña "Console"
   - Busca mensajes de error en rojo

2. **Revisa los logs de Supabase:**
   - Dashboard → Logs
   - Busca errores recientes

3. **Verifica el archivo .env:**
   ```bash
   cat "/Users/jinkunchen/Therian app/kindred/.env"
   ```
   Debe mostrar tus credenciales correctamente

4. **Verifica que todas las tablas existen:**
   - Dashboard → Table Editor
   - Deberías ver: profiles, swipes, matches, messages, theriotypes

---

¡Buena suerte! 🐺✨
