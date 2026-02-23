
class RubroService {
  constructor(rubroRepository) {
    this.rubroRepository = rubroRepository;
  }


  async obtenerJerarquiaCompleta() {
    return await this.rubroRepository.listarJerarquia();
  }

  // ============================
  // CREAR O REACTIVAR RUBRO
  // ============================
  async crear({ denominacion, padreId = null }) {

    return await this.rubroRepository.inTransaction(async (transaction) => {

      // 1️⃣ Validar denominación
      if (!denominacion || !denominacion.trim()) {
        throw new Error("DENOMINACION_REQUERIDA");
      }

      // 2️⃣ Normalizar
      const denominacionNormalizada =
        this._normalizarDenominacion(denominacion);

      // 3️⃣ Validar padre (si existe)
      if (padreId !== null && padreId !== undefined) {

        const padre =
          await this.rubroRepository.buscarPorId(padreId, transaction);

        if (!padre || !padre.activo) {
          throw new Error("PADRE_INVALIDO");
        }

        // No permitir tercer nivel
        if (padre.padreId !== null) {
          throw new Error("NO_SE_PERMITE_TERCER_NIVEL");
        }
      }

      // 4️⃣ Buscar existente (activo o inactivo)
      const existente =
        await this.rubroRepository.buscarPorDenominacionYPadre(
          denominacionNormalizada,
          padreId,
          transaction
        );

      // Caso A: No existe → Crear
      if (!existente) {

        return await this.rubroRepository.crear({
          denominacion: denominacionNormalizada,
          padreId,
          activo: true
        }, transaction);
      }

      // Caso B: Existe y está activo → Error
      if (existente.activo) {
        throw new Error("RUBRO_YA_EXISTE");
      }

      // Caso C: Existe y está inactivo → Reactivar
      return await this.rubroRepository.actualizar(
        existente.id,
        {
          denominacion: denominacionNormalizada,
          padreId,
          activo: true
        },
        transaction
      );
    });
  }

  // ============================
  // ACTUALIZAR RUBRO
  // ============================
  async actualizar(id, { denominacion, padreId = null }) {

    return await this.rubroRepository.inTransaction(async (transaction) => {

      // 1️⃣ Buscar rubro existente
      const rubro =
        await this.rubroRepository.buscarPorId(id, transaction);

      if (!rubro) {
        throw new Error("RUBRO_NO_EXISTE");
      }

      if (!rubro.activo) {
        throw new Error("RUBRO_INACTIVO");
      }

      // 2️⃣ Validar denominación
      if (!denominacion || !denominacion.trim()) {
        throw new Error("DENOMINACION_REQUERIDA");
      }

      // 3️⃣ Normalizar
      const denominacionNormalizada =
        this._normalizarDenominacion(denominacion);

      // 4️⃣ Validar padre si viene
      if (padreId !== null && padreId !== undefined) {

        // No puede ser su propio padre
        if (padreId === id) {
          throw new Error("PADRE_INVALIDO");
        }

        const padre =
          await this.rubroRepository.buscarPorId(padreId, transaction);

        if (!padre || !padre.activo) {
          throw new Error("PADRE_INVALIDO");
        }

        // No permitir tercer nivel
        if (padre.padreId !== null) {
          throw new Error("NO_SE_PERMITE_TERCER_NIVEL");
        }
      }

      // 5️⃣ Validar duplicado en mismo nivel (excluyendo el actual)
      const existente =
        await this.rubroRepository.buscarPorDenominacionYPadreExcluyendoId(
          denominacionNormalizada,
          padreId,
          id,
          transaction
        );

      if (existente) {
        throw new Error("RUBRO_YA_EXISTE");
      }

      // 6️⃣ Actualizar
      return await this.rubroRepository.actualizar(
        id,
        {
          denominacion: denominacionNormalizada,
          padreId
        },
        transaction
      );
    });
  }

  // ============================
  // ELIMINAR RUBRO (LÓGICO)
  // ============================
  async eliminar(id) {

    return await this.rubroRepository.inTransaction(async (transaction) => {

      // 1️⃣ Buscar rubro
      const rubro =
        await this.rubroRepository.buscarPorId(id, transaction);

      if (!rubro) {
        throw new Error("RUBRO_NO_EXISTE");
      }

      if (!rubro.activo) {
        throw new Error("RUBRO_YA_INACTIVO");
      }

      // 2️⃣ Verificar hijos activos
      const tieneHijosActivos =
        await this.rubroRepository.tieneSubrubrosActivos(id, transaction);

      if (tieneHijosActivos) {
        throw new Error("RUBRO_TIENE_SUBRUBROS");
      }

      // 3️⃣ Verificar platos activos
      const tienePlatosActivos =
        await this.rubroRepository.tienePlatosAsociados(id, transaction);

      if (tienePlatosActivos) {
        throw new Error("RUBRO_TIENE_PLATOS");
      }

      // 4️⃣ Eliminación lógica
      return await this.rubroRepository.eliminar(id, transaction);
    });
  }


  // ---------------------------------
  // MÉTODOS PRIVADOS
  // ---------------------------------
  _normalizarDenominacion(texto) {

    const palabrasMinusculas = [
      "de", "y", "con", "a", "en", "para", "por", "sin", "del", "al"
    ];

    return texto
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .split(" ")
      .map((palabra, index) => {

        if (index === 0) {
          // La primera palabra siempre mayúscula
          return palabra.charAt(0).toUpperCase() + palabra.slice(1);
        }

        if (palabrasMinusculas.includes(palabra)) {
          return palabra; // se mantiene minúscula
        }

        return palabra.charAt(0).toUpperCase() + palabra.slice(1);
      })
      .join(" ");
  }

}
module.exports = RubroService;