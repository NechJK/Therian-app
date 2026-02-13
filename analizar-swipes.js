import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rkrbaciaknxugdpefycs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcmJhY2lha254dWdkcGVmeWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODg1MDEsImV4cCI6MjA4NjU2NDUwMX0.UMms34Xv9bv3TLFRxin3B-uokR4wOFaVzDcBaQLE4aw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function analizar() {
  // Obtener perfiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('user_id, name')
  
  console.log('👥 USUARIOS:\n')
  profiles.forEach(p => {
    console.log(`${p.name}: ${p.user_id}`)
  })
  
  // Obtener swipes
  const { data: swipes } = await supabase
    .from('swipes')
    .select('*')
    .order('created_at', { ascending: true })
  
  console.log('\n📊 SWIPES:\n')
  swipes.forEach(s => {
    const swiper = profiles.find(p => p.user_id === s.swiper_id)
    const swiped = profiles.find(p => p.user_id === s.swiped_id)
    console.log(`${swiper?.name || 'Unknown'} → ${s.direction} → ${swiped?.name || 'Unknown'}`)
  })
  
  // Buscar matches potenciales
  console.log('\n💖 ANÁLISIS DE MATCHES:\n')
  
  for (let i = 0; i < swipes.length; i++) {
    const swipe1 = swipes[i]
    if (swipe1.direction !== 'like') continue
    
    // Buscar swipe recíproco
    const reciproco = swipes.find(s => 
      s.swiper_id === swipe1.swiped_id && 
      s.swiped_id === swipe1.swiper_id &&
      s.direction === 'like'
    )
    
    if (reciproco) {
      const user1 = profiles.find(p => p.user_id === swipe1.swiper_id)
      const user2 = profiles.find(p => p.user_id === swipe1.swiped_id)
      console.log(`✅ MATCH encontrado: ${user1?.name} ⟷ ${user2?.name}`)
    }
  }
  
  // Verificar matches en la BD
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
  
  console.log(`\n🎯 Matches en la base de datos: ${matches?.length || 0}`)
}

analizar()
