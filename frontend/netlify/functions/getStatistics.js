// netlify/functions/getStatistics.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

export async function handler() {
  try {
    // Aquí agregas la lógica que antes tenías en statistics.js
    const { data: forms } = await supabase.from('forms').select('*');
    const { data: records } = await supabase.from('records').select('*');

    // Ejemplo: contar registros por tipo
    const stats = {
      totalForms: forms.length,
      totalRecords: records.length
    };

    return { statusCode: 200, body: JSON.stringify(stats) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
