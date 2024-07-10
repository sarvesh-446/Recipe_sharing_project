import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Notification from "../component/Notification";
import "./PostRecipe.css";

export const PostRecipe = ({ recipeData, onClose }) => {
	const userID = useGetUserID();
	const [cookies] = useCookies(["access_token"]);
	const navigate = useNavigate();
	const [notification, setNotification] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [recipe, setRecipe] = useState({
		title: "",
		description: "",
		ingredients: [{ name: "", quantity: "", unit: "g" }],
		instructions: "",
		cook_time: "",
		servings: "",
		category: "american",
		difficulty: "easy",
		tags: "",
		image: "",
		userOwner: userID,
	});
	const [file, setFile] = useState();
	const [isEditing, setIsEditing] = useState(null);

	useEffect(() => {
		if (cookies.access_token) {
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
	}, [cookies]);

	useEffect(() => {
		if (recipeData) {
			setRecipe(recipeData);
		}
	}, [recipeData]);

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setRecipe({ ...recipe, [name]: value });
	};

	const handleIngredientChange = (index, event) => {
		const { name, value } = event.target;
		const updatedIngredients = recipe.ingredients.map((ingredient, i) =>
			i === index ? { ...ingredient, [name]: value } : ingredient
		);
		setRecipe({ ...recipe, ingredients: updatedIngredients });
	};

	const handleEdit = (index) => {
		setIsEditing(index);
	};

	const handleSave = (index) => {
		setIsEditing(null);
	};

	const handleCancel = () => {
		setIsEditing(null);
	};

	const handleDelete = (index) => {
		const updatedIngredients = recipe.ingredients.filter(
			(_, i) => i !== index
		);
		setRecipe({ ...recipe, ingredients: updatedIngredients });
	};

	const addIngredient = () => {
		setRecipe({
			...recipe,
			ingredients: [
				...recipe.ingredients,
				{ name: "", quantity: "", unit: "g" },
			],
		});
	};

	// const uploadImage = async () => {
	// 	const formData = new FormData();
	// 	formData.append("file", file);
	// 	const response = await axios.post(
	// 		"http://localhost:3001/recipe/upload-image",
	// 		formData,
	// 		{
	// 			headers: {
	// 				"Content-Type": "multipart/form-data",
	// 			},
	// 		}
	// 	);
	// 	return response.data.imagePath;
	// };

	const onSubmit = async (event) => {
		event.preventDefault();
		let imagePath = recipe.image;
		if (file) {
			imagePath = await uploadImage();
		}
		const newRecipe = { ...recipe };
		const options = {
			method: recipeData ? "PUT" : "POST",
			url: recipeData
				? `http://localhost:3001/recipe/edit-recipe/${recipe._id}`
				: "http://localhost:3001/recipe/post-recipe",
			headers: {
				accept: "application/json",
			},
			data: newRecipe,
		};
		axios
			.request(options)
			.then((response) => {
				if (onClose) onClose();
				navigate("/my_recipe");
				
			})
			.catch((err) => {
				console.error(err);
				setNotification("Failed to submit recipe.");
			});
	};

	if (!isAuthenticated) {
		return (
			<div className="not-authenticated">
				<h2>You need to be signed in to post a recipe</h2>
				<button onClick={() => navigate("/auth")} className="log-btn">
					Login / Register
				</button>
			</div>
		);
	}

	return (
		<div className="post-container">
			{notification && <Notification message={notification} />}
			<h2>
				{recipeData
					? "Edit Your Recipe Magic"
					: "Share Your Recipe Magic"}
			</h2>
			<p>
				From Your Kitchen to the World's Plate: <br></br>Share Your Best
				Recipes!
			</p>
			<form
				onSubmit={onSubmit}
				id="recipe-form"
				method="post"
				encType="multipart/form-data"
			>
				<div className="form-group">
					<label htmlFor="title">Recipe Title</label>
					<input
						type="text"
						id="title"
						name="title"
						placeholder="Enter Recipe Name"
						value={recipe.title}
						onChange={handleInputChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="description">Description</label>
					<textarea
						id="description"
						name="description"
						placeholder="Enter Recipe Description"
						value={recipe.description}
						onChange={handleInputChange}
						required
					></textarea>
				</div>
				<div className="form-group" id="ingredients">
					<label>Ingredients</label>
					{recipe.ingredients.map((ingredient, index) => (
						<div className="ingredient" key={index}>
							<input
								type="text"
								name="name"
								placeholder="Ingredient"
								value={ingredient.name}
								onChange={(e) =>
									handleIngredientChange(index, e)
								}
								required
							/>
							<input
								type="number"
								name="quantity"
								placeholder="Quantity"
								value={ingredient.quantity}
								onChange={(e) =>
									handleIngredientChange(index, e)
								}
								required
							/>
							<select
								name="unit"
								value={ingredient.unit}
								onChange={(e) =>
									handleIngredientChange(index, e)
								}
								required
							>
								<option value="g">g</option>
								<option value="ml">ml</option>
								<option value="cup">cup</option>
								<option value="tbsp">tbsp</option>
								<option value="nos">nos</option>
								{/* Add more units as needed */}
							</select>
							{isEditing === index ? (
								<>
									<button
										type="button"
										onClick={() => handleSave(index)}
									>
										Save
									</button>
									<button
										type="button"
										onClick={handleCancel}
									>
										Cancel
									</button>
								</>
							) : (
								<>
									<button
										type="button"
										onClick={() => handleEdit(index)}
									>
										Edit
									</button>
									<button
										type="button"
										onClick={() => handleDelete(index)}
									>
										Delete
									</button>
								</>
							)}
						</div>
					))}
					<button
						type="button"
						onClick={addIngredient}
						style={{
							margin: "auto",
						}}
					>
						Add More
					</button>
				</div>
				<div className="form-group">
					<label htmlFor="instructions">Instructions</label>
					<textarea
						id="instructions"
						name="instructions"
						value={recipe.instructions}
						onChange={handleInputChange}
						required
					></textarea>
				</div>
				<div className="form-group">
					<label htmlFor="cook-time">Cooking Time (minutes)</label>
					<input
						type="number"
						id="cook-time"
						name="cook_time"
						value={recipe.cook_time}
						onChange={handleInputChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="servings">Servings</label>
					<input
						type="number"
						id="servings"
						name="servings"
						value={recipe.servings}
						onChange={handleInputChange}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="category">Category</label>
					<select
						id="category"
						name="category"
						value={recipe.category}
						onChange={handleInputChange}
						required
					>
						<option value="american">American</option>
						<option value="thai">Thai</option>
						<option value="indian">Indian</option>
						<option value="italian">Italian</option>
						{/* Add more categories as needed */}
					</select>
				</div>
				<div className="form-group">
					<label htmlFor="difficulty">Difficulty Level</label>
					<select
						id="difficulty"
						name="difficulty"
						value={recipe.difficulty}
						onChange={handleInputChange}
						required
					>
						<option value="easy">Easy</option>
						<option value="medium">Medium</option>
						<option value="hard">Hard</option>
					</select>
				</div>
				{/* <div className="form-group">
					<label htmlFor="image">Image (Optional) </label>
					<input
						type="file"
						onChange={(e) => setFile(e.target.files[0])}
					/>
					{recipe.image && (
						<img
							src={`http://localhost:3001${recipe.image}`}
							alt={recipe.title}
							style={{ width: "100px", height: "100px" }}
						/>
					)}
				</div> */}
				<div className="form-group">
					<label htmlFor="tags">Tags</label>
					<input
						type="text"
						id="tags"
						name="tags"
						placeholder="e.g., spicy, healthy, quick"
						value={recipe.tags}
						onChange={handleInputChange}
					/>
				</div>
				<button className="sub-button" type="submit">
					{recipeData ? "Update Recipe" : "Submit Recipe"}
				</button>
				<button
					type="button"
					className="sub-button"
					style={{
						marginTop: "10px",
					}}
					onClick={onClose}
				>
					Cancel
				</button>
			</form>
		</div>
	);
};
