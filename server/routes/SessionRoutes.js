const express = require("express");
const { signin, logout, verify } = require( "../controllers/SessionController");
const router = express.Router();

router.post("/api/account/signin", signin);
router.get("/api/account/logout", logout)
router.get("/api/account/verify", verify)

module.exports = router;