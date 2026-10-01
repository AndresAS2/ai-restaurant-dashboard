# Corrección de guardado — 1 de octubre de 2026

Los archivos se subían a Storage, pero los enlaces y métodos editados permanecían en el formulario hasta guardar la configuración. El botón Actualizar descartaba esos cambios sin aviso.

- Botón Guardar cambios en la cabecera, asociado al formulario y sus validaciones.
- Aviso visible de cambios pendientes.
- Actualizar queda deshabilitado mientras hay cambios pendientes o un guardado en curso.
- Advertencia del navegador al recargar/cerrar con cambios pendientes.
- Una carga que termine durante un guardado continúa marcada como pendiente; no se informa falsamente que todo quedó guardado.
- Se recuperaron el JPG y PDF existentes de demo-burger-ai en menu_images, sin modificar otros ajustes. No se reconstruyeron datos de pago no guardados.
- Ejecución n8n 182: éxito; devolvió imagen JPG y enlace PDF usando la ruta rápida.
- Prueba de navegador: guardar imagen y Nequi, actualizar, recargar y comprobar que ambos permanecen.

El botón Guardar cambios es necesario después de subir archivos o editar métodos. No se implementó guardado automático ni protección de navegación interna entre módulos.
