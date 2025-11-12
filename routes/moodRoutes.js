const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createMoodEntry, getMoodHistory, getMoodStats } = require('../models/MoodModel');

const router = express.Router();

// Initialize Gemini AI
let genAI = null;
let model = null;

const initializeGemini = () => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Gemini API key not found in environment variables");
      return false;
    }
    
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    return true;
  } catch (error) {
    console.error("Error initializing Gemini:", error);
    return false;
  }
};

// Mood analysis prompt
const moodAnalysisPrompt = (message) => `
Analyze the user's mood based on this message.

Return ONLY this JSON format:
{
  "mood": "Very Positive | Positive | Neutral | Negative | Very Negative",
  "confidence": "0-1",
  "keywords": ["main feelings"]
}

Message: "${message}"
`;

// POST /api/mood/analyze - Analyze mood from user message
router.post('/analyze', async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message || !userId) {
      return res.status(400).json({ error: 'Message and userId are required' });
    }
    
    // Initialize Gemini if not already done
    if (!model && !initializeGemini()) {
      return res.status(500).json({ error: 'Failed to initialize AI service' });
    }
    
    // Analyze mood using Gemini
    const prompt = moodAnalysisPrompt(message);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    let moodAnalysis;
    try {
      // Extract JSON from the response
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      moodAnalysis = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Error parsing mood analysis response:', parseError);
      return res.status(500).json({ error: 'Failed to parse mood analysis' });
    }
    
    // Save mood data to file
    const moodData = {
      userId,
      mood: moodAnalysis.mood,
      confidence: parseFloat(moodAnalysis.confidence),
      keywords: moodAnalysis.keywords,
      message: message
    };
    
    const savedMood = await createMoodEntry(moodData);
    
    res.json({
      success: true,
      mood: moodAnalysis,
      id: savedMood.insertedId
    });
  } catch (error) {
    console.error('Error in mood analysis:', error);
    res.status(500).json({ error: 'Failed to analyze mood', details: error.message });
  }
});

// GET /api/mood/history/:userId - Get mood history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const moodHistory = await getMoodHistory(userId);
    
    res.json({
      success: true,
      moods: moodHistory
    });
  } catch (error) {
    console.error('Error fetching mood history:', error);
    res.status(500).json({ error: 'Failed to fetch mood history' });
  }
});

// GET /api/mood/stats/:userId - Get mood statistics for a user
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const stats = await getMoodStats(userId);
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching mood stats:', error);
    res.status(500).json({ error: 'Failed to fetch mood stats' });
  }
});

module.exports = router;