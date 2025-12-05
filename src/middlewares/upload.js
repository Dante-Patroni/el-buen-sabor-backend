const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento
const storage = multer.diskStorage({
  // 1. ¿Dónde se guardan?
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // La carpeta que creaste en la raíz
  },
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
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos de imagen"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
