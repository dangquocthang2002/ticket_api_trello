const { verifyToken } = require("../utils/jwt.util");
const userSchema = require("../models/users.model");

const jwt = require("jsonwebtoken");
const { checkUserInBoard } = require("../services/boards.service");

const verifyLogin = (roles = []) => {
  return async (req, res, next) => {
    const wrongAuth = () => {
      res.status(401).json("Permission denied!");
    };

    try {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader.split(" ")[1];
      const data = verifyToken(token);

      if (data?._id) {
        const user = await userSchema.findById(data._id);
        if (roles.includes(user.role)) {
          req.data = user;
          next();
        } else {
          wrongAuth();
        }
      } else {
        wrongAuth();
      }
    } catch (error) {
      console.log("401 error", error);
      wrongAuth();
    }
  };
};
const checkUserInBoardMiddleWare = () => {
  return async (req, res, next) => {
    const wrongAuth = () => {
      res.status(401).json("Permission denied!");
    };
    try {
      if (req.data.role === "ADMIN") {
        req.boardId = req.params.id;

        next();
      } else {
        const check = await checkUserInBoard(req.data, req.params.id);
        if (check) {
          req.boardId = req.params.id;
          next();
        } else {
          wrongAuth();
        }
      }
    } catch (error) {
      wrongAuth();
    }
  };
};
module.exports = { verifyLogin, checkUserInBoardMiddleWare };
