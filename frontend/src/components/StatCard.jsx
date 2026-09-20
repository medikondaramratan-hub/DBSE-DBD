import React from 'react';

export default function StatCard({ label, value, icon: Icon, color = 'indigo', subtitle }) {
  const colorStyles = {
    indigo: { bg: '#EEF2FF', text: '#4F46E5' },
    emerald: { bg: '#ECFDF5', text: '#10B981' },
    amber: { bg: '#FFFBEB', text: '#F59E0B' },
    purple: { bg: '#FAF5FF', text: '#8B5CF6' },
  };

  const activeColor = colorStyles[color] || colorStyles.indigo;

  return (
    <div className="stat-card">
      <div 
        className="stat-icon-wrapper" 
        style={{ background: activeColor.bg, color: activeColor.text }}
      >
        {Icon && <Icon size={26} />}
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <div className="stat-value">{value}</div>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>

      <style>{`
        .stat-subtitle {
          display: block;
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }
      `}</style>
    </div>
  );
}
