const express = require("express");
const { showAll, create } = require( "../controllers/MarkerController.js");
const router = express.Router();

router.get("/api/markers", showAll)
router.post("/api/markers", create);

module.exports = router;