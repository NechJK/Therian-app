import { createClient } from '@supabase/supabase-js'

// Usar service_role key para ver todo
const supabaseUrl = 'https://rkrbaciaknxugdpefycs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcmJhY2lha254dWdkcGVmeWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODg1MDEsImV4cCI6MjA4NjU2NDUwMX0.UMms34Xv9bv3TLFRxin3B-uokR4wOFaVzDcBaQLE4aw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function verificar() {
  console.log('🔍 Verificando sistema de matches...\n')
  
  // Ver perfiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('user_id, name')
  
  console.log('👥 Usuarios:')
  const userMap = {}
  profiles.forEach(p => {
    userMap[p.user_id] = p.name
    console.log(`  ${p.name}: ${p.user_id}`)
  })
  
  // Ver todos los swipes (sin RLS)
  console.log('\n📊 Intentando obtener swipes...')
  
  // Vamos a hacer una consulta SQL directa
  const { data: swipesRaw, error } = await supabase
    .rpc('get_all_swipes')
    .catch(async () => {
      // Si no existe la función, intentar select normal
      return await supabase
        .from('swipes')
        .select('*')
    })
  
  console.log('\nSwipes encontrados desde API:', swipesRaw?.length || 0)
  
  if (!swipesRaw || swipesRaw.length === 0) {
    console.log('\n⚠️  No se pueden leer swipes via API (RLS bloqueando)')
    console.log('Pero viste 2 swipes en el Table Editor de Supabase\n')
    console.log('Según la imagen:')
    console.log('  - Usuario 987f6f3c (TU pollito) → like → a2de1803 (Akira)')
    console.log('  - Usuario a2de1803 (Akira) → like → 987f6f3c (TU pollito) (?)\n')
  }
  
  // Ver matches
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
  
  console.log('💖 Matches en BD:', matches?.length || 0)
  if (matches && matches.length > 0) {
    matches.forEach(m => {
      console.log(`  ${userMap[m.user_a_id]} ⟷ ${userMap[m.user_b_id]}`)
    })
  } else {
    console.log('  (Ningún match creado aún)\n')
    console.log('🤔 Posibles razones:')
    console.log('  1. El segundo usuario aún no ha dado like')
    console.log('  2. Hubo un error al crear el match')
    console.log('  3. El código de detección de match no se ejecutó\n')
  }
}

verificar()
