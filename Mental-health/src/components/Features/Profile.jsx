import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Save, User, Mail, Calendar, Award, Target, Heart, Camera, LogOut } from 'lucide-react'
import './Profile.css'

export default function Profile({ user, onUpdateUser, onLogout }) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    bio: 'Mental wellness enthusiast focused on daily mindfulness and self-care.',
    goals: ['Track mood daily', 'Practice meditation', 'Write in journal'],
    preferences: {
      notifications: true,
      publicProfile: false,
      shareProgress: true
    }
  })

  const handleSave = () => {
    onUpdateUser({ ...user, ...profileData })
    setIsEditing(false)
  }

  const achievements = [
    { title: '7-Day Streak', description: 'Tracked mood for 7 consecutive days', icon: Target, color: '#10b981' },
    { title: 'Mindful Moments', description: 'Completed 10 breathing exercises', icon: Heart, color: '#f093fb' },
    { title: 'Journal Writer', description: 'Created 5 journal entries', icon: Edit3, color: '#667eea' }
  ]

  return (
    <div className="profile">
      <div className="container">
        <motion.div
          className="profile-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Your Profile</h1>
          <p>Manage your account and track your wellness journey</p>
        </motion.div>

        <div className="profile-content">
          <motion.div
            className="profile-main card-3d"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <img src={user.avatar} alt={user.name} className="profile-avatar" />
                <button className="avatar-edit-btn">
                  <Camera size={16} />
                </button>
              </div>
              <div className="profile-basic-info">
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="edit-name-input"
                  />
                ) : (
                  <h2>{profileData.name}</h2>
                )}
                <p className="join-date">
                  <Calendar size={16} />
                  Joined {new Date(user.joinDate).toLocaleDateString()}
                </p>
              </div>
              <div className="profile-actions">
                <button
                  className={`btn ${isEditing ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                >
                  {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                  {isEditing ? 'Save' : 'Edit Profile'}
                </button>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-section">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="edit-input"
                  />
                ) : (
                  <p>{profileData.email}</p>
                )}
              </div>

              <div className="detail-section">
                <label>Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    className="edit-textarea"
                    rows={3}
                  />
                ) : (
                  <p>{profileData.bio}</p>
                )}
              </div>

              <div className="detail-section">
                <label>Wellness Goals</label>
                <div className="goals-list">
                  {profileData.goals.map((goal, index) => (
                    <div key={index} className="goal-item">
                      <Target size={16} />
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Logout Button */}
              <div className="detail-section">
                <button 
                  className="btn btn-danger"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      onLogout();
                    }
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="profile-stats card-3d"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>Your Achievements</h3>
            <div className="achievements-grid">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  className="achievement-card"
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                >
                  <div className="achievement-icon" style={{ backgroundColor: achievement.color }}>
                    <achievement.icon size={24} />
                  </div>
                  <h4>{achievement.title}</h4>
                  <p>{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}