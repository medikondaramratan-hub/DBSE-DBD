import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Target, 
  BrainCircuit, 
  TrendingUp, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      {/* Top Banner */}
      <nav className="landing-nav">
        <div className="landing-brand">
          <div className="brand-logo">
            <Sparkles size={22} />
          </div>
          <span className="brand-name">AdaptivePrep</span>
        </div>
        <div className="landing-nav-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <BrainCircuit size={16} className="text-primary" />
          <span>AI-POWERED ADAPTIVE TESTING</span>
        </div>
        <h1 className="hero-title">
          Exam Preparation App With <span className="gradient-text">Adaptive Quizzes</span>
        </h1>
        <p className="hero-description">
          A full-stack personalized learning platform built on Spring Boot, PostgreSQL, and React.js.
          Dynamically adjusts item difficulty in real-time according to student comprehension, maximizing exam readiness.
        </p>

        <div className="hero-cta-group">
          <Link to={isAuthenticated ? "/dashboard" : "/register"} className="btn btn-primary btn-lg">
            <span>Start Practice Quiz</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/subjects" className="btn btn-secondary btn-lg">
            <BookOpen size={18} />
            <span>Explore Curriculum</span>
          </Link>
        </div>

      </section>

      {/* Feature Cards Grid */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
            <BrainCircuit size={28} />
          </div>
          <h3 className="feature-title">Real-Time Adaptive Engine</h3>
          <p className="feature-desc">
            Starts at intermediate baseline (MEDIUM). Adjusts difficulty to EASY when accuracy falls below 50%,
            or promotes to HARD when accuracy exceeds 75%.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>
            <Target size={28} />
          </div>
          <h3 className="feature-title">Core Computer Science Syllabus</h3>
          <p className="feature-desc">
            Structured curriculum across DBMS, Java, Data Structures, Operating Systems, Networks, and Software Engineering
            with granular academic topics.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon" style={{ background: '#FAF5FF', color: '#8B5CF6' }}>
            <TrendingUp size={28} />
          </div>
          <h3 className="feature-title">Diagnostic Analytics</h3>
          <p className="feature-desc">
            Pinpoints weak topics and generates targeted practice recommendations so students focus effort exactly where improvement is needed.
          </p>
        </div>
      </section>

      <style>{`
        .landing-page {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 0%, #EEF2FF 0%, #F8FAFC 70%);
          padding: 0 1.5rem 4rem;
        }
        .landing-nav {
          max-width: 1200px;
          margin: 0 auto;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .landing-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .brand-logo {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-name {
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .landing-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .hero-section {
          max-width: 860px;
          margin: 4rem auto 3.5rem;
          text-align: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #FFFFFF;
          border: 1px solid var(--card-border);
          box-shadow: var(--shadow-sm);
          padding: 0.4rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.775rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        .hero-title {
          font-size: 3.25rem;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          letter-spacing: -0.03em;
        }
        .gradient-text {
          background: linear-gradient(135deg, #4F46E5 0%, #818CF8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-description {
          font-size: 1.15rem;
          color: var(--text-muted);
          line-height: 1.6;
          max-width: 680px;
          margin: 0 auto 2.25rem;
        }
        .hero-cta-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .btn-lg {
          padding: 0.85rem 1.75rem;
          font-size: 1rem;
        }
        .features-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .feature-card {
          background: #FFFFFF;
          border: 1px solid var(--card-border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: var(--shadow-card);
          transition: transform var(--transition-normal);
        }
        .feature-card:hover {
          transform: translateY(-4px);
        }
        .feature-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .feature-title {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .feature-desc {
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.25rem;
          }
          .hero-cta-group {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
