# 02 - Arquitectura

Ultima actualizacion: 2026-02-27

## Capas
- Routes: define endpoints e inyeccion de dependencias.
- Controllers: entrada/salida HTTP.
- Services: logica de negocio.
- Repositories: acceso a datos (Sequelize).
- Middlewares: auth, validacion, upload.

## Flujo obligatorio
`Route -> Controller -> Service -> Repository`

## Reglas de dependencia
- Controller no consulta DB directo.
- Service no conoce `req` ni `res`.
- Repository no tiene logica HTTP.

## Persistencia
- MySQL: datos transaccionales.
- MongoDB: (si aplica) datos auxiliares/historicos.

## Eventos / sockets (si aplica)
- 

## Diagrama simple (texto)
- 

