import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
);

/**
 * Middleware para validar JWT de Supabase y rol de usuario
 * @param {Request} req 
 * @param {Function} next 
 * @param {Object} options 
 * @param {Array} options.allowedRoles - Roles permitidos ["admin", "viewer"]
 */
export async function requireRole(req, next, { allowedRoles = [] } = {}) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No token provided" }), { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verificar token con Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }

    // Consultar perfil
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("rol, aprobado")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 403 });
    }

    // Validar aprobado
    if (!profile.aprobado) {
      return new Response(JSON.stringify({ error: "User not approved" }), { status: 403 });
    }

    // Validar rol
    if (!allowedRoles.includes(profile.rol)) {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
    }

    // Si todo bien → continuar
    return next();
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
