import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
import { Link } from 'react-router-dom'
import { Brain, Heart, Shield, Users, Zap, Star } from 'lucide-react'
import './Landing.css'

const AnimatedSphere = () => {
  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 100, 200]} scale={2.4}>
        <MeshDistortMaterial
          color="#667eea"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0}
        />
      </Sphere>
    </Float>
  )
}

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  return (
    <motion.div
      className="card-3d feature-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10, rotateY: 5 }}
    >
      <div className="feature-icon">
        <Icon size={40} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  )
}

const StatCard = ({ number, label, delay }) => {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      <h3 className="stat-number text-gradient">{number}</h3>
      <p className="stat-label">{label}</p>
    </motion.div>
  )
}

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: "AI Mental Health Companion",
      description: "24/7 empathetic AI chatbot trained to provide emotional support and guidance"
    },
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "Track your daily emotions and discover patterns in your mental wellness journey"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and protected with industry-leading security standards"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others on similar journeys in a safe, supportive environment"
    },
    {
      icon: Zap,
      title: "Personalized Exercises",
      description: "CBT, mindfulness, and breathing exercises tailored to your needs"
    },
    {
      icon: Star,
      title: "Progress Insights",
      description: "Comprehensive dashboard showing your mental health progress over time"
    }
  ]

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Your Mental Wellness
                <span className="text-gradient"> Journey Starts Here</span>
              </motion.h1>
              
              <motion.p
                className="hero-subtitle"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Experience personalized mental health support with our AI companion. 
                Track your mood, practice mindfulness, and build resilience with 
                science-backed tools designed for your wellbeing.
              </motion.p>
              
              <motion.div
                className="hero-buttons"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Link to="/login" className="btn btn-primary btn-large">
                  Start Your Journey
                </Link>
                <button className="btn btn-secondary btn-large">
                  Learn More
                </button>
              </motion.div>
            </div>
            
            <div className="hero-visual">
              <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <AnimatedSphere />
                <OrbitControls enableZoom={false} enablePan={false} />
              </Canvas>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <StatCard number="10K+" label="Active Users" delay={0.1} />
            <StatCard number="95%" label="Feel Better" delay={0.2} />
            <StatCard number="24/7" label="Support Available" delay={0.3} />
            <StatCard number="50+" label="Guided Exercises" delay={0.4} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Everything You Need for Mental Wellness</h2>
            <p>Comprehensive tools and support designed by mental health professionals</p>
          </motion.div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content glass"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Transform Your Mental Health?</h2>
            <p>Join thousands of users who have found peace and clarity through our platform</p>
            <Link to="/login" className="btn btn-accent btn-large">
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}