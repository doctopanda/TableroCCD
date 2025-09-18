// netlify/functions/auth.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 401, body: JSON.stringify({ error: err.message }) };
  }
}
