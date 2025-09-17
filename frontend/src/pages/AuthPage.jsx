import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AuthPage(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      if(mode === 'login'){
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if(error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if(error) throw error;
        setMsg('Revisa tu correo para confirmar cuenta.');
      }
    } catch (err){
      setMsg(err.message || 'Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-gobVino mb-4">{mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
        <form onSubmit={submit} className="space-y-4">
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Correo" type="email" required />
          <input value={password} onChange={e => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="Contraseña" type="password" required />
          <button className="w-full bg-gobVino text-white py-2 rounded">{mode === 'login' ? 'Entrar' : 'Crear'}</button>
        </form>
        <p className="mt-4 text-sm text-gray-600">{msg}</p>
        <div className="mt-4 text-sm">
          {mode === 'login' ? (
            <span>¿No tienes cuenta? <button onClick={() => setMode('signup')} className="font-semibold text-gobVino">Regístrate</button></span>
          ) : (
            <span>¿Ya tienes cuenta? <button onClick={() => setMode('login')} className="font-semibold text-gobVino">Inicia sesión</button></span>
          )}
        </div>
      </div>
    </div>
  );
}
