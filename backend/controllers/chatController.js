const { validationResult } = require('express-validator');
const openRouterService = require('../services/openRouterService');
const vectorService = require('../services/vectorService');
const Chat = require('../models/Chat');

/**
 * @desc    Chat with legal assistant
 * @route   POST /api/chat
 * @access  Private
 */
const chat = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { message, sessionId } = req.body;
    const mode = req.query.mode || 'legal'; // 'simple' or 'legal'

    // 1. Query MongoDB Vector Search for top 3 relevant documents
    const relevantDocs = await vectorService.queryDocuments(message, 3);
    
    // 2. Format documents into a single context string
    const dynamicContext = relevantDocs.length > 0 
      ? relevantDocs.join('\n\n--- Document ---\n') 
      : "No specific legal context found.";

    // 3. Send message + context + mode to Nvidia via OpenRouter
    const responseFormat = await openRouterService.sendMessageToOpenRouter(message, dynamicContext, mode);

    // 4. Save conversation to Chat model only if user is logged in
    let currentSessionId = null;

    if (req.user) {
      let chatSession;

      if (sessionId) {
        // Find existing session
        chatSession = await Chat.findOne({ _id: sessionId, user: req.user._id });
      }

      // If no session found or no sessionId provided, create a new one
      if (!chatSession) {
        // Give the session a dynamic title based on the first prompt
        const sessionTitle = message.length > 30 ? message.substring(0, 30) + '...' : message;
        chatSession = new Chat({ user: req.user._id, title: sessionTitle, messages: [] });
      }

      // Push user message
      chatSession.messages.push({
        role: 'user',
        content: message
      });

      // Push AI response
      chatSession.messages.push({
        role: 'assistant',
        content: responseFormat.answer || JSON.stringify(responseFormat)
      });

      await chatSession.save();
      currentSessionId = chatSession._id;
    }

    res.status(200).json({
      success: true,
      data: responseFormat, // { answer, source, confidence }
      sessionId: currentSessionId, // Frontend needs this to continue the same chat
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Get all chat sessions (threads) for the current user
 * @route   GET /api/chat/sessions
 * @access  Private
 */
const getChatSessions = async (req, res, next) => {
  try {
    // Return all sessions but exclude the bulky 'messages' array for the sidebar
    const sessions = await Chat.find({ user: req.user._id })
      .select('title createdAt updatedAt')
      .sort({ updatedAt: -1 }); // Newest sessions first

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get chat history (messages) for a specific session
 * @route   GET /api/chat/history/:sessionId
 * @access  Private
 */
const getChatHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const chatSession = await Chat.findOne({ _id: sessionId, user: req.user._id });

    if (!chatSession) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }

    // Simple pagination by slicing the messages array (newest to oldest or vice versa)
    // Reversing so page 1 shows newest messages
    const reversedMessages = [...chatSession.messages].reverse();
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = reversedMessages.length;

    const paginatedMessages = reversedMessages.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      count: paginatedMessages.length,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: paginatedMessages
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chat,
  getChatSessions,
  getChatHistory,
};
