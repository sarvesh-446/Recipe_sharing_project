const express = require("express");
const recipeRouter = express.Router();
const multer = require("multer");
const path = require("path");
const recipeController = require("../controllers/recipe.js");

// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(
// 			null,
// 			path.join(__dirname, "../../../client/recipe-app/public/images")
// 		);
// 	},
// 	filename: (req, file, cb) => {
// 		cb(
// 			null,
// 			file.fieldname + "_" + Date.now() + path.extname(file.originalname)
// 		);
// 	},
// });

// const upload = multer({
// 	storage: storage,
// });

recipeRouter.get("/", recipeController.getAllRecipes);

recipeRouter.get("/:recipeID", recipeController.getRecipeByID);

// recipeRouter.post("/upload-image", upload.single("file"), recipeController.uploadImage);

recipeRouter.post("/post-recipe", recipeController.postRecipe);

recipeRouter.put("/save-recipe", recipeController.updateSaveRecipe);

recipeRouter.put("/edit-recipe/:recipeID", recipeController.editRecipe);

recipeRouter.get("/saved-recipes/:userID", recipeController.getSaveRecipeByID);

recipeRouter.delete("/delete-save-recipe", recipeController.deleteSaveRecipe );

recipeRouter.get("/my-recipes/:userID", recipeController.getMyRecipesByID);

recipeRouter.delete("/my-recipes", recipeController.deleteMyRecipe);

module.exports = recipeRouter;
