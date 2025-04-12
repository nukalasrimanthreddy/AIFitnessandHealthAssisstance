const mongoose = require("mongoose");

const workoutPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  week: [
    {
      day: {
        type: String,
        required: true
      },
      exercises: [
        {
          exercise: { type: String, required: true },
          sets: { type: String, required: true },
          reps: { type: String, required: true },
          weight: { type: String, default: "---" },
          rest: { type: String, default: "---" }
        }
      ]
    }
  ]
});

module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema);
