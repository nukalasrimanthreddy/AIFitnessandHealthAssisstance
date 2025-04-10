const express = require('express');
const mealController = require('../controllers/mealController');

const router = express.Router();

router.post('/generate', mealController.generateMealPlan);

router.get('/user/:userId', mealController.getUserMealPlans);

router.get('/history/:userId', mealController.getUserMealHistory);

router.delete('/plan/:id', mealController.deleteMealPlan);

module.exports = router;
