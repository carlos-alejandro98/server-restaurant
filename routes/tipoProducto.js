const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller middlewares
const { getTipoProductos, actualizarTipoProducto, changeStatusTipoProducto, createTipoProducto, eliminarTipoProducto } = require("../controllers/tipoProducto");

// routes-endpoints

// ROUTES - SWAGGER

/**
 * @swagger
 * /productos/tipo-productos:
 *   get:
 *     tags:
 *       - name: "Tipo Productos"
 *     summary: "Obtener todos los tipo productos"
 *     responses:
 *       200: 
 *          description: ok   
 */
 router.get("/productos/tipo-productos", getTipoProductos);

/**
 * @swagger
 * /productos/create-tipo-productos:
 *   post:
 *     summary: Crear Tipo Producto
 *     tags:
 *       - name: "Tipo Productos"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TipoProducto"
 *     responses:
 *       200: 
 *         description: ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TipoProducto"
 *       400:
 *         description: bad request     
 */
router.post("/productos/create-tipo-productos", createTipoProducto);

/**
 * @swagger
 * /productos/tipo-productos-delete/{tipoproducto}:
 *   patch:
 *     tags:
 *       - name: "Tipo Productos"
 *     summary: "Actualizar Estado Tipo Producto"
 *     parameters:
 *       - name: "tipoProducto"
 *         in: "path"
 *         description: "tipoProducto search"
 *         required: true
 *         type: "string"
 *         trim: true
 *         text: true
 *     responses:
 *       200: 
 *          description: ok   
 */
router.patch("/productos/tipo-productos-delete/:slug", changeStatusTipoProducto); // soft-delete

/**
 * @swagger
 * /productos/remove-tipo-productos/{tipoproducto}:
 *   delete:
 *     tags:
 *       - name: "Tipo Productos"
 *     summary: "Eliminar Tipo Productos"
 *     parameters:
 *       - tipoProducto: "tipoProducto"
 *         in: "path"
 *         description: "tipoProducto search"
 *         required: true
 *         type: "string"
 *         trim: true
 *         text: true
 *     responses:
 *       200: 
 *          description: ok   
 */
 router.delete("/productos/remove-tipo-productos/:slug", eliminarTipoProducto); 


/**
 * @swagger
 * /productos/tipo-productos-update/{tipoproducto}:
 *   put:
 *     summary: Actualizar Tipo Producto
 *     tags:
 *       - name: "Tipo Productos"
 *     parameters:
 *       - tipoProducto: "tipoproducto"
 *         in: "path"
 *         description: "tipoproducto search"
 *         required: true
 *         type: "string"
 *         trim: true
 *         text: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TipoProducto"
 *     responses:
 *       200: 
 *         description: ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TipoProducto"
 *       400:
 *         description: bad request     
 */
router.put("/productos/tipo-productos-update/:slug", actualizarTipoProducto);


module.exports = router;

// SCHEMAS - SWAGGER

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoProducto:
 *       type: object
 *       required:
 *         - tipoProducto
 *       properties:
 *         tipoProducto:
 *            type: string
 *            trim: true
 *            minlength: 2
 *            maxlength: 32
 *         identificador:
 *            type: string
 *            trim: true
 *            minlength: 2
 *            maxlength: 32
 *         slug:
 *            type: string
 *            unique: true
 *            lowercase: true
 *            index: true
 *         status:
 *            type: string
 *            default: "Active"
 *            enum:
 *            - "Active"
 *            - "Inactive"
 *       example:
 *         tipoProducto: Frutas y Verduras
 *         identificador: FB
 *         slug: frutas-verduras
 *         status: Active      
 */