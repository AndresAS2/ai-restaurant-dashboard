# AI Restaurant Dashboard

Panel React conectado directamente a las tablas existentes de Supabase. No necesita n8n para consultar pedidos, clientes, conversaciones o menú.

## Ejecutar

1. Instalar Node.js 22.12 o posterior y ejecutar `npm ci`.
2. Copiar `.env.example` a `.env.local` y completar la clave **publishable/anon** del proyecto. Nunca usar `service_role` ni claves secretas en variables `VITE_*`.
3. Ejecutar `npm run dev` y abrir la dirección indicada.
4. Para compilar: `npm run build`. El resultado está en `dist/`.

El alojamiento debe redirigir las rutas del frontend a `index.html` para permitir recargar `/orders`, `/settings`, etc. No se ha publicado el sitio.

## Acceso

La cuenta debe existir en Supabase Authentication y tener una fila en `restaurant_users` con su `user_id` y el `restaurant_id` autorizado. Sin esta asignación, el panel muestra “Acceso pendiente”. La autorización de datos depende de las políticas RLS existentes, no de ocultar botones.

La cuenta del propietario ya está confirmada y asociada a Demo Burger AI. Se verificaron autenticación, lectura y guardado al mismo valor con sus permisos reales. Las credenciales no se guardan en este repositorio. Ver [validación funcional](DASHBOARD-VALIDATION.md) para resultados y límites.

## Módulos

- Inicio: métricas de pedidos, clientes y mensajes. Ventas del día incluye pedidos **creados hoy en Bogotá y ya entregados**; no equivale a fecha contable de entrega. Excluye pedidos `is_test` o estado `TEST`.
- Pedidos: detalle de productos, entrega, pago, filtros reales/prueba y actualización de estado con protección frente a cambios concurrentes.
- Conversaciones: historial entrante/saliente agrupado por cliente y canal. Busca por nombre o referencia.
- Clientes: búsqueda, edición de nombre, número de pedidos reales y consumo de pedidos entregados.
- Menú: crear/editar categorías y productos, precios, descripciones y disponibilidad.
- Configuración restaurante: nombre, logo, contacto, dirección, horarios, pagos y recursos visuales.
- Entrenamiento IA: pantalla independiente con bienvenida, personalidad, tono, reglas, promociones, FAQ e información adicional. Conserva los demás ajustes existentes.

Pedidos, clientes, conversaciones e inicio actualizan cada 15 segundos con la pestaña visible. Las pantallas muestran errores y permiten reintentar. Menú y configuración se actualizan manualmente para evitar sobrescribir formularios.

## Tablas y compatibilidad

Se reutilizan `restaurants`, `restaurant_users`, `orders`, `order_items`, `customers`, `conversation_history`, `menu_categories`, `menu_products` y `restaurant_settings`. Todas las consultas operativas filtran por restaurante, además de RLS. No se crean tablas ni se alteran políticas.

`conversation_history.customer_id` no tiene relación FK declarada: los nombres se resuelven consultando clientes del mismo restaurante. `menu_categories` no tiene `created_at`. `restaurant_settings.restaurant_id` no tiene restricción única: se actualiza la fila existente y se informa error si hay duplicados, en lugar de utilizar un upsert inválido. La creación concurrente de configuración sigue dependiendo del esquema existente y debe hacerse una sola vez por restaurante.

## Funciones conservadas fuera de esta entrega

Fidelización no tenía implementación y se identifica como pendiente. Prueba IA conserva su integración opcional y desactiva el envío cuando falta `VITE_N8N_WEBHOOK_URL`. La fase 7 optimizó y probó consultas simples en el chat n8n; no se activó WhatsApp. Los módulos `/master/*` se reservan para `app_metadata.role = master`, requieren servicios administrativos del servidor y siguen fuera del alcance de completar el panel del restaurante. Los adaptadores antiguos de eventos no se usan para calcular métricas del panel.

La profesionalización visual, los cambios de rendimiento y los resultados actuales están en [validación de fases](PHASES-VALIDATION.md).

## ADMIN del propietario

La cuenta propietaria tiene un módulo privado `/admin` con consumo real registrado y costos editables por restaurante/mes. Los servicios, tarifas IA, nombre/precio del plan y cambio USD/COP recalculan el total y margen. La autorización se verifica también en Supabase. La sincronización continua de tokens requiere configurar n8n API; se importó el histórico disponible y se preparó una plantilla portable. Ver [alcance y pruebas ADMIN](ADMIN-VALIDATION.md).

## Verificación

- `npm test`: métricas, exclusión de pruebas, estados y día local.
- `npm run test:e2e`: navegación, edición de pedidos/clientes/productos/configuración, conservación de claves, permisos, errores recuperables y diseño móvil. Usa Edge instalado; las respuestas de Supabase y la sesión son **simuladas**, sin escribir datos reales.
- `npm run build`: compilación de producción.

El esquema y las relaciones se contrastaron con Supabase real. La autenticación y las consultas de datos se probaron con la cuenta autorizada. También se comprobaron escrituras al mismo valor en restaurante, configuración, productos y clientes. Los cambios operativos de pedidos se prueban con datos simulados.
