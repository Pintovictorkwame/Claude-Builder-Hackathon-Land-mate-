require('dotenv').config();
const { sendMessageToOpenRouter } = require('./services/openRouterService');

(async () => {
  try {
    const result = await sendMessageToOpenRouter("What is the maximum leasehold?", "context");
    console.log("Success:", result);
  } catch (error) {
    console.error("Failure:", error.message);
  }
})();
