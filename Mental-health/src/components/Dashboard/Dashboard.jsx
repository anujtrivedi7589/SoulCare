import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Heart, 
  MessageCircle, 
  BookOpen, 
  Activity,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Brain,
  Smile
} from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import './Dashboard.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard({ user }) {
  const [moodData, setMoodData] = useState([])
  const [stats, setStats] = useState({
    currentStreak: 7,
    totalSessions: 24,
    moodAverage: 7.2,
    journalEntries: 12
  })

  useEffect(() => {
    // Generate mock mood data for the chart
    const generateMoodData = () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      const data = days.map(() => Math.floor(Math.random() * 4) + 6) // Mood between 6-10
      setMoodData(data)
    }
    
    generateMoodData()
  }, [])

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Mood Level',
        data: moodData,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#667eea',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#667eea',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 10,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6b7280',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        }
      }
    }
  }

  const quickActions = [
    {
      title: 'AI Chat Support',
      description: 'Talk to your AI companion',
      icon: MessageCircle,
      path: '/chat',
      color: '#667eea',
      bgColor: 'rgba(102, 126, 234, 0.1)'
    },
    {
      title: 'Track Your Mood',
      description: 'Log how you\'re feeling today',
      icon: Heart,
      path: '/mood',
      color: '#f093fb',
      bgColor: 'rgba(240, 147, 251, 0.1)'
    },
    {
      title: 'Write in Journal',
      description: 'Reflect on your thoughts',
      icon: BookOpen,
      path: '/journal',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Wellness Exercises',
      description: 'Practice mindfulness & CBT',
      icon: Activity,
      path: '/exercises',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    }
  ]

  const StatCard = ({ icon: Icon, title, value, change, color }) => (
    <motion.div
      className="stat-card card-3d"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, rotateY: 5 }}
    >
      <div className="stat-icon" style={{ backgroundColor: color }}>
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
        {change && (
          <span className={`stat-change ${change > 0 ? 'positive' : 'negative'}`}>
            <TrendingUp size={14} />
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </motion.div>
  )

  const ActionCard = ({ title, description, icon: Icon, path, color, bgColor }) => (
    <motion.div
      className="action-card card-3d"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, rotateX: 5 }}
    >
      <Link to={path} className="action-link">
        <div className="action-icon" style={{ backgroundColor: bgColor, color }}>
          <Icon size={32} />
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
      </Link>
    </motion.div>
  )

  return (
    <div className="dashboard">
      <div className="container">
        {/* Welcome Section */}
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="welcome-content">
            <h1>Welcome back, {user.name}!</h1>
            <p>Here's your mental wellness overview for today</p>
          </div>
          <div className="user-mood">
            <Smile size={40} className="mood-icon" />
            <span>Feeling Good</span>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <section className="stats-section">
          <div className="stats-grid">
            <StatCard
              icon={Target}
              title="Current Streak"
              value={`${stats.currentStreak} days`}
              change={12}
              color="#10b981"
            />
            <StatCard
              icon={Brain}
              title="Total Sessions"
              value={stats.totalSessions}
              change={8}
              color="#667eea"
            />
            <StatCard
              icon={Heart}
              title="Avg Mood"
              value={`${stats.moodAverage}/10`}
              change={5}
              color="#f093fb"
            />
            <StatCard
              icon={BookOpen}
              title="Journal Entries"
              value={stats.journalEntries}
              change={-3}
              color="#f59e0b"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ActionCard {...action} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Mood Chart */}
        <section className="chart-section">
          <motion.div
            className="chart-card card-3d"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="chart-header">
              <h2>Your Mood This Week</h2>
              <div className="chart-legend">
                <span className="legend-item">
                  <div className="legend-color"></div>
                  Mood Level (1-10)
                </span>
              </div>
            </div>
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>
          </motion.div>
        </section>

        {/* Recent Activity */}
        <section className="activity-section">
          <motion.div
            className="activity-card card-3d"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <Calendar className="activity-icon" />
                <div className="activity-content">
                  <h4>Mood logged</h4>
                  <p>Feeling optimistic - 2 hours ago</p>
                </div>
              </div>
              <div className="activity-item">
                <MessageCircle className="activity-icon" />
                <div className="activity-content">
                  <h4>Chat session</h4>
                  <p>15 minute conversation about anxiety - 5 hours ago</p>
                </div>
              </div>
              <div className="activity-item">
                <Award className="activity-icon" />
                <div className="activity-content">
                  <h4>Achievement unlocked</h4>
                  <p>7-day mood tracking streak! - 1 day ago</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}