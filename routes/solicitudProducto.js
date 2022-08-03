const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");


// controller middlewares
const { solicitarProducto } = require("../controllers/solicitudProducto");


/**
 * @swagger
 * /solicitar-producto/crear-solicitud:
 *   post:
 *     summary: Solicitud de Producto
 *     tags:
 *       - name: "SolicitudProducto"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SolicitudProducto"
 *     responses:
 *       200: 
 *         description: ok
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SolicitudProducto"
 *       400:
 *         description: bad request     
 */
 router.post("/solicitar-producto/crear-solicitud", solicitarProducto);


 module.exports = router;


 // SCHEMAS - SWAGGER

/**
 * @swagger
 * components:
 *   schemas:
 *     SolicitudProducto:
 *       type: object
 *       required:
 *         - typeProduct
 *         - cantidad
 *         - pmp
 *         - fechaSolicitud
 *       properties:
 *         usuario:
 *            type: string
 *            trim: true
 *         typeProduct:
 *            type: Array
 *         cantidad:
 *            type: number
 *         status:
 *            type: string
 *            default: "Solicitado"
 *            enum:
 *            - "Solicitado"
 *            - "Pendiente"
 *            - "Entregado"
 *       example:
 *         usuario: idUsuario
 *         typeProduct: [1,2,3,4]
 *         cantidad: 4
 *         pmp: 4000
 *         fechaSolicitud: 09/10/2022
 *         status: Solicitado     
 */