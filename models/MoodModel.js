const fs = require('fs');
const path = require('path');

// File path for storing mood data
const moodsFilePath = path.join(__dirname, '..', 'moods.json');

// Helper function to read moods from file
const readMoodsFromFile = () => {
  try {
    if (fs.existsSync(moodsFilePath)) {
      const data = fs.readFileSync(moodsFilePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading moods file:', error);
    return [];
  }
};

// Helper function to write moods to file
const writeMoodsToFile = (moods) => {
  try {
    fs.writeFileSync(moodsFilePath, JSON.stringify(moods, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing moods file:', error);
    return false;
  }
};

// Load moods from file
let moods = readMoodsFromFile();

// Create mood entry
function createMoodEntry(moodData) {
  try {
    const newMood = {
      _id: Date.now().toString(),
      ...moodData,
      createdAt: new Date().toISOString()
    };
    
    moods.push(newMood);
    writeMoodsToFile(moods);
    
    return { insertedId: newMood._id };
  } catch (error) {
    console.error('Error creating mood entry:', error);
    throw error;
  }
}

// Get mood history for a user
function getMoodHistory(userId) {
  try {
    return moods.filter(mood => mood.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error fetching mood history:', error);
    throw error;
  }
}

// Get mood statistics for a user
function getMoodStats(userId) {
  try {
    const userMoods = moods.filter(mood => mood.userId === userId);
    
    // Get mood counts
    const moodCounts = {};
    userMoods.forEach(mood => {
      moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    });
    
    // Get recent moods
    const recentMoods = userMoods
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
      
    return { moodCounts, recentMoods };
  } catch (error) {
    console.error('Error fetching mood stats:', error);
    throw error;
  }
}

module.exports = {
  createMoodEntry,
  getMoodHistory,
  getMoodStats
};