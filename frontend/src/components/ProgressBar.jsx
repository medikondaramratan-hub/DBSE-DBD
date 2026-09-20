import React from 'react';

export default function ProgressBar({ current, total }) {
  const percentage = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-label">Quiz Progression</span>
        <span className="progress-step">Question {current} of {total} ({percentage}%)</span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
      </div>

      <style>{`
        .progress-container {
          margin-bottom: 1.5rem;
        }
        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
        }
        .progress-label {
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .progress-step {
          font-weight: 700;
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}
