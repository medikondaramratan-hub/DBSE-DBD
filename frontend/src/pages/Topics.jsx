import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { 
  ArrowLeft, 
  Layers, 
  HelpCircle, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  BookOpen 
} from 'lucide-react';

export default function Topics() {
  const { subjectId } = useParams();
  const [topics, setTopics] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopicsData = async () => {
      try {
        setLoading(true);
        const [topRes, subRes] = await Promise.all([
          axiosClient.get(`/subjects/${subjectId}/topics`),
          axiosClient.get(`/subjects/${subjectId}`)
        ]);
        setTopics(topRes.data);
        setSubject(subRes.data);
      } catch (err) {
        console.error('Failed to load topics:', err);
        setError('Unable to load curriculum topics.');
      } finally {
        setLoading(false);
      }
    };

    if (subjectId) {
      fetchTopicsData();
    }
  }, [subjectId]);

  return (
    <div className="topics-page">
      <div className="breadcrumb-nav">
        <Link to="/subjects" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to All Subjects</span>
        </Link>
      </div>

      <div className="topics-hero card">
        <div className="hero-sub-icon">
          <BookOpen size={32} />
        </div>
        <div>
          <span className="hero-sub-badge">Curriculum Module</span>
          <h1 className="hero-sub-title">{subject?.subjectName || 'Course Discipline'}</h1>
          <p className="hero-sub-desc">{subject?.description}</p>
        </div>
      </div>

      <div className="topics-section-header">
        <h2 className="section-title">Available Topics ({topics.length})</h2>
        <span className="adaptive-hint">
          <Sparkles size={14} className="text-primary" />
          <span>Every topic supports real-time difficulty adaptation (EASY, MEDIUM, HARD)</span>
        </span>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading topics from database...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
          {error}
        </div>
      ) : (
        <div className="topics-list-grid">
          {topics.map((t) => (
            <div key={t.topicId} className="card card-hover topic-card">
              <div className="topic-card-header">
                <div className="topic-icon-pill">
                  <Layers size={20} />
                </div>
                <span className="question-count-badge">
                  {t.totalQuestions} Questions Available
                </span>
              </div>

              <h3 className="topic-title">{t.topicName}</h3>
              <p className="topic-desc">{t.description}</p>

              <div className="topic-card-footer">
                <div className="difficulty-tier-pills">
                  <span className="tier-dot dot-easy" title="Includes EASY questions">EASY</span>
                  <span className="tier-dot dot-med" title="Includes MEDIUM questions">MEDIUM</span>
                  <span className="tier-dot dot-hard" title="Includes HARD questions">HARD</span>
                </div>

                <Link
                  to={`/quiz/start/${t.topicId}`}
                  className="btn btn-primary btn-sm"
                >
                  <Play size={14} />
                  <span>Start Adaptive Quiz</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .topics-page {
          padding-bottom: 2rem;
        }
        .breadcrumb-nav {
          margin-bottom: 1.5rem;
        }
        .topics-hero {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          margin-bottom: 2.5rem;
          background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%);
        }
        .hero-sub-icon {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hero-sub-badge {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--primary);
          display: block;
          margin-bottom: 0.25rem;
        }
        .hero-sub-title {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .hero-sub-desc {
          color: var(--text-muted);
          font-size: 0.95rem;
          max-width: 750px;
        }
        .topics-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .adaptive-hint {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--text-muted);
          background: #F1F5F9;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
        }
        .topics-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        .topic-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.5rem;
        }
        .topic-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .topic-icon-pill {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: #F1F5F9;
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .question-count-badge {
          font-size: 0.775rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .topic-title {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        .topic-desc {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          flex: 1;
        }
        .topic-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--card-border);
          padding-top: 1.25rem;
        }
        .difficulty-tier-pills {
          display: flex;
          gap: 0.35rem;
        }
        .tier-dot {
          font-size: 0.675rem;
          font-weight: 700;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
        }
        .dot-easy { background: #ECFDF5; color: #065F46; }
        .dot-med { background: #FFFBEB; color: #92400E; }
        .dot-hard { background: #FAF5FF; color: #6B21A8; }
        @media (max-width: 768px) {
          .topics-hero {
            flex-direction: column;
            align-items: flex-start;
          }
          .topics-list-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
