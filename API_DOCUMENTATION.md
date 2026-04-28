# Documentación de Endpoints - El Buen Sabor Backend

A continuación se detalla la documentación completa de todos los endpoints disponibles en el backend, incluyendo su propósito, los parámetros de entrada y sus correspondientes respuestas de salida. Esta documentación es ideal para la materia **Taller de Desarrollo de APPs**.

---

## 🍽️ 1. Mesas (`/api/mesas`)
Gestión del estado de las mesas en el restaurante.

### `GET /api/mesas`
- **Para qué se usa:** Obtiene el estado actual de todas las mesas (si están libres u ocupadas, el total actual consumido, etc.).
- **Qué entra:** Requiere token de autenticación (Header: `Authorization: Bearer <token>`).
- **Qué sale:** Lista de objetos de mesas.
  - Ejemplo de retorno: `[ { id: 4, nombre: "Mesa 4", estado: "ocupada", totalActual: 1500.00 } ]`

### `POST /api/mesas/{id}/abrir`
- **Para qué se usa:** Ocupa una mesa y le asigna un mozo. Cambia el estado de la mesa a 'ocupada'.
- **Qué entra:** 
  - `id` en la URL (ID de la mesa).
  - Body (JSON): `{ "idMozo": 5 }` (ID del usuario/mozo que abre la mesa).
  - Token de autenticación.
- **Qué sale:** Confirmación de mesa abierta y datos de la mesa.
  - Ejemplo de retorno: `{ "message": "Mesa abierta con éxito", "mesa": { ... } }`

### `POST /api/mesas/{id}/cerrar`
- **Para qué se usa:** Cierra una mesa y libera su estado. Pasa el estado a 'libre', desasigna el mozo y devuelve el total cobrado.
- **Qué entra:** 
  - `id` en la URL (ID de la mesa a cerrar).
  - Token de autenticación.
- **Qué sale:** Confirmación de cierre y datos de facturación de la mesa.
  - Ejemplo de retorno: `{ "message": "Mesa cerrada con éxito", "mesaId": 4, "totalCobrado": 2500.75 }`

---

## 📝 2. Pedidos (`/api/pedidos`)
Manejo de pedidos, carga de productos a mesas y facturación en curso.

### `POST /api/pedidos`
- **Para qué se usa:** Crea un nuevo pedido para una mesa específica.
- **Qué entra:** 
  - Token de autenticación.
  - Body (JSON): 
    ```json
    {
      "mesa": "5",
      "cliente": "Juan Pérez",
      "productos": [
         { "platoId": 1, "cantidad": 2, "aclaracion": "Sin sal" }
      ]
    }
    ```
- **Qué sale:** Confirmación de creación del pedido.

### `GET /api/pedidos`
- **Para qué se usa:** Obtiene el historial completo de todos los pedidos del restaurante.
- **Qué entra:** Token de autenticación.
- **Qué sale:** Lista completa de pedidos.

### `GET /api/pedidos/mesa/{mesa}`
- **Para qué se usa:** Obtiene los pedidos que se encuentran activos (en curso) de una mesa específica.
- **Qué entra:** 
  - `mesa` en la URL (Número de la mesa).
  - Token de autenticación.
- **Qué sale:** Lista de pedidos que pertenecen a esa mesa.

### `PUT /api/pedidos/modificar`
- **Para qué se usa:** Modifica un pedido existente (actualiza los productos, valida stock disponible y recalcula el total).
- **Qué entra:** 
  - Token de autenticación.
  - Body (JSON):
    ```json
    {
      "id": 69,
      "mesa": "4",
      "productos": [
         { "platoId": 1, "cantidad": 3, "aclaracion": "Modificado" }
      ]
    }
    ```
- **Qué sale:** Confirmación de que el pedido fue modificado o recreado con éxito.

### `DELETE /api/pedidos/{id}`
- **Para qué se usa:** Elimina/cancela un pedido específico y restaura el stock de los productos que lo conformaban.
- **Qué entra:** 
  - `id` en la URL (ID del pedido a cancelar).
  - Token de autenticación.
- **Qué sale:** Confirmación de eliminación y restauración de stock.

---

## 🍲 3. Platos (`/api/platos`)
Gestión del menú (productos a la venta) y sus correspondientes fotos.

### `GET /api/platos`
- **Para qué se usa:** Obtiene el menú completo del restaurante.
- **Qué entra:** Endpoint público (no requiere token).
- **Qué sale:** Lista completa de todos los platos disponibles.

### `POST /api/platos`
- **Para qué se usa:** Crea un nuevo plato en la base de datos.
- **Qué entra:** 
  - Token de autenticación.
  - Body (JSON): `{ "nombre": "Milanesa", "precio": 4500, "rubroId": 2, "esMenuDelDia": false }`
