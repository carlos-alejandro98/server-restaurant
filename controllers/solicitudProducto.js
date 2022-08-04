const Solicitud = require("../models/solicitudProducto");

const STATUS_CODES = {
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  INVALID: "INVALID",
};

// Crear Solicitudes
exports.solicitarProducto = async (req, res) => {
  try {
    const newSolicitudProducto = await new Solicitud(req.body).save();
    res.status(200).json({
      CodeResult: STATUS_CODES.SUCCESS,
      solicitudProduct: newSolicitudProducto
    })
  } catch (err) {
    res.status(200).json({
      errorMessage: err.message,
      CodeResult: STATUS_CODES.ERROR,
    });
  }
};


// Obtener todos los tipos de productos
exports.obtenerSolicitudes = async (req, res) => {
  let solicitudes = await Solicitud.find()
      .exec();
  res.json(solicitudes);
};



