# Validación de rutas tempranas — 2026-09-30

Workflow: xQQohsOmooxDCDxB. Base: 783a7eff-52c1-4e11-8ff8-76d9d8891301.
Se conserva inactivo, para pruebas; no se publicó ni se envió a WhatsApp.

## Cambios
- Agregados: Early Query Intent, Early Query Router, Simple Query Reply.
- Modificados: Supabase Restaurant Registry PostgreSQL (proyección de configuración y consultas condicionales); Prepare Agent Context (elimina identificadores técnicos redundantes del prompt).
- Conexiones de Normalize y Tenant Security Gate Menu ajustadas; el resto del recorrido de pedidos intacto.
- Eliminados: ninguno. Tablas, credenciales, controles tenant, memoria y lógica de pedidos sin cambios.
- Security Test Input se restauró exactamente después de las pruebas.
- GENERAL_QUERY solo usa ruta rápida para saludos reconocidos. Ambigüedad y mensajes mixtos conservan Gemini.
- Precios específicos conservan el mecanismo Fast Chat Intent existente; todavía cargan catálogo e historial. No se adelantaron por riesgo de confundir referencias al pedido.
- Las consultas simples siguen registrando interacción y métricas para conservar historial/dashboard.

## Mediciones
Duración de ejecución n8n, no latencia de entrega WhatsApp. Una muestra por frase en cada versión, misma instancia, sesiones aisladas; no es prueba de carga. Algunas ejecuciones se superpusieron. Tokens de tracing del proveedor, sin duplicar el subnodo del modelo.

| Mensaje | Ejecuciones antes/después | ms antes | ms después | tokens antes | tokens después |
|---|---|---:|---:|---:|---:|
| muéstrame el menú | 142/169 | 2842 | 2155 | 0 | 0 |
| qué tienen | 143/170 | 3176 | 1573 | 609 | 0 |
| qué precios tienen | 144/171 | 3997 | 1094 | 2151 | 0 |
| qué métodos de pago manejan | 147/173 | 490 | 334 | 0 | 0 |
| horario | 148/172 | 2235 | 522 | 1958 | 0 |
| dirección | 149/158 | 1676 | 392 | 609 | 0 |

Promedio: 2403 ms antes; 1012 ms después.
Consulta adicional «¿Cuál es el horario?»: ejecución153, 15544 ms y1952 tokens; ejecución157,987 ms y0 tokens. Variación elevada del modelo: no generalizar esa reducción a pedidos.

## Pruebas funcionales
-154–161: saludo, menú, Nequi, horario, dirección, hamburguesa clásica, cambio ambiguo de bebida, domicilio. Todas success.
-162–168: sesión persistente; dos hamburguesas y Coca Cola, consulta rápida Nequi, reemplazo por limonada, nombre/domicilio/efectivo, dirección/barrio, «sí está bien». Pedido de prueba creado con2 hamburguesas y1 limonada,53000 COP, sin cocina.
-174/175: REST001 ydemo-burger-ai, misma clave de sesión, ejecuciones superpuestas. Menús aislados (Pizza Margarita frente al catálogo de hamburguesas).
-176: reserva usa Gemini ySimple Memory; informa que integración de reservas está pendiente. Contexto compacto ejecutado.
-Pruebas unitarias para mensajes mixtos, datos ausentes, aislamiento y regresión del clasificador existente.

## Hallazgos y límites
-«dirección» antes derivaba a pedir productos; ahora responde dirección configurada.
-El modelo anunciaba horario de apertura aun con todos los días cerrados; ruta directa respeta closed.
-La configuración real marca todos los días cerrados. Debe revisarse en dashboard por el dueño, sin inventar horarios.
-Hay seis nodos raíz desconectados preexistentes. No ejecutan ni añaden latencia; se conservaron para no eliminar funcionalidades.
-Advertencia de cantidad de cajas en canvas: se conserva distribución existente del usuario; no afecta ejecución.
-No se modificaron políticas de domicilio/cobertura ni integración de reservas.
-La reducción de contexto del agente conserva catálogo y reglas comerciales; se quitaron IDs repetidos por producto ycampos internos del borrador. El clasificador de pedidos ymemoria permanecen intactos.
-Recomendación: ampliar muestras ymedir entrega real WhatsApp al activar; optimizar precios específicos con manejo de referencias antes de adelantar esa ruta.

