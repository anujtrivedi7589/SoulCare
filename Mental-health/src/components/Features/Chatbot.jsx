import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { 
  Send, 
  Bot, 
  User, 
  Heart, 
  Smile,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Users,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import './Chatbot.css'

// Mock database of mental health professionals
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Clinical Psychologist",
    experience: "12 years",
    location: "New York, NY",
    contact: "+1 (555) 123-4567",
    email: "s.johnson@mindcare.com",
    rating: 4.9,
    languages: ["English", "Spanish"],
    availability: "Mon-Fri, 9AM-5PM"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Psychiatrist",
    experience: "8 years",
    location: "San Francisco, CA",
    contact: "+1 (555) 234-5678",
    email: "m.chen@wellnesscenter.com",
    rating: 4.8,
    languages: ["English", "Mandarin"],
    availability: "Tue-Sat, 10AM-6PM"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Therapist",
    experience: "10 years",
    location: "Miami, FL",
    contact: "+1 (555) 345-6789",
    email: "e.rodriguez@therapyhub.com",
    rating: 4.7,
    languages: ["English", "Spanish"],
    availability: "Mon-Wed-Fri, 8AM-4PM"
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Counseling Psychologist",
    experience: "15 years",
    location: "Chicago, IL",
    contact: "+1 (555) 456-7890",
    email: "j.wilson@mentalwellness.com",
    rating: 4.9,
    languages: ["English"],
    availability: "Mon-Thu, 9AM-7PM"
  },
  {
    id: 5,
    name: "Dr. Priya Sharma",
    specialty: "Clinical Social Worker",
    experience: "7 years",
    location: "Seattle, WA",
    contact: "+1 (555) 567-8901",
    email: "p.sharma@supportcenter.com",
    rating: 4.6,
    languages: ["English", "Hindi"],
    availability: "Wed-Sun, 11AM-8PM"
  }
]

const FloatingOrb = ({ isListening }) => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[0.5, 64, 64]}>
        <MeshDistortMaterial
          color={isListening ? "#f093fb" : "#667eea"}
          attach="material"
          distort={isListening ? 0.6 : 0.3}
          speed={isListening ? 3 : 1.5}
          roughness={0}
        />
      </Sphere>
    </Float>
  )
}

// Initialize Gemini AI
let genAI = null;
let model = null;

// Initialize the Gemini model
const initializeGemini = () => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Gemini API key not found in environment variables");
      return false;
    }
    
    genAI = new GoogleGenerativeAI(apiKey);
    // Configure to use v1beta endpoint as required
    model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      baseUrl: "http://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent" 
    });
    return true;
  } catch (error) {
    console.error("Error initializing Gemini:", error);
    return false;
  }
};

// Add token validation function
const validateToken = (token) => {
  // In a real application, this would call an API to validate the token
  // For demonstration, we'll use a simple check
  const validTokens = [
    'MH_PREMIUM_2025',
    'MH_PRO_2025',
    'MH_VIP_2025'
  ]
  
  return validTokens.includes(token)
}

// Add token-based authentication component

// Add token submission handler

const quickResponses = [
  "I'm feeling anxious",
  "I had a good day",
  "I'm stressed about work",
  "I feel lonely",
  "I'm grateful for...",
  "I need motivation",
  "Can you recommend a therapist?",
  "I need professional help"
]

// Enhanced doctor recommendation function
const recommendDoctors = (userMessage) => {
  // Simple keyword matching for demonstration
  const lowerMessage = userMessage.toLowerCase()
    
  // If user is asking for doctors or professionals
  if (lowerMessage.includes('doctor') || 
      lowerMessage.includes('therapist') || 
      lowerMessage.includes('professional') || 
      lowerMessage.includes('help') ||
      lowerMessage.includes('support') ||
      lowerMessage.includes('recommend') ||
      lowerMessage.includes('psychologist') ||
      lowerMessage.includes('psychiatrist') ||
      lowerMessage.includes('counselor')) {
      
      // Filter doctors based on specialty mentioned in the message
      let filteredDoctors = [...mockDoctors]
      
      if (lowerMessage.includes('psychologist')) {
        filteredDoctors = mockDoctors.filter(doc => doc.specialty.includes('Psychologist'))
      } else if (lowerMessage.includes('psychiatrist')) {
        filteredDoctors = mockDoctors.filter(doc => doc.specialty.includes('Psychiatrist'))
      } else if (lowerMessage.includes('therapist')) {
        filteredDoctors = mockDoctors.filter(doc => doc.specialty.includes('Therapist'))
      }
      
      // For now, return a random selection of doctors
      // In a real app, this would be based on user's location, specialty needs, etc.
      const shuffled = filteredDoctors.sort(() => 0.5 - Math.random())
      return shuffled.slice(0, 3)
    }
    
    return []
  }

