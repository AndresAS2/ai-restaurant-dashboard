import React from 'react';
import { getIntegrationStatus } from '../services/integrationStatus';

export default function IntegrationStatus() {
  const status = getIntegrationStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Integraciones</h1>
        <p className="text-sm text-gray-500">
          Estado de conexión del dashboard con los servicios del restaurante.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-5">
          <h2 className="font-medium">n8n Workflow</h2>
          <p className="mt-2 text-sm text-gray-500">
            AI Restaurant Virtual Waiter
          </p>
          <span className="mt-4 inline-block rounded-full border px-3 py-1 text-sm">
            {status.n8n.configured ? 'Conectado' : 'Pendiente configuración'}
          </span>
        </div>

        <div className="rounded-xl border p-5">
          <h2 className="font-medium">WhatsApp API</h2>
          <p className="mt-2 text-sm text-gray-500">
            Canal utilizado por el agente virtual.
          </p>
          <span className="mt-4 inline-block rounded-full border px-3 py-1 text-sm">
            Gestionado por workflow
          </span>
        </div>

        <div className="rounded-xl border p-5">
          <h2 className="font-medium">Fuente de datos</h2>
          <p className="mt-2 text-sm text-gray-500">
            Eventos enviados desde la arquitectura SaaS.
          </p>
          <span className="mt-4 inline-block rounded-full border px-3 py-1 text-sm">
            {status.source}
          </span>
        </div>
      </div>
    </div>
  );
}
