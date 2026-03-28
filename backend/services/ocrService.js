const Tesseract = require('tesseract.js');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const path = require('path');

/**
 * Extract text from an image or PDF.
 * @param {string} filePath - Absolute path to the file
 * @returns {Promise<string>} - Extracted text
 */
const extractText = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.pdf') {
      // Parse text from PDF
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else {
      // OCR from Image using Tesseract
      const result = await Tesseract.recognize(filePath, 'eng', {
        logger: (m) => {}, // Suppress verbose console logs
      });
      return result.data.text;
    }
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to extract text from file');
  }
};

module.exports = {
  extractText,
};
