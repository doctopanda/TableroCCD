import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    // Login con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) throw authError;

    // Traer rol desde la tabla users
    const { data: userRole, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (roleError) throw roleError;

    // Devolver usuario con rol
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: authData.user.id,
        email: authData.user.email,
        role: userRole.role
      })
    };
  } catch (err) {
    return { statusCode: 401, body: JSON.stringify({ error: err.message }) };
  }
}
