# Cierre funcional del dashboard

## Implementado

- Inicio: identidad y contacto del restaurante, métricas provenientes de datos reales. Ventas cuentan pedidos creados hoy en Bogotá y entregados; no representan ingresos por fecha de entrega, porque no existe esa fecha en el esquema.
- Pedidos: seis estados visuales, filtro por estado y separación de pruebas. PENDING_CONFIRMATION y otros estados de espera existentes se presentan como pendientes de aprobación sin reescribir datos históricos. La actualización conserva la comparación con el estado anterior.
- Conversaciones: historial completo, cliente, teléfono/referencia, fechas e intención existente. response_time_ms se interpreta explícitamente como milisegundos; no se infiere latencia a partir de marcas de tiempo.
- Clientes: compras entregadas, gasto correspondiente, pedidos reales, última interacción e historial que identifica pedidos de prueba.
- Menú: creación/edición, categoría activa, filtros de categoría/disponibilidad, precio y descripción. No se elimina el historial asociado a productos.
- Configuración restaurante: nombre/WhatsApp en restaurants; logo, contacto, dirección y horarios en restaurant_settings.config.restaurant_profile. Pagos, política de entrega y menu_images mantienen sus claves originales.
- Entrenamiento IA: pantalla independiente con personalidad, tono, reglas, instrucciones, bienvenida, promociones, FAQ e información adicional. Cada pantalla modifica únicamente sus propias claves y conserva las demás.

## Persistencia y límites

No se crean tablas, funciones SQL ni políticas. Nombre/WhatsApp y el resto de ajustes se guardan en dos operaciones; si la segunda falla, el formulario informa expresamente del guardado parcial y permite reintentar. No hay una transacción entre ambas tablas. El JSON se actualiza mediante comparación con el valor leído para detectar cambios concurrentes durante el guardado.

Para Realtime, el frontend incluye una suscripción filtrada por restaurant_id a INSERT/UPDATE de orders y order_items, limpieza al salir y agrupación de eventos. Está deshabilitada por defecto porque no hay tablas en la publicación del proyecto. Para activarla, habilitar ambas tablas en la publicación supabase_realtime y establecer VITE_SUPABASE_REALTIME=true. Se mantiene consulta cada 15 segundos como respaldo, también para eliminaciones. La entrega real de eventos todavía no se ha verificado; no se cambiaron publicaciones ni permisos.

La fase posterior modificó únicamente las rutas rápidas del workflow y las probó en el chat de prueba; ver PHASES-VALIDATION.md. Sigue pendiente comprobar consumo de nuevos campos de perfil, FAQ e información adicional y registrar metadata.response_time_ms. Guardar entrenamiento no demuestra que todos sus campos se estén usando.

## Pruebas

- Compilación de producción correcta; la carga por rutas eliminó el aviso de tamaño del archivo inicial JavaScript.
- 15 pruebas de navegador con Supabase simulado: módulos, formularios, filtros, separación de ajustes, preservación de datos, metadatos, errores, permisos y móvil.
- 6 pruebas unitarias de métricas, identidad de clientes y rutas rápidas.
- Autenticación real y lectura correctas con la cuenta del propietario: 25 pedidos, 71 clientes, 127 mensajes, 6 categorías, 12 productos y 1 configuración al verificar.
- Escrituras autenticadas verificadas en restaurants, restaurant_settings, menu_products y customers mediante actualización al mismo valor con condición de coincidencia. No se cambiaron contenidos.
- Los cambios de estado de pedidos se probaron con datos simulados para no avanzar pedidos reales.

El servidor local está en http://127.0.0.1:5175. Esta entrega no incluye despliegue público, administración global de múltiples restaurantes ni facturación SaaS. Fidelización se conserva como módulo pendiente, sin presentar funcionalidad ficticia.
