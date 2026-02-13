import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rkrbaciaknxugdpefycs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrcmJhY2lha254dWdkcGVmeWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODg1MDEsImV4cCI6MjA4NjU2NDUwMX0.UMms34Xv9bv3TLFRxin3B-uokR4wOFaVzDcBaQLE4aw'

const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
  console.log('Obteniendo swipes...\n')
  
  const { data, error } = await supabase
    .from('swipes')
    .select('*')
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log('Swipes encontrados:', data?.length || 0)
  console.log('\nDatos:')
  console.log(JSON.stringify(data, null, 2))
}

check()
