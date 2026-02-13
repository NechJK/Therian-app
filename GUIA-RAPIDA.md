# 🚀 Guía Rápida - 5 Minutos para Lanzar Kindred

## Opción 1: Configuración Manual (Recomendada) ⭐

### Paso 1: Crear proyecto en Supabase (2 min)

1. Ve a **https://supabase.com** → Sign Up (gratis)
2. Click en **"New Project"**
3. Rellena:
   - **Name**: Kindred
   - **Database Password**: (inventa una y guárdala)
   - **Region**: Elige el más cercano
4. Click **"Create new project"**
5. ⏰ Espera 2-3 minutos...

### Paso 2: Copiar credenciales (30 seg)

1. En tu proyecto, ve a **Settings** (⚙️ abajo a la izquierda) → **API**
2. Copia estos 2 valores:
   - ✅ **Project URL**: `https://xxxxx.supabase.co`
   - ✅ **anon public key**: (una key muy larga)

### Paso 3: Crear archivo .env (30 seg)

1. Abre tu proyecto en el editor de código
2. Crea un archivo llamado `.env` en la carpeta `/Users/jinkunchen/Therian app/kindred/`
3. Pega esto (reemplaza con tus valores):

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

4. Guarda el archivo

### Paso 4: Crear la base de datos (1 min)

1. En Supabase, ve a **SQL Editor** (icono </>)
2. Click en **"New query"**
3. Abre el archivo `supabase-schema.sql` del proyecto
4. **Copia TODO el contenido** (Cmd+A → Cmd+C)
5. **Pégalo** en el editor SQL de Supabase (Cmd+V)
6. Click en **"Run"** (botón verde abajo a la derecha)
7. ✅ Deberías ver "Success. No rows returned"

### Paso 5: Crear bucket para fotos (1 min)

1. En Supabase, ve a **Storage** (icono 📦)
2. Click en **"Create a new bucket"**
3. Rellena:
   - **Name**: `photos`
   - ✅ Marca **"Public bucket"**
4. Click **"Create bucket"**

### Paso 6: Configurar políticas de storage (1 min)

1. En Storage, click en el bucket **"photos"**
2. Ve a la pestaña **"Policies"** (arriba)
3. Click **"New Policy"** → **"For full customization"**

**Política 1:**
```sql
CREATE POLICY "Usuarios pueden subir fotos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos');
```

**Política 2:**
```sql
CREATE POLICY "Fotos públicas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'photos');
```

### Paso 7: Habilitar Realtime para chat (30 seg)

1. Ve a **Database** → **Replication**
2. Busca la tabla **"messages"**
3. ✅ Activa el toggle

### Paso 8: Ejecutar la app 🎉

```bash
cd "/Users/jinkunchen/Therian app/kindred"
npm run dev
```

Abre **http://localhost:5173** y ¡listo! 🐺

---

## Opción 2: Script Semiautomático (Experimental)

```bash
cd "/Users/jinkunchen/Therian app/kindred"
npm run setup
```

Sigue las instrucciones en pantalla. Luego completa manualmente los pasos 4, 6 y 7 de arriba.

---

## ✅ Verificar que funciona

1. Abre http://localhost:5173
2. Click en **"Unirme a la manada"**
3. Registra una cuenta (email + contraseña)
4. Completa el onboarding:
   - Nombre y edad
   - Selecciona un theriotype (ej: Lobo 🐺)
   - Sube una foto
   - Escribe una bio
   - Selecciona qué buscas (Amistad, Romance, etc)
5. **¡Deberías llegar a la pantalla de descubrimiento!** ✨

Si llegaste aquí sin errores, **¡todo funciona!** 🎉

---

## 🐛 Problemas comunes

### Error: "Invalid API key"
- ✅ Verifica que copiaste bien las credenciales en el `.env`
- ✅ Reinicia el servidor: Ctrl+C y `npm run dev` de nuevo

### Error al subir fotos
- ✅ Verifica que el bucket `photos` sea público
- ✅ Verifica que creaste las 2 políticas de storage

### No aparecen perfiles
- ℹ️ Es normal, eres el primer usuario
- ✅ Crea otra cuenta en una ventana de incógnito para probar

### Chat no funciona en tiempo real
- ✅ Ve a Database > Replication
- ✅ Activa Realtime para la tabla "messages"

---

## 🚀 Deploy a producción (opcional)

### Opción más fácil: Vercel

1. Sube tu código a GitHub
2. Ve a **vercel.com** → Import Project
3. Conecta tu repo de GitHub
4. Agrega las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy! 🎉

Tu app estará en: `https://kindred.vercel.app`

---

## 📞 ¿Necesitas ayuda?

Si algo no funciona:

1. Revisa la **consola del navegador** (F12 → Console)
2. Revisa los **logs de Supabase** (Logs en el dashboard)
3. Verifica que el archivo `.env` esté en la carpeta correcta
4. Asegúrate de haber ejecutado TODO el `supabase-schema.sql`

---

## 🎯 Próximos pasos

Una vez que funcione:

1. **Prueba todas las funciones**:
   - Registro y login
   - Onboarding completo
   - Swipe (crea múltiples cuentas para probar)
   - Chat en tiempo real

2. **Invita a amigos** de la comunidad therian para probar

3. **Lanza en redes**:
   - Post en r/therian
   - Video en TikTok
   - Discord de la comunidad

---

¡Buena suerte con el lanzamiento! 🐺✨

**Hecho con 🖤 para la comunidad therian**
