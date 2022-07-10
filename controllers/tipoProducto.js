const TipoProductoModel = require("../models/tipoProducto");
const slugify = require("slugify");

// Crear Tipo de Productos
exports.createTipoProducto = async (req, res) => {
    try {
        const { tipoProducto, identificador } = req.body;
        res.json(await new TipoProductoModel({ tipoProducto, identificador, slug: slugify(tipoProducto) }).save());
    } catch (err) {
        console.log("Error Detalle: ", err);
        res.status(400).send("Ha ocurrido un error al crear el tipo de producto");
    }
};

// Obtener todos los tipos de productos
exports.getTipoProductos = async (req, res) => {
    let tipoproductos = await TipoProductoModel.find({ status: "Active" })
        .exec();
    res.json(tipoproductos);
};

// Soft-delete
exports.changeStatusTipoProducto = async (req, res) => {
    try {
        const deleted = await TipoProductoModel.findOneAndUpdate(
            {
                slug: req.params.slug,
            },
            { status: "Inactive" },
            { new: true }
        ).exec();
        res.json(deleted);
    } catch (err) {
        console.log(err);
        return res.status(400).send("Ha ocurrido un error al eliminar el tipo de producto");
    }
};

// Eliminar Tipo Producto
exports.eliminarTipoProducto = async (req, res) => {
    console.log("ELIMINANDO TIPO PRODUCTO...");
    console.log("SLUG:" ,req.params.slug);
    try {
        const deleted = await TipoProductoModel.findOneAndRemove({
            slug: req.params.slug,
        }).exec();
        res.json(deleted);
    } catch (err) {
        console.log(err);
        return res.status(400).send("Ha ocurrido un error al eliminar el tipo de producto");
    }
}

// Actualizar Tipo Producto
exports.actualizarTipoProducto = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updated = await TipoProductoModel.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true }
        ).exec();
        res.json(updated);
    } catch (err) {
        console.log("Error al actualizar el tipo de producto: ", err);
        // return res.status(400).send("Product update failed");
        res.status(400).json({
            err: err.message,
        });
    }
};