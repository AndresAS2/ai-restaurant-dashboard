import { useState } from 'react';
import { supabase } from '../services/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    await supabase.auth.signInWithPassword({ email, password });
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="space-y-4 p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold">AI Restaurant</h1>
        <input className="border p-2 w-full" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
        <input className="border p-2 w-full" type="password" placeholder="Contraseña" onChange={(e)=>setPassword(e.target.value)} />
        <button className="bg-black text-white px-4 py-2 rounded">Ingresar</button>
      </form>
    </main>
  );
}
