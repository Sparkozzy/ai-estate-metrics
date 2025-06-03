
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ghayhpwthdbmnpsptcnb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYXlocHd0aGRibW5wc3B0Y25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTI3MTMsImV4cCI6MjA2MjI4ODcxM30.S2eyQXNn222n7eHMAXIzfAub8dBiWYlOSyXGFo1LIpA'

export const supabase = createClient(supabaseUrl, supabaseKey)
