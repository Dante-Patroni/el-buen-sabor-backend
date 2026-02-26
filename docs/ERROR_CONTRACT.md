# Contrato Unificado de Errores

## Objetivo
Definir un formato unico y consistente para manejar errores en todo el backend.

---

## 1. Formato de respuesta de error

### Error simple
```json
{
  "error": "CODIGO_ERROR"
}
```

### Error con detalles (validaciones)
```json
{
  "error": "DATOS_INVALIDOS",
  "details": [
    {
      "field": "mesa",
      "message": "La mesa es obligatoria"
    }
  ]
}
```

Reglas:
- El campo principal siempre es `error`.
- `error` siempre lleva un codigo de dominio, no texto libre.
- `details` es opcional y se usa solo cuando aporta valor (validaciones).

---

## 2. Convencion de codigos

- Siempre MAYUSCULAS con guion bajo.
- Sin acentos ni caracteres especiales.
- Deben ser estables en el tiempo (no mensajes de UI).

Ejemplos validos:
- `USUARIO_NO_ENCONTRADO`
- `LEGAJO_YA_EXISTENTE`
- `DATOS_INVALIDOS`
- `SOLO_ADMIN`

Ejemplos no validos:
- `Usuario no encontrado`
- `contraseña incorrecta`
- `error interno del servidor`

---

## 3. Mapeo HTTP estandar

- `400 Bad Request`: error de validacion o datos invalidos.
- `401 Unauthorized`: autenticacion invalida o token ausente/expirado.
- `403 Forbidden`: autenticado sin permisos o regla de negocio prohibitiva.
- `404 Not Found`: recurso inexistente.
- `409 Conflict`: conflictos de unicidad o estado incompatible por conflicto de datos.
- `500 Internal Server Error`: error no mapeado o inesperado.

---

## 4. Responsabilidad por capa

### Service
- Aplica reglas de negocio.
- Lanza errores de dominio con `throw new Error("CODIGO_ERROR")`.
- No responde HTTP.

### Controller
- Orquesta request/response HTTP.
- Traduce `CODIGO_ERROR` a status HTTP.
- Devuelve JSON en formato estandar (`error`, `details` opcional).

### Middleware
- Debe respetar el mismo formato de error.
- No debe devolver estructuras incompatibles con controllers.

### Repository
- No define reglas de negocio.
- Puede propagar errores tecnicos (BD, ORM) hacia capas superiores.

---

## 5. Catalogo base global

Codigos transversales recomendados:
- `DATOS_INVALIDOS`
- `NO_AUTORIZADO`
- `TOKEN_INVALIDO`
- `SOLO_ADMIN`
- `RECURSO_NO_ENCONTRADO`
- `CONFLICTO_DE_DATOS`
- `ERROR_INTERNO`

Cada modulo puede tener codigos propios (por ejemplo `MESA_NO_ENCONTRADA`, `RUBRO_YA_EXISTE`, `PASSWORD_INCORRECTA`) respetando la misma convencion.

---

## 6. Regla operativa para refactor

Antes de cambiar implementaciones:
1. Definir el codigo de error de dominio.
2. Registrar su mapeo HTTP.
3. Actualizar tests del Service y Controller.
4. Recién luego ajustar rutas/middlewares si aplica.

---

## 7. Criterio de calidad

El backend se considera homogeneo cuando:
- Todos los endpoints de error devuelven `error` como clave principal.
- No hay mensajes hardcodeados mezclados como contrato.
- Los status HTTP son coherentes con el tipo de falla.
- Los tests cubren al menos casos 400/401/403/404/409/500 por modulo.
