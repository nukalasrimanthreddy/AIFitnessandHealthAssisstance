const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");

router.post("/create", workoutController.createWorkout);
router.get("/:userId", workoutController.getWorkoutPlans);
router.delete("/:planID", workoutController.deleteWorkoutPlan);
module.exports = router;
