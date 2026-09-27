import { useEffect, useState } from 'react';
import { getAIConfig, saveAIConfig } from '../services/aiConfig';
import { useAuth } from '../context/AuthContext';

export default function AISettings() {
  const { restaurant } = useAuth();

  const [settings, setSettings] = useState({
    personality: '',
    salesInstructions: '',
    tone: '',
    initialMessage: '',
    policies: '',
    promotions: '',
    paymentMethods: '',
    deliveryPolicy: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function load() {
      if (!restaurant?.id) return;
      const data = await getAIConfig(restaurant.id);
      if (data) setSettings(data);
    }

    load();
  }, [restaurant]);

  const updateField = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }));
  };

  async function handleSave() {
    setStatus('Guardando...');

    await saveAIConfig(restaurant.id, {
      personality: settings.personality,
      salesInstructions: settings.salesInstructions,
      tone: settings.tone,
      initialMessage: settings.initialMessage,
      policies: settings.policies,
      promotions: settings.promotions,
      paymentMethods: settings.paymentMethods,
      deliveryPolicy: settings.deliveryPolicy
    });

    setStatus('Configuración guardada');
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Configuración IA</h1>
      <p className="text-gray-600">Configura el comportamiento del mesero virtual del restaurante.</p>

      <textarea className="w-full border rounded p-3" placeholder="Personalidad del asistente" value={settings.personality || ''} onChange={(e) => updateField('personality', e.target.value)} />
      <textarea className="w-full border rounded p-3" placeholder="Instrucciones de venta" value={settings.salesInstructions || ''} onChange={(e) => updateField('salesInstructions', e.target.value)} />
      <textarea className="w-full border rounded p-3" placeholder="Tono de conversación" value={settings.tone || ''} onChange={(e) => updateField('tone', e.target.value)} />
      <textarea className="w-full border rounded p-3" placeholder="Mensaje inicial" value={settings.initialMessage || ''} onChange={(e) => updateField('initialMessage', e.target.value)} />
      <textarea className="w-full border rounded p-3" placeholder="Políticas del restaurante" value={settings.policies || ''} onChange={(e) => updateField('policies', e.target.value)} />
      <textarea className="w-full border rounded p-3" placeholder="Promociones actuales" value={settings.promotions || ''} onChange={(e) => updateField('promotions', e.target.value)} />
      <textarea className="w-full border rounded p-3" placeholder="Métodos de pago" value={settings.paymentMethods || ''} onChange={(e) => updateField('paymentMethods', e.target.value)} />
      <textarea className="w-full border rounded p-3" placeholder="Política de domicilios" value={settings.deliveryPolicy || ''} onChange={(e) => updateField('deliveryPolicy', e.target.value)} />

      <button className="px-4 py-2 rounded bg-black text-white" onClick={handleSave}>
        Guardar configuración
      </button>

      {status && <p>{status}</p>}
    </div>
  );
}
