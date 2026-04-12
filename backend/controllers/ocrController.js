const fs = require('fs');
const ocrService = require('../services/ocrService');
const openRouterService = require('../services/openRouterService');

/**
 * @desc    Upload document and extract text
 * @route   POST /api/ocr/extract
 * @access  Private
 */
const extractText = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const text = await ocrService.extractText(req.file.path);

    // Cleanup uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      text: text,
    });
  } catch (error) {
    // Attempt cleanup if error occurred after upload
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

/**
 * @desc    Upload document, extract text, and analyze with Claude
 * @route   POST /api/ocr/analyze
 * @access  Private
 */
const analyzeDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    // Optional query if user wants to ask something specific about the doc
    const userMessage = req.body.message || "Please summarize the key legal points in this document.";

    // 1. Extract text from uploaded file
    const extractedText = await ocrService.extractText(req.file.path);

    // 2. Clean up uploaded file immediately after extraction
    fs.unlinkSync(req.file.path);

    if (!extractedText || extractedText.trim() === '') {
      return res.status(400).json({ success: false, message: 'Could not extract text from document.' });
    }

    // Truncate to avoid context window limits on free AI models
    const MAX_CHARS = 12000;
    const safeContext = extractedText.length > MAX_CHARS 
      ? extractedText.substring(0, MAX_CHARS) + '\n\n...[Document Truncated]' 
      : extractedText;

    // 3. Send to OpenRouter using the extracted text as context
    const responseFormat = await openRouterService.sendMessageToOpenRouter(userMessage, safeContext);

    res.status(200).json({
      success: true,
      data: responseFormat, // { answer, source, confidence }
    });
  } catch (error) {
    // Attempt cleanup if error occurred
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

module.exports = {
  extractText,
  analyzeDocument,
};
