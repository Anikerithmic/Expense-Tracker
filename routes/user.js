const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();


router.get('/user/login', userController.getLogin);
router.post('/user/login-post', userController.postLogin);
router.get('/user/signup-page', userController.signupPage);
router.post('/user/signup', userController.createUser);

module.exports = router;
