// Native fetch will be used to bypass SDK validation bugs

/**
 * Send a message to Nvidia model via OpenRouter and return structured response.
 * @param {string} message - User's chat message
 * @param {string} context - Formatted text context (from knowledge base)
 * @param {string} mode - 'simple' or 'legal' explanation mode
 * @returns {Promise<Object>} - { answer, source, confidence }
 */
const sendMessageToOpenRouter = async (message, context, mode = 'legal') => {
  // If no API key is set yet, return dummy response right away
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'your_openrouter_api_key_goes_here') {
    return {
      answer: "I am a Ghanaian legal assistant. Since the OpenRouter API key is missing or invalid, this is a placeholder response.",
      source: "Placeholder Context",
      confidence: "high"
    };
  }

  const modeInstruction = mode === 'simple' 
    ? "Explain the concepts in very simple, plain, conversational English that a 10-year old or non-lawyer could easily understand." 
    : "Provide a formal, legally accurate, and professional explanation.";

  const systemPrompt = `You are an expert Ghanaian legal assistant.
You may respond politely and warmly to casual greetings (e.g., "Hello", "How are you?"). However, for any factual or legal questions, you MUST only answer using the provided CONTEXT. 

If the user asks a factual or legal question that has absolutely nothing to do with the context provided, you MUST reject the question using the exact rejection format.

Formatting Rules:
- ${modeInstruction}
- Extract the specific source citation strictly from the context (e.g., 'Land Act 2020'). Use "System" as the source for greetings.
- Score your confidence: "high" if the context directly answers it perfectly or if it is a standard greeting, "medium" if it partially addresses it, "low" if it's vague.

If context is completely insufficient or unrelated for a factual question:
{
  "answer": "Not found in legal knowledge base",
  "source": "None",
  "confidence": "low"
}

Otherwise, YOU MUST reply EXCLUSIVELY in the following raw JSON format without markdown blocks:
{
  "answer": "string",
  "source": "string",
  "confidence": "high|medium|low"
}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-nano-30b-a3b:free",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `CONTEXT:\n${context || '<empty for now>'}\n\nUSER:\n${message}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter HTTP Error:', response.status, errorText);
      throw new Error(`OpenRouter API responded with status ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.choices[0]?.message?.content || "";

    try {
      // Because open models might wrap the JSON in markdown code blocks like ```json ... ```, we clean it up
      const cleanedJSON = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
      const result = JSON.parse(cleanedJSON);
      return {
        answer: result.answer || replyText,
        source: result.source || 'Unknown',
        confidence: result.confidence || 'low',
      };
    } catch (parseError) {
      // In case the model didn't respect the JSON format completely
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
    console.error('OpenRouter API Error:', error);
    throw new Error('Failed to communicate with OpenRouter API');
  }
};

module.exports = {
  sendMessageToOpenRouter,
};
