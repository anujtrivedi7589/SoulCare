const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import mood routes
const moodRoutes = require('./routes/moodRoutes');

const app = express();
const PORT = process.env.PORT || 3003; // Changed from 5000 to 3003 as per memory

// Middleware
app.use(cors());
app.use(express.json());

// File path for storing user data
const usersFilePath = path.join(__dirname, 'users.json');

// Helper function to read users from file
const readUsersFromFile = () => {
  try {
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

// Helper function to write users to file
const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing users file:', error);
    return false;
  }
};

// Load users from file
let users = readUsersFromFile();

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'fallback_secret_key',
    { expiresIn: '24h' }
  );
};

// Routes
app.use('/api/mood', moodRoutes);

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      joinDate: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      mood: 'neutral',
      streak: 0
    };

    users.push(newUser);
    
    // Save users to file
    writeUsersToFile(users);

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        joinDate: newUser.joinDate,
        avatar: newUser.avatar,
        mood: newUser.mood,
        streak: newUser.streak
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        joinDate: user.joinDate,
        avatar: user.avatar,
        mood: user.mood,
        streak: user.streak
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    
    // Find user
    const user = users.find(user => user.id === decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        joinDate: user.joinDate,
        avatar: user.avatar,
        mood: user.mood,
        streak: user.streak
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Register endpoint: http://localhost:${PORT}/api/auth/register`);
  console.log(`Login endpoint: http://localhost:${PORT}/api/auth/login`);
  console.log(`Profile endpoint: http://localhost:${PORT}/api/auth/me`);
  console.log(`Mood analysis endpoint: http://localhost:${PORT}/api/mood/analyze`);
});