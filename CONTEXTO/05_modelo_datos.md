# 05 - Modelo de Datos

Ultima actualizacion: 2026-02-27

## Motor y ORM
- MySQL + Sequelize
- MongoDB (si aplica)

## Entidades principales

### Usuario
- Campos:
- Restricciones:
- Indices:

### Mesa
- Campos:
- Restricciones:
- Relacion con Usuario (mozo):

### Pedido
- Campos:
- Estado:
- Relacion con Mesa:

### DetallePedido
- Campos:
- Relacion con Pedido y Plato:

### Plato
- Campos:
- Stock / esIlimitado:
- Imagen:

### Rubro
- Campos:
- Jerarquia (padre/hijo):

## Migraciones
- Convencion de nombres:
- Como correr:
  - `npx sequelize-cli db:migrate`

## Seeds
- Como correr:
  - `npx sequelize-cli db:seed:all`

