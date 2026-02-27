# AGENTS.md

## 1) Proposito
Este archivo define como debe trabajar cualquier agente de IA en este repositorio para mantener calidad, consistencia y velocidad de entrega.

Objetivos principales:
- Mantener arquitectura limpia por capas.
- Evitar regresiones funcionales.
- Mantener homogeneidad en manejo de errores y respuestas HTTP.
- Enseñar mientras se implementa (explicando por que, que y como).

---

## 2) Forma de trabajo esperada (nuestro estilo)
El agente debe trabajar en este orden:
1. Entender el requerimiento y el contexto real del codigo.
2. Explicar brevemente el plan en 3 pasos:
   - Por que se hace.
   - Que se va a hacer.
   - Como se va a hacer.
3. Implementar cambios pequenos, seguros y verificables.
4. Validar con tests y/o ejecuciones relevantes.
5. Entregar resumen final con archivos tocados, validacion y pendientes.

Reglas de colaboracion:
- Priorizar claridad y aprendizaje del desarrollador.
- Si el usuario lo pide, guiar paso a paso en vez de editar todo de golpe.
- No hacer cambios innecesarios fuera de alcance.
- Si aparece algo inesperado en el repo, frenar y avisar.

---

## 3) Arquitectura obligatoria
Se debe respetar separacion de responsabilidades:
- `routes`: definicion de endpoints y wiring de dependencias.
- `controllers`: entrada/salida HTTP, sin logica de negocio compleja.
- `services`: reglas de negocio y orquestacion.
- `repositories`: acceso a datos/ORM.
- `middlewares`: autenticacion, validacion, upload, etc.

Flujo esperado:
`Route -> Controller -> Service -> Repository`

No saltar capas salvo justificacion fuerte.

---

## 4) Convenciones de codigo
- Mantener nomenclatura consistente con el proyecto (espanol).
- Evitar duplicacion de logica.
- Funciones cortas y de responsabilidad unica.
- Evitar dependencias nuevas sin justificar.
- No tocar archivos no relacionados.
- No hardcodear secretos ni credenciales.
- Usar `async/await` con manejo claro de errores.

---

## 5) JSDoc obligatorio en todas las funciones
Requisito mandatorio del proyecto:
- Cada funcion debe incluir un bloque JSDoc inmediatamente encima.
- Aplica a funciones publicas y privadas.
- Aplica a controllers, services, repositories, middlewares y utilidades.

Plantilla minima:
```js
/**
 * @description Describe claramente que hace la funcion.
 * @param {Tipo} parametro - Que representa y validaciones relevantes.
 * @returns {Tipo|Promise<Tipo>} Valor de retorno esperado.
 * @throws {Error} Codigos de error de dominio que puede lanzar.
 */
```

Notas:
- En funciones `async`, usar `Promise<Tipo>` en `@returns`.
- Si no lanza errores de dominio, omitir `@throws` solo si es trivial.

---

## 6) Manejo de errores (estandar del proyecto)
Principios:
- Usar codigos de dominio estables: ejemplo `USUARIO_NO_ENCONTRADO`.
- Evitar mensajes libres cuando ya existe codigo de dominio.
- Mantener mapeo centralizado HTTP en `errorMapper` (o equivalente).
- No responder errores inconsistentes entre modulos.

Reglas practicas:
- En `services`: lanzar `throw new Error("CODIGO_DOMINIO")`.
- En `controllers`: delegar en manejador central (`manejarErrorHttp`).
- En `middlewares`: mantener el mismo contrato JSON de error.
- Para validaciones de entrada, usar `DATOS_INVALIDOS` + `details` cuando corresponda.

---

## 7) Transacciones
Cuando una operacion afecta multiples escrituras relacionadas:
- Usar transaccion.
- Propagar `transaction` entre service/repository de forma explicita.
- No mezclar operaciones fuera de transaccion durante validaciones criticas.
- Mantener atomicidad (commit solo al final del flujo exitoso).

---

## 8) Contrato HTTP
Mantener consistencia:
- JSON de exito claro y estable.
- JSON de error: `{ "error": "CODIGO_DOMINIO" }`
- Cuando aplique validacion detallada: `{ error, details }`

Evitar:
- Mezclar `message` y `mensaje` sin criterio.
- Devolver 200 en errores de negocio.

---

## 9) Testing obligatorio
Todo cambio funcional debe validarse.

Minimo requerido:
- Unit tests:
  - `npm run test:unit`
- E2E/API cuando impacta endpoints:
  - `npm test` (Newman)

Reglas:
- Si cambias contrato/comportamiento, actualiza tests.
- No cerrar tarea con tests fallando.
- Si no se pudo correr algo, declararlo explicitamente.

---

## 10) CI/CD
Al cambiar colecciones Postman, assets o scripts:
- Confirmar que rutas funcionen en local y CI.
- Verificar workflow en `.github/workflows/ci.yml`.
- Evitar dependencias de rutas absolutas locales.

---

## 11) Git y versionado
- Commits atomicos y con intencion clara.
- Mensaje de commit: que cambia + por que.
- No mezclar refactor masivo con bugfix puntual si complica revision.
- Trabajar en rama de feature/chore, evitar cambios directos en `main`.

---

## 12) Checklist de cierre
Antes de dar una tarea como terminada:
1. Codigo implementado y coherente con arquitectura.
2. JSDoc agregado en todas las funciones nuevas/modificadas.
3. Manejo de errores homogeneo.
4. Tests relevantes en verde.
5. Resumen final con:
   - Archivos modificados.
   - Validaciones ejecutadas.
   - Riesgos o pendientes.

---

## 13) Regla de oro
Primero correcto, despues prolijo, siempre consistente.
Si hay duda entre rapidez y calidad estructural, elegir calidad estructural sin perder pragmatismo.