- **Qué sale:** Confirmación y datos del producto creado.

### `PUT /api/platos/{id}`
- **Para qué se usa:** Edita atributos de un plato existente (por ejemplo, actualiza su precio o si es menú del día).
- **Qué entra:** 
  - `id` en la URL (ID del plato).
  - Token de autenticación.
  - Body (JSON): `{ "precio": 5000, "esMenuDelDia": true }`
- **Qué sale:** Confirmación de plato actualizado.

### `DELETE /api/platos/{id}`
- **Para qué se usa:** Elimina un plato específico del catálogo.
- **Qué entra:** 
  - `id` en la URL (ID del plato a borrar).
  - Token de autenticación.
- **Qué sale:** Confirmación `{ "mensaje": "Plato eliminado correctamente" }`.

### `POST /api/platos/{id}/imagen`
- **Para qué se usa:** Sube una imagen (fotografía) para un plato específico.
- **Qué entra:** 
  - `id` en la URL.
  - Token de autenticación.
  - Form-Data: Archivo binario enviado en el campo `imagen`.
- **Qué sale:** Confirmación de que la imagen se ha subido correctamente.

---

## 📂 4. Rubros (`/api/rubros`)
Gestión de las categorías organizativas del menú (rubros e ítems hijos).

### `GET /api/rubros`
- **Para qué se usa:** Obtiene el árbol jerárquico de todos los rubros (categorías y subcategorías).
- **Qué entra:** Por defecto no requiere token.
- **Qué sale:** Lista de rubros indexada jerárquicamente.

### `POST /api/rubros`
- **Para qué se usa:** Crea un nuevo rubro o reactiva uno previamente dado de baja.
- **Qué entra:**
  - Body (JSON): `{ "denominacion": "Bebidas", "padreId": null }` o bien un entero si depende de otro rubro.
- **Qué sale:** Datos del rubro creado.

### `PUT /api/rubros/{id}`
- **Para qué se usa:** Actualiza el nombre o la dependencia de un rubro existente.
- **Qué entra:** 
  - `id` en la URL.
  - Body (JSON): `{ "denominacion": "Bebidas sin alcohol", "padreId": 1 }`
- **Qué sale:** Rubro modificado correctamente.

### `DELETE /api/rubros/{id}`
- **Para qué se usa:** Elimina un rubro de forma lógica (baja lógica). No borra el registro de la base de datos, lo desactiva.
- **Qué entra:** `id` en la URL.
- **Qué sale:** Confirmación de eliminación (código HTTP 204 sin contenido o mensaje de éxito).

---

## 👥 5. Usuarios (`/api/usuarios`)
Autenticación y mantenimiento del personal interno (CRUD de cuentas).

### `POST /api/usuarios/login`
- **Para qué se usa:** Inicia sesión en el sistema para obtener el token de acceso JWT.
- **Qué entra:** Endpoint público.
  - Body (JSON): `{ "usuario": "dante", "password": "123" }` (o los campos correspondientes según tu base local).
- **Qué sale:** Token JWT de autenticación y datos básicos del usuario.

### `GET /api/usuarios`
- **Para qué se usa:** Lista completa de los usuarios. Solo disponible para rol administrador.
- **Qué entra:** Token de autenticación (requiere rol `admin`).
- **Qué sale:** Lista de empleados y administradores activos.

### `GET /api/usuarios/{id}`
- **Para qué se usa:** Obtiene el detalle de un usuario específico. Solo para administradores.
- **Qué entra:**
  - `id` en la URL.
  - Token de autenticación de admin.
- **Qué sale:** Objeto con datos del perfil del usuario.

### `POST /api/usuarios`
- **Para qué se usa:** Da de alta a un nuevo usuario o empleado en el sistema.
- **Qué entra:** 
  - Token de autenticación de admin.
  - Formato JSON con datos completos del empleado (nombre, usuario, clave, rol, etc.).
- **Qué sale:** Perfil de usuario creado.

### `PUT /api/usuarios/{id}`
- **Para qué se usa:** Modifica la información de un usuario registrado.
- **Qué entra:**
  - `id` en la URL.
  - Token de administrador.
  - Body (JSON) con los atributos a actualizar.
- **Qué sale:** Usuario actualizado.

### `DELETE /api/usuarios/{id}`
- **Para qué se usa:** Ejecuta una baja lógica sobre el usuario, impidiéndole el acceso al sistema desde ese momento.
- **Qué entra:** 
  - `id` en la URL.
  - Token de administrador.
- **Qué sale:** Confirmación de baja del sistema.
