const RecipeModel = require("../models/recipes.js");
const UserModel = require("../models/users.js")

exports.getAllRecipes = async (req, res) => {
	try {
		const recipes = await RecipeModel.find();
		return res.status(200).send(recipes);
	} catch (error) {
		return res.status(400).send({ message: error.message });
	}
};

exports.getRecipeByID = async (req, res) => {
	try {
		const recipes = await RecipeModel.findById(req.params.recipeID);
		return res.status(200).send(recipes);
	} catch (error) {
		return res.status(400).send({ message: error.message });
	}
};

exports.postRecipe = async (req, res) => {
	try {
		const recipeTitle = await RecipeModel.findOne({
			title: req.body.title,
		});
		if (recipeTitle) {
			return res.status(400).json({
				message: "Recipe Already exists, Give different recipe title",
			});
		}
		const newRecipe = new RecipeModel(req.body);
		await newRecipe.save();

		const user = await UserModel.findById(req.body.userOwner);
		user.myRecipes.push(newRecipe._id);
		await user.save();

		res.status(201).json(newRecipe);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};


exports.updateSaveRecipe = async (req, res) => {
	try {
		const recipe = await RecipeModel.findById(req.body.recipeID);
		const user = await UserModel.findById(req.body.userID);
		user.savedRecipes.push(recipe);
		await user.save();
		res.json({ savedRecipes: user.savedRecipes });
	} catch (err) {
		res.json(err);
	}
}

exports.editRecipe = async (req, res) => {
	try {
		const recipe = await RecipeModel.findByIdAndUpdate(
			req.params.recipeID,
			req.body,
			{
				new: true,
			}
		);
		res.status(201).json(recipe);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

exports.getSaveRecipeByID =  async (req, res) => {
	try {
		const user = await UserModel.findById(req.params.userID).populate(
			"savedRecipes"
		);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		return res.status(200).json(user.savedRecipes);
	} catch (error) {
		res.status(500).json({
			message: "Error fetching saved recipes",
			error: error.message,
		});
	}
}

exports.deleteSaveRecipe = async (req, res) => {
	const { userID, recipeID } = req.body;

	try {
		const user = await UserModel.findByIdAndUpdate(
			userID,
			{ $pull: { savedRecipes: recipeID } },
			{ new: true }
		);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({
			message: "Recipe removed from saved recipes",
			savedRecipes: user.savedRecipes,
		});
	} catch (err) {
		res.status(500).json({ message: "Server error", error: err.message });
	}
}

exports.getMyRecipesByID = async (req, res) => {
	try {
		const user = await UserModel.findById(req.params.userID).populate(
			"myRecipes"
		);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		return res.status(200).json(user.myRecipes);
	} catch (error) {
		res.status(500).json({
			message: "Error fetching my recipes",
			error: error.message,
		});
	}
}

exports.deleteMyRecipe =  async (req, res) => {
	const { userID, recipeID } = req.body;
	try {
		const user = await UserModel.findByIdAndUpdate(
			userID,
			{ $pull: { myRecipes: recipeID } },
			{ new: true }
		);

		if (!user) {
			return res.status(404).json({ message: "User not  found" });
		}
		const deleteRecipe = await RecipeModel.findByIdAndDelete(recipeID);
		res.json({
			message: "Your Recipe has been removed ",
			myRecipes: user.myRecipes,
		});
	} catch (error) {
		res.status(500).json({
			message: "Error deleting recipes",
			error: error.message,
		});
	}
}
