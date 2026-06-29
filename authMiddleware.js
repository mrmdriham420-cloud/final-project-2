const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  const token =
    req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "No Token"
    });
  }

  try {

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.user = decoded;

    next();

  } catch {

    return res.status(401).json({
      message: "Invalid Token"
    });
  }
};