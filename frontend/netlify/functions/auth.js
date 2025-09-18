import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    // Login con Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (authError) throw authError;

    // Buscar perfil asociado en profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('nombre_completo, email, distrito, municipio, estado, fecha_nacimiento, rol, aprobado')
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;
    
// Dentro de handler en netlify/functions/auth.js
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: authData.user.id,
        email: authData.user.email,
        access_token: authData.session.access_token, // 👈 se devuelve aquí
        nombre_completo: profile.nombre_completo,
        distrito: profile.distrito,
        municipio: profile.municipio,
        estado: profile.estado,
        fecha_nacimiento: profile.fecha_nacimiento,
        rol: profile.rol,
        aprobado: profile.aprobado
      })
    };
  } catch (err) {
    return { statusCode: 401, body: JSON.stringify({ error: err.message }) };
  }
}
