const Producto = require("../models/producto");
const Solicitud = require("../models/solicitudProducto");

const STATUS_CODES = {
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  INVALID: "INVALID",
};

// Crear solicitud
exports.solicitarProducto = async (req, res) => {
  try {
    const { producto } = req.body;
    const isProduct = await producto.map(async (prod) => {
      const products = await Producto.find({ name: prod.product });
      if (products.length > 0) {
        let firstProduct = products[0];
        if (firstProduct.countStock > 0 && firstProduct.countStock >= prod.count) {
          firstProduct.countStock = firstProduct.countStock - prod.count;
          await new Producto(firstProduct).save();
          return ({ isProduct: true, noProducts: false, noStock: false, product: prod.product })
        } else {
          return ({ isProduct: false, noProducts: false, noStock: true, product: prod.product })
        }
      } else {
        return ({ isProduct: false, noProducts: true, noStock: false, product: prod.product })
      } 
    });
    isProduct.map(elem => {
      elem.then(val => {
        const { isProduct, noProducts, noStock, product } = val
        if (isProduct) {
          res.status(200).json({
            CodeResult: STATUS_CODES.SUCCESS,
            message: `Producto ${product} solicitado correctamente`,
          });
        } else if(noProducts) {
          res.status(200).json({
            CodeResult: STATUS_CODES.INVALID,
            errorMessage: `El producto ${product} no existe`,
          });
        } else if (noStock) {
          res.status(200).json({
            CodeResult: STATUS_CODES.INVALID,
            errorMessage: `No existe Stock disponible para el producto ${product}`,
          });
        }
      })
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
  let solicitudes = await Solicitud.find().exec();
  res.status(200).json({
    CodeResult: STATUS_CODES.SUCCESS,
    solicitudes,
  });
};

//cambiar estados
/* exports.cambiarEstado = async (req, res) => {
  try {
    const updated = await Solicitud.findOneAndUpdate(
      { producto: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    res.status(200).json({
      CodeResult: STATUS_CODES.SUCCESS,
      updated
    });
  } catch (err) {
    console.log("Error al actualizar el producto: ", err);
    // return res.status(400).send("Product update failed");
    res.status(400).json({
      errorMessage: "Error al actualizar el producto",
      CodeResult: STATUS_CODES.ERROR
    });
  }
}; */

exports.cambiarEstado = async (req, res) => {
  const estado = req.body.status;
  try {
    const updated = await Solicitud.findOneAndUpdate(
      { _id: req.params.producto },
      { status: estado === "Solicitado" ? "Pendiente" : "Entregado" },
      { new: true }
    ).exec();
    res.status(200).json({
      CodeResult: STATUS_CODES.SUCCESS,
      updated,
    });
  } catch (err) {
    console.log("Error al actualizar el producto: ", err);
    // return res.status(400).send("Product update failed");
    res.status(400).json({
      errorMessage: "Error al actualizar el producto",
      CodeResult: STATUS_CODES.ERROR,
    });
  }
};

exports.deleteRequestProduct = async (req, res) => {
  try {
    const { id, count, name } = req.body;
    const request = await Solicitud.find({ _id: id });
    if (request.length > 0) {
      const products = await Producto.find({ name });
      let firstProduct = products[0];
      firstProduct.countStock = firstProduct.countStock + count;
      await new Producto(firstProduct).save();
      await Solicitud.deleteOne({ _id: id });
      res.status(200).json({
        CodeResult: STATUS_CODES.SUCCESS,
        message: "Solicitud eliminada correctamente",
      });
    } else {
      res.status(200).json({
        errorMessage: "Hubo un error al eliminar solicitud de producto",
        CodeResult: STATUS_CODES.INVALID,
      });
    }
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
      CodeResult: STATUS_CODES.ERROR,
    });
  }
};
