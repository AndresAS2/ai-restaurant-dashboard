import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getRestaurantAIContext, buildN8NPayload } from '../services/aiContext';
import { sendToN8N } from '../services/n8n';

export default function AITestChat() {
  const { restaurant } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const configured = Boolean(import.meta.env.VITE_N8N_WEBHOOK_URL);

  async function handleSend() {
    if (!configured || loading || !message.trim() || !restaurant?.id) return;

    const userMessage = message;
    setMessage('');
    setMessages((current) => [...current, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const context = await getRestaurantAIContext(restaurant.id);
      const payload = buildN8NPayload(context, userMessage);
      const response = await sendToN8N(payload);

      setMessages((current) => [
        ...current,
        { role: 'assistant', content: response?.message || 'Respuesta recibida del asistente.' }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: 'No fue posible conectar con la IA.' }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Prueba de conversación IA</h1>
      {!configured && <p className="notice" role="status">La prueba de IA está pendiente de conectar. Los módulos del dashboard funcionan directamente con Supabase.</p>}
      <div className="border rounded p-4 min-h-[300px] space-y-2">
        {messages.map((item, index) => (
          <div key={index}><strong>{item.role}:</strong> {item.content}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input aria-label="Mensaje de prueba" className="flex-1 min-w-0 border rounded p-2" disabled={!configured || loading} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escribe un mensaje de prueba" />
        <button className="px-4 py-2 bg-black text-white rounded" onClick={handleSend} disabled={!configured || loading || !message.trim()}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