// Function to analyze mood using the backend API
const analyzeMood = async (message, userId) => {
  try {
    const response = await fetch('http://localhost:3003/api/mood/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, userId }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.mood;
    } else {
      console.error('Mood analysis failed:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Error analyzing mood:', error);
    return null;
  }
};

// Modify the getBotResponse function to use Gemini API
const getBotResponse = async (userMessage) => {
  // Initialize Gemini if not already done
  if (!model && !initializeGemini()) {
    // Fallback to mock responses if Gemini initialization fails
    const responses = {
      anxiety: [
        "I understand you're feeling anxious. Let's try some deep breathing together. Breathe in for 4 counts...",
        "Anxiety can be overwhelming. Remember, this feeling is temporary and you're stronger than you think.",
        "Would you like to try a quick mindfulness exercise to help calm your mind?"
      ],
      sad: [
        "I'm sorry you're feeling sad. It's okay to feel this way sometimes. Would you like to talk about what's bothering you?",
        "Sadness is a natural emotion. Remember that it's okay to not be okay sometimes.",
        "You're not alone in this. Would you like me to suggest some gentle activities that might help?"
      ],
      happy: [
        "I'm so glad to hear you're feeling happy! What's been bringing you joy today?",
        "That's wonderful! Happiness is precious. Would you like to capture this moment in your journal?",
        "Your positive energy is beautiful! How can we maintain this feeling?"
      ],
      stressed: [
        "Stress can be challenging. Let's work together to find some relief. What's causing you the most stress right now?",
        "I hear that you're stressed. Would you like to try a quick relaxation technique?",
        "Stress is your body's way of responding to challenges. Let's find healthy ways to manage it."
      ],
      doctors: [
        "I understand you're looking for professional help. Here are some mental health professionals I recommend based on your needs:",
        "It's great that you're seeking professional support. Here are some qualified mental health professionals in your area:",
        "Professional guidance can be very beneficial. Here are some highly-rated mental health professionals I recommend:"
      ],
      default: [
        "Thank you for sharing that with me. How does that make you feel?",
        "I'm here to listen and support you. Would you like to explore this feeling further?",
        "Your feelings are valid. What would help you feel better right now?",
        "I appreciate you opening up to me. How can I best support you today?"
      ]
    }

    // Check if user is asking for doctor recommendations
    const doctors = recommendDoctors(userMessage)
    if (doctors.length > 0) {
      const doctorResponse = responses.doctors[Math.floor(Math.random() * responses.doctors.length)]
      return {
        text: doctorResponse,
        doctors: doctors,
        type: 'doctor_recommendation'
      }
    }

    // Handle other responses
    const lowerMessage = userMessage.toLowerCase()
    let category = 'default'

    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
      category = 'anxiety'
    } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      category = 'sad'
    } else if (lowerMessage.includes('happy') || lowerMessage.includes('joy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
      category = 'happy'
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
      category = 'stressed'
    } else if (lowerMessage.includes('doctor') || lowerMessage.includes('therapist') || 
               lowerMessage.includes('professional') || lowerMessage.includes('counselor') ||
               lowerMessage.includes('psychologist') || lowerMessage.includes('psychiatrist')) {
      category = 'doctors'
    }

    const responseArray = responses[category]
    const responseText = responseArray[Math.floor(Math.random() * responseArray.length)]
      
    return {
      text: responseText,
      type: 'text'
    }
  }

  try {
    // Use Gemini API for generating responses
    const prompt = `You are an AI mental health companion. Respond empathetically to the user's message with supportive and helpful advice. Keep responses concise but meaningful. If the user mentions needing professional help or asking for doctors, mention that you can recommend mental health professionals.
    
User message: "${userMessage}"

Response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Check if user is asking for doctor recommendations
    const doctors = recommendDoctors(userMessage);
    if (doctors.length > 0) {
      return {
        text: text,
        doctors: doctors,
        type: 'doctor_recommendation'
      };
    }

    return {
      text: text,
      type: 'text'
    };
  } catch (error) {
    console.error("Error generating response with Gemini:", error);
    // Fallback to mock responses if Gemini fails
    return getBotResponse(userMessage); // This will use the mock response logic
  }
}

export default function Chatbot({ user }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${user.name}! I'm your AI mental health companion. How are you feeling today?`,
      sender: 'bot',
      timestamp: new Date(),
      emotion: 'supportive'
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [currentMood, setCurrentMood] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Analyze mood in the background
    analyzeMood(input, user.id)
      .then(moodData => {
        if (moodData) {
          setCurrentMood(moodData);
        }
      })
      .catch(error => {
        console.error('Error in mood analysis:', error);
        // Don't break the chatbot if mood analysis fails
      });

    // Generate bot response using Gemini
    try {
      const botResponseData = await getBotResponse(input)
      const botResponse = {
        id: Date.now() + 1,
        text: botResponseData.text,
        doctors: botResponseData.doctors,
        sender: 'bot',
        timestamp: new Date(),
        emotion: 'supportive'
      }

      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error("Error in handleSubmit:", error)
      // Fallback response
      const fallbackResponse = {
        id: Date.now() + 1,
        text: "I'm here to support you. Could you share a bit more about what you're feeling?",
        sender: 'bot',
        timestamp: new Date(),
        emotion: 'supportive'
      }
      setMessages(prev => [...prev, fallbackResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    // In a real app, you'd implement speech recognition here
  }

  const DoctorRecommendation = ({ doctors }) => {
    return (
      <div className="doctor-recommendations">
        <h4>Recommended Mental Health Professionals</h4>
        <div className="doctors-list">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <div className="doctor-header">
                <div className="doctor-avatar">
                  <Users size={24} />
                </div>
                <div className="doctor-info">
                  <h5>{doctor.name}</h5>
                  <p className="doctor-specialty">{doctor.specialty}</p>
                </div>
              </div>
              <div className="doctor-details">
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{doctor.location}</span>
                </div>
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{doctor.contact}</span>
                </div>
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{doctor.email}</span>
                </div>
              </div>
              <div className="doctor-meta">
                <span className="rating">★ {doctor.rating}</span>
                <span className="experience">{doctor.experience} experience</span>
              </div>
              <div className="doctor-languages">
                <span>Languages: {doctor.languages.join(', ')}</span>
              </div>
              <div className="doctor-availability">
                <span>Availability: {doctor.availability}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const MessageBubble = ({ message }) => {
    const isBot = message.sender === 'bot'
    
    return (
      <motion.div
        className={`message-bubble ${isBot ? 'bot-message' : 'user-message'}`}
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="message-avatar">
          {isBot ? (
            <div className="bot-avatar">
              <Bot size={20} />
            </div>
          ) : (
            <img src={user.avatar} alt={user.name} className="user-avatar" />
          )}
        </div>
        <div className="message-content">
          <p>{message.text}</p>
          {message.doctors && <DoctorRecommendation doctors={message.doctors} />}
          <span className="message-time">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </motion.div>
    )
  }

  // Function to get mood emoji based on mood text
  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'Very Positive': return '😊';
      case 'Positive': return '🙂';
      case 'Neutral': return '😐';
      case 'Negative': return '🙁';
      case 'Very Negative': return '😢';
      default: return '😐';
    }
  }

  return (
    <div className="chatbot-page">
      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="ai-companion-info">
            <div className="companion-visual">
              <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <FloatingOrb isListening={isListening} />
              </Canvas>
            </div>
            <div className="companion-details">
              <h2>AI Companion</h2>
              <p className="status">
                <span className="status-dot"></span>
                Online & Ready to Help
              </p>
            </div>
          </div>
          <div className="chat-controls">
            <button 
              className={`control-btn ${soundEnabled ? 'active' : ''}`}
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            {/* Remove auth status indicator */}
          </div>
        </div>

        {/* Messages Area */}
        <div className="messages-container">
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              className="typing-indicator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bot-avatar">
                <Bot size={20} />
              </div>
              <div className="typing-animation">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Remove TokenAuth component */}

        {/* Quick Responses */}
        <div className="quick-responses">
          <AnimatePresence>
            {messages.length <= 2 && (
              <motion.div
                className="quick-responses-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <p>Quick responses:</p>
                <div className="quick-buttons">
                  {quickResponses.map((response, index) => (
                    <motion.button
                      key={response}
                      className="quick-btn"
                      onClick={() => setInput(response)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {response}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="chat-input-container">
          <form onSubmit={handleSubmit} className="chat-form">
            <div className="input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share your thoughts or feelings..."
                className="chat-input"
                disabled={isTyping}
              />
              <button
                type="button"
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleListening}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button
                type="submit"
                className="send-btn"
                disabled={!input.trim() || isTyping}
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mood Indicators */}
      <div className="mood-sidebar">
        <h3>How you're feeling</h3>
        <div className="mood-indicators">
          {currentMood ? (
            <motion.div 
              className="mood-item"
              key={currentMood.mood}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="mood-emoji">{getMoodEmoji(currentMood.mood)}</span>
              <span>{currentMood.mood}</span>
            </motion.div>
          ) : (
            <motion.div 
              className="mood-item"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Heart className="mood-icon" />
              <span>Share your thoughts</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}