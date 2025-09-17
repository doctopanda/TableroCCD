import React, { useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function FormCreator({ backendUrl }){
  const fileRef = useRef();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const uploadPdf = async (e) => {
    e.preventDefault();
    setMsg(''); setLoading(true);
    const file = fileRef.current.files[0];
    if(!file){ setMsg('Selecciona un PDF.'); setLoading(false); return; }
    try {
      // Get session to send access token
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      const form = new FormData();
      form.append('pdf', file);
      form.append('name', name);

      const res = await fetch(`${backendUrl}/api/upload`, {
        method: 'POST',
        body: form,
        headers: accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}
      });

      const j = await res.json();
      if(!res.ok) throw new Error(j?.error || j?.message || 'Error upload');
      setMsg('PDF subido y plantilla creada. ID: ' + j.templateId);
      setName('');
      fileRef.current.value = null;
    } catch(err){
      console.error(err);
      setMsg(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Crear Formulario</h3>
      <form onSubmit={uploadPdf} className="space-y-4">
        <input ref={fileRef} type="file" accept="application/pdf" />
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre del formulario" className="w-full border px-3 py-2 rounded" />
        <button className="bg-gobVino text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Subiendo…' : 'Subir y crear plantilla'}</button>
      </form>
      <p className="mt-3 text-sm text-gray-600">{msg}</p>
    </div>
  );
}
