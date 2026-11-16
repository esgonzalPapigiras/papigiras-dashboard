# Pilo · entrega para revisión de Esteban

Esta rama contiene la versión renovada elegida por Camilo. Es una candidata de pruebas, con frontend y backend compatibles; **no reemplazar producción ni fusionar directamente a main**. La interfaz corresponde a la versión probada en simulador y a la beta Android. No se incluyen datos de pasajeros, contraseñas reales, firmas, bases de datos ni el túnel temporal.

## Qué cambió

- Interfaz Pilo, navegación uniforme por perfil e inicio con mapa para familias.
- Mapa, selección de hitos, bitácora, fotos, galería y notas de voz de hasta 60 segundos.
- Nómina con buscador, filtros, dietas, fotos y acceso a fichas; contador QR.
- Ficha médica consistente, lectura bloqueada, edición por apoderado con nueva aceptación y PDF vigente sin marca, nombrado por alumno y RUT.
- Documentos internos/vouchers, tripulación y varios coordinadores por gira; permisos por rol, pasajero y gira.

## Repositorios de esta entrega

Usar la rama `revision/pilo-2026-11-16` de los tres repositorios de `esgonzalPapigiras`: `papigiras-app` (Flutter), `ms-papigiras-app` (API) y `papigiras-dashboard` (Angular). Cada repositorio tiene su commit y manifiesto `revision/ORIGEN.json`. No aplicar además los parches PG históricos: estas fuentes ya los contienen.

## Lo imprescindible antes de integrar a producción

La revisión distingue la experiencia aprobada de los adaptadores de pruebas. Autenticación/JWT, filesystem privado en lugar de Spaces, notificaciones locales en lugar de FCM y bloqueo a API local son parte del entorno de prueba. **No son únicamente variables de entorno: todavía requieren adaptación y pruebas para usar los servicios oficiales.** GPS del bus es sintético; contador QR está en memoria y falta confirmar el QR oficial. No se presentan como funciones productivas terminadas.

Primero probar esta candidata aislada; después resolver esos adaptadores, revisar migraciones sobre copia de base y validar cámara/micrófono/QR/PDF en teléfonos. Sólo entonces preparar despliegue y tiendas. `revision/INTEGRACION.md` identifica los puntos concretos y los límites. La rama no publica ni despliega automáticamente.

## Evidencia disponible

La candidata base pasó 468 pruebas backend, 138 comprobaciones HTTP con datos ficticios, 959 pruebas Flutter más 46 pruebas focalizadas de PDF y 87 comprobaciones del panel con compilación. La variante beta posterior verificó transporte HTTPS, permisos, audio/fotos/PDF y firma APK; la prueba física Android/iPhone sigue pendiente. Estos resultados pertenecen a las fuentes identificadas en el manifiesto, no certifican producción. Las comprobaciones de empaquetado de esta rama se registran en `revision/VERIFICACION.json`.

## Probar el panel

Usar la versión Node indicada en `.nvmrc` y el lockfile incluido.

```sh
npm ci
python3 scripts/check_isolation.py
npm run build
npm start -- --host 127.0.0.1 --port 4200
```

El panel conserva la conexión local y CSP de pruebas. Necesita API compatible en 127.0.0.1:8084 y credenciales de operador del entorno aislado. No usar el puerto si ya está ocupado ni introducir credenciales oficiales. Documentos internos y vouchers requieren el backend de esta entrega. Para producción hay que configurar autenticación/transporte/CSP del destino y conservar restricciones por rol.

## Reconciliación con GitHub del 16/11/2026

App y panel siguen sobre las mismas bases oficiales. El backend parte ahora de `947419a`, que Esteban añadió después de la copia inicial. Se conservaron sus fotos HD y miniaturas, nombres únicos, límites de carga, limpieza y texto de notificación. Pilo mantiene fotos completas en `images`, IDs estables en `imageIds`, audio y permisos; se añaden `thumbnails`/`photoIds` y lectura de foto con autorización por gira. La integración productiva de FCM sigue pendiente; se conserva el aviso local de pruebas. No hay migraciones nuevas en esta reconciliación. Suite backend de la rama: **475 pruebas aprobadas**, sin fallos, errores ni omisiones. No se reinició ningún servicio activo.
