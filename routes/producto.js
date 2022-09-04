const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller middlewares
const {
  obtenerProductos,
  crearProducto,
  cantidadProductos,
  actualizarProducto,
  cambiarEstado,
  eliminarProducto,
  obtenerProductosName,
} = require("../controllers/producto");

// routes-endpoints

// ROUTES - SWAGGER

/**
 * @swagger
 * /productos/obtener-productos:
 *   get:
 *     tags:
 *       - name: "Productos"
 *     summary: "Obtener todos los productos"
 *     responses:
 *       200:
 *          description: ok
 */
router.get("/productos/obtener-productos", obtenerProductos);

router.get("/productos/obtener-productos-name", obtenerProductosName);

/**
 * @swagger
 * /productos/create-producto:
 *   post:
 *     summary: Crear Producto
 *     tags:
 *       - name: "Productos"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Producto"
 *     responses:
 *       200:
 *         description: ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Producto"
 *       400:
 *         description: bad request
 */
router.post("/productos/create-producto", crearProducto);

/**
 * @swagger
 * /productos/producto-delete/{nombre}:
 *   patch:
 *     tags:
 *       - name: "Productos"
 *     summary: "Actualizar Estado Producto"
 *     parameters:
 *       - name: "nombre"
 *         in: "path"
 *         description: "nombre search"
 *         required: true
 *         type: "string"
 *         trim: true
 *         text: true
 *     responses:
 *       200:
 *          description: ok
 */
router.patch("/productos/producto-delete/:slug", cambiarEstado); // soft-delete

/**
 * @swagger
 * /productos/remove-producto/{nombre}:
 *   delete:
 *     tags:
 *       - name: "Productos"
 *     summary: "Eliminar Producto"
 *     parameters:
 *       - name: "nombre"
 *         in: "path"
 *         description: "nombre search"
 *         required: true
 *         type: "string"
 *         trim: true
 *         text: true
 *     responses:
 *       200:
 *          description: ok
 */
router.delete("/productos/remove-producto/:slug", eliminarProducto);

/**
 * @swagger
 * /productos/producto-update/{nombre}:
 *   put:
 *     summary: Actualizar Producto
 *     tags:
 *       - name: "Productos"
 *     parameters:
 *       - name: "nombre"
 *         in: "path"
 *         description: "nombre search"
 *         required: true
 *         type: "string"
 *         trim: true
 *         text: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Producto"
 *     responses:
 *       200:
 *         description: ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Producto"
 *       400:
 *         description: bad request
 */
router.put("/productos/producto-update/:slug", actualizarProducto);

module.exports = router;

// SCHEMAS - SWAGGER

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       required:
 *         - nombre
 *         - imagen
 *       properties:
 *         nombre:
 *            type: string
 *            trim: true
 *            maxlength: 32
 *         precioCompra:
 *            type: number
 *            trim: true
 *         slug:
 *            type: string
 *            unique: true
 *            lowercase: true
 *            index: true
 *         imagen:
 *            type: string
 *            trim: true
 *         status:
 *            type: string
 *            default: "Active"
 *            enum:
 *            - "Active"
 *            - "Inactive"
 *       example:
 *         nombre: Manzana
 *         precioCompra: 2000
 *         cantidadComprada: 10
 *         cantidadStock: 9
 *         slug: frutas-verduras
 *         tipoProducto: 62cafa0d01f8204e84a31b7e
 *         imagen: ruta
 *         status: Active
 */
