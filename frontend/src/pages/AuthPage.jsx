
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const distritos = [
  'DSB 01', 'DSB 02', 'DSB 03', 'DSB 04', 'DSB 05', 'DSB 06'
];

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [msg, setMsg] = useState('');
  // Campos extra para registro
  const [nombre, setNombre] = useState('');
  const [distrito, setDistrito] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [estado] = useState('Sonora');
  const [fechaNacimiento, setFechaNacimiento] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nombre_completo: nombre,
              distrito,
              municipio,
              estado,
              fecha_nacimiento: fechaNacimiento
            }
          }
        });
        if (error) throw error;
        setMsg('Revisa tu correo para confirmar cuenta.');
      }
    } catch (err) {
      setMsg(err.message || 'Error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Columna izquierda institucional */}
      <div className="md:w-1/2 guinda-bg text-white flex flex-col justify-center p-12">
        <h1 className="text-4xl font-bold mb-4 leading-tight">Centro de Datos de la Dirección General de Servicios de Salud Pública de Sonora</h1>
        <p className="text-lg text-red-100 opacity-90">Información para decisiones estratégicas en salud pública.</p>
      </div>
      {/* Columna derecha: login/registro */}
      <div className="md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{mode === 'login' ? 'Iniciar Sesión' : 'Solicitud de Registro'}</h2>
          <p className="text-gray-600 mb-8">{mode === 'login' ? 'Bienvenido de nuevo. Ingresa tus credenciales.' : 'Completa el formulario. Tu cuenta requerirá aprobación de un administrador.'}</p>
          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Nombre completo" required />
                <select value={distrito} onChange={e => setDistrito(e.target.value)} className="w-full border px-3 py-2 rounded" required>
                  <option value="">Selecciona un distrito</option>
                  {distritos.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <input value={municipio} onChange={e => setMunicipio(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Municipio" required />
                <input value={estado} disabled className="w-full border px-3 py-2 rounded bg-gray-100" placeholder="Estado" />
                <input value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Fecha de nacimiento" type="date" required />
              </>
            )}
            <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Correo electrónico" type="email" required />
            <input value={password} onChange={e => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Contraseña" type="password" required />
            <button className="w-full guinda-bg text-white font-bold py-3 px-4 rounded-lg guinda-hover transition duration-300 flex items-center justify-center">{mode === 'login' ? 'Iniciar Sesión' : 'Enviar Solicitud'}</button>
          </form>
          <p className="mt-4 text-sm text-gray-600">{msg}</p>
          <div className="mt-4 text-sm">
            {mode === 'login' ? (
              <span>¿No tienes cuenta? <button onClick={() => setMode('signup')} className="font-semibold guinda-text">Regístrate aquí</button></span>
            ) : (
              <span>¿Ya tienes cuenta? <button onClick={() => setMode('login')} className="font-semibold guinda-text">Inicia sesión</button></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
