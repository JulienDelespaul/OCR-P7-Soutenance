const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const User = require("../models/user");

// Sign up and login

// Sign up
exports.signup = (req, res, next) => {
	bcryptjs
		//hashing and salting the password
		.hash(req.body.password, 10)
		.then((hash) => {
			//creating a new user
			const user = new User({
				email: req.body.email,
				password: hash,
				role: req.body.role,
			});
			//saving the user to the database
			user
				.save()
				.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

// Login
exports.login = (req, res, next) => {
	//finding the user in the database
	User.findOne({ email: req.body.email })
		.then((user) => {
			//if the user is not found
			if (!user) {
				return res.status(401).json({ error: "Utilisateur non trouvé !" });
			}
			bcryptjs
				//comparing the password
				.compare(req.body.password, user.password)
				.then((valid) => {
					//if the password is not valid
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					res.json({
						userId: user._id,
						token: jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "45min" }),
						role: user.role,
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

// User profile

// Get user profile
exports.getUserProfile = (req, res, next) => {
	User.findOne({ _id: req.params.id }, { password: 0 })
		.then((user) => res.status(200).json(user))
		.catch((error) => res.status(404).json({ error }));
};

// Update user profile
exports.updateUserProfile = (req, res, next) => {
	if (req.file) {
		if (user.imageUrl !== null) {
			const filename = user.imageUrl.split("/images/profil/")[1];
			fs.unlink(`images/profil/${filename}`, () => {
				console.log("Image supprimée");
			});
		}
		User.updateOne({ _id: req.params.id }, { ...req.body, imageUrl: `${req.protocol}://${req.get("host")}/images/profil/${req.file.filename}` })
			.then(() => res.status(200).json({ message: "Profil modifié !" }))
			.catch((error) => res.status(400).json({ error }));
	} else {
		User.updateOne({ _id: req.params.id }, { ...req.body, imageUrl: user.imageUrl })
			.then(() => res.status(200).json({ message: "Profil modifié !" }))
			.catch((error) => res.status(400).json({ error }));
	}
};
