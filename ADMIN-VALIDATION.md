# ADMIN privado: consumo y costos
Acceso: /admin, solo cuenta confirmada suarezjulian2227@gmail.com.
El enlace y la ruta se ocultan al resto; la autorización efectiva se comprueba en Supabase contra auth.users por auth.uid(), no contra un correo enviado por el navegador. Las funciones privilegiadas están en private con search_path vacío; las funciones públicas son SECURITY INVOKER. Las dos tablas privadas no permiten lectura/escritura directa del cliente.

## Implementado
- Mensajes por restaurante y mes en zona Bogotá, separando cantidad de pruebas.
- Tokens reales importados desde metadata.tracing de agentes n8n, sin sumar otra vez sus subnodos.
- Registro único workflow_id/execution_id para evitar duplicados; tokens estimados o incompletos no se presentan como medición del proveedor.
- Casos sin restaurante confiable quedan sin asignar. No se atribuyen por nombre o texto del cliente.
- Datos BD: suma actual de tamaño lógico de registros, sin índices/backups. No equivale al espacio físico facturado por Supabase.
- Archivos Storage: actualmente 0 porque no hay objetos. Si se crean objetos sin vínculo confiable con restaurantes, devuelve pendiente y requiere definir ese vínculo; no reparte el tamaño arbitrariamente.
- Nombre/precio del plan y servicios editables por restaurante y mes. Se pueden agregar, quitar o renombrar n8n, Supabase, VPS u otros costos.
- Tarifas de entrada/salida por millón de tokens y tipo de cambio configurables. Cero significa gratuito; vacío significa desconocido.
- Costos y margen recalculados en la pantalla. Margen = (precio COP - costo USD × COP/USD) / precio COP. No se divide USD directamente por COP.
- No hay valores comerciales ficticios guardados ni se adoptó el ejemplo de 399.000 COP.

## Alcance de la medición
Se recuperaron 62 ejecuciones finalizadas disponibles y después 4 pruebas de esta integración: 66 ejecuciones, 69.495 tokens, sin duplicados. Una ejecución no tiene restaurante confiable y se excluye de sus totales. Los datos incluyen consumo de pruebas y de ejecuciones fallidas que sí consumieron tokens. Tres ejecuciones antiguas en espera no se importaron como finalizadas. Esto no garantiza cobertura de ejecuciones eliminadas por retención.

Se modificaron únicamente Normalize y Save Chat Interaction del workflow xQQohsOmooxDCDxB. El primero añade meter_started_at; el segundo registra uso en la misma consulta que guarda historial. En la rama de chat, una respuesta sin agentes usados registra cero. Una respuesta con IA registra tokens pendientes; la importación de la ejecución terminada los completa.
El workflow sigue inactivo; no se activó WhatsApp ni se modificó la lógica de pedidos. El registro inmediato añadido cubre chat; la importación de ejecuciones terminadas cubre ambos canales cuando hay un restaurante confiable.

La sincronización automática fue pospuesta explícitamente por el usuario al no configurar n8n API todavía. El botón Actualizar lee Supabase; no obtiene ejecuciones de n8n. El dashboard muestra esa limitación y la última sincronización.
n8n/admin-usage-collector.template.json es una plantilla manual portable para importar después en n8n/VPS. Sus configuraciones se validaron, pero la plantilla no se ejecutó sin credencial n8n API. Requiere configurar esa credencial y PostgreSQL con permisos privados. No contiene claves. Consulta todas las ejecuciones retenidas y hace upsert: en producción con mucho volumen conviene paginación incremental y reintentos de ejecuciones incompletas.

## Cálculo frente a facturación
El consumo es real; los costos son cálculos basados en tarifas y gastos introducidos por el propietario, no facturas obtenidas del proveedor. Las tarifas de IA se aplican al consumo medido del mes; distintos modelos, caché, descuentos, impuestos y ejecuciones no retenidas requieren conciliación. Si faltan tarifas o hay ejecuciones sin tokens completos, no se muestra un costo IA/total completo.
La VPS aún no está elegida. No se inventó proveedor ni importe. Los costos compartidos deben introducirse como la parte asignada al restaurante, evitando imputar la factura completa a cada uno. El tipo de cambio tampoco se inventó.

## Cambios Supabase
Se justifican dos tablas nuevas porque antes no existía registro de consumo ni finanzas del propietario:
- private.ai_execution_usage: mediciones por ejecución.
- private.restaurant_monthly_finance: configuración financiera mensual.
No se modificaron las tablas de pedidos/clientes ni sus políticas.
SQL aplicado en orden: owner-usage-report.sql, admin-metering.sql, admin-finance.sql, admin-private-policies.sql. Son archivos de referencia; las migraciones remotas ya están aplicadas, no ejecutarlas otra vez ciegamente.

## Pruebas
- Navegador con la sesión real del propietario: /admin cargó el informe de Supabase, con 161 mensajes y 69.282 tokens en su restaurante al comprobar. No se guardaron importes ficticios en esa sesión.
- 8 unitarias: métricas, rutas rápidas, suma sin doble conteo, identidad de restaurante, monedas, datos faltantes y margen negativo.
- 17 pruebas de navegador: incluye ADMIN oculto a otras cuentas, navegación directa denegada, guardado, recálculo, separación mensual y móvil (Supabase simulado).
- Supabase real: lectura autorizada, guardado comprobado dentro de transacción con rollback, bloqueo de otra identidad aunque envíe el correo del propietario, rechazo de importes NaN, acceso anónimo revocado.
- n8n: ejecución 138 sin IA y 139 con IA completadas correctamente. Las pruebas 136/137 detectaron un error de expresión que se corrigió pasando parámetros SQL separados; sus consumos reales también se importaron.
- La revisión de seguridad no añadió acceso directo a tablas. Siguen avisos anteriores sobre funciones de acceso del proyecto y protección de contraseñas filtradas, ajenos a ADMIN: https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable y https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
