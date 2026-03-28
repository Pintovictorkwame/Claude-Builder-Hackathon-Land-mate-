const express = require('express');
const { extractText, analyzeDocument } = require('../controllers/ocrController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Upload a single file (field name 'document')
router.post('/extract', upload.single('document'), extractText);
router.post('/analyze', upload.single('document'), analyzeDocument);

module.exports = router;
