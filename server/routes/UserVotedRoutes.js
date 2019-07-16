const express = require("express");
const {create} = require( "../controllers/UserVotedController");
const router = express.Router();

router.post("/api/user/didvote", create);


module.exports = router;