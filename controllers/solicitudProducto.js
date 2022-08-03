const Solicitud = require("../models/solicitudProducto");

const STATUS_CODES = {
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  INVALID: "INVALID",
};

// Crear Producto
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


// Obtener Productos
/* exports.obtenerProductos = async (req, res) => {
  let products = await Product.find()
    .limit(parseInt(req.params.count))
    .exec();
  res.status(200).json({
    products,
    CodeResult: STATUS_CODES.SUCCESS
  })
}; */



