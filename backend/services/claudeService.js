const Anthropic = require('@anthropic-ai/sdk');

// We initialize the client inside the function or globally.
// Depending on whether process.env.CLAUDE_API_KEY is available at startup.
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || 'your_claude_api_key_goes_here', // defaults to process.env.ANTHROPIC_API_KEY
});

/**
 * Send a message to Claude and return structured response.
 * @param {string} message - User's chat message
 * @param {string} context - Formatted text context (static placeholder for now)
 * @returns {Promise<Object>} - { answer, source, confidence }
 */
const sendMessageToClaude = async (message, context) => {
  // If no API key is set yet, return dummy response right away
  if (!process.env.CLAUDE_API_KEY || process.env.CLAUDE_API_KEY === 'your_claude_api_key_goes_here') {
    return {
      answer: "I am a Ghanaian legal assistant. Since the Claude API key is missing or invalid, this is a placeholder response.",
      source: "Placeholder Context",
      confidence: "high"
    };
  }

  const systemPrompt = `You are a Ghanaian legal assistant.
Only answer using provided context. 
If context is insufficient, respond with: "Not found in legal knowledge base".

Response format: Must be raw JSON without markdown formatting.
{
  "answer": "string",
  "source": "string",
  "confidence": "high|medium|low"
}`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // fast and cost-effective
      max_tokens: 1024,
      system: systemPrompt,
      temperature: 0,
      messages: [
        {
          role: 'user',
          content: `CONTEXT:\n${context || '<empty for now>'}\n\nUSER:\n${message}`,
        },
      ],
    });

    const replyText = response.content[0].text;
    
    try {
      // Parse the JSON. We told Claude to return raw JSON.
      const result = JSON.parse(replyText);
      return {
        answer: result.answer || replyText,
        source: result.source || 'Unknown',
        confidence: result.confidence || 'low',
      };
    } catch (parseError) {
      // In case Claude didn't respect the JSON format completely
      if (replyText.includes('Not found in legal knowledge base')) {
        return {
          answer: "Not found in legal knowledge base",
          source: "None",
          confidence: "high"
        };
      }
      return {
        answer: replyText,
        source: 'Unknown',
        confidence: 'low',
      };
    }
  } catch (error) {
    console.error('Claude API Error:', error);
    throw new Error('Failed to communicate with Claude API');
  }
};

module.exports = {
  sendMessageToClaude,
};
