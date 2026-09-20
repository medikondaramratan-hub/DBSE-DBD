import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import DifficultyBadge from '../components/DifficultyBadge';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  Target, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  RotateCcw, 
  LayoutDashboard,
  BarChart3,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export default function QuizResult() {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showExplanations, setShowExplanations] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/quizzes/${attemptId}/result`);
        setResult(res.data);
      } catch (err) {
        console.error('Failed to load quiz result:', err);
        setError('Unable to load quiz attempt result.');
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) {
      fetchResult();
    }
  }, [attemptId]);

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <p>Calculating final score and updating learning analytics in database...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="card" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
        {error || 'Quiz result not found.'}
      </div>
    );
  }

  return (
    <div className="result-page">
      {/* Result Hero Header */}
      <div className="result-hero card">
        <div className="result-status-badge">
          <CheckCircle2 size={16} className="text-success" />
          <span>Quiz Completed Successfully</span>
        </div>

        <h1 className="result-title">Adaptive Quiz Results</h1>
        <p className="result-subtitle">
          {result.subjectName} • {result.topicName}
        </p>

        {/* 4 Score Metric Badges */}
        <div className="metrics-summary-grid">
          <div className="metric-box">
            <Award size={24} className="metric-icon text-primary" />
            <span className="metric-val">{result.score} / {result.totalQuestions}</span>
            <span className="metric-lbl">Total Score</span>
          </div>

          <div className="metric-box">
            <Target size={24} className="metric-icon text-success" />
            <span className="metric-val">{result.accuracy}%</span>
            <span className="metric-lbl">Accuracy</span>
          </div>

          <div className="metric-box">
            <Clock size={24} className="metric-icon text-amber" />
            <span className="metric-val">{result.timeFormatted}</span>
            <span className="metric-lbl">Duration</span>
          </div>

          <div className="metric-box">
            <TrendingUp size={24} className="metric-icon text-purple" />
            <span className="metric-val">{result.performanceLevel}</span>
            <span className="metric-lbl">Mastery Level</span>
          </div>
        </div>

        <div className="adaptive-recommendation-pill">
          <span className="rec-pill-label">Adaptive Progression:</span>
          <span>Next suggested difficulty for this topic:</span>
          <DifficultyBadge difficulty={result.nextRecommendedDifficulty} />
        </div>

        {/* Action Buttons */}
        <div className="result-actions-bar">
          <Link
            to={`/quiz/start/${result.topicId}`}
            className="btn btn-primary"
          >
            <RotateCcw size={16} />
            <span>Practice Topic Again</span>
          </Link>

          <Link to="/performance" className="btn btn-secondary">
            <BarChart3 size={16} />
            <span>View Performance Analytics</span>
          </Link>

          <Link to="/dashboard" className="btn btn-secondary">
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Answer Review Section */}
      <div className="review-section">
        <div className="review-header">
          <h2 className="section-title">Question Breakdown & Solutions ({result.reviews.length})</h2>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowExplanations(!showExplanations)}
          >
            {showExplanations ? 'Hide Explanations' : 'Show All Explanations'}
          </button>
        </div>

        <div className="reviews-list">
          {result.reviews.map((rev, index) => (
            <div 
              key={rev.questionId} 
              className={`card review-card ${rev.isCorrect ? 'border-correct' : 'border-incorrect'}`}
            >
              <div className="review-card-top">
                <div className="review-q-meta">
                  <span className="review-q-number">Question {index + 1}</span>
                  <DifficultyBadge difficulty={rev.difficulty} />
                </div>
                <div className={`eval-badge ${rev.isCorrect ? 'eval-correct' : 'eval-incorrect'}`}>
                  {rev.isCorrect ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Correct</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} />
                      <span>Incorrect</span>
                    </>
                  )}
                </div>
              </div>

              <h3 className="review-question-text">{rev.questionText}</h3>

              <div className="review-options-grid">
                {[
                  { key: 'A', text: rev.optionA },
                  { key: 'B', text: rev.optionB },
                  { key: 'C', text: rev.optionC },
                  { key: 'D', text: rev.optionD },
                ].map(({ key, text }) => {
                  let optClass = 'review-option-pill';
                  const isUserSelection = rev.selectedAnswer === key;
                  const isActualCorrect = rev.correctAnswer === key;

                  if (isActualCorrect) {
                    optClass += ' opt-is-correct';
                  } else if (isUserSelection && !rev.isCorrect) {
                    optClass += ' opt-is-wrong';
                  }

                  return (
                    <div key={key} className={optClass}>
                      <span className="opt-key">{key}</span>
                      <span className="opt-text">{text}</span>
                      {isUserSelection && (
                        <span className="user-choice-tag">Your Choice</span>
                      )}
                      {isActualCorrect && (
                        <span className="correct-choice-tag">Correct Answer</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {showExplanations && rev.explanation && (
                <div className="explanation-box">
                  <div className="explanation-header">
                    <ShieldCheck size={16} className="text-primary" />
                    <strong>Academic Explanation:</strong>
                  </div>
                  <p className="explanation-text">{rev.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .result-page {
          max-width: 900px;
          margin: 0 auto;
          padding-bottom: 3rem;
        }
        .result-hero {
          text-align: center;
          padding: 2.5rem 2rem;
          margin-bottom: 2.5rem;
        }
        .result-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #ECFDF5;
          color: #065F46;
          padding: 0.3rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .result-title {
          font-size: 2.25rem;
          margin-bottom: 0.35rem;
        }
        .result-subtitle {
          color: var(--text-muted);
          font-size: 1rem;
          margin-bottom: 2rem;
        }
        .metrics-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .metric-box {
          background: #F8FAFC;
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }
        .metric-icon {
          margin-bottom: 0.25rem;
        }
        .metric-val {
          font-size: 1.5rem;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          color: var(--text-main);
        }
        .metric-lbl {
          font-size: 0.775rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }
        .text-amber { color: var(--warning); }
        .text-purple { color: #8B5CF6; }
        .adaptive-recommendation-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          background: #F1F5F9;
          padding: 0.65rem 1.25rem;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 2rem;
        }
        .rec-pill-label {
          font-weight: 700;
          color: var(--text-main);
        }
        .result-actions-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .review-section {
          margin-top: 2rem;
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .review-card {
          padding: 1.75rem;
        }
        .border-correct {
          border-left: 4px solid var(--success);
        }
        .border-incorrect {
          border-left: 4px solid var(--danger);
        }
        .review-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .review-q-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .review-q-number {
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .eval-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
        }
        .eval-correct {
          background: #ECFDF5;
          color: #065F46;
        }
        .eval-incorrect {
          background: #FEF2F2;
          color: #991B1B;
        }
        .review-question-text {
          font-size: 1.15rem;
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }
        .review-options-grid {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 1.25rem;
        }
        .review-option-pill {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          background: #F8FAFC;
          border: 1px solid var(--card-border);
          font-size: 0.9rem;
          gap: 0.75rem;
        }
        .opt-key {
          font-weight: 700;
          width: 26px;
          height: 26px;
          background: #E2E8F0;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          flex-shrink: 0;
        }
        .opt-text {
          flex: 1;
        }
        .opt-is-correct {
          background: #ECFDF5;
          border-color: #10B981;
          color: #065F46;
          font-weight: 600;
        }
        .opt-is-correct .opt-key {
          background: #10B981;
          color: #FFFFFF;
        }
        .opt-is-wrong {
          background: #FEF2F2;
          border-color: #EF4444;
          color: #991B1B;
          font-weight: 600;
        }
        .opt-is-wrong .opt-key {
          background: #EF4444;
          color: #FFFFFF;
        }
        .user-choice-tag {
          font-size: 0.725rem;
          font-weight: 700;
          background: #FEE2E2;
          color: #991B1B;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }
        .correct-choice-tag {
          font-size: 0.725rem;
          font-weight: 700;
          background: #D1FAE5;
          color: #065F46;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }
        .explanation-box {
          background: #F8FAFC;
          border-left: 3px solid var(--primary);
          padding: 1rem 1.25rem;
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
        }
        .explanation-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--primary);
          margin-bottom: 0.35rem;
        }
        .explanation-text {
          font-size: 0.875rem;
          color: var(--text-main);
          line-height: 1.5;
        }
        @media (max-width: 640px) {
          .metrics-summary-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .result-actions-bar {
            flex-direction: column;
          }
          .result-actions-bar .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
