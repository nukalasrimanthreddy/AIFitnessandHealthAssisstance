const WorkoutPlan = require("../models/WorkoutPlan");
const User = require('../models/User');
const geminiService = require('../services/geminiService');
const MealHistory = require('../models/MealHistory')
exports.createWorkout = async (req, res) => {
  try {
    console.log(req.body.UserId)
    const prompt = await geminiService.generatePrompt(req.body.formData)
    text = await geminiService.generateText(prompt)
    console.log("created")
    const workoutPlan = new WorkoutPlan({
          userId: req.body.UserId,
          week: text
        });
    await workoutPlan.save();
    const history = new MealHistory({
      user: req.body.UserId,
      action: 'created',
      details: `Created Workout plan ${JSON.stringify(req.body.formData)}`
    });
  await history.save()
    res.status(201).json(workoutPlan);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

exports.getWorkoutPlans = async (req, res) => {
  try {
    const { userId } = req.params;
    const workouts = await WorkoutPlan.find({ userId }).sort({ date: -1 });
    res.status(200).json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteWorkoutPlan = async (req, res)=>{
  console.log("received")
  try {
    const id = req.params.planID;
        
    
    const deletedPlan = await WorkoutPlan.findByIdAndDelete(id);
    if (!deletedPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    console.log(deletedPlan)
    const history = new MealHistory({
          user: deletedPlan.userId,
          action: 'deleted',
          details: `Deleted Workout plan from ${new Date(deletedPlan.generatedAt).toLocaleDateString()}`
        });
    await history.save()
    console.log('success')
    res.status(200).json(deletedPlan);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message });
  }
}

