import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rkrbaciaknxugdpefycs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcmJhY2lha254dWdkcGVmeWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODg1MDEsImV4cCI6MjA4NjU2NDUwMX0.UMms34Xv9bv3TLFRxin3B-uokR4wOFaVzDcBaQLE4aw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function ver() {
  console.log('🔍 Estado actual del sistema\n')
  
  const { data: profiles } = await supabase.from('profiles').select('user_id, name')
  console.log('👥 Usuarios:', profiles?.length || 0)
  profiles?.forEach(p => console.log(`  - ${p.name}`))
  
  const { data: matches } = await supabase.from('matches').select('*')
  console.log('\n💖 Matches en BD:', matches?.length || 0)
  
  if (matches && matches.length > 0) {
    console.log('\n✅ HAY MATCHES:')
    matches.forEach(m => {
      const u1 = profiles.find(p => p.user_id === m.user_a_id)
      const u2 = profiles.find(p => p.user_id === m.user_b_id)
      console.log(`  ${u1?.name || 'Unknown'} ⟷ ${u2?.name || 'Unknown'}`)
    })
  } else {
    console.log('\n❌ NO HAY MATCHES AÚN')
    console.log('\n💡 Para crear un match:')
    console.log('  1. Abre la app en dos navegadores (normal + incógnito)')
    console.log('  2. Inicia sesión con cada usuario')
    console.log('  3. Ambos deben dar LIKE al otro')
    console.log('  4. Cuando el segundo dé like, aparecerá el modal de match')
  }
  
  console.log('\n📊 Nota: Los swipes están ocultos por RLS (normal)')
}

ver()
