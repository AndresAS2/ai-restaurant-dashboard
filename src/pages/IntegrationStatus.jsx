import React from 'react';

export default function IntegrationStatus() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Integraciones</h1>
        <p className="text-sm text-gray-500">
          Estado de conexión del dashboard con servicios externos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-5">
          <h2 className="font-medium">n8n</h2>
          <p className="mt-2 text-sm text-gray-500">
            Preparado para conectar el workflow de automatización del restaurante.
          </p>
          <span className="mt-4 inline-block rounded-full border px-3 py-1 text-sm">
            Configuración pendiente
          </span>
        </div>

        <div className="rounded-xl border p-5">
          <h2 className="font-medium">WhatsApp API</h2>
          <p className="mt-2 text-sm text-gray-500">
            El dashboard mostrará el estado recibido desde el sistema externo.
          </p>
          <span className="mt-4 inline-block rounded-full border px-3 py-1 text-sm">
            Pendiente conexión
          </span>
        </div>
      </div>
    </div>
  );
}
