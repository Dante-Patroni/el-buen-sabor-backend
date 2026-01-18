
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
      const producto = await this.platoRepository.buscarPorId(id);
            if (!producto) return null;

            return await this.platoRepository.modificarProductoSeleccionado(id, datos);
           
    }

    // 2. DESCONTAR A STOCK (Escritura)
  async descontarStock(platoId, cantidadADescontar) {
    
       const plato = await this.platoRepository.buscarPorId(platoId);

      // Solo descontamos si existe y NO es ilimitado
      if (plato && plato.stockInicial > cantidadADescontar) {
        // Restamos del contador actual
       plato.cantidadActual -= cantidadADescontar;

        // Guardamos en DB
        return await this.platoRepository.actualizarStock(plato);

      }
  }

    // 2. AGREGAR A STOCK (Escritura)
  async agregarAStock(platoId, cantidadASumar) {
    
       const plato = await this.platoRepository.buscarPorId(platoId);

      // Solo sumamos si existe
      if (plato) {
        // Sumamos del contador actual
       plato.cantidadActual += cantidadASumar;

        // Guardamos en DB
        return await this.platoRepository.actualizarStock(plato);

      }
  }

    // 4. ACTUALIZAR IMAGEN (Tu código original)
    async cargarImagenProducto(id, nombreArchivo) {
  const producto = await this.platoRepository.buscarPorId(id);
  if (!producto) return null;

  const imagenPath = `/uploads/${nombreArchivo}`;

  await this.platoRepository.modificarProductoSeleccionado(id, {
    imagenPath
  });

  // 🔑 volvemos a traer el producto actualizado
  return await this.platoRepository.buscarPorId(id);
}

}

module.exports = PlatoService;