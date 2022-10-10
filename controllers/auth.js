const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const nodemailer = require("nodemailer");

const STATUS_CODES = {
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  INVALID: "INVALID",
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({
        errorMessage: "El usuario no existe.",
        CodeResult: STATUS_CODES.INVALID,
      });
    }
    const successPassword = bcrypt.compareSync(password, user.password);
    if (!successPassword) {
      return res.json({
        errorMessage: "La contraseña es incorrecta.",
        CodeResult: STATUS_CODES.INVALID,
      });
    }
    const payload = {
      user: {
        id: user.id,
        email,
      },
    };
    jwt.sign(
      payload,
      process.env.SECRET_PASS,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;
        res.status(200).json({
          token,
          CodeResult: STATUS_CODES.SUCCESS,
          user,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al iniciar sesión.",
      CodeResult: STATUS_CODES.ERROR,
      errorMessage: error,
    });
  }
};

exports.createNewUser = async (req, res) => {
  try {
    const { name, role, phoneNumber, avatarUrl, password, email, status } =
      req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(200).json({
        message: "Usuario ya existe",
        CodeResult: STATUS_CODES.INVALID,
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      let passwordHash = "";
      if (password) {
        passwordHash = await bcrypt.hash(password, salt);
      }
      const newUser = await new User({
        email: email,
        name: name ? name : email.split("@")[0],
        role: role ? role : "subscriber",
        phoneNumber: phoneNumber ? phoneNumber : "",
        password: passwordHash,
        avatarUrl: avatarUrl ? avatarUrl : "",
        status: status ? status : true,
      }).save();
      res.status(200).json({
        message: "Usuario creado correctamente",
        user: newUser,
        CodeResult: STATUS_CODES.SUCCESS,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Hubo un error al crear usuario",
      CodeResult: STATUS_CODES.ERROR,
      errorMessage: error,
    });
  }
};

// Actualizar Producto
exports.updateUser = async (req, res) => {
  const { name, role, phoneNumber, avatarUrl, password, email, status } =
    req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    let passwordHash = "";
    if (password) {
      passwordHash = await bcrypt.hash(password, salt);
    }
    const newUser = {
      email: email,
      name: name,
      role: role,
      phoneNumber: phoneNumber,
      password: passwordHash,
      avatarUrl: avatarUrl,
      status: status,
    };
    const updated = await User.findOneAndUpdate(
      { _id: req.params.id },
      newUser,
      { new: true }
    ).exec();
    res.status(200).json({
      CodeResult: STATUS_CODES.SUCCESS,
      updated,
    });
  } catch (err) {
    console.log("Error al actualizar el usuario: ", err);
    res.status(400).json({
      errorMessage: "Error al actualizar el usuario",
      CodeResult: STATUS_CODES.ERROR,
    });
  }
};

exports.currentUser = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "El usuario no existe",
        CodeResult: STATUS_CODES.INVALID,
      });
    }
    res.status(200).json({
      user,
      CodeResult: STATUS_CODES.SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener usuario",
      CodeResult: STATUS_CODES.ERROR,
      errorMessage: error,
    });
  }
};

exports.getAllUsers = async (_, res) => {
  try {
    let users = await User.find();
    if (users.length === 0) {
      res.status(200).json({
        CodeResult: STATUS_CODES.INVALID,
        message:
          "Por el momento no existen usuarios registrados, registra un usuario para añadirlo a la lista.",
      });
    } else {
      return res.status(200).json({
        CodeResult: STATUS_CODES.SUCCESS,
        message: "Listado de usuarios registrados",
        users,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener usuarios",
      CodeResult: STATUS_CODES.ERROR,
      errorMessage: error,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findOneAndRemove({
      _id: req.params.id,
    }).exec();
    res.status(200).json({
      CodeResult: STATUS_CODES.SUCCESS,
      deleted,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      errorMessage: "Error al eliminar el usuario",
      CodeResult: STATUS_CODES.ERROR,
    });
  }
};

exports.sendEmailWithCodeToChangePassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (email === "") {
      res.status(200).json({ message: "El correo es obligatorio" });
      return;
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({
        errorMessage: "El usuario no existe.",
        CodeResult: STATUS_CODES.INVALID,
      });
    } else {
      const code = shortid.generate();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_GMAIL,
          pass: process.env.PASSWORD_GMAIL_MAC,
        },
      });
      const mailOptions = {
        from: process.env.USER_GMAIL,
        to: email,
        subject: `Recuperación de contraseña`,
        text:
          "Estimado:\nHemos recibido una solicitud para modificar tu contraseña.\nIntroduce el siguiente codigo para restablecer tu contraseña: " +
          `${code}`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          res.status(200).json({
            message: "Error al enviar email" + err,
            CodeResult: STATUS_CODES.INVALID,
          });
        } else {
          res.status(200).json({
            message: "Correo enviado correctamente",
            code,
            email,
            CodeResult: STATUS_CODES.SUCCESS,
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      message: "Hubo un error al enviar correo.",
      error,
      CodeResult: STATUS_CODES.ERROR,
    });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({
        errorMessage: "El usuario no existe.",
        CodeResult: STATUS_CODES.INVALID,
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const newUser = {
        email: email,
        password: passwordHash,
      };
      await User.findOneAndUpdate({ email }, newUser).exec();
      res.status(200).json({
        CodeResult: STATUS_CODES.SUCCESS,
        message: "Contraseña modificada correctamente",
      });
    }
  } catch (error) {
    console.log(err);
    return res.status(200).json({
      errorMessage: "Error al cambiar la contraseña",
      CodeResult: STATUS_CODES.ERROR,
    });
  }
};
