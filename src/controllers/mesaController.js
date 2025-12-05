//Importamos el servicio de mesa
const mesaService = require('../services/mesaService');

class MesaController {

    constructor() { 
        //Instanciamos el servicio de mesa para poder usarlo
        this.mesaService = new mesaService();
    }

    //Este método lo llamamos desde la ruta
    async obtenerEstadoMesas(req, res) {
        try{
            //1. Llamamos al servicio para obtener el estado de las mesas
            const mesas = await this.mesaService.listarEstadoMesas();
        
            //2. Si todo sale bien, respondemos con código 200 (OK) y los datos
            res.status(200).json(mesas);

        } catch (error) {
            //3. Si hay un error, respondemos con código 500 (Error del servidor) y el mensaje de error
            console.error('Error al obtener el estado de las mesas:', error.message);
            res.status(500).json({ mensaje: 'Error al obtener el estado de las mesas'});
        }
    }
}
module.exports = MesaController;