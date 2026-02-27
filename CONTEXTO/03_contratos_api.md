# 03 - Contratos API

Ultima actualizacion: 2026-02-27

## Convencion de respuesta
- Exito: objeto JSON segun endpoint.
- Error: `{ "error": "CODIGO_DOMINIO" }`
- Validacion: `{ "error": "DATOS_INVALIDOS", "details": [...] }`

## Auth
- Header: `Authorization: Bearer <token>`
- Codigo sin token: `NO_AUTORIZADO`
- Codigo token invalido: `TOKEN_INVALIDO`

## Endpoints clave (resumen)

### Usuarios
- `POST /api/usuarios/login`
- `GET /api/usuarios`
- `GET /api/usuarios/:id`
- `POST /api/usuarios`
- `PUT /api/usuarios/:id`
- `DELETE /api/usuarios/:id`

### Mesas
- `GET /api/mesas`
- `POST /api/mesas/:id/abrir`
- `POST /api/mesas/:id/cerrar`

### Pedidos
- `POST /api/pedidos`
- `PUT /api/pedidos/modificar`
- `DELETE /api/pedidos/:id`

### Platos
- `GET /api/platos`
- `POST /api/platos`
- `PUT /api/platos/:id`
- `DELETE /api/platos/:id`
- `POST /api/platos/:id/imagen`

### Rubros
- `GET /api/rubros`
- `POST /api/rubros`
- `PUT /api/rubros/:id`
- `DELETE /api/rubros/:id`

## Pendientes de contrato
- 
- 

