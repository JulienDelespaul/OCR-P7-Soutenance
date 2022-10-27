const express = require("express");
const router = express.Router();
const { validator } = require("../middleware/validator");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const userCtrl = require("../controllers/user");

router.post("/signup", validator, userCtrl.signup);
router.post("/login", validator, userCtrl.login);

router.get("/profile/:id", auth, userCtrl.getUserProfile);
router.put("/profile/:id", auth, multer, userCtrl.updateUserProfile);

module.exports = router;
