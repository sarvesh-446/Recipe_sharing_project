import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import RecipeModal from "../component/RecipeModal";
import Notification from "../component/Notification"; // Import the Notification component

export const SavedRecipe = () => {
	const userID = useGetUserID();
	const [cookies] = useCookies(["access_token"]);
	const navigate = useNavigate();

	const [searchQuery, setSearchQuery] = useState("");
	const [filteredRecipes, setFilteredRecipes] = useState([]);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [recipes, setRecipes] = useState([]);
	const [error, setError] = useState(null);
	const [savedRecipes, setSavedRecipes] = useState(new Set());
	const [notification, setNotification] = useState("");

	useEffect(() => {
		if (cookies.access_token) {
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
	}, [cookies]);

	useEffect(() => {
		const fetchSavedRecipes = async () => {
			try {
				const options = {
					method: "GET",
					url: `http://localhost:3001/recipe/saved-recipes/${userID}`,
					params: { fetchDetails: true },
					headers: {
						accept: "application/json",
					},
				};
				axios
					.request(options)
					.then((response) => {
						setRecipes(response.data);
						setSavedRecipes(
							new Set(response.data.map((recipe) => recipe._id))
						);
					})
					.catch((err) => {
						console.error(err);
					});
			} catch (err) {
				setError(
					err.response ? err.response.data.message : err.message
				);
			}
		};

		if (isAuthenticated) {
			fetchSavedRecipes();
		}
	}, [isAuthenticated, userID, cookies.access_token]);

	useEffect(() => {
		setFilteredRecipes(
			recipes.filter((recipe) =>
				recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
			)
		);
	}, [searchQuery, recipes]);

	const fetchRecipeDetails = async (recipeID) => {
		const options = {
			method: "GET",
			url: `http://localhost:3001/recipe/${recipeID}`,
			headers: {
				accept: "application/json",
			},
		};
		try {
			const response = await axios.request(options);
			return response.data;
		} catch (error) {
			console.log(error);
			return null;
		}
	};

	const openModal = async (recipe) => {
		const recipeDetails = await fetchRecipeDetails(recipe._id);
		setSelectedRecipe(recipeDetails);
	};

	const closeModal = () => {
		setSelectedRecipe(null);
	};

	if (!isAuthenticated) {
		return (
			<div className="not-authenticated">
				<h2>You need to be signed in to Save a recipe</h2>
				<button onClick={() => navigate("/auth")} className="log-btn">
					Login / Register
				</button>
			</div>
		);
	}

	const handleSaveClick = (event, recipe) => {
		event.stopPropagation();
		const recipeID = recipe._id;

		const options = {
			method: "DELETE",
			url: `http://localhost:3001/recipe/delete-save-recipe`,
			headers: {
				accept: "application/json",
			},
			data: {
				userID,
				recipeID,
			},
		};

		axios
			.request(options)
			.then((response) => {
				const updatedSavedRecipes = new Set(savedRecipes);
				updatedSavedRecipes.delete(recipeID);
				setSavedRecipes(updatedSavedRecipes);
				setNotification("Recipe Removed!");

				const updatedRecipes = recipes.filter(
					(r) => r._id !== recipeID
				);
				setRecipes(updatedRecipes);
			})
			.catch((err) => {
				console.error(err);
				setNotification("Failed to remove recipe.");
			});

		setTimeout(() => {
			setNotification("");
		}, 3000);
	};

	const isRecipeSaved = (recipe) => savedRecipes.has(recipe._id);

	return (
		<div>
			<div className="Home">
				<header className="Home-header">
					<h1>Saved Recipes</h1>
					<input
						type="text"
						placeholder="Search recipes..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</header>
			</div>
			{notification && (
				<Notification
					message={notification}
					onClose={() => setNotification("")}
				/>
			)}
			<div className="container">
				{filteredRecipes.length > 0 ? (
					filteredRecipes.map((recipe) => (
						<div
							className="recipe"
							key={recipe._id}
							onClick={() => openModal(recipe)}
						>
							<h2>{recipe.title}</h2>
							<img src={recipe.image} alt={recipe.title} />
							<p>
								Difficulty level:{" "}
								<span className="difficulty">
									{recipe.difficulty}
								</span>
							</p>
							<p>
								Time to Cook:{" "}
								<span className="difficulty">
									{recipe.cook_time} Minutes
								</span>
							</p>
							<button
								className={`save-btn ${
									isRecipeSaved(recipe) ? "saved" : ""
								}`}
								onClick={(event) =>
									handleSaveClick(event, recipe)
								}
							>
								Unsave
							</button>
						</div>
					))
				) : (
					<h2>Nothing to show</h2>
				)}
			</div>
			<RecipeModal
				selectedRecipe={selectedRecipe}
				closeModal={closeModal}
			/>
		</div>
	);
};
