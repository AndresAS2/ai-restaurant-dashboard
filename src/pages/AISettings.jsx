import { useState } from 'react';

export default function AISettings() {
  const [settings, setSettings] = useState({
    personality: '',
    salesInstructions: '',
    tone: '',
    initialMessage: ''
  });

  const updateField = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Configuración IA</h1>
      <p className="text-gray-600">
        Configura cómo debe comunicarse el asistente del restaurante.
      </p>

      <textarea className="w-full border rounded p-3" placeholder="Personalidad del asistente" value={settings.personality} onChange={(e) => updateField('personality', e.target.value)} />
      <textarea className="w-full border rounded p-3" placeholder="Instrucciones de venta" value={settings.salesInstructions} onChange={(e) => updateField('salesInstructions', e.target.value)} />
      <textarea className="w-full border rounded p-3" placeholder="Tono de conversación" value={settings.tone} onChange={(e) => updateField('tone', e.target.value)} />
      <textarea className="w-full border rounded p-3" placeholder="Mensaje inicial" value={settings.initialMessage} onChange={(e) => updateField('initialMessage', e.target.value)} />
    </div>
  );
}
