const multer = require("multer");
const path = require("path");
const { manejarErrorHttp } = require("../controllers/errorMapper");

// Configuración de almacenamiento
const storage = multer.diskStorage({
  /**
   * @description Define el directorio de destino para archivos subidos.
   * @param {import("express").Request} req - Request HTTP.
   * @param {Express.Multer.File} file - Metadata del archivo entrante.
   * @param {(error: Error|null, destination: string) => void} cb - Callback de Multer.
   * @returns {void} No retorna valor, solo invoca callback.
   */
  // 1. ¿Dónde se guardan?
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // La carpeta que creaste en la raíz
  },
  /**
   * @description Genera un nombre unico para evitar colisiones en disco.
   * @param {import("express").Request} req - Request HTTP.
   * @param {Express.Multer.File} file - Metadata del archivo entrante.
   * @param {(error: Error|null, filename: string) => void} cb - Callback de Multer.
   * @returns {void} No retorna valor, solo invoca callback.
   */
  // 2. ¿Cómo se llaman?
  filename: function (req, file, cb) {
    // Generamos un nombre único: "timestamp + extensión original"
    // Ej: 17300023423-milanesa.jpg
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Filtro para aceptar solo imágenes
/**
 * @description Valida que el archivo recibido sea una imagen por MIME type.
 * @param {import("express").Request} req - Request HTTP.
 * @param {Express.Multer.File} file - Archivo entrante.
 * @param {(error: Error|null, acceptFile: boolean) => void} cb - Callback de validacion de Multer.
 * @returns {void} No retorna valor, solo invoca callback.
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("TIPO_ARCHIVO_INVALIDO"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB maximo
});

/**
 * @description Traduce errores de Multer al contrato de errores HTTP del proyecto.
 * @param {Error|null} error - Error reportado por Multer.
 * @param {import("express").Request} req - Request HTTP.
 * @param {import("express").Response} res - Response HTTP.
 * @param {import("express").NextFunction} next - Continuacion del pipeline.
 * @returns {import("express").Response|void} Respuesta de error o continuacion.
 */
function manejarErroresUpload(error, req, res, next) {
  if (!error) {
    return next();
  }

  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return manejarErrorHttp(new Error("ARCHIVO_DEMASIADO_GRANDE"), res);
  }

  if (error.message === "TIPO_ARCHIVO_INVALIDO") {
    return manejarErrorHttp(error, res);
  }

  return manejarErrorHttp(error, res);
}

module.exports = {
  upload,
  manejarErroresUpload,
};
