const express = require('express');
const router = express.Router();
const usersController = require('./../controllers/users-controller');
const authMiddleware = require('./../middleware/auth-middleware')

// router.get("/", usersController.home);

router.get("/register", usersController.registerForm);
router.post("/register", usersController.register);

router.get("/login", usersController.loginForm);
router.post("/login", usersController.login);

router.get("/profile", authMiddleware.isLoggedIn, usersController.profile);

// router.get("/admin-profile", authMiddleware.isAdmin, usersController.adminProfile);

router.get("/logout", usersController.logout);

module.exports = router;
