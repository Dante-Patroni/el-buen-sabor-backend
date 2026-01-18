class PlatoRepository {
    //LISTAR MENU COMPLETO
    async listarMenuCompleto() {
        throw new Error("Método no implementado");
    }
    // CREAR NUEVO PRODUCTO
    async crearNuevoProducto(datos) {
        throw new Error("Método no implementado");
    }

    async actualizarStock(id, nuevoStock) {
        throw new Error("Método no implementado");
    }
    
    async buscarPorId(id) {
    throw new Error("Not implemented");
  }

   //MODIFICAR PRODUCTO ID
    async modificarProductoSeleccionado(id, datos) {
        throw new Error("Método no implementado");
    }

}

module.exports = PlatoRepository;