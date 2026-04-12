const { extractText } = require('./services/ocrService');
const path = require('path');

const testPath = path.join(__dirname, 'sample.pdf');

extractText(testPath)
  .then(text => {
    console.log('--- Extracted Text ---');
    console.log(text.substring(0, 500));
    console.log('--- End ---');
  })
  .catch(err => {
    console.error('OCR Test Failed:', err.message);
  });
