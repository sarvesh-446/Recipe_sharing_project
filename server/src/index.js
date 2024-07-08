const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());


app.use("/auth", authRouter);
app.use("/recipe", recipeRouter);