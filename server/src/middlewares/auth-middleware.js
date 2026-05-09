const jwt = require("jsonwebtoken");

const authMiddleware = (
  req,
  res,
  next
) => {

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    // TOKEN EXPIRED
    if (
      error.name === "TokenExpiredError"
    ) {

      return res.status(401).json({
        message: "Access token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    // INVALID TOKEN
    return res.status(401).json({
      message: "Invalid token",
      code: "INVALID_TOKEN",
    });
  }
};

module.exports = authMiddleware;