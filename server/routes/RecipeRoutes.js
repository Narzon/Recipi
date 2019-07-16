const express = require("express");
const {show, showAll, create, changeRating, changeRatingLess, showOne } = require( "../controllers/RecipeController");
const router = express.Router();

router.get("/api/myrecipes", show);
router.get("/api/recipes", showAll)
router.post("/api/recipes", create);
router.post("/api/recipes/plusrating", changeRating)
router.post("/api/recipes/minusrating", changeRatingLess)
router.post("/api/recipes/find", showOne);

module.exports = router;