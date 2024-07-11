import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/userGetUserID";
import { useCookies } from "react-cookie";
import RecipeModal from "../component/RecipeModal";
import Notification from "../component/Notification";
import "./RecipeCont.css"


export const Home = () => {
	const userID = useGetUserID();
	const [cookies] = useCookies(["access_token"]);
	const [recipes, setRecipes] = useState([]);
	const [searchQuery, setSearchQuery] = useState(""); // State for search query

	const [filteredRecipes, setFilteredRecipes] = useState([]); // State for filtered recipes
	const [sortOption, setSortOption] = useState([]);

	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [savedRecipes, setSavedRecipes] = useState(new Set());
	const [notification, setNotification] = useState("");

	

	useEffect(() => {
		if (cookies.access_token) {
			setIsAuthenticated(true);
			fetchSavedRecipes(userID);
		} else {
			setIsAuthenticated(false);
		}
	}, [cookies]);

	useEffect(() => {
		const fetchRecipes = async () => {
			const apiData = await getRecipes();
			setRecipes(apiData);
		};

		fetchRecipes();
	}, []);

	useEffect(() => {
		// Filter recipes based on search query
		const filtered = recipes.filter((recipe) =>
			recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
		);
		// Sort the filtered recipes based on the selected sorting option
		sortt(filtered);
	}, [searchQuery, recipes, sortOption]);

	const fetchSavedRecipes = async (userID) => {
		try {
			const response = await axios.get(
				`http://localhost:3001/recipe/saved-recipes/${userID}`
			);
			const savedRecipeIDs = new Set(
				response.data.map((recipe) => recipe._id)
			);
			setSavedRecipes(savedRecipeIDs);
		} catch (error) {
			console.log(error);
		}
	};

	const getRecipes = async () => {
		const options = {
			method: "GET",
			url: `http://localhost:3001/recipe`,
			headers: {
				accept: "application/json",
			},
		};
		try {
			const response = await axios.request(options);
			return response.data;
		} catch (error) {
			console.log(error);
			return [];
		}
	};
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

	const handleSaveClick = (event, recipe) => {
		event.stopPropagation();
		if (!isAuthenticated) {
			setNotification("Not logged in! Login and Save");
		} else {
			const recipeID = recipe._id;
			if (savedRecipes.has(recipeID)) {
				// Recipe is already saved, so remove from saved recipes

				// Trigger state update
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
						savedRecipes.delete(recipeID);
						setSavedRecipes(new Set(savedRecipes)); // Trigger state update
						setNotification("Recipe Removed!");
					})
					.catch((err) => {
						console.error(err);
					});
			} else {
				// Recipe is not saved, so save it
				const options = {
					method: "PUT",
					url: `http://localhost:3001/recipe/save-recipe`,
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
						savedRecipes.add(recipeID);
						setSavedRecipes(new Set(savedRecipes)); // Trigger state update
					})
					.catch((err) => {
						console.error(err);
					});
			}
		}
	};

	const handleSortChange = (event) => {
		setSortOption(event.target.value);
	};

	const difficultyOrder = { easy: 1, medium: 2, hard: 3 };

	const sortt = (recipesToSort) => {
		const sortedRecipes = [...recipesToSort];
		switch (sortOption) {
			case "name-asc":
				sortedRecipes.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "name-desc":
				sortedRecipes.sort((a, b) => b.title.localeCompare(a.title));
				break;
			case "cookTime-asc":
				sortedRecipes.sort((a, b) => a.cook_time - b.cook_time);
				break;
			case "cookTime-desc":
				sortedRecipes.sort((a, b) => b.cook_time - a.cook_time);
				break;
			case "difficulty-low":
				sortedRecipes.sort((a, b) =>
					difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
				);
				break;
			case "difficulty-hard":
				sortedRecipes.sort((a, b) =>
					difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]
				);
				break;
			default:
				break;
		}
		setFilteredRecipes(sortedRecipes);
	};
	const isRecipeSaved = (recipe) => savedRecipes.has(recipe._id);

	const closeNotification = () => {
		setNotification("");
	};

	return (
		<div>
			<div className="Home">
			{notification && (
				<Notification
					message={notification}
					onClose={closeNotification}
				/>
			)}
				<header className="Home-header">
					<h1>Recipe Sharing Platform</h1>
					<div className="filter-cont">
						<input
							type="text"
							placeholder="Search recipes..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
						/>
						<select value={sortOption} onChange={handleSortChange}>
							<option value="">Sort By</option>
							<option value="name-asc">Name: A-Z</option>
							<option value="name-desc">Name: Z-A</option>
							<option value="cookTime-asc">
								Cooking Time: Shortest to Longest
							</option>
							<option value="cookTime-desc">
								Cooking Time: Longest to Shortest
							</option>
							<option value="difficulty-low">
								Difficulty: Easy to Hard
							</option>
							<option value="difficulty-hard">
								Difficulty: Hard to Easy
							</option>
						</select>
					</div>
				</header>
				<div className="container">
					{filteredRecipes.length > 0 ? (
						filteredRecipes.map((recipe) => (
							<div
								className="recipe"
								key={recipe._id}
								onClick={() => openModal(recipe)}
							>
								<h2>{recipe.title}</h2>
								
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
									{isRecipeSaved(recipe) ? "Saved" : "Save"}
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
		</div>
	);
};

export default Home;
