const User = require("../models/user");

const STATUS_CODES = {
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  INVALID: "INVALID",
};

exports.createNewUser = async (req, res) => {
  try {
    const { emailUser, picture, uid } = req.user;
    const { email, displayName, role, phoneNumber, avatarUrl, id } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(200).json({
        message: "Usuario ya existe",
        CodeResult: STATUS_CODES.INVALID,
      });
    } else {
      const newUser = await new User({
        email: email ? email : emailUser,
        name: displayName ? displayName : email.split("@")[0],
        role: role ? role : "subscriber",
        phoneNumber: phoneNumber ? phoneNumber : "",
        avatarUrl: avatarUrl ? avatarUrl : picture,
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
