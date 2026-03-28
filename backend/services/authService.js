const User = require('../models/User');

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 * @returns {Object} - { token, user }
 */
const registerUser = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('A user with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  // Create user (password is hashed via pre-save hook)
  const user = await User.create({ name, email, password });

  // Generate token
  const token = user.generateAuthToken();

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

/**
 * Login an existing user
 * @param {Object} credentials - { email, password }
 * @returns {Object} - { token, user }
 */
const loginUser = async ({ email, password }) => {
  // Find user and explicitly include password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Validate password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Generate token
  const token = user.generateAuthToken();

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};
