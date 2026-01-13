const { Plato, Rubro } = require("../../models");
const PlatoRepository = require("../platoRepository");



class SequelizePlatoRepository extends PlatoRepository {

    //LISTAR MENU COMPLETO
    async listarMenuCompleto() {
            // A. MySQL: Traemos platos e incluimos el nombre del Rubro
            return await Plato.findAll({
                include: [{ model: Rubro, as: 'rubro', attributes: ['denominacion'] }] 
            });

    }

// CREAR NUEVO PRODUCTO
    async crearNuevoProducto(datos) {
        // datos trae: nombre, precio, rubroId, esMenuDelDia, etc.
            return await Plato.create(datos);
    }

    //BUSCAR PRODUCTO POR ID
    async buscarProductoPorId(id) {
            return await Plato.findByPk(id);

    }
//MODIFICAR PRODUCTO ID
    async modificarProductoSeleccionado(id, datos) {
  return await Plato.update(datos, {
    where: { id }
  });
}

}

module.exports = SequelizePlatoRepository;