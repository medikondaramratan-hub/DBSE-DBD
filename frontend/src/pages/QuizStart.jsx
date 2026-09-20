import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  Clock, 
  Award, 
  Play, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function QuizStart() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/topics/${topicId}`);
        setTopic(res.data);
      } catch (err) {
        console.error('Failed to load topic:', err);
        setError('Topic information not found.');
      } finally {
        setLoading(false);
      }
    };
    if (topicId) {
      fetchTopic();
    }
  }, [topicId]);

  const handleStart = async () => {
    try {
      setStarting(true);
      setError('');
      const res = await axiosClient.post('/quizzes/start', {
        topicId: Number(topicId),
        totalQuestions: Number(totalQuestions)
      });
      const { attemptId } = res.data;
      navigate(`/quiz/${attemptId}`);
    } catch (err) {
      console.error('Failed to start quiz:', err);
      setError(err.response?.data?.message || 'Failed to start quiz attempt.');
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
        <p>Loading quiz preparation details...</p>
      </div>
    );
  }

  return (
    <div className="quiz-start-page">
      <div className="breadcrumb-nav">
        <Link to={`/topics/${topic?.subjectId}`} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Topics</span>
        </Link>
      </div>

      <div className="quiz-briefing-card card">
        <div className="briefing-header">
          <div className="badge badge-medium" style={{ marginBottom: '0.5rem' }}>
            Adaptive Engine Mode
          </div>
          <h1 className="briefing-title">{topic?.topicName}</h1>
          <p className="briefing-subject">{topic?.subjectName} • College Exam Preparation</p>
        </div>

        {error && (
          <div className="card" style={{ background: 'var(--danger-bg)', color: 'var(--danger)', marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="briefing-details-grid">
          <div className="detail-item">
            <div className="detail-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
              <HelpCircle size={22} />
            </div>
            <div>
              <span className="detail-label">Questions</span>
              <span className="detail-val">{totalQuestions} Test Items</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon" style={{ background: '#FFFBEB', color: '#F59E0B' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <span className="detail-label">Starting Difficulty</span>
              <span className="detail-val">MEDIUM Tier</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>
              <Clock size={22} />
            </div>
            <div>
              <span className="detail-label">Session Timer</span>
              <span className="detail-val">Untimed / Self-Paced</span>
            </div>
          </div>
        </div>

        {/* Adaptive Rules Box */}
        <div className="rules-box">
          <h3 className="rules-title">How the Adaptive Engine Works</h3>
          <ul className="rules-list">
            <li>
              <CheckCircle2 size={16} className="text-success" />
              <span><strong>Baseline Question:</strong> The quiz always begins with a <strong>MEDIUM</strong> difficulty problem.</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="text-success" />
              <span><strong>Promoting to HARD:</strong> Sustaining rolling accuracy <strong>&gt; 75%</strong> automatically promotes you to challenging, higher-mark questions.</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="text-success" />
              <span><strong>Adapting to EASY:</strong> If rolling accuracy drops <strong>&lt; 50%</strong>, the engine seamlessly routes to foundational EASY questions.</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="text-success" />
              <span><strong>Answer Integrity:</strong> Correct answers and explanations are revealed only after full quiz submission.</span>
            </li>
          </ul>
        </div>

        <div className="briefing-actions">
          <button
            onClick={handleStart}
            className="btn btn-primary btn-lg btn-start"
            disabled={starting}
          >
            <Play size={20} />
            <span>{starting ? 'Initializing Adaptive Session...' : 'Start Practice Quiz Now'}</span>
          </button>
        </div>
      </div>

      <style>{`
        .quiz-start-page {
          max-width: 760px;
          margin: 0 auto;
          padding-bottom: 3rem;
        }
        .breadcrumb-nav {
          margin-bottom: 1.5rem;
        }
        .quiz-briefing-card {
          padding: 2.5rem;
        }
        .briefing-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .briefing-title {
          font-size: 2rem;
          margin-bottom: 0.35rem;
        }
        .briefing-subject {
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        .briefing-details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: #F8FAFC;
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          padding: 1rem;
        }
        .detail-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .detail-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .detail-val {
          display: block;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .rules-box {
          background: #F8FAFC;
          border: 1px solid var(--card-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        .rules-title {
          font-size: 1.05rem;
          margin-bottom: 1rem;
          color: var(--text-main);
        }
        .rules-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          font-size: 0.9rem;
          color: var(--text-main);
        }
        .rules-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          line-height: 1.5;
        }
        .rules-list li svg {
          margin-top: 0.2rem;
          flex-shrink: 0;
        }
        .briefing-actions {
          text-align: center;
        }
        .btn-start {
          width: 100%;
          padding: 0.95rem;
          font-size: 1.05rem;
        }
        @media (max-width: 640px) {
          .briefing-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
