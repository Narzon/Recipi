const express = require("express");
const { showAll, create } = require( "../controllers/CommentController");
const router = express.Router();

router.get("/api/comments", showAll)
router.post("/api/comments", create);

module.exports = router;