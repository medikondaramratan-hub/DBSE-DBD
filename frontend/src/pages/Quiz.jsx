import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import ProgressBar from '../components/ProgressBar';
import DifficultyBadge from '../components/DifficultyBadge';
import { 
  Clock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  HelpCircle,
  TrendingUp,
  Shield
} from 'lucide-react';

export default function Quiz() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Timer State
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const questionStartTimeRef = useRef(Date.now());

  // Fetch initial question
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/quizzes/${attemptId}/next-question`);
        setQuestion(res.data);
        questionStartTimeRef.current = Date.now();
      } catch (err) {
        console.error('Failed to load question:', err);
        // If all questions are already answered, redirect to results
        if (err.response?.status === 400 && err.response?.data?.message?.includes('already been answered')) {
          navigate(`/quiz/result/${attemptId}`);
        } else {
          setError(err.response?.data?.message || 'Error loading active quiz question.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) {
      fetchQuestion();
    }
  }, [attemptId, navigate]);

  // Overall Timer Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (letter) => {
    if (submittedFeedback) return; // Prevent changing after submission
    setSelectedOption(letter);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption) {
      setError('Please select an option before submitting.');
      return;
    }
    setError('');

    const timeSpentOnQuestion = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));

    try {
      setSubmitting(true);
      const res = await axiosClient.post(`/quizzes/${attemptId}/answer`, {
        questionId: question.questionId,
        selectedAnswer: selectedOption,
        responseTime: timeSpentOnQuestion
      });

      setSubmittedFeedback(res.data);
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError(err.response?.data?.message || 'Failed to evaluate answer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextOrFinish = async () => {
    if (!submittedFeedback) return;

    if (submittedFeedback.hasMoreQuestions && submittedFeedback.nextQuestion) {
      // Advance to next adaptive question
      setQuestion(submittedFeedback.nextQuestion);
      setSelectedOption('');
      setSubmittedFeedback(null);
      questionStartTimeRef.current = Date.now();
    } else {
      // Quiz finished - conclude attempt
      try {
        setLoading(true);
        await axiosClient.post(`/quizzes/${attemptId}/finish`);
        navigate(`/quiz/result/${attemptId}`);
      } catch (err) {
        console.error('Error completing quiz:', err);
        navigate(`/quiz/result/${attemptId}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="card quiz-loading-card">
        <div className="spinner"></div>
        <p>Loading question from PostgreSQL database...</p>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      {/* Top Status Bar */}
      <div className="quiz-topbar card">
        <div className="quiz-top-left">
          <span className="quiz-mode-pill">
            <Sparkles size={14} />
            <span>Adaptive Quiz</span>
          </span>
          <div className="current-tier-indicator">
            <span className="tier-label">Current Difficulty:</span>
            <DifficultyBadge difficulty={question?.difficulty} />
          </div>
        </div>

        <div className="quiz-top-right">
          <div className="timer-badge">
            <Clock size={16} />
            <span>Time Elapsed: {formatTimer(secondsElapsed)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {question && (
        <ProgressBar
          current={question.questionNumber}
          total={question.totalQuestions}
        />
      )}

      {error && (
        <div className="card error-banner" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Question Card */}
      {question && (
        <div className="card question-card">
          <div className="question-header">
            <span className="question-number-tag">
              Question {question.questionNumber} of {question.totalQuestions}
            </span>
            <span className="question-tier-tag">
              Assigned Tier: {question.difficulty}
            </span>
          </div>

          <h2 className="question-text">{question.questionText}</h2>

          {/* 4 Options */}
          <div className="options-container">
            {[
              { key: 'A', text: question.optionA },
              { key: 'B', text: question.optionB },
              { key: 'C', text: question.optionC },
              { key: 'D', text: question.optionD },
            ].map(({ key, text }) => {
              let optionClass = 'option-btn';
              if (selectedOption === key) {
                optionClass += ' selected';
              }
              if (submittedFeedback) {
                if (selectedOption === key) {
                  optionClass += submittedFeedback.isCorrect ? ' correct' : ' incorrect';
                }
              }

              return (
                <button
                  key={key}
                  type="button"
                  className={optionClass}
                  onClick={() => handleSelectOption(key)}
                  disabled={!!submittedFeedback}
                >
                  <span className="option-indicator">{key}</span>
                  <span className="option-label-text">{text}</span>
                </button>
              );
            })}
          </div>

          {/* Instant Adaptive Feedback Banner */}
          {submittedFeedback && (
            <div className={`adaptive-feedback-banner ${submittedFeedback.isCorrect ? 'fb-correct' : 'fb-incorrect'}`}>
              <div className="fb-header">
                {submittedFeedback.isCorrect ? (
                  <>
                    <CheckCircle2 size={20} className="text-success" />
                    <strong>Correct Response! (+1 Mark)</strong>
                  </>
                ) : (
                  <>
                    <XCircle size={20} className="text-danger" />
                    <strong>Incorrect Response</strong>
                  </>
                )}
              </div>
              <div className="fb-body">
                <div className="fb-stat">
                  <span>Rolling Accuracy:</span>
                  <strong>{submittedFeedback.currentAccuracy}%</strong>
                </div>
                <div className="fb-stat">
                  <span>Next Adaptive Tier:</span>
                  <DifficultyBadge difficulty={submittedFeedback.nextDifficulty} />
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="question-footer">
            {!submittedFeedback ? (
              <button
                type="button"
                className="btn btn-primary btn-submit-answer"
                onClick={handleSubmitAnswer}
                disabled={!selectedOption || submitting}
              >
                <span>{submitting ? 'Evaluating Response...' : 'Submit Answer'}</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-next-question"
                onClick={handleNextOrFinish}
              >
                <span>
                  {submittedFeedback.hasMoreQuestions
                    ? 'Next Adaptive Question'
                    : 'Finish Quiz & View Results'}
                </span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        .quiz-page {
          max-width: 860px;
          margin: 0 auto;
          padding-bottom: 3rem;
        }
        .quiz-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .quiz-top-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .quiz-mode-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.775rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .current-tier-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .tier-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .timer-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--text-main);
          background: #F1F5F9;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
        }
        .question-card {
          padding: 2.25rem;
        }
        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .question-number-tag {
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .question-tier-tag {
          font-size: 0.775rem;
          font-weight: 600;
          color: var(--text-subtle);
        }
        .question-text {
          font-size: 1.35rem;
          line-height: 1.45;
          margin-bottom: 2rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .options-container {
          margin-bottom: 2rem;
        }
        .option-label-text {
          flex: 1;
          line-height: 1.45;
        }
        .adaptive-feedback-banner {
          border-radius: var(--radius-md);
          padding: 1.25rem;
          margin-bottom: 1.75rem;
          border: 1px solid;
          animation: fadeIn 0.3s ease;
        }
        .fb-correct {
          background: #ECFDF5;
          border-color: #A7F3D0;
          color: #065F46;
        }
        .fb-incorrect {
          background: #FEF2F2;
          border-color: #FECACA;
          color: #991B1B;
        }
        .fb-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }
        .fb-body {
          display: flex;
          align-items: center;
          gap: 2rem;
          font-size: 0.875rem;
        }
        .fb-stat {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .question-footer {
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid var(--card-border);
          padding-top: 1.5rem;
        }
        .btn-submit-answer,
        .btn-next-question {
          min-width: 220px;
          padding: 0.85rem 1.5rem;
        }
        .error-banner {
          background: var(--danger-bg);
          color: var(--danger);
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .quiz-loading-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 2rem;
          color: var(--text-muted);
          gap: 1rem;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .quiz-topbar {
            flex-direction: column;
            align-items: flex-start;
          }
          .fb-body {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .btn-submit-answer,
          .btn-next-question {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
