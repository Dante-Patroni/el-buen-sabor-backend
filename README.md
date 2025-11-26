# 🍔 El Buen Sabor - Backend API

API RESTful desarrollada con **Node.js, Express y MySQL** para la gestión de pedidos de un restaurante. Este proyecto implementa patrones de arquitectura de software profesional y pruebas automatizadas.

## 🚀 Tecnologías

* **Runtime:** Node.js
* **Framework:** Express.js
* **Base de Datos:** MySQL (con Sequelize ORM)
* **Documentación:** Swagger UI (OpenAPI)
* **Testing:** Postman + Newman (E2E Testing)

## 🏛️ Arquitectura

El proyecto sigue una **Arquitectura en Capas (Layered Architecture)** para asegurar la escalabilidad y mantenibilidad:

* `src/routes`: Definición de endpoints.
* `src/controllers`: Manejo de peticiones HTTP.
* `src/services`: Lógica de negocio y Validaciones.
* `src/models`: Definición de tablas y relaciones de BD.
* `src/data`: Simulador de sistema Legacy (Patrón Adapter).

## ⚙️ Instalación

1.  Clonar el repositorio:
    ```bash
    git clone [https://github.com/TU_USUARIO/el-buen-sabor-backend.git](https://github.com/TU_USUARIO/el-buen-sabor-backend.git)
    ```
2.  Instalar dependencias:
    ```bash
    npm install
    ```
3.  Configurar variables de entorno (Base de datos).
4.  Iniciar el servidor:
    ```bash
    npm run dev
    ```

## 🧪 Testing y Documentación

* **Swagger UI:** Accede a `http://localhost:3000/api-docs` para probar los endpoints visualmente.
* **Tests Automáticos:** Ejecuta el siguiente comando para correr las pruebas de integración:
    ```bash
    npx newman run tests/el-buen-sabor.postman_collection.json
    ```

---
Desarrollado por **Dante Patroni** - 2025
