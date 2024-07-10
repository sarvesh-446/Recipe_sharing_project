const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		ingredients: [
			{
				name: {
					type: String,
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
				unit: {
					type: String,
					required: true,
				},
			},
		],
		instructions: {
			type: String,
			required: true,
		},
		cook_time: {
			type: Number,
			required: true,
		},
		servings: {
			type: Number,
			required: true,
		},
		category: {
			type: String,
			required: true,
			enum: ["american", "thai", "indian", "italian"], // Add more categories as needed
		},
		difficulty: {
			type: String,
			required: true,
			enum: ["easy", "medium", "hard"],
		},
		// image: {
		//     type: String,
		//     required: true
		// },
		tags: [String],
		
		userOwner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
			required: true,
		}
	},

	{
		timestamps: true, // Automatically creates 'createdAt' and 'updatedAt' fields
	}
);

module.exports = mongoose.model("recipes", recipeSchema);
