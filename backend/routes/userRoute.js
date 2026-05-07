const express = require('express');
const  router = express.Router();
const userController = require('../controllers/userController');
const isAuthenticated = require('../middleware/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/logout', isAuthenticated, userController.logout);
router.get('/profile', isAuthenticated, userController.getProfile);


module.exports = router;
