const express = require('express');
const { extractText, analyzeDocument } = require('../controllers/ocrController');
const { protect, optionalProtect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Upload a single file (field name 'document')
router.post('/extract', optionalProtect, upload.single('document'), extractText);
router.post('/analyze', optionalProtect, upload.single('document'), analyzeDocument);

module.exports = router;
