const express = require("express");
const router = express.Router();

// middlewares pre-process
const { authCheck, adminCheck } = require("../middlewares/auth");

// middlewares controller
const { createNewUser, updateUser, currentUser, getAllUsers, loginAdmin, deleteUser } = require("../controllers/auth");

// routes - endpoints

// TO-DO SWAGGER SERVICE

/**
 * @swagger
 * schemes:
 *   - "https"
 *   - "http"
 * /create-or-update-user:
 *  post:
 *     summary: Create or Update User with Firebase Auth
 *     tags:
 *         - Auth
 *     consumes:
 *         - "application/json"
 *     produces:
 *         - "application/json"
 *     parameters:
 *       - name: authtoken
 *         in: header
 *         description: an authorization token JWT-ouath2
 *     responses:
 *      "200":
 *         description: User Information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *      "401":
 *         description: Invalid or expired token
 */
router.post("/create-user", createNewUser);
router.post("/login-admin", loginAdmin);
router.post("/update-user", authCheck, updateUser);
router.post("/current-user", authCheck, currentUser);
router.post("/all-users", getAllUsers);
router.delete("/delete-user/:id", deleteUser);
router.post("/current-admin", authCheck, adminCheck, currentUser);

module.exports = router;

// TO-DO SCHEMAS - SWAGGER

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         name:
 *            type: string
 *         email:
 *            type: string
 *            index: true
 *         role:
 *            type: string
 *            default: "subscriber"
 *       example:
 *         name: cabarca
 *         email: cabarca@gmail.com
 *         role: subscriber
 */
