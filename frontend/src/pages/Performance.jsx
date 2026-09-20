import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import StatCard from '../components/StatCard';
import { 
  BarChart3, 
  Award, 
  Target, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  HelpCircle,
  Play
} from 'lucide-react';

export default function Performance() {
  const [summary, setSummary] = useState(null);
  const [topicPerformances, setTopicPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const [sumRes, topRes] = await Promise.all([
          axiosClient.get('/performance/me'),
          axiosClient.get('/performance/me/topics')
        ]);
        setSummary(sumRes.data);
        setTopicPerformances(topRes.data);
      } catch (err) {
        console.error('Failed to load performance analytics:', err);
        setError('Unable to load performance analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <p>Aggregating topic mastery metrics from PostgreSQL...</p>
      </div>
    );
  }

  const hasData = summary && summary.totalQuizzesAttempted > 0;

  return (
    <div className="performance-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Performance Analytics</h1>
          <p className="page-subtitle">
            Longitudinal topic mastery metrics and diagnostic readiness indicators powered by real database records.
          </p>
        </div>
      </div>

      {error && (
        <div className="card" style={{ background: 'var(--danger-bg)', color: 'var(--danger)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Aggregate Metric Cards */}
      <div className="stat-card-grid">
        <StatCard
          label="Total Quizzes"
          value={summary?.totalQuizzesAttempted || 0}
          icon={Award}
          color="indigo"
          subtitle="Completed sessions"
        />
        <StatCard
          label="Overall Accuracy"
          value={`${summary?.averageAccuracy || 0}%`}
          icon={Target}
          color="emerald"
          subtitle="Average quiz accuracy"
        />
        <StatCard
          label="Total Questions"
          value={summary?.totalQuestionsAnswered || 0}
          icon={HelpCircle}
          color="purple"
          subtitle="Recorded answers"
        />
        <StatCard
          label="Cumulative Level"
          value={summary?.currentLearningLevel?.replace('_', ' ') || 'BEGINNER'}
          icon={TrendingUp}
          color="amber"
          subtitle="Overall mastery tier"
        />
      </div>

      {hasData ? (
        <>
          {/* Smart Practice Recommendations */}
          <div className="card performance-section">
            <div className="section-header">
              <div className="title-with-icon">
                <Sparkles size={20} className="text-primary" />
                <h2 className="section-title">Diagnostic Topic Recommendations</h2>
              </div>
              <span className="section-tag">Targeted Action Items</span>
            </div>

            {summary?.recommendations && summary.recommendations.length > 0 ? (
              <div className="rec-grid">
                {summary.recommendations.map((rec, idx) => (
                  <div key={idx} className={`rec-card priority-${rec.priority.toLowerCase()}`}>
                    <div className="rec-badge">
                      <span>{rec.subjectName}</span>
                      <span>•</span>
                      <span>{rec.topicName}</span>
                    </div>
                    <p className="rec-msg">{rec.message}</p>
                    <div className="rec-footer">
                      <span className="rec-acc">Current Accuracy: {rec.accuracy}%</span>
                      <Link
                        to={`/quiz/start/${rec.topicId}`}
                        className="btn btn-primary btn-sm"
                      >
                        <Play size={14} />
                        <span>Practice Topic</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No weak topics identified! All attempted areas are above 80% accuracy.</p>
            )}
          </div>

          {/* Detailed Topic Breakdown Table */}
          <div className="card performance-section">
            <div className="section-header">
              <h2 className="section-title">Topic-wise Mastery Breakdown</h2>
              <span className="section-tag">{topicPerformances.length} Topics Attempted</span>
            </div>

            <div className="topic-table-wrapper">
              <table className="topic-table">
                <thead>
                  <tr>
                    <th>Curriculum Topic</th>
                    <th>Attempts</th>
                    <th>Questions</th>
                    <th>Accuracy Progress</th>
                    <th>Avg Speed</th>
                    <th>Mastery Tier</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {topicPerformances.map((tp) => (
                    <tr key={tp.topicId}>
                      <td>
                        <strong className="topic-name">{tp.topicName}</strong>
                        <span className="sub-name">{tp.subjectName}</span>
                      </td>
                      <td>{tp.totalAttempts}</td>
                      <td>{tp.totalQuestions} ({tp.correctAnswers} correct)</td>
                      <td>
                        <div className="table-accuracy-bar">
                          <div className="acc-track">
                            <div
                              className={`acc-fill ${tp.accuracy >= 80 ? 'fill-high' : tp.accuracy >= 60 ? 'fill-mid' : 'fill-low'}`}
                              style={{ width: `${Math.min(100, tp.accuracy)}%` }}
                            ></div>
                          </div>
                          <span className="acc-percent">{tp.accuracy}%</span>
                        </div>
                      </td>
                      <td>{tp.averageResponseTime}s</td>
                      <td>
                        <span className="level-badge">{tp.currentLevel}</span>
                      </td>
                      <td>
                        <span className={`status-pill ${tp.status === 'Strong' ? 'status-strong' : tp.status === 'Improving' ? 'status-improving' : 'status-needs-practice'}`}>
                          {tp.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/quiz/start/${tp.topicId}`}
                          className="btn btn-secondary btn-xs"
                        >
                          Practice
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="card empty-state">
          <div className="empty-state-icon">
            <BarChart3 size={56} />
          </div>
          <h2 className="empty-state-title">No Performance Metrics Yet</h2>
          <p className="empty-state-desc">
            Your performance analytics and mastery charts are populated dynamically from your quiz responses.
            Take your first quiz to see diagnostic reports here.
          </p>
          <Link to="/subjects" className="btn btn-primary">
            <span>Explore Subjects & Take Quiz</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      <style>{`
        .performance-page {
          padding-bottom: 3rem;
        }
        .page-header {
          margin-bottom: 2rem;
        }
        .page-title {
          font-size: 1.85rem;
          margin-bottom: 0.35rem;
        }
        .page-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        .performance-section {
          margin-bottom: 2rem;
          padding: 1.75rem;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .title-with-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .section-title {
          font-size: 1.25rem;
        }
        .section-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          background: var(--primary-light);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }
        .rec-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.25rem;
        }
        .rec-card {
          background: #F8FAFC;
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
        }
        .rec-card.priority-high {
          border-left: 4px solid var(--warning);
        }
        .rec-card.priority-medium {
          border-left: 4px solid var(--primary);
        }
        .rec-card.priority-low {
          border-left: 4px solid var(--success);
        }
        .rec-badge {
          display: flex;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .rec-msg {
          font-size: 0.925rem;
          font-weight: 500;
          line-height: 1.5;
        }
        .rec-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--card-border);
          padding-top: 0.75rem;
        }
        .rec-acc {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .topic-table-wrapper {
          overflow-x: auto;
        }
        .topic-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
          text-align: left;
        }
        .topic-table th {
          color: var(--text-muted);
          font-size: 0.775rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.85rem 0.5rem;
          border-bottom: 1px solid var(--card-border);
        }
        .topic-table td {
          padding: 1rem 0.5rem;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
        }
        .topic-name {
          display: block;
          color: var(--text-main);
          font-size: 0.925rem;
        }
        .sub-name {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .table-accuracy-bar {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          min-width: 140px;
        }
        .acc-track {
          flex: 1;
          height: 8px;
          background: #E2E8F0;
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .acc-fill {
          height: 100%;
          border-radius: var(--radius-full);
        }
        .fill-high { background: var(--success); }
        .fill-mid { background: var(--warning); }
        .fill-low { background: var(--danger); }
        .acc-percent {
          font-weight: 700;
          font-size: 0.825rem;
          min-width: 36px;
        }
        .level-badge {
          font-size: 0.75rem;
          font-weight: 700;
          background: #F1F5F9;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
        .status-pill {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
        }
        .status-strong { background: #ECFDF5; color: #065F46; }
        .status-improving { background: #FFFBEB; color: #92400E; }
        .status-needs-practice { background: #FEF2F2; color: #991B1B; }
        .btn-xs {
          padding: 0.25rem 0.6rem;
          font-size: 0.775rem;
        }
        @media (max-width: 768px) {
          .topic-table {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
