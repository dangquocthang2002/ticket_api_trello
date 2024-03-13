const fileController = require("../../controllers/files.controller");

const router = require("express").Router();

router.get("/:folder/:filename", fileController.previewFile);

module.exports = router;
