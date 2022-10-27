const { body, validationResult } = require("express-validator");

exports.validator = [
	body("email").isEmail().withMessage("L'email n'est pas valide"),
	body("password").isLength({ min: 6 }).withMessage("Le mot de passe doit contenir au moins 6 caractères"),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
			});
		}
		next();
	},
];
