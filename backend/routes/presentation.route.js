const express = require("express");
const router = express.Router();
const presentationController = require("../controllers/presentation.controller");
const upload = require("../middleware/upload");

router.post(
  "/upload",
  upload.single("file"),
  presentationController.uploadPresentation
);
router.get("/presentation/:id", presentationController.getPresentation);

module.exports = router;
