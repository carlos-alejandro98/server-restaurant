const admin = require("../firebase");
const User = require("../models/user");

// middlewares validation
exports.authCheck = async (req, res, next) => {
  try {
    let firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    req.user = firebaseUser;
    console.log(firebaseUser)
    next();
  } catch (err) {
    res.status(401).json({
      errorMessage: "Invalid or expired token",
    });
  }
};

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email }).exec();
  if (adminUser !== null) {
    if (adminUser.role !== "admin") {
      res.status(403).json({
        errorMessage: "Admin resource. Access denied",
      });
    } else {
      next();
    }
  } else {
    res.status(403).json({
      errorMessage: "No existen usuarios",
    });
  }
};
