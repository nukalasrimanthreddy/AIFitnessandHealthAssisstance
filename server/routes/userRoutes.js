const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login', userController.loginUser);

router.post('/', userController.createUser);

router.put('/:userId', userController.updateUserPreferences);

router.get('/:userId', userController.getUserById);

module.exports = router;
