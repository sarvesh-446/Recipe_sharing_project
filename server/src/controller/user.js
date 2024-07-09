const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/users");

exports.registerUser = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await UserModel.findOne({ username });
		if (user) {
			return res.status(400).json({ message: "Username already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new UserModel({
			username,
			password: hashedPassword,
		});

		await newUser.save();
		res.status(201).json(newUser);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}

exports.loginUser =  async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await UserModel.findOne({ username });

		if (!user) {
			return res.status(400).json({ message: "Username didn't exist" });
		}

		const isPassValid = await bcrypt.compare(password, user.password);
		if (!isPassValid) {
			return res.status(400).json({ message: "Incorrect Password" });
		}

		const token = jwt.sign({ id: user._id }, "secret");
		res.json({token,id: user._id});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}