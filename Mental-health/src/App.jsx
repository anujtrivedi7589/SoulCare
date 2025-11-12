import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './App.css'

// Import components
import Landing from './components/Layout/Landing'
import Login from './components/Auth/Login'
import Dashboard from './components/Dashboard/Dashboard'
import Chatbot from './components/Features/Chatbot'
import MoodTracker from './components/Features/MoodTracker'
import Journal from './components/Features/Journal'
import Exercises from './components/Features/Exercises'
import Profile from './components/Features/Profile'
import Navbar from './components/Layout/Navbar'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is authenticated
  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await fetch('http://localhost:3003/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Authentication error:', error)
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading your wellness journey...</p>
      </div>
    )
  }

  return (
    <Router>
      <div className="app">
        <AnimatePresence mode="wait">
          {user && <Navbar user={user} onLogout={logout} />}
          <Routes>
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" /> : <Landing />} 
            />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login onLogin={login} />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/chat" 
              element={user ? <Chatbot user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/mood" 
              element={user ? <MoodTracker user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/journal" 
              element={user ? <Journal user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/exercises" 
              element={user ? <Exercises user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} onUpdateUser={setUser} onLogout={logout} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App