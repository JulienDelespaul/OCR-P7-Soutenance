const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const dotenv = require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");

mongoose
	.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.apj7t.mongodb.net/P7?retryWrites=true&w=majority`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(cookieParser());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	// res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(mongoSanitize());

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);
app.use("/api/post", postRoutes);

module.exports = app;
