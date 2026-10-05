import { createClient } from '@supabase/supabase-js';

const PRODUCTION_SUPABASE_URL = 'https://aqxgvlygrhdssxjmjxqb.supabase.co';
const PRODUCTION_SUPABASE_KEY = 'sb_publishable_fMMgeI0zelagfD8jzcS0aA_v5hCFI5-';

const configuredUrl = import.meta.env.VITE_SUPABASE_URL;
const configuredKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isProductionProject = typeof configuredUrl === 'string'
  && configuredUrl.includes('aqxgvlygrhdssxjmjxqb.supabase.co');

const supabaseUrl = isProductionProject ? configuredUrl : PRODUCTION_SUPABASE_URL;
const supabaseKey = isProductionProject && configuredKey
  ? configuredKey
  : PRODUCTION_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
