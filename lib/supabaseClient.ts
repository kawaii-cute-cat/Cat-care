import { supabase } from '@/lib/supabaseClient'

async function loadData() {
  const { data, error } = await supabase
    .from('your_table')
    .select('*')
  if (error) console.error(error)
  else console.log(data)
}
