# DOCUMENTO DE DISEÑO TÉCNICO (TDD)

**Proyecto:** Backend Gestión de Pedidos - "El Buen Sabor"
**Versión:** 1.0.0
**Estado:** Aprobado para Desarrollo

---

## 1. Contexto y Alcance

El objetivo es desarrollar una **API REST** para la gestión de pedidos de un restaurante. El sistema debe integrarse con un sistema legacy de control de stock que exporta datos en formato JSON plano.

### 1.1 Restricciones Técnicas

- **Runtime:** Node.js + Express.
- **Base de Datos:** MySQL (vía Sequelize ORM).
- **Integración Legacy:** Lectura de archivo local `stock.json` mediante **Patrón Adapter**.
- **Arquitectura:** En capas (Controller, Service, Data Access).

---

## 2. Contratos de Datos (Data Schemas)

Para garantizar la integridad de los datos, se definen las siguientes estructuras utilizando sintaxis TypeScript como referencia estricta.

### 2.1 Entidades de Base de Datos (MySQL)

**Entidad: Plato**
interface Plato {
id: number; // PK, Autoincremental
nombre: string; // Ej: "Hamburguesa Clásica"
precio: number; // Float
ingredientePrincipal: string; // Clave para cruce con Stock (Ej: "Carne_Res")
}

**Entidad: Pedido**
interface Pedido {
id: number; // PK, Autoincremental
cliente: string; // Nombre del cliente
fecha: Date; // Fecha de creación
estado: 'pendiente' | 'en_preparacion' | 'rechazado' | 'entregado'; // ENUM
platoId: number; // FK -> Relación con Plato
}

### 2.2 Entidades Externas (Archivo JSON)

Estructura esperada del archivo data/stock.json:
interface StockItem {
ingrediente: string; // ID único del ingrediente
cantidadDisponible: number; // Integer >= 0
}
// El archivo contiene un Array: StockItem[]

## 3. Arquitectura del Sistema

### 3.1 Diagrama de Clases (Estructura)

Se aplica el Patrón Controller para manejar las peticiones y el Patrón Adapter para aislar la lectura del archivo JSON.
classDiagram
class PedidoController {
+crear(req, res)
}

    class PedidoService {
        +crearYValidarPedido(cliente, platoId)
    }

    class StockAdapter {
        +consultarStock(ingrediente): Promise<number>
    }

    class PedidoModel {
        +create(data)
    }

    PedidoController --> PedidoService : orquesta
    PedidoService --> StockAdapter : consulta stock
    PedidoService --> PedidoModel : persiste

### 3.2 Diagrama de Secuencia (Flujo: Crear Pedido)

Lógica para el endpoint POST /api/pedidos.

sequenceDiagram
participant Cliente (HTTP)
participant Controller
participant Service
participant Adapter (JSON)
participant DB (MySQL)

    Cliente->>Controller: POST { cliente, platoId }
    Controller->>Service: crearYValidarPedido()
    Service->>Adapter: consultarStock(ingredientePrincipal)
    Adapter-->>Service: retorna cantidad (int)

    alt Stock Suficiente (> 0)
        Service->>DB: INSERT Pedido (estado: 'en_preparacion')
        DB-->>Service: Pedido Creado
        Service-->>Controller: Objeto Pedido
        Controller-->>Cliente: 201 Created
    else Stock Insuficiente
        Service-->>Controller: Error("STOCK_INSUFICIENTE")
        Controller-->>Cliente: 409 Conflict
    end

## 4. Especificación de la API (Endpoints)

### 4.1 Crear Nuevo Pedido

URL: /api/pedidos

Método: POST

Content-Type: application/json

Request Body (Entrada):
{
"cliente": "Dante Patroni",
"platoId": 1
}
Respuestas Posibles:
Código,Descripción,Cuerpo de Respuesta (Ejemplo)
201,Pedido Creado,"{ ""mensaje"": ""Éxito"", ""data"": { ""id"": 1, ""estado"": ""en_preparacion"" } }"
400,Datos Faltantes,"{ ""error"": ""Faltan datos obligatorios"" }"
404,Plato Inexistente,"{ ""error"": ""El plato solicitado no existe"" }"
409,Sin Stock,"{ ""error"": ""No se puede procesar: Stock insuficiente"" }"
500,Error Interno,"{ ""error"": ""Error interno del servidor"" }"

## 5. Reglas de Negocio (Gherkin)

Escenarios para pruebas automatizadas (TDD/BDD).

Feature: Validación de Stock al crear pedidos

Scenario: Cliente pide un plato con stock disponible Given que existe el plato "Hamburguesa" con ingrediente "Carne_Res" And el sistema de stock reporta 50 unidades de "Carne_Res" When recibo un pedido para "Hamburguesa" Then el pedido debe guardarse en la base de datos And el estado del pedido debe ser "en_preparacion" And la API debe responder código 201.

Scenario: Cliente pide un plato sin stock Given que existe el plato "Pizza" con ingrediente "Queso_Cheddar" And el sistema de stock reporta 0 unidades de "Queso_Cheddar" When recibo un pedido para "Pizza" Then el pedido NO debe guardarse en la base de datos And la API debe responder código 409 (Conflict) And el mensaje de error debe indicar falta de stock.
