import React from "react";
import logo from "../img/logo.jpg";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";

const Bar = () => {
	const [cookies, setCookies] = useCookies(["access_token"]);
	const navigate = useNavigate();

	const logout = () => {
		setCookies("access_token", "");
		window.localStorage.removeItem("userID");
		navigate("/");
		window.location.reload();
	};

	return (
		<div className="js-navigation-container">
			<nav className="nav">
				<div class="logo-container">
					<img src={logo} alt="Logo" />
					<label>RecipeItUp</label>
				</div>
				<Link to="/">Home</Link>
				<Link to="/post_recipe">Add Recipe</Link>
				<Link to="/saved_recipe">Saved Recipes</Link>
				<Link to="/my_recipe">My Recipes</Link>
				{!cookies.access_token ? (
					<Link to="/auth">Login / Register</Link>
				) : (
					<button className="log-btn" onClick={logout}>
						Logout
					</button>
				)}
			</nav>
		</div>
	);
};

export default Bar;
