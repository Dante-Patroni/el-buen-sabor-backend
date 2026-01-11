class MesaService {
  // 👇 Inyección de dependencia (igual que PedidoService)
  constructor(mesaRepository) {
    this.mesaRepository = mesaRepository;
  }

  // 1. LISTAR MESAS
  async listar() {
     return await this.mesaRepository.listarMesasConMozo();
  }


  // 2. ABRIR MESA
  async abrirMesa(idMesa, idMozo) {
    // A. Buscar mesa
    const mesa = await this.mesaRepository.buscarMesaPorId(idMesa);
    if (!mesa) throw new Error('Mesa no encontrada');

    // B. Regla de negocio
    if (mesa.estado === 'ocupada') throw new Error('La mesa ya está ocupada');

    // C. Aplicar cambios
    mesa.estado = 'ocupada';
    mesa.mozoId = idMozo; // Vinculamos al mozo

    // D. Persistir
    await this.mesaRepository.actualizarMesa(mesa);

    return mesa;

  }

}

module.exports = MesaService;