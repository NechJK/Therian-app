import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rkrbaciaknxugdpefycs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcmJhY2lha254dWdkcGVmeWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODg1MDEsImV4cCI6MjA4NjU2NDUwMX0.UMms34Xv9bv3TLFRxin3B-uokR4wOFaVzDcBaQLE4aw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testMatches() {
  console.log('🔍 Verificando sistema de matches...\n')
  
  // 1. Ver swipes
  const { data: swipes, error: swipesError } = await supabase
    .from('swipes')
    .select('*')
  
  console.log('📊 Swipes totales:', swipes?.length || 0)
  if (swipes && swipes.length > 0) {
    console.log('Últimos 5 swipes:')
    swipes.slice(-5).forEach(s => {
      console.log(`  - Usuario ${s.swiper_id.substring(0, 8)} → ${s.direction} → Usuario ${s.swiped_id.substring(0, 8)}`)
    })
  }
  
  // 2. Ver matches
  const { data: matches, error: matchesError } = await supabase
    .from('matches')
    .select('*')
  
  console.log('\n💖 Matches totales:', matches?.length || 0)
  if (matches && matches.length > 0) {
    matches.forEach(m => {
      console.log(`  - Match entre ${m.user_a_id.substring(0, 8)} y ${m.user_b_id.substring(0, 8)}`)
    })
  }
  
  // 3. Ver perfiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('user_id, name')
  
  console.log('\n👥 Perfiles totales:', profiles?.length || 0)
  if (profiles) {
    profiles.forEach(p => {
      console.log(`  - ${p.name} (${p.user_id.substring(0, 8)})`)
    })
  }
  
  console.log('\n')
}

testMatches()
