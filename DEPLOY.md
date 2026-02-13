# 🚀 Guía de Deploy - Kindred

Esta guía te llevará paso a paso para subir Kindred a GitHub y desplegarlo en Vercel.

## Paso 1: Subir a GitHub 📦

### Opción A: Usando GitHub Desktop (Más Fácil)

1. **Descarga GitHub Desktop:**
   - Ve a https://desktop.github.com
   - Descarga e instala

2. **Inicia sesión:**
   - Abre GitHub Desktop
   - File → Options → Accounts
   - Sign in con tu cuenta de GitHub

3. **Agrega el repositorio:**
   - File → Add Local Repository
   - Selecciona: `/Users/jinkunchen/Therian app/kindred`
   - Click "Add Repository"

4. **Publica en GitHub:**
   - Click en "Publish repository" (arriba a la derecha)
   - Nombre: `kindred-app`
   - Descripción: "Kindred - Therian Connect PWA"
   - ✅ Marca "Keep this code private" (si quieres que sea privado)
   - Click "Publish Repository"

5. **¡Listo!** Tu código ya está en GitHub 🎉

---

### Opción B: Usando Terminal

Si prefieres usar comandos, ejecuta esto en tu terminal:

```bash
# 1. Ve a GitHub.com y crea un nuevo repositorio llamado "kindred-app"
# (NO inicialices con README, .gitignore, ni license)

# 2. Ejecuta estos comandos:
cd "/Users/jinkunchen/Therian app/kindred"

# Configurar tu usuario de git (si no lo has hecho)
git config --global user.name "Tu Nombre"
git config --global user.email "tuemail@ejemplo.com"

# Conectar con tu repositorio de GitHub
git remote add origin https://github.com/TU-USUARIO/kindred-app.git

# Subir el código
git branch -M main
git push -u origin main
```

**Nota:** Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub.

---

## Paso 2: Deploy en Vercel 🌐

Vercel es **gratis** y perfecto para apps React. Se conecta directamente con GitHub.

### 2.1 Crear cuenta en Vercel

1. Ve a https://vercel.com
2. Click en "Sign Up"
3. Selecciona "Continue with GitHub"
4. Autoriza Vercel

### 2.2 Importar proyecto

1. En el dashboard de Vercel, click en **"Add New..."** → **"Project"**
2. Busca tu repositorio **"kindred-app"**
3. Click en **"Import"**

### 2.3 Configurar variables de entorno

**MUY IMPORTANTE:** Antes de hacer deploy, agrega las variables de entorno:

1. En la página de configuración del proyecto, busca **"Environment Variables"**
2. Agrega estas 2 variables:

```
VITE_SUPABASE_URL = https://rkrbaciaknxugdpefycs.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcmJhY2lha254dWdkcGVmeWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODg1MDEsImV4cCI6MjA4NjU2NDUwMX0.UMms34Xv9bv3TLFRxin3B-uokR4wOFaVzDcBaQLE4aw
```

3. Click en **"Add"** para cada una

### 2.4 Deploy

1. Deja las configuraciones por defecto (Vercel las detecta automáticamente):
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. Click en **"Deploy"**

3. ⏰ Espera 2-3 minutos...

4. **¡Listo!** Tu app estará en: `https://kindred-app.vercel.app` 🎉

---

## Paso 3: Actualizar Supabase con la URL de producción

Una vez que tengas la URL de Vercel, actualiza Supabase:

1. Ve a tu proyecto en Supabase
2. **Authentication** → **URL Configuration**
3. Agrega tu URL de Vercel a:
   - **Site URL:** `https://kindred-app.vercel.app`
   - **Redirect URLs:** `https://kindred-app.vercel.app/**`

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas cambios en el código:

### Usando GitHub Desktop:
1. Abre GitHub Desktop
2. Escribe un mensaje describiendo los cambios
3. Click "Commit to main"
4. Click "Push origin"
5. **Vercel desplegará automáticamente** 🎉

### Usando Terminal:
```bash
cd "/Users/jinkunchen/Therian app/kindred"
git add .
git commit -m "Descripción de tus cambios"
git push
```

Vercel detecta los cambios y redespliega automáticamente en 1-2 minutos.

---

## 📊 Monitorear tu app

### En Vercel:
- **Analytics:** Ver visitas, usuarios, rendimiento
- **Logs:** Ver errores en producción
- **Deployments:** Ver historial de deploys

### En Supabase:
- **Database:** Ver usuarios registrados, matches, mensajes
- **Logs:** Ver actividad de la base de datos
- **Auth:** Ver usuarios autenticados

---

## 🐛 Solución de Problemas

### Error: "Build failed"
- Verifica que las variables de entorno estén correctas
- Revisa los logs del build en Vercel

### Error: "Can't connect to Supabase"
- Verifica que las variables de entorno estén configuradas
- Verifica que Supabase esté activo

### La app no carga correctamente
- Abre la consola del navegador (F12 → Console)
- Revisa los errores
- Verifica que la URL de Supabase sea correcta

---

## 🎯 Checklist Final

Antes de compartir tu app, verifica:

- [ ] ✅ App desplegada en Vercel
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ URL de Vercel agregada a Supabase
- [ ] ✅ Puedes registrarte en la versión en vivo
- [ ] ✅ El onboarding funciona
- [ ] ✅ Puedes subir fotos
- [ ] ✅ El swipe funciona
- [ ] ✅ Los matches se crean correctamente
- [ ] ✅ El chat funciona en tiempo real

---

## 🚀 ¡A Lanzar!

Una vez que todo funcione:

1. **Comparte la URL** en redes sociales
2. **Post en r/therian** con el link
3. **Video en TikTok** mostrando la app
4. **Servidor de Discord** para feedback

---

**URLs importantes:**
- Tu app: `https://kindred-app.vercel.app` (será diferente)
- GitHub: `https://github.com/TU-USUARIO/kindred-app`
- Vercel Dashboard: `https://vercel.com/dashboard`
- Supabase Dashboard: `https://supabase.com/dashboard`

---

¡Buena suerte con el lanzamiento! 🐺✨
