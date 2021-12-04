const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "invalid token" });
  }
};

exports.adminOnly = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (verified.role && verified.role === "admin") {
    next();
    return;
  }
  res.status(403).send({ message: "forbidden" });
};
