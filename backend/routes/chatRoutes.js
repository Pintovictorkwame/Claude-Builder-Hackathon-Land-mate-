const express = require('express');
const { body } = require('express-validator');
const { chat, getChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const chatValidation = [
  body('message', 'Message is required').not().isEmpty(),
];

// All chat routes are protected
router.use(protect);

router.get('/history', getChatHistory);
router.post('/', chatValidation, chat);

module.exports = router;
