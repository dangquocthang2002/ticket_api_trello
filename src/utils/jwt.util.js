const jwt = require("jsonwebtoken");

exports.generateToken = (data) => {
  return (newToken = jwt.sign(
    {
      data: data,
    },
    process.env.JWT_ACCESS_KEY,
    {
      expiresIn: "7days",
    }
  ));
};

exports.verifyToken = (token) => {
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
      return decoded.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);

    return null;
  }
};
