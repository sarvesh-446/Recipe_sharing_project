const express = require("express");
const recipeRouter = express.Router();

const recipeController = require("../controllers/recipe.js");


recipeRouter.get("/", recipeController.getAllRecipes);

recipeRouter.get("/:recipeID", recipeController.getRecipeByID);



recipeRouter.post("/post-recipe", recipeController.postRecipe);

recipeRouter.put("/save-recipe", recipeController.updateSaveRecipe);

recipeRouter.put("/edit-recipe/:recipeID", recipeController.editRecipe);

recipeRouter.get("/saved-recipes/:userID", recipeController.getSaveRecipeByID);

recipeRouter.delete("/delete-save-recipe", recipeController.deleteSaveRecipe );

recipeRouter.get("/my-recipes/:userID", recipeController.getMyRecipesByID);

recipeRouter.delete("/my-recipes", recipeController.deleteMyRecipe);

module.exports = recipeRouter;
