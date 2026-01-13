
class PlatoService {
constructor(platoRepository) {
    this.platoRepository = platoRepository;
  }

    // 1. LISTAR (Tu lógica Híbrida MySQL + Mongo)
    async listarMenuCompleto() {
        return await this.platoRepository.listarMenuCompleto();
    }

    // 👇 2. NUEVO: CREAR PLATO
    async crearNuevoProducto(datos) {
        return await this.platoRepository.crearNuevoProducto(datos);
    }

    //ACTUALIZAR PRODUCTO
    async modificarProducto(id, datos) {
      const producto = await this.platoRepository.buscarProductoPorId(id);
            if (!producto) return null;

            return await this.platoRepository.modificarProductoSeleccionado(id, datos);
           
    }

    // 4. ACTUALIZAR IMAGEN (Tu código original)
    async cargarImagenProducto(id, nombreArchivo) {
  const producto = await this.platoRepository.buscarProductoPorId(id);
  if (!producto) return null;

  producto.imagenPath = imagenPath;

  return await this.platoRepository.actualizarProducto(producto);
}


    // --- MÉTODOS PRIVADOS ---
    _calcularEstadoStock(cantidad, esIlimitado) {
        if (esIlimitado) return "DISPONIBLE";
        if (cantidad <= 0) return "AGOTADO";
        if (cantidad < 5) return "BAJO_STOCK";
        return "DISPONIBLE";
    }
}

module.exports = PlatoService;