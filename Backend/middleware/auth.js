const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  console.log("Received token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    console.log("Token expiration:", new Date(decoded.exp * 1000));

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    console.log("Authenticated user:", req.user);
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).send({ error: "Please authenticate." });
  }
};

const isManager = (req, res, next) => {
  console.log("User role:", req.user.role); // Log user role
  if (req.user.role !== "Manager") {
    return res.status(403).send({ error: "Access denied." });
  }
  next();
};

module.exports = { auth, isManager };
