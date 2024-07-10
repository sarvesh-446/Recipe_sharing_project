import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { PostRecipe } from "./post_recipe";
import RecipeModal from "../component/RecipeModal";
import Notification from "../component/Notification";

export const MyRecipe = () => {
	const userID = useGetUserID();
	const [cookies] = useCookies(["access_token"]);
	const navigate = useNavigate();

	const [searchQuery, setSearchQuery] = useState(""); // State for search query
	const [filteredRecipes, setFilteredRecipes] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [editRecipeData, setEditRecipeData] = useState(null);
	const [selectedRecipe, setSelectedRecipe] = useState(null);
	const [recipes, setRecipes] = useState([]);
	const [myRecipes, setMyRecipes] = useState(new Set());
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [notification, setNotification] = useState(""); // Notification state

	useEffect(() => {
		if (cookies.access_token) {
			setIsAuthenticated(true);
		} else {
			setIsAuthenticated(false);
		}
		setIsLoading(false);
		setNotification("");
	}, [cookies]);

	useEffect(() => {
		const fetchMyRecipes = async () => {
			const data = await getMyRecipes();
			setRecipes(data);
		};
		fetchMyRecipes();
	}, []);

	useEffect(() => {
		// Filter recipes based on search query
		setFilteredRecipes(
			recipes.filter((recipe) =>
				recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
			)
		);
	}, [searchQuery, recipes]);

	const getMyRecipes = async () => {
		const options = {
			method: "GET",
			url: `${process.env.REACT_APP_SERVER_URL}/recipe/my-recipes/${userID}`,
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
			url: `${process.env.REACT_APP_SERVER_URL}/recipe/${recipeID}`,
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

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!isAuthenticated) {
		return (
			<div className="not-authenticated">
				<h2>
					You need to be signed in to Post, Edit and Delete Your
					recipe
				</h2>
				<button onClick={() => navigate("/auth")} className="log-btn">
					Login / Register
				</button>
			</div>
		);
	}

	const deleteRecipe = (event, recipe) => {
		event.stopPropagation();
		const recipeID = recipe._id;

		const options = {
			method: "DELETE",
			url: `${process.env.REACT_APP_SERVER_URL}/recipe/my-recipes`,
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
				const updatedRecipes = recipes.filter(
					(r) => r._id !== recipeID
				);
				setRecipes(updatedRecipes);
				setNotification("Recipe Removed!");

				setTimeout(() => {
					setNotification("");
				}, 3000);
			})
			.catch((err) => {
				console.error(err);
				setNotification("Failed to remove recipe.");

				setTimeout(() => {
					setNotification("");
				}, 3000);
			});
	};

	const editRecipe = (event, recipe) => {
		event.stopPropagation();
		setIsEditing(true);
		setEditRecipeData(recipe);
	};

	const handleFormClose = () => {
		setIsEditing(false);
		setEditRecipeData(null);
	};

	return (
		<div>
			{notification && <Notification message={notification} />}
			<div className="Home">
				<header className="Home-header">
					<h1>{isEditing ? "Edit Your Recipe" : "My Recipes"}</h1>
					<input
						type="text"
						placeholder="Search recipes..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
					/>
				</header>
				<p>{isEditing ? "Update your recipe details below:" : ""}</p>
			</div>
			<div className="container">
				{isEditing ? (
					<PostRecipe
						recipeData={editRecipeData}
						onClose={handleFormClose}
					/>
				) : (
					<>
						{filteredRecipes.length > 0 ? (
							filteredRecipes.map((recipe) => (
								<div
									className="recipe"
									key={recipe._id}
									onClick={() => openModal(recipe)}
								>
									<h2>{recipe.title}</h2>
									{/* <img
										src={recipe.image}
										alt={recipe.title}
									/> */}
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
									<div className="recipe-container">
										<button
											onClick={(event) =>
												editRecipe(event, recipe)
											}
										>
											Edit
										</button>
										<button
											onClick={(event) =>
												deleteRecipe(event, recipe)
											}
										>
											Delete
										</button>
									</div>
								</div>
							))
						) : (
							<h2>Nothing to show</h2>
						)}
					</>
				)}
			</div>
			<RecipeModal
				selectedRecipe={selectedRecipe}
				closeModal={closeModal}
			/>
		</div>
	);
};
