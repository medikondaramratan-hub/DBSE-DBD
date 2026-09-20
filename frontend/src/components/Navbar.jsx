import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const isDemo = localStorage.getItem('demo_mode') === 'true';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-breadcrumb">
          <BookOpen size={18} className="text-primary" />
          <span>Exam Preparation Portal</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Student Portal</span>
        </div>
      </div>

      <div className="topbar-right">
        {isDemo && (
          <span
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #FCD34D',
              marginRight: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
            title="Interactive client-side simulation"
          >
            ⚡ Offline Preview
          </span>
        )}
        {user ? (
          <div className="user-profile-menu">
            <div className="user-meta">
              <span className="user-name">{user.name}</span>
              <span className="user-role-badge">{user.role}</span>
            </div>
            <div className="user-avatar">
              <UserIcon size={20} />
            </div>
            <button
              onClick={logout}
              className="btn btn-secondary btn-sm"
              title="Logout securely"
              aria-label="Logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </div>
        )}
      </div>

      <style>{`
        .topbar {
          height: var(--topbar-height);
          background: #FFFFFF;
          border-bottom: 1px solid var(--card-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .topbar-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .breadcrumb-current {
          color: var(--text-main);
          font-weight: 600;
        }
        .breadcrumb-separator {
          color: var(--text-subtle);
        }
        .user-profile-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-meta {
          text-align: right;
        }
        .user-name {
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-main);
        }
        .user-role-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.1rem 0.5rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }
        .user-avatar {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-full);
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-sm {
          padding: 0.4rem 0.85rem;
          font-size: 0.85rem;
        }
        @media (max-width: 768px) {
          .topbar {
            padding: 0 1rem;
          }
          .topbar-breadcrumb span:nth-child(2),
          .breadcrumb-separator {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
