import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck, Calendar, KeyRound, LogOut, Award } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1 className="page-title">Student Profile</h1>
        <p className="page-subtitle">Authenticated college student account details and credential security status.</p>
      </div>

      <div className="profile-card card">
        <div className="profile-hero">
          <div className="profile-avatar">
            <User size={44} />
          </div>
          <div className="profile-title-block">
            <h2 className="profile-name">{user?.name}</h2>
            <div className="profile-badges">
              <span className="role-pill">{user?.role}</span>
              <span className="status-pill">Active Student Account</span>
            </div>
          </div>
        </div>

        <div className="profile-details-grid">
          <div className="detail-row">
            <div className="detail-label-icon">
              <Mail size={18} />
              <span>College Email:</span>
            </div>
            <span className="detail-value">{user?.email}</span>
          </div>

          <div className="detail-row">
            <div className="detail-label-icon">
              <ShieldCheck size={18} />
              <span>Account Role:</span>
            </div>
            <span className="detail-value">{user?.role} (Standard Student Permissions)</span>
          </div>

          <div className="detail-row">
            <div className="detail-label-icon">
              <KeyRound size={18} />
              <span>Password Security:</span>
            </div>
            <span className="detail-value">Salted BCrypt Hash (SHA-512 / 10 Rounds)</span>
          </div>

          <div className="detail-row">
            <div className="detail-label-icon">
              <Award size={18} />
              <span>Session Authorization:</span>
            </div>
            <span className="detail-value">Stateless JWT (JSON Web Token)</span>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={logout} className="btn btn-danger">
            <LogOut size={16} />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>

      <style>{`
        .profile-page {
          max-width: 760px;
          margin: 0 auto;
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
        .profile-card {
          padding: 2.5rem;
        }
        .profile-hero {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--card-border);
          margin-bottom: 2rem;
        }
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, #4F46E5, #818CF8);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
        }
        .profile-name {
          font-size: 1.65rem;
          margin-bottom: 0.4rem;
        }
        .profile-badges {
          display: flex;
          gap: 0.5rem;
        }
        .role-pill {
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.2rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.775rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-pill {
          background: #ECFDF5;
          color: #065F46;
          padding: 0.2rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.775rem;
          font-weight: 600;
        }
        .profile-details-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 1rem;
          background: #F8FAFC;
          border-radius: var(--radius-md);
          font-size: 0.925rem;
          gap: 1rem;
        }
        .detail-label-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .detail-value {
          font-weight: 600;
          color: var(--text-main);
          text-align: right;
        }
        .profile-actions {
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid var(--card-border);
          padding-top: 1.5rem;
        }
        @media (max-width: 640px) {
          .profile-hero {
            flex-direction: column;
            text-align: center;
          }
          .profile-badges {
            justify-content: center;
          }
          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
          .detail-value {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}
