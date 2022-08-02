const Product = require("../models/producto");
const slugify = require("slugify");

const STATUS_CODES = {
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  INVALID: "INVALID",
};

// Crear Producto
exports.crearProducto = async (req, res) => {
  try {
    req.body.name = slugify(req.body.slug);
    const newProduct = await new Product(req.body).save();
    res.status(200).json({
      CodeResult: STATUS_CODES.SUCCESS,
      product: newProduct
    })
  } catch (err) {
    // res.status(400).send("Create product failed");
    res.status(200).json({
      errorMessage: err.message,
      CodeResult: STATUS_CODES.ERROR,
    });
  }
};

// Obtener la cantidad de productos activos
exports.cantidadProductos = async (req, res) => {
  let total = await Product.find({ status: "Active" })
    .estimatedDocumentCount()
    .exec();
  res.json(total); // 2
};

// Obtener Productos
exports.obtenerProductos = async (req, res) => {
  let products = await Product.find()
    .limit(parseInt(req.params.count))
    .exec();
  res.status(200).json({
    products,
    CodeResult: STATUS_CODES.SUCCESS
  })
};

// soft-delete
exports.cambiarEstado = async (req, res) => {
  try {
    const deleted = await Product.findOneAndUpdate(
      {
        slug: req.params.slug,
      },
      { status: "Inactive" },
      { new: true }
    ).exec();
    res.json(deleted);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error al eliminar producto");
  }
};

// Eliminar Producto
exports.eliminarProducto = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.status(200).json({
      CodeResult: STATUS_CODES.SUCCESS,
      deleted
    })
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      errorMessage: "Error al eliminar producto",
      CodeResult: STATUS_CODES.ERROR
    });
  }
};

// Actualizar Producto
exports.actualizarProducto = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
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
};
