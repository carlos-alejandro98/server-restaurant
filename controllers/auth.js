const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
        email
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
  console.log(req.body);
  try {
    const { name, role, phoneNumber, avatarUrl, password, email } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(200).json({
        message: "Usuario ya existe",
        CodeResult: STATUS_CODES.INVALID,
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      let passwordHash = '';
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

exports.updateUser = async (req, res) => {
  try {
    const { email, name, role } = req.user;
    const { nameBody, emailBody, roleBody } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      res.status(200).json({
        message: "Usuario no existe",
        CodeResult: STATUS_CODES.INVALID,
      });
    }
    const user = await User.findOneAndUpdate({
      ...req.user,
      name: nameBody ? nameBody : name,
      email: emailBody ? emailBody : email,
      role: roleBody ? roleBody : role,
    });
    res.json({
      message: "Usuario modificado correctamente",
      user,
      CodeResult: STATUS_CODES.SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Hubo un error al modificar usuario",
      CodeResult: STATUS_CODES.ERROR,
      errorMessage: error,
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
