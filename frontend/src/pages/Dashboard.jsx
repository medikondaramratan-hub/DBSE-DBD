import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import StatCard from '../components/StatCard';
import DifficultyBadge from '../components/DifficultyBadge';
import { 
  Award, 
  Target, 
  HelpCircle, 
  TrendingUp, 
  Play, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Clock,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [performance, setPerformance] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [perfRes, subRes] = await Promise.all([
          axiosClient.get('/performance/me'),
          axiosClient.get('/subjects')
        ]);
        setPerformance(perfRes.data);
        setSubjects(subRes.data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Unable to load dashboard data. Please verify your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Analyzing learning progress from PostgreSQL database...</p>
        <style>{`
          .dashboard-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 5rem 2rem;
            color: var(--text-muted);
            gap: 1rem;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #E2E8F0;
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const hasHistory = performance && performance.totalQuizzesAttempted > 0;

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Welcome back, {user?.name || 'Student'} 👋
          </h1>
          <p className="welcome-subtitle">
            Your personalized adaptive preparation dashboard. Practice quizzes calibrate difficulty based on real-time response accuracy.
          </p>
        </div>
        <div className="welcome-actions">
          <Link to="/subjects" className="btn btn-primary">
            <Play size={16} />
            <span>Start Practice Quiz</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="card" style={{ background: 'var(--danger-bg)', color: 'var(--danger)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="stat-card-grid">
        <StatCard
          label="Quizzes Completed"
          value={performance?.totalQuizzesAttempted || 0}
          icon={Award}
          color="indigo"
          subtitle="Adaptive attempts recorded"
        />
        <StatCard
          label="Average Accuracy"
          value={`${performance?.averageAccuracy || 0}%`}
          icon={Target}
          color="emerald"
          subtitle="Cumulative question mastery"
        />
        <StatCard
          label="Questions Answered"
          value={performance?.totalQuestionsAnswered || 0}
          icon={HelpCircle}
          color="purple"
          subtitle="Live database responses"
        />
        <StatCard
          label="Current Learning Level"
          value={performance?.currentLearningLevel?.replace('_', ' ') || 'BEGINNER'}
          icon={TrendingUp}
          color="amber"
          subtitle="Calculated mastery tier"
        />
      </div>

      {/* Main Dashboard Layout */}
      <div className="dashboard-main-grid">
        {/* Left Column: Recommendations & Recent Activity */}
        <div className="dashboard-left-col">
          {/* Smart Practice Recommendations */}
          <div className="card card-section">
            <div className="section-header">
              <div className="section-title-wrapper">
                <Sparkles size={20} className="text-primary" />
                <h2 className="section-title">Smart Practice Recommendations</h2>
              </div>
              <span className="section-tag">AI Calibrated</span>
            </div>

            {performance?.recommendations && performance.recommendations.length > 0 ? (
              <div className="recommendations-list">
                {performance.recommendations.map((rec, idx) => (
                  <div key={idx} className={`rec-card priority-${rec.priority.toLowerCase()}`}>
                    <div className="rec-info">
                      <div className="rec-topic-badge">
                        <span>{rec.subjectName}</span>
                        <span>•</span>
                        <span>{rec.topicName}</span>
                      </div>
                      <p className="rec-message">{rec.message}</p>
                    </div>
                    <Link
                      to={`/quiz/start/${rec.topicId}`}
                      className="btn btn-primary btn-sm"
                    >
                      <span>Practice Topic</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-recommendation">
                <p>Complete your first adaptive quiz to generate personalized weak-topic recommendations.</p>
                <Link to="/subjects" className="btn btn-outline btn-sm">Explore Topics</Link>
              </div>
            )}
          </div>

          {/* Recent Quiz Activity */}
          <div className="card card-section">
            <div className="section-header">
              <h2 className="section-title">Recent Quiz Attempts</h2>
              <Link to="/performance" className="section-link">View All Analytics</Link>
            </div>

            {hasHistory ? (
              <div className="recent-attempts-table-wrapper">
                <table className="recent-table">
                  <thead>
                    <tr>
                      <th>Subject & Topic</th>
                      <th>Score</th>
                      <th>Accuracy</th>
                      <th>Tier</th>
                      <th>Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performance.recentAttempts.map((attempt) => (
                      <tr key={attempt.attemptId}>
                        <td>
                          <span className="table-topic-name">{attempt.topicName}</span>
                          <span className="table-subject-name">{attempt.subjectName}</span>
                        </td>
                        <td><strong>{attempt.score}</strong> / {attempt.totalQuestions}</td>
                        <td>
                          <span className={`accuracy-pill ${attempt.accuracy >= 75 ? 'acc-high' : attempt.accuracy >= 50 ? 'acc-mid' : 'acc-low'}`}>
                            {attempt.accuracy}%
                          </span>
                        </td>
                        <td>
                          <DifficultyBadge difficulty={attempt.finalDifficulty} />
                        </td>
                        <td>{attempt.timeTaken}s</td>
                        <td>
                          <Link to={`/quiz/result/${attempt.attemptId}`} className="btn btn-secondary btn-xs">
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <HelpCircle size={48} />
                </div>
                <h3 className="empty-state-title">No Quiz History Yet</h3>
                <p className="empty-state-desc">
                  Start your first adaptive quiz to establish your baseline aptitude tier and begin tracking your performance.
                </p>
                <Link to="/subjects" className="btn btn-primary">
                  <span>Browse Subjects & Start</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Strong/Weak Topic Summary & Quick Subjects */}
        <div className="dashboard-right-col">
          {/* Diagnostic Topic Insights */}
          <div className="card card-section">
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Curriculum Mastery</h2>
            
            <div className="mastery-summary-box">
              <div className="mastery-item">
                <span className="mastery-label">Strongest Subject:</span>
                <span className="mastery-val text-success">
                  {performance?.strongestSubject || 'Pending Data'}
                </span>
              </div>
              <div className="mastery-item">
                <span className="mastery-label">Area for Improvement:</span>
                <span className="mastery-val text-warning">
                  {performance?.weakestSubject || 'Pending Data'}
                </span>
              </div>
            </div>

            {/* Quick Subjects Jump */}
            <h3 className="sub-section-title">Core Academic Disciplines</h3>
            <div className="quick-subjects-list">
              {subjects.slice(0, 4).map((sub) => (
                <Link
                  key={sub.subjectId}
                  to={`/topics/${sub.subjectId}`}
                  className="quick-subject-row"
                >
                  <div className="quick-sub-info">
                    <span className="quick-sub-name">{sub.subjectName}</span>
                    <span className="quick-sub-topics">{sub.topicCount} Topics</span>
                  </div>
                  <ArrowRight size={16} className="text-subtle" />
                </Link>
              ))}
            </div>

            <Link to="/subjects" className="btn btn-secondary btn-full" style={{ marginTop: '1rem' }}>
              <span>View All 6 Subjects</span>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-page {
          padding-bottom: 2rem;
        }
        .welcome-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1.5rem;
        }
        .welcome-title {
          font-size: 1.85rem;
          margin-bottom: 0.35rem;
        }
        .welcome-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
          max-width: 700px;
        }
        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }
        .card-section {
          margin-bottom: 1.5rem;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        .section-title-wrapper {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .section-title {
          font-size: 1.2rem;
          font-weight: 700;
        }
        .section-tag {
          font-size: 0.725rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
        }
        .section-link {
          font-size: 0.85rem;
          font-weight: 600;
        }
        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .rec-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          background: #F8FAFC;
          border: 1px solid var(--card-border);
          gap: 1rem;
        }
        .rec-card.priority-high {
          border-left: 4px solid var(--warning);
        }
        .rec-card.priority-medium {
          border-left: 4px solid var(--primary);
        }
        .rec-topic-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }
        .rec-message {
          font-size: 0.925rem;
          color: var(--text-main);
          font-weight: 500;
        }
        .empty-recommendation {
          padding: 1.5rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .empty-recommendation p {
          margin-bottom: 1rem;
        }
        .recent-attempts-table-wrapper {
          overflow-x: auto;
        }
        .recent-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
          text-align: left;
        }
        .recent-table th {
          color: var(--text-muted);
          font-size: 0.775rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.75rem 0.5rem;
          border-bottom: 1px solid var(--card-border);
        }
        .recent-table td {
          padding: 0.85rem 0.5rem;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
        }
        .table-topic-name {
          display: block;
          font-weight: 600;
          color: var(--text-main);
        }
        .table-subject-name {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .accuracy-pill {
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
        }
        .acc-high { background: #ECFDF5; color: #065F46; }
        .acc-mid { background: #FFFBEB; color: #92400E; }
        .acc-low { background: #FEF2F2; color: #991B1B; }
        .btn-xs {
          padding: 0.25rem 0.65rem;
          font-size: 0.775rem;
        }
        .mastery-summary-box {
          background: #F8FAFC;
          border-radius: var(--radius-md);
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .mastery-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }
        .mastery-label {
          color: var(--text-muted);
        }
        .mastery-val {
          font-weight: 700;
        }
        .text-success { color: var(--success); }
        .text-warning { color: var(--warning); }
        .sub-section-title {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }
        .quick-subjects-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .quick-subject-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          background: #F8FAFC;
          border-radius: var(--radius-md);
          border: 1px solid var(--card-border);
          transition: all var(--transition-fast);
        }
        .quick-subject-row:hover {
          background: #FFFFFF;
          border-color: var(--primary);
          transform: translateX(3px);
        }
        .quick-sub-name {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .quick-sub-topics {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .btn-full {
          width: 100%;
        }
        @media (max-width: 1024px) {
          .dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .welcome-banner {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
