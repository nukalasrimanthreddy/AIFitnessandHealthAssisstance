const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dietaryPreferences: {
    type: [String],
    default: []
  },
  allergies: {
    type: [String],
    default: []
  },
  pantryItems: {
    type: [String],
    default: []
  },
  calorieTarget: {
    type: Number,
    default: 2000
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  workoutHistory: [
    {
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
              exercise: {
                type: String,
                required: true
              },
              sets: {
                type: String, // Keep it string because it can be "3", "Hold for 30 sec", etc.
                required: true
              },
              reps: {
                type: String,
                required: true
              },
              weight: {
                type: String,
                default: '---'
              },
              rest: {
                type: String,
                default: '---'
              }
            }
          ]
        }
      ]
    }
  ]
});

module.exports = mongoose.model('User', UserSchema);

