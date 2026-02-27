# 04 - Catalogo de Errores

Ultima actualizacion: 2026-02-27

## Regla
Siempre usar codigos de error de dominio estables.

## Formato
- Codigo dominio: `ERROR_X`
- HTTP mapeado en `errorMapper`.

## Errores de autenticacion
- `NO_AUTORIZADO` -> 401
- `TOKEN_INVALIDO` -> 401

## Errores de usuarios
- `USUARIO_NO_ENCONTRADO` -> 404
- `USUARIO_INACTIVO` -> 403
- `LEGAJO_YA_EXISTENTE` -> 409
- `DATOS_INVALIDOS` -> 400

## Errores de mesas
- `MESA_NO_ENCONTRADA` -> 404
- `MESA_YA_OCUPADA` -> 400
- `MESA_YA_LIBRE` -> 400
- `MOZO_REQUERIDO` -> 400

## Errores de pedidos
- `PEDIDO_NO_ENCONTRADO` -> 404
- `PRODUCTOS_INVALIDOS` -> 400
- `TRANSICION_ESTADO_INVALIDA` -> 400

## Errores de platos
- `PLATO_NO_ENCONTRADO` -> 404
- `PRODUCTO_YA_EXISTE` -> 409
- `STOCK_INSUFICIENTE` -> 400
- `NO_SE_ENVIO_IMAGEN` -> 400
- `TIPO_ARCHIVO_INVALIDO` -> 400
- `ARCHIVO_DEMASIADO_GRANDE` -> 400

## Errores de rubros
- `RUBRO_NO_EXISTE` -> 404
- `RUBRO_YA_EXISTE` -> 409
- `DENOMINACION_REQUERIDA` -> 400

## Notas
- Completar tabla completa segun `src/controllers/errorMapper.js`.

