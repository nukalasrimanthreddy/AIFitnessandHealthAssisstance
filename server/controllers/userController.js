const User = require('../models/User');
const MealHistory = require('../models/MealHistory');


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.createUser = async (req, res) => {
  try {
    const { name, email, password, dietaryPreferences, allergies, pantryItems, calorieTarget } = req.body;
    

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      dietaryPreferences: dietaryPreferences || [],
      allergies: allergies || [],
      pantryItems: pantryItems || [],
      calorieTarget: calorieTarget || 2000
    });
    
    await user.save();
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.updateUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const { dietaryPreferences, allergies, pantryItems, calorieTarget } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    

    if (dietaryPreferences) user.dietaryPreferences = dietaryPreferences;
    if (allergies) user.allergies = allergies;
    if (pantryItems) user.pantryItems = pantryItems;
    if (calorieTarget) user.calorieTarget = calorieTarget;
    
    await user.save();
    

    const history = new MealHistory({
      user: userId,
      action: 'modified',
      details: 'Updated user preferences'
    });
    
    await history.save();
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in updateUserPreferences:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
