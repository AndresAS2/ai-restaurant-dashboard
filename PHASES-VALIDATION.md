# Fases de profesionalización y validación
Fecha: 29 de septiembre de 2026 (Bogotá). Rama: dashboard-bot-integration.

## Resultado por fase
1. Navegación: sidebar con grupos Operación/Tu restaurante, estados activos, menú móvil accesible y todos los módulos conservados.
2. Pedidos: estados amarillo/verde/azul/morado/negro/rojo, hora, tiempo transcurrido, entrega y cliente. No se modificó la lógica de cambios de estado.
3. Filtros: botones Todos/Reales/Pruebas, búsqueda por cliente/teléfono/referencia y filtro de estado.
4. Clientes: identificación legible de sesiones sin nombre, teléfonos válidos, referencia individual y aviso de teléfono compartido. No se fusionan personas por nombre ni se elimina historial. Revisión de datos: 74 registros, 73 identificadores que no son teléfonos válidos, 32 nombres genéricos, ningún grupo con teléfono válido exactamente duplicado. Son datos históricos de pruebas, no 73 números dañados.
5. Conversaciones: bandeja CRM, previsualizaciones, burbujas entrantes/salientes y navegación lista/conversación en móvil. Se muestran intención y latencia solo si existen; no se inventan tiempos.
6. Rendimiento: carga de pantallas bajo demanda, índices de actividad de clientes y agrupación de conversaciones memorizada. Consultas de actualización automática simultáneas comparten la petición; tras guardar se fuerza una lectura nueva para no reutilizar datos anteriores al guardado. Archivo inicial JS: 527,10 → 491,67 kB (143,39 kB gzip). No hay aviso de fragmentos >500 kB.
7. n8n: se amplió únicamente Fast Chat Intent. Pagos, Nequi, precios y menú usan datos del restaurante sin llamadas al modelo cuando la pregunta es simple. Pedidos y mensajes mixtos mantienen el flujo completo. Contexto del modelo, memoria, consultas tenant, guardas y conexiones conservados. El catálogo ya se carga en una consulta conjunta: no se añadieron consultas ni caché de precios.
8. Validación: compilación correcta, 6 pruebas unitarias y 15 pruebas de navegador aprobadas. Pruebas manuales reales del workflow completadas.

## Mediciones reales del chat de prueba
Las duraciones son observaciones individuales de n8n, no garantías ni tiempos de entrega en WhatsApp.

| Consulta | Ejecución | Duración | Llamadas IA |
|---|---|---:|---:|
| Métodos de pago, antes | 129 | 4,195 s | 2; 1.952 tokens |
| Métodos de pago, después | 131 | 2,700 s | 0; 0 tokens |
| Precio de hamburguesa | 132 | 2,674 s | 0; 0 tokens |
| Menú | 133 | 2,788 s | 0; 0 tokens |
| Pedido de hamburguesa | 134 | 3,829 s | Flujo completo con clasificador |
| Nequi | 135 | 2,814 s | 0; 0 tokens |

Todas terminaron correctamente y recorrieron Save Chat Interaction. El pedido quedó como borrador de prueba solicitando datos, sin confirmación ni envío a cocina. Las pruebas locales cubren “sí está bien”, cancelación, total de borrador, información faltante, productos retirados y frases mixtas que no deben saltarse el flujo avanzado. No se ejecutó una compra real ni se revalidó de extremo a extremo la confirmación de WhatsApp.

Workflow: xQQohsOmooxDCDxB. Versión anterior: c2bdc5ae-6230-45de-9691-9c1790ad0bcd. Versión editada: fe2f97e1-5b0f-4063-bdcc-c91f0ae263fe. Sigue inactivo; no se publicó ni activó. Para revertir esta optimización, recuperar Fast Chat Intent de la versión anterior en el historial n8n. El archivo n8n/fast-chat-intent.js contiene el código aplicado y tests/fast-chat.test.js sus pruebas sin datos privados.

## Errores y limitaciones encontrados
- Las preguntas con signos españoles y pagos recorrían dos modelos innecesariamente. Corregido con coincidencias acotadas; mensajes complejos siguen usando IA.
- Identificadores de sesiones se mostraban como teléfonos y nombres genéricos no distinguían contactos. Se mejoró la presentación sin cambiar registros.
- El listado de clientes repetía búsquedas por cada registro; ahora se indexa una vez.
- La carga inicial incluía todas las pantallas; ahora se divide por ruta.
- La reutilización de peticiones no debe devolver una lectura anterior al guardado. Se separó actualización automática de actualización forzada.
- n8n conserva seis nodos desconectados preexistentes (Wait 2 Hours, Admin Preview Input, Stored Order?, SaaS Restaurant Registry Lookup MVP, SaaS Tenant Context Mapper, Supabase Menu Products PostgreSQL). No participan en estas ejecuciones y eliminarlos no reduciría su latencia. Se conservaron.
- Las pruebas de navegador usan Supabase simulado para verificar formularios y estados sin alterar pedidos reales. Las comprobaciones autenticadas reales del dashboard están descritas en DASHBOARD-VALIDATION.md.

## Archivos afectados
- src/layouts/DashboardLayout.jsx, src/styles/index.css: navegación y aspecto.
- src/components/OrderStatus.jsx, src/components/SegmentedControl.jsx, src/pages/Orders.jsx, src/services/format.js: pedidos, filtros y fechas.
- src/pages/Customers.jsx, src/services/customers.js, src/services/customerIdentity.js: identidad y actividad.
- src/pages/Conversations.jsx: CRM.
- src/App.jsx, src/hooks/useResource.js: carga y actualizaciones.
- tests/metrics.test.js, tests/browser/dashboard.spec.js, tests/fast-chat.test.js, package.json: verificación.
- n8n/fast-chat-intent.js: única modificación del workflow.
- README.md, DASHBOARD-VALIDATION.md y este documento: alcance y resultados.

## Pendientes fuera de estas fases
- Publicar el dashboard con redirección de rutas y configuración pública de Supabase.
- Habilitar y comprobar Realtime en Supabase si se desea; sigue la actualización cada 15 segundos.
- Conectar Prueba IA mediante un endpoint autenticado que valide al restaurante en servidor. No exponer una credencial administrativa o confiar en restaurant_id enviado por navegador.
- Fidelización y administración SaaS global siguen identificados como pendientes; conservar el enlace no equivale a implementarlos.
- Registrar response_time_ms desde el backend para disponer de latencias nuevas en CRM.
- Confirmar consumo de FAQ/perfil adicional por el bot y validar WhatsApp antes de activarlo en producción.

No se crearon tablas, no se cambiaron políticas y no se publicaron servicios.

