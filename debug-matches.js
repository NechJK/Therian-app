import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rkrbaciaknxugdpefycs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcmJhY2lha254dWdkcGVmeWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODg1MDEsImV4cCI6MjA4NjU2NDUwMX0.UMms34Xv9bv3TLFRxin3B-uokR4wOFaVzDcBaQLE4aw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debug() {
  console.log('🔍 Analizando swipes para encontrar matches...\n')
  
  // IDs visibles en la imagen
  const users = {
    'a2de1803-8bed-461d-a2a5-881a1f': 'Usuario A',
    '987f6f3c-00a6-4bfe-8f0d-39809f': 'Usuario B',
    '35d8ad38-9cdb-40b5-8fc7-fcae5': 'Usuario C',
    '8ede6a97-2bbf-4fe5-addd-c880c': 'Usuario D'
  }
  
  // Simular swipes visibles en la imagen (solo los primeros caracteres)
  const swipesVisibles = [
    { swiper: 'a2de1803', swiped: '987f6f3c', dir: 'like' },
    { swiper: '35d8ad38', swiped: '987f6f3c', dir: 'like' },
    { swiper: 'a2de1803', swiped: '35d8ad38', dir: 'like' },
    { swiper: '35d8ad38', swiped: 'a2de1803', dir: 'nope' },
    { swiper: 'a2de1803', swiped: '987f6f3c', dir: 'like' },
    { swiper: '8ede6a97', swiped: 'a2de1803', dir: 'like' },
    { swiper: '8ede6a97', swiped: '987f6f3c', dir: 'like' },
    { swiper: '987f6f3c', swiped: 'a2de1803', dir: 'like' },
    { swiper: '35d8ad38', swiped: '8ede6a97', dir: 'like' }
  ]
  
  console.log('📊 Swipes detectados:')
  swipesVisibles.forEach(s => {
    console.log(`  ${s.swiper.substring(0, 8)} → ${s.dir} → ${s.swiped.substring(0, 8)}`)
  })
  
  console.log('\n💖 Buscando matches (likes mutuos):')
  
  for (let i = 0; i < swipesVisibles.length; i++) {
    const s1 = swipesVisibles[i]
    if (s1.dir !== 'like') continue
    
    const reciproco = swipesVisibles.find(s2 => 
      s2.swiper === s1.swiped &&
      s2.swiped === s1.swiper &&
      s2.dir === 'like'
    )
    
    if (reciproco) {
      console.log(`  ✅ MATCH: ${s1.swiper.substring(0, 8)} ⟷ ${s1.swiped.substring(0, 8)}`)
    }
  }
  
  // Ver matches reales en BD
  const { data: matches } = await supabase.from('matches').select('*')
  console.log(`\n🎯 Matches en base de datos: ${matches?.length || 0}`)
  
  if (matches && matches.length > 0) {
    matches.forEach(m => {
      console.log(`  ${m.user_a_id.substring(0, 8)} ⟷ ${m.user_b_id.substring(0, 8)}`)
    })
  }
}

debug()
