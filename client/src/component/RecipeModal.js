import React from "react";
import "../App.css";

const RecipeModal = ({ selectedRecipe, closeModal }) => {
	return (
		selectedRecipe && (
			<div className="modal">
				<div className="modal-content">
					<span className="close" onClick={closeModal}>
						&times;
					</span>
					<h2>{selectedRecipe.title}</h2>
					
					<p>{selectedRecipe.description}</p>
					<div className="ingredients-container">
						<h3>Ingredients</h3>
						<ul className="ingredients-list">
							{selectedRecipe.ingredients.map(
								(ingredient, index) => (
									<li key={index} className="ingredient-item">
										<span className="ingredient-name">
											{ingredient.name}
										</span>
										<span className="ingredient-quantity">
											{ingredient.quantity}
										</span>
										<span className="ingredient-unit">
											{ingredient.unit}
										</span>
									</li>
								)
							)}
						</ul>
					</div>
					<p className="instructions">
						<strong>Instructions:</strong>{" "}
						{selectedRecipe.instructions}
					</p>
					<p>
						<strong>Cooking Time:</strong>{" "}
						{selectedRecipe.cook_time} minutes
					</p>
					<p>
						<strong>Difficulty:</strong> {selectedRecipe.difficulty}
					</p>
					<p>
						<strong>Servings:</strong> {selectedRecipe.servings}
					</p>
					<p>
						<strong>Tags:</strong> {selectedRecipe.tags}
					</p>
				</div>
			</div>
		)
	);
};

export default RecipeModal;
