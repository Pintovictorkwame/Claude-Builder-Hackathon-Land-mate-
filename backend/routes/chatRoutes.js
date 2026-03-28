const express = require('express');
const { body } = require('express-validator');
const { chat, getChatSessions, getChatHistory } = require('../controllers/chatController');
const { protect, optionalProtect } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const chatValidation = [
  body('message').notEmpty().withMessage('Message is required')
];

// Routes
router.get('/sessions', protect, getChatSessions);       // Private
router.get('/history/:sessionId', protect, getChatHistory); // Private
router.post('/', optionalProtect, chatValidation, chat); // Public or Private

module.exports = router;
