import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fwusxlammxgowaxdubcm.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_Ek8CxRytusQVm-gXJH9uew_B_LtX_2w'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
