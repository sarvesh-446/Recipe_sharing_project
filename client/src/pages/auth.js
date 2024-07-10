import React, { useState } from "react";
import axios from "axios";
import "../App.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Notification from "../component/Notification";
import "./Auth.css"

export const Auth = () => {
	const [showLogin, setShowLogin] = useState(true);

	const toggleForm = () => {
		setShowLogin(!showLogin);
	};

	return (
		<div className="auth">
			{showLogin ? (
				<Login toggleForm={toggleForm} />
			) : (
				<Register toggleForm={toggleForm} />
			)}
		</div>
	);
};

const Login = ({ toggleForm }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [notification, setNotification] = useState("");

	const [_, setCookies] = useCookies(["access_token"]);

	const navigate = useNavigate();

	const onSubmit = async (event) => {
		event.preventDefault();
		const options = {
			method: "POST",
			url: `http://localhost:3001/auth/login`,
			headers: {
				accept: "application/json",
			},
			data: {
				username,
				password,
			},
		};

		axios
			.request(options)
			.then((response) => {
				setCookies("access_token", response.data.token);
				window.localStorage.setItem("userID", response.data.id);
				navigate("/");
			})
			.catch((err) => {
				console.error(err);
				setNotification("Invalid username or password.");
			});
	};
	const closeNotification = () => {
		setNotification("");
	};

	return (
		<div className="auth-container">
			{notification && (
				<Notification
					message={notification}
					onClose={closeNotification}
				/>
			)}
			<input type="checkbox" id="check" />
			<div className="login form">
				<header>Login</header>
				<form onSubmit={onSubmit}>
					<input
						type="text"
						placeholder="Enter your username"
						value={username}
						onChange={(event) => setUsername(event.target.value)}
					/>
					<input
						type="password"
						placeholder="Enter your password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
					/>
					{/* <a href="#">Forgot password?</a> */}
					<input type="submit" className="button" value="Login" />
				</form>
				<div className="signup">
					<span className="signup">Don't have an account?</span>
					<label htmlFor="check" onClick={toggleForm}>
						Signup
					</label>
				</div>
			</div>
		</div>
	);
};

const Register = ({ toggleForm }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordMatch, setPasswordMatch] = useState(true);
	const [notification, setNotification] = useState("");

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
		setPasswordMatch(event.target.value === confirmPassword);
	};

	const handleConfirmPasswordChange = (event) => {
		setConfirmPassword(event.target.value);
		setPasswordMatch(event.target.value === password);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const options = {
			method: "POST",
			url: `http://localhost:3001/auth/Register`,
			headers: {
				accept: "application/json",
			},
			data: {
				username,
				password: confirmPassword,
			},
		};
		axios
			.request(options)
			.then((response) => {
				setNotification("Registration Completed! Now Login");
				toggleForm();
			})
			.catch((error) => {
				setNotification("Username Already exists");
			});
	};

	const closeNotification = () => {
		setNotification("");
	};

	return (
		<div className="auth-container">
			{notification && (
				<Notification
					message={notification}
					onClose={closeNotification}
				/>
			)}
			<div className="registration form">
				<header>Signup</header>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Enter your username"
						value={username}
						onChange={(event) => setUsername(event.target.value)}
					/>
					<input
						type="password"
						placeholder="Create a password"
						value={password}
						onChange={handlePasswordChange}
					/>
					<input
						type="password"
						placeholder="Confirm your password"
						value={confirmPassword}
						onChange={handleConfirmPasswordChange}
					/>
					{!passwordMatch && (
						<p style={{ color: "red" }}>Passwords do not match!</p>
					)}
					<input type="submit" className="button" value="Signup" />
				</form>
				<div className="signup">
					<span className="signup">Already have an account?</span>
					<label htmlFor="check" onClick={toggleForm}>
						Login
					</label>
				</div>
			</div>
		</div>
	);
};
