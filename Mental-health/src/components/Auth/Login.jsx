import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Heart } from 'lucide-react'
import './Login.css'

export default function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  const loginUser = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3003/api/auth/login", { // Changed from 5000 to 3003
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        // Get user profile after successful login
        const userProfileResponse = await fetch("http://localhost:3003/api/auth/me", { // Changed from 5000 to 3003
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.token}`
          },
        });
        
        const userProfile = await userProfileResponse.json();
        if (userProfileResponse.ok && userProfile.user) {
          onLogin(userProfile.user);
          navigate("/dashboard");
        } else {
          setError(userProfile.message || "Failed to fetch user profile");
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error("Login error:", err);
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:3003/api/auth/register", { // Changed from 5000 to 3003
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        // Get user profile after successful registration
        const userProfileResponse = await fetch("http://localhost:3003/api/auth/me", { // Changed from 5000 to 3003
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.token}`
          },
        });
        
        const userProfile = await userProfileResponse.json();
        if (userProfileResponse.ok && userProfile.user) {
          onLogin(userProfile.user);
          navigate("/dashboard");
        } else {
          setError(userProfile.message || "Failed to fetch user profile");
        }
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error("Registration error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match!')
        setLoading(false)
        return
      }
      // Register user
      await registerUser(formData.name, formData.email, formData.password)
    } else {
      // Login user
      await loginUser(formData.email, formData.password)
    }
    
    setLoading(false)
  }

  const handleAnonymousLogin = () => {
    const anonymousUser = {
      id: 'anonymous_' + Date.now(),
      name: 'Anonymous User',
      email: 'anonymous@example.com',
      joinDate: new Date().toISOString(),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous',
      mood: 'neutral',
      streak: 0,
      isAnonymous: true
    }
    onLogin(anonymousUser)
    navigate("/dashboard")
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <motion.div
          className="auth-card glass"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="auth-header">
            <motion.div
              className="auth-logo"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Heart size={40} className="logo-icon" />
            </motion.div>
            <h2>{isSignUp ? 'Join MindCare' : 'Welcome Back'}</h2>
            <p>{isSignUp ? 'Start your mental wellness journey' : 'Continue your wellness journey'}</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {isSignUp && (
              <motion.div
                className="input-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <label htmlFor="name">
                  <User size={20} />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your full name"
                  required={isSignUp}
                />
              </motion.div>
            )}

            <motion.div
              className="input-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <label htmlFor="email">
                <Mail size={20} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email"
                required
              />
            </motion.div>

            <motion.div
              className="input-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <label htmlFor="password">
                <Lock size={20} />
                Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            {isSignUp && (
              <motion.div
                className="input-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <label htmlFor="confirmPassword">
                  <Lock size={20} />
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Confirm your password"
                  required={isSignUp}
                />
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="loading-spinner-small"></div>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Anonymous Login */}
          <motion.button
            type="button"
            onClick={handleAnonymousLogin}
            className="btn btn-secondary btn-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            Continue Anonymously
          </motion.button>

          {/* Toggle */}
          <motion.div
            className="auth-toggle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('') // Clear error when toggling
                }}
                className="toggle-link"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </motion.div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          className="back-home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}