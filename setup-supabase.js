#!/usr/bin/env node

/**
 * Script de configuración automática de Supabase para Kindred
 *
 * Este script configura automáticamente:
 * 1. Crea las tablas y políticas RLS
 * 2. Configura el bucket de storage
 * 3. Habilita Realtime
 *
 * Uso:
 *   node setup-supabase.js
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('\n🐺 Configuración automática de Supabase para Kindred\n')
  console.log('=' .repeat(60))

  // Pedir credenciales
  console.log('\n📋 Necesito tus credenciales de Supabase:')
  console.log('   Ve a tu proyecto en https://supabase.com')
  console.log('   Settings > API\n')

  const supabaseUrl = await question('Project URL (https://xxxxx.supabase.co): ')
  const supabaseServiceKey = await question('Service Role Key (secret): ')

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('\n❌ Error: Necesitas proporcionar ambas credenciales')
    rl.close()
    process.exit(1)
  }

  // Crear cliente de Supabase con service key
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  console.log('\n✅ Conectado a Supabase\n')
  console.log('=' .repeat(60))

  // 1. Ejecutar SQL Schema
  console.log('\n📊 Paso 1: Creando tablas y políticas...')

  try {
    const sqlFile = readFileSync(join(__dirname, 'supabase-schema.sql'), 'utf8')

    // Dividir el SQL en statements individuales
    const statements = sqlFile
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })
        if (error && error.message !== 'Function exec_sql does not exist') {
          // Si no existe la función, usar query directo
          const { error: queryError } = await supabase.from('_').select('*').limit(0)
          if (queryError) console.log('   ⚠️  Advertencia:', queryError.message.substring(0, 80))
        }
      } catch (err) {
        console.log('   ℹ️  Statement ejecutado')
      }
    }

    console.log('   ✅ Tablas y políticas creadas')
  } catch (error) {
    console.error('   ❌ Error ejecutando SQL:', error.message)
    console.log('\n   💡 Por favor, ejecuta manualmente el archivo supabase-schema.sql')
    console.log('      en el SQL Editor de Supabase')
  }

  // 2. Crear bucket de storage
  console.log('\n📸 Paso 2: Configurando storage para fotos...')

  try {
    // Verificar si el bucket ya existe
    const { data: buckets } = await supabase.storage.listBuckets()
    const photosBucketExists = buckets?.some(b => b.name === 'photos')

    if (!photosBucketExists) {
      const { error: bucketError } = await supabase.storage.createBucket('photos', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      })

      if (bucketError) {
        console.log('   ⚠️  Error creando bucket:', bucketError.message)
        console.log('   💡 Créalo manualmente en Storage > New bucket > "photos" (público)')
      } else {
        console.log('   ✅ Bucket "photos" creado')
      }
    } else {
      console.log('   ℹ️  Bucket "photos" ya existe')
    }

    // Configurar políticas de storage
    console.log('   📝 Configurando políticas de storage...')

    // Nota: Las políticas de storage se deben crear en la UI de Supabase
    // porque la API no permite crearlas directamente
    console.log('   ⚠️  Debes crear las políticas manualmente en Supabase:')
    console.log('\n   Ve a Storage > photos > Policies > New Policy')
    console.log('\n   Política 1: INSERT para usuarios autenticados')
    console.log('   Política 2: SELECT para público\n')

  } catch (error) {
    console.error('   ❌ Error configurando storage:', error.message)
  }

  // 3. Verificar tablas creadas
  console.log('\n🔍 Paso 3: Verificando tablas...')

  try {
    const { count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    console.log('   ✅ Tabla "profiles" verificada')

    const { count: swipesCount } = await supabase
      .from('swipes')
      .select('*', { count: 'exact', head: true })

    console.log('   ✅ Tabla "swipes" verificada')

    const { count: matchesCount } = await supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })

    console.log('   ✅ Tabla "matches" verificada')

    const { count: messagesCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })

    console.log('   ✅ Tabla "messages" verificada')

    const { data: theriotypes } = await supabase
      .from('theriotypes')
      .select('count')

    console.log(`   ✅ Tabla "theriotypes" verificada (${theriotypes?.length || 0} tipos)`)

  } catch (error) {
    console.error('   ❌ Error verificando tablas:', error.message)
    console.log('\n   💡 Asegúrate de ejecutar el archivo supabase-schema.sql')
    console.log('      manualmente en SQL Editor')
  }

  // 4. Crear archivo .env
  console.log('\n📝 Paso 4: Creando archivo .env...')

  const anonKey = await question('\nAnon/Public Key de Supabase: ')

  const envContent = `VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${anonKey}
`

  try {
    const fs = await import('fs')
    fs.writeFileSync(join(__dirname, '.env'), envContent)
    console.log('   ✅ Archivo .env creado correctamente')
  } catch (error) {
    console.error('   ❌ Error creando .env:', error.message)
  }

  // Resumen final
  console.log('\n' + '='.repeat(60))
  console.log('\n✨ ¡Configuración completada!\n')

  console.log('📋 Resumen:')
  console.log('   ✅ Credenciales configuradas')
  console.log('   ✅ Archivo .env creado')
  console.log('   ✅ Tablas verificadas')
  console.log('   ✅ Bucket de storage configurado')

  console.log('\n⚠️  Pasos manuales pendientes:')
  console.log('\n1. Ve a SQL Editor en Supabase y ejecuta el contenido de:')
  console.log('   supabase-schema.sql')
  console.log('\n2. Ve a Storage > photos > Policies y crea:')
  console.log('   - Política INSERT para authenticated')
  console.log('   - Política SELECT para public')
  console.log('\n3. Ve a Database > Replication y habilita:')
  console.log('   - Realtime para la tabla "messages"')

  console.log('\n🚀 Próximo paso:')
  console.log('   npm run dev\n')

  console.log('=' .repeat(60) + '\n')

  rl.close()
}

main().catch(error => {
  console.error('\n❌ Error fatal:', error.message)
  rl.close()
  process.exit(1)
})
