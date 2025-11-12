import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, CheckCircle, Brain, Heart, Wind, Video } from 'lucide-react'
import './Exercises.css'

export default function Exercises({ user }) {
  const [activeExercise, setActiveExercise] = useState(null)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  const exercises = [
    {
      id: 1,
      title: '4-7-8 Breathing',
      description: 'A calming breathing technique to reduce anxiety and promote relaxation',
      category: 'Breathing',
      duration: '4 minutes',
      icon: Wind,
      color: '#06b6d4',
      youtubeId: 'AI5KnFb926I', // Example YouTube ID for breathing exercise
      steps: [
        'Exhale completely through your mouth',
        'Close your mouth and inhale through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale through your mouth for 8 counts'
      ]
    },
    {
      id: 2,
      title: 'Mindful Body Scan',
      description: 'Progressive relaxation technique to release tension and increase awareness',
      category: 'Mindfulness',
      duration: '10 minutes',
      icon: Heart,
      color: '#f093fb',
      youtubeId: 'q1J58G2V54Q', // Example YouTube ID for body scan meditation
      steps: [
        'Lie down comfortably and close your eyes',
        'Start from your toes and slowly move up',
        'Notice any tension or sensations',
        'Breathe into each body part as you scan'
      ]
    },
    {
      id: 3,
      title: 'Thought Challenging',
      description: 'CBT technique to identify and reframe negative thought patterns',
      category: 'CBT',
      duration: '15 minutes',
      icon: Brain,
      color: '#10b981',
      youtubeId: 'dJL1nA6w1q0', // Example YouTube ID for CBT techniques
      steps: [
        'Identify the negative thought',
        'What evidence supports this thought?',
        'What evidence contradicts it?',
        'Create a more balanced perspective'
      ]
    },
    {
      id: 4,
      title: 'Progressive Muscle Relaxation',
      description: 'Systematic tensing and relaxing of muscle groups to reduce stress',
      category: 'Relaxation',
      duration: '12 minutes',
      icon: Heart,
      color: '#8b5cf6',
      youtubeId: '10kRCUfLKEo', // Example YouTube ID for PMR
      steps: [
        'Find a quiet, comfortable place',
        'Start with your feet and work up your body',
        'Tense each muscle group for 5 seconds',
        'Release and notice the relaxation'
      ]
    },
    {
      id: 5,
      title: 'Mindful Walking',
      description: 'Walking meditation to connect with the present moment',
      category: 'Mindfulness',
      duration: '8 minutes',
      icon: Wind,
      color: '#f59e0b',
      youtubeId: 'qE4w2j5w8sk', // Example YouTube ID for walking meditation
      steps: [
        'Walk slowly and deliberately',
        'Focus on each step and your breathing',
        'Notice the sensations in your feet',
        'Observe your surroundings without judgment'
      ]
    },
    {
      id: 6,
      title: 'Gratitude Journaling',
      description: 'Practice gratitude to shift focus to positive aspects of life',
      category: 'Journaling',
      duration: '10 minutes',
      icon: Brain,
      color: '#ec4899',
      youtubeId: 'U67sLbzZi1o', // Example YouTube ID for gratitude practice
      steps: [
        'Set aside 10 minutes daily',
        'List 3 things you are grateful for',
        'Write a sentence about why you appreciate each',
        'Reflect on how gratitude affects your mood'
      ]
    }
  ]

  const startExercise = (exercise) => {
    setActiveExercise(exercise)
    setTimer(0)
    setIsRunning(true)
    setShowVideo(false)
  }

  const toggleVideo = () => {
    setShowVideo(!showVideo)
  }

  return (
    <div className="exercises">
      <div className="container">
        <motion.div
          className="exercises-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Wellness Exercises</h1>
          <p>Practice mindfulness, breathing, and CBT techniques for better mental health</p>
        </motion.div>

        <div className="exercises-grid">
          {exercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              className="exercise-card card-3d"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, rotateY: 5 }}
            >
              <div className="exercise-icon" style={{ backgroundColor: exercise.color }}>
                <exercise.icon size={32} />
              </div>
              <h3>{exercise.title}</h3>
              <p>{exercise.description}</p>
              <div className="exercise-meta">
                <span className="category">{exercise.category}</span>
                <span className="duration">{exercise.duration}</span>
              </div>
              <div className="exercise-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => startExercise(exercise)}
                >
                  <Play size={16} />
                  Start Exercise
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setActiveExercise(exercise)
                    setShowVideo(true)
                  }}
                >
                  <Video size={16} />
                  Watch Video
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {activeExercise && (
          <motion.div
            className="active-exercise card-3d"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2>{activeExercise.title}</h2>
            
            {/* YouTube Video Embed */}
            {showVideo && activeExercise.youtubeId && (
              <div className="video-container">
                <div className="video-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeExercise.youtubeId}`}
                    title={activeExercise.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
            
            {/* Exercise Steps */}
            <div className="exercise-steps">
              {activeExercise.steps.map((step, index) => (
                <div key={index} className="step">
                  <span className="step-number">{index + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            
            <div className="exercise-controls">
              <button
                className="btn btn-secondary"
                onClick={toggleVideo}
              >
                <Video size={16} />
                {showVideo ? 'Hide Video' : 'Show Video'}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? <Pause size={16} /> : <Play size={16} />}
                {isRunning ? 'Pause' : 'Resume'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setActiveExercise(null)}
              >
                <CheckCircle size={16} />
                Complete
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}