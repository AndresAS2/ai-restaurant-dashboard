# Menú y configuración profesional — 30 de septiembre de 2026

## Entrega
Se amplió la aplicación existente, sin reconstruir arquitectura ni modificar la lógica de pedidos.
Rama: dashboard-bot-integration. Supabase: aqxgvlygrhdssxjmjxqb.
El workflow n8n continúa inactivo, igual que antes de esta fase.

### Frontend
- Menú: ingredientes, orden visual, búsqueda por nombre/descripción, categorías ordenadas y eliminación protegida.
- Importación: varias imágenes/PDF → extracción → vista previa editable → selección → confirmación → guardado transaccional.
- Configuración: descripción, logo, imagen principal, recursos del menú con orden, activación, vistas previas y enlaces existentes.
- Métodos de pago visuales: nombre, tipo, número/cuenta, instrucciones, imagen y activación.
- Se conserva el texto de pagos existente hasta configurar métodos visuales. Los campos paymentMethods y payment_methods se derivan de los métodos activos para compatibilidad con n8n.
- Se conserva la política de domicilio y el entrenamiento IA existente.

### Persistencia
Tablas reutilizadas: restaurants, restaurant_settings, menu_products, menu_categories.
Campos agregados: menu_products.ingredients (text[]), menu_products.sort_order, menu_categories.sort_order.
No se crearon tablas de aplicación.
Storage: bucket restaurant-assets; recursos públicos para clientes, escrituras/listados/borrado restringidos por pertenencia al restaurante y prefijo de carpeta. Archivos de hasta 6 MB, JPG/PNG/WebP/PDF; rutas aleatorias, sin sobrescribir recursos.
Configuración JSON: restaurant_profile.description/logo_url/hero_url; payment_options; menu_images.
RPC import_reviewed_menu: autorización, transacción, categorías reutilizadas, rechazo de duplicados por nombre y reintento idempotente por IDs del lote.
RPC delete_unused_menu_product: bloquea eliminación de productos con pedidos históricos.
SQL versionado como scripts de despliegue; migraciones remotas aplicadas: menu_assets_and_reviewed_import y preserve_menu_order_history.

### IA y workflow
Se modificaron exclusivamente Menu?, Send message2, Prepare Agent Context, Supabase Restaurant Registry PostgreSQL, Chat2 y Simple Query Reply.
- Descripciones e ingredientes reales llegan al contexto informativo.
- Menú respeta orden visual y presenta PDF como enlace, no como imagen rota.
- Ruta de pago lee métodos activos y puede presentar sus imágenes en chat; WhatsApp recibe enlaces.
- La ruta rápida permanece sin Gemini para pagos.
- Pedidos, confirmaciones y memoria sin cambios.
- El envío de imágenes/documentos nativos de WhatsApp no forma parte de esta entrega: se comparten enlaces.

## Archivos
- src/pages/Menu.jsx, src/pages/Settings.jsx.
- src/components/AssetPicker.jsx, MenuImport.jsx, PaymentEditor.jsx, MenuMediaEditor.jsx.
- src/services/menu.js, assets.js, menuValidation.js.
- supabase/menu-assets-and-import.sql, delete-unused-menu-product.sql.
- supabase/functions/extract-menu/index.ts.
- n8n/restaurant-registry-query.sql, prepare-agent-context.js, simple-query-reply.js, menu-media-reply.js.
- tests/menu-professional.test.js, tests/browser/dashboard.spec.js, package.json.
- n8n/menu-professional-node-parameters.json: parámetros de los seis nodos modificados, sin credenciales.

## Verificación
- Build de producción correcto.
- 15 pruebas unitarias aprobadas.
- 20 pruebas de navegador aprobadas (datos/Storage/Gemini simulados). Incluyen subir archivo, vista previa, revisión de precio, confirmación de importación, logo, imagen de Nequi, guardado compatible y pantalla móvil.
- Pruebas SQL reales con rol authenticated y rollback: importación, reintento sin duplicados, aislamiento entre restaurantes, políticas de Storage, bloqueo de eliminación con historial.
- Ningún producto de esas pruebas SQL quedó persistido.
- Edge Function extract-menu desplegada; solicitud HTTP real sin sesión devuelve401.
- n8n ejecución178: respondió ingredientes usando descripción real de Hamburguesa clásica.
- n8n ejecución179: respondió métodos de pago existentes mediante ruta rápida.
- No se ha probado un archivo real contra Gemini: falta confirmar configuración del secreto y realizar esa prueba autenticada.
- No se ha completado una subida binaria real con la cuenta del usuario: interfaz cubierta con mocks y políticas verificadas directamente en DB.

## Extracción: activación y límites
El usuario autorizó explícitamente el envío a Google Gemini de las imágenes/PDF seleccionados al pulsar Extraer productos.
Configurar GEMINI_API_KEY en Supabase → Edge Functions → Secrets. Nunca introducirla en frontend.
GEMINI_MENU_MODEL opcional; modelo por defecto gemini-3.5-flash-lite, coincidente con el workflow existente.
La función valida sesión y pertenencia antes de descargar archivos o invocar Gemini.
Máximo 5 archivos,6 MB por archivo y12 MB combinados por extracción; máximo 100 productos; límite de 60 segundos de espera de Gemini.
No publica productos: devuelve una propuesta editable.
Los precios ilegibles quedan vacíos yrequieren edición; los ingredientes no explícitos no se inventan.
Recomendación previa a comercializar: configurar cuotas del proveedor y medir costo por extracción; todavía no existe un cupo mensual por restaurante para OCR.

## Hallazgos
- La FK existente usa ON DELETE SET NULL: eliminar un producto habría perdido su vínculo histórico. El dashboard ahora usa RPC protegida.
- El contexto anterior omitía descripción/ingredientes; ahora usa datos reales.
- El visor de menú trataba todo como imagen; ahora diferencia PDF.
- Se conservaron las advertencias de seguridad preexistentes, sin ampliar su alcance: funciones helper SECURITY DEFINER y protección de contraseñas filtradas deshabilitada.
  - https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable
  - https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- Quitar un recurso de configuración no borra el objeto de Storage: evita romper enlaces compartidos. Falta una política de retención/limpieza de archivos sin referencias; también las cargas abandonadas pueden permanecer almacenadas.
- Las fuentes de importación se conservan en Storage; la lista de la importación actual es temporal. El historial de importaciones no está implementado.

## Siguiente prueba
1. Configurar el secreto.
2. Iniciar sesión en el dashboard.
3. Menú → Importar → subir un menú real → Extraer productos.
4. Revisar precios/ingredientes → Confirmar.
5. Consultar producto y pago en el chat de n8n.
6. Revisar también cuotas, archivos sin referencias y seguridad de Auth antes de anunciar el sistema como listo para producción comercial.
