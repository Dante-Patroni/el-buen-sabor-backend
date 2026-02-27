# 06 - Testing

Ultima actualizacion: 2026-02-27

## Estrategia
- Unit tests: services/controllers.
- E2E/API: Postman + Newman.

## Comandos
- Unit:
  - `npm run test:unit`
- E2E:
  - `npm test`
- Coverage:
  - `npm run test:coverage`

## Criterio minimo antes de merge
1. Unit tests verdes.
2. Newman verde (si se tocan endpoints).
3. CI verde.

## Guia rapida de test unitario (Jest)
1. Mock de dependencias.
2. Caso feliz.
3. Caso de error de dominio.
4. Assert de llamada a dependencia y resultado.

## Casos obligatorios por modulo
- Usuarios:
- Mesas:
- Pedidos:
- Platos:
- Rubros:

## Notas CI
- Si hay upload en Newman, usar rutas relativas versionadas.

