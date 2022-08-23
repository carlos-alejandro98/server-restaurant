const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");


// controller middlewares
const { solicitarProducto, obtenerSolicitudes, cambiarEstado } = require("../controllers/solicitudProducto");


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


 /**
 * @swagger
 * /solicitar-producto/solicitudes:
 *   get:
 *     tags:
 *       - name: "SolicitudProducto"
 *     summary: "Obtener todas las solicitudes"
 *     responses:
 *       200: 
 *          description: ok   
 */
  router.get("/solicitar-producto/solicitudes", obtenerSolicitudes);





/**
 * @swagger
 * /solicitar-producto/cambiarEstado/{producto}:
 *   patch:
 *     tags:
 *       - name: "SolicitudProducto"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SolicitudProducto"
 *     summary: "Cambiar estado de las solicitudes"
 *     parameters:
 *       - name: "producto"
 *         in: "path"
 *         description: "producto search"
 *         required: true
 *         type: "string"
 *         trim: true
 *         text: true
 *     responses:
 *       200: 
 *          description: ok   
 */
router.patch("/solicitar-producto/cambiarEstado/:producto", cambiarEstado); // soft-delete



 module.exports = router;


 // SCHEMAS - SWAGGER

/**
 * @swagger
 * components:
 *   schemas:
 *     SolicitudProducto:
 *       type: object
 *       required:
 *         - usuario
 *         - producto
 *         - cantidad
 *         - pmp
 *         - fechaSolicitud
 *       properties:
 *         usuario:
 *            type: string
 *            trim: true
 *         producto:
 *            type: array
 *            trim: true
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
 *         usuario: usuario
 *         producto: [{"producto": "manzana", "cantidad": 2},{"producto": "pera", "cantidad": 5}]
 *         cantidad: 4
 *         pmp: 4000
 *         fechaSolicitud: 09/10/2022
 *         status: Solicitado     
 */