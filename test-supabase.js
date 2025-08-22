// Quick test to verify Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lgddiqnuapkrowxekxxx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZGRpcW51YXBrcm93eGVreHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTY2MTAsImV4cCI6MjA2Njg3MjYxMH0.zPmePQUXagXLg_xpcEHf2RS_k3gvdbhX6d93aia1FMs'

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key (first 50 chars):', supabaseKey.substring(0, 50) + '...')

const supabase = createClient(supabaseUrl, supabaseKey)

// Test the connection
async function testConnection() {
  try {
    console.log('\n1. Testing basic connection...')
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      
      if (error.message.includes('relation "public.users" does not exist')) {
        console.log('\n🔧 The database schema needs to be set up!')
        console.log('📋 Please run the schema.sql file in your Supabase dashboard')
        console.log('   1. Go to https://app.supabase.com')
        console.log('   2. Open SQL Editor')  
        console.log('   3. Copy and paste the contents of schema.sql')
        console.log('   4. Click Run')
      }
    } else {
      console.log('✅ Connection successful!')
      console.log('📊 Users table exists and is accessible')
    }
    
    console.log('\n2. Testing auth...')
    const { data: authData } = await supabase.auth.getSession()
    console.log('🔐 Auth client initialized:', authData ? 'Yes' : 'No')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testConnection()
