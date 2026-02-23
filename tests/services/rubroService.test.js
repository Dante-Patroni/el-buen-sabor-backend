const RubroService = require('../../src/services/rubroService');

describe('RubroService', () => {

  let rubroRepositoryMock;
  let rubroService;

  beforeEach(() => {

    rubroRepositoryMock = {
      inTransaction: jest.fn((callback) => callback(null)),
      listarJerarquia: jest.fn(),
      buscarPorId: jest.fn(),
      buscarPorDenominacionYPadre: jest.fn(),
      buscarPorDenominacionYPadreExcluyendoId: jest.fn(),
      crear: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
      tieneSubrubrosActivos: jest.fn(),
      tienePlatosAsociados: jest.fn()
    };

    rubroService = new RubroService(rubroRepositoryMock);
  });

  // ======================================
  // CREAR
  // ======================================

  describe('crear()', () => {

    it('debe crear un rubro si no existe', async () => {

      rubroRepositoryMock.buscarPorDenominacionYPadre.mockResolvedValue(null);
      rubroRepositoryMock.crear.mockResolvedValue({ id: 1 });

      const result = await rubroService.crear({
        denominacion: 'Bebidas',
        padreId: null
      });

      expect(rubroRepositoryMock.crear).toHaveBeenCalled();
      expect(result).toEqual({ id: 1 });
    });

    it('debe lanzar error si denominacion es vacía', async () => {
      await expect(
        rubroService.crear({ denominacion: '' })
      ).rejects.toThrow('DENOMINACION_REQUERIDA');
    });

    it('debe lanzar error si ya existe activo', async () => {

      rubroRepositoryMock.buscarPorDenominacionYPadre.mockResolvedValue({
        id: 1,
        activo: true
      });

      await expect(
        rubroService.crear({ denominacion: 'Bebidas' })
      ).rejects.toThrow('RUBRO_YA_EXISTE');
    });

    it('debe reactivar si existe inactivo', async () => {

      rubroRepositoryMock.buscarPorDenominacionYPadre.mockResolvedValue({
        id: 1,
        activo: false
      });

      rubroRepositoryMock.actualizar.mockResolvedValue(1);

      const result = await rubroService.crear({
        denominacion: 'Bebidas'
      });

      expect(rubroRepositoryMock.actualizar).toHaveBeenCalled();
      expect(result).toBe(1);
    });

  });

  // ======================================
  // ACTUALIZAR
  // ======================================

  describe('actualizar()', () => {

    it('debe actualizar correctamente', async () => {

      rubroRepositoryMock.buscarPorId.mockResolvedValue({
        id: 1,
        activo: true
      });

      rubroRepositoryMock.buscarPorDenominacionYPadreExcluyendoId
        .mockResolvedValue(null);

      rubroRepositoryMock.actualizar.mockResolvedValue(1);

      const result = await rubroService.actualizar(1, {
        denominacion: 'Nuevo Nombre'
      });

      expect(result).toBe(1);
    });

    it('debe lanzar error si rubro no existe', async () => {

      rubroRepositoryMock.buscarPorId.mockResolvedValue(null);

      await expect(
        rubroService.actualizar(1, { denominacion: 'Test' })
      ).rejects.toThrow('RUBRO_NO_EXISTE');
    });

    it('debe lanzar error si ya existe duplicado', async () => {

      rubroRepositoryMock.buscarPorId.mockResolvedValue({
        id: 1,
        activo: true
      });

      rubroRepositoryMock.buscarPorDenominacionYPadreExcluyendoId
        .mockResolvedValue({ id: 2 });

      await expect(
        rubroService.actualizar(1, { denominacion: 'Test' })
      ).rejects.toThrow('RUBRO_YA_EXISTE');
    });

  });

  // ======================================
  // ELIMINAR
  // ======================================

  describe('eliminar()', () => {

    it('debe eliminar correctamente si no tiene dependencias', async () => {

      rubroRepositoryMock.buscarPorId.mockResolvedValue({
        id: 1,
        activo: true
      });

      rubroRepositoryMock.tieneSubrubrosActivos.mockResolvedValue(false);
      rubroRepositoryMock.tienePlatosAsociados.mockResolvedValue(false);
      rubroRepositoryMock.eliminar.mockResolvedValue(1);

      const result = await rubroService.eliminar(1);

      expect(result).toBe(1);
    });

    it('debe lanzar error si tiene subrubros activos', async () => {

      rubroRepositoryMock.buscarPorId.mockResolvedValue({
        id: 1,
        activo: true
      });

      rubroRepositoryMock.tieneSubrubrosActivos.mockResolvedValue(true);

      await expect(
        rubroService.eliminar(1)
      ).rejects.toThrow('RUBRO_TIENE_SUBRUBROS');
    });

    it('debe lanzar error si tiene platos asociados', async () => {

      rubroRepositoryMock.buscarPorId.mockResolvedValue({
        id: 1,
        activo: true
      });

      rubroRepositoryMock.tieneSubrubrosActivos.mockResolvedValue(false);
      rubroRepositoryMock.tienePlatosAsociados.mockResolvedValue(true);

      await expect(
        rubroService.eliminar(1)
      ).rejects.toThrow('RUBRO_TIENE_PLATOS');
    });

  });

});