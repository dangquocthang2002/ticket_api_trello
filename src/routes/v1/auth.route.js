const express = require("express");
const router = express.Router();
const { verifyLogin } = require("../../middlewares/auth.middleware");

const authController = require("../../controllers/auth.controller");

const multer = require("multer");
const handleFile = require("../../middlewares/handleFile.middleware");

router.post("/login", authController.login);

router.post("/register", authController.register);

router.get(
  "/me",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  authController.getMe
);

router.put(
  "/me",
  verifyLogin(["ADMIN", "LEADER", "USER"]),
  multer({ storage: multer.memoryStorage() }).array("filesUpload"),
  handleFile(),
  authController.updateAva
);

module.exports = router;
