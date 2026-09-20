import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message
        || (err.request
          ? 'The sign-in service is unavailable. Start the backend and database, then try again.'
          : 'Unable to sign in. Please try again.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    localStorage.setItem('demo_mode', 'true');
    const demoUser = {
      userId: 1,
      name: 'Ram Ratan',
      email: email.trim() || 'ramratanmedikonda@gmail.com',
      role: 'STUDENT',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('token', 'mock-jwt-token-demo');
    localStorage.setItem('user', JSON.stringify(demoUser));
    navigate('/dashboard');
    window.location.reload();
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-brand-logo">
            <Sparkles size={24} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your adaptive learning account</p>
        </div>

        {error && (
          <div className="auth-error-banner" role="alert" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              style={{
                background: 'none',
                border: 'none',
                color: '#4F46E5',
                textDecoration: 'underline',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
                fontSize: '0.875rem'
              }}
            >
              👉 Click here to test in Interactive Demo Mode
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">College Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="email-input"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-submit"
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn btn-secondary btn-submit"
            style={{
              marginTop: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: '#F0FDF4',
              color: '#166534',
              borderColor: '#BBF7D0',
              fontWeight: 600
            }}
          >
            <Sparkles size={18} />
            <span>⚡ Try Demo Mode (Instant Access)</span>
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/register" className="auth-link">Register New Student</Link>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: radial-gradient(circle at 50% 10%, #EEF2FF 0%, #F8FAFC 80%);
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          padding: 2.5rem 2rem;
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
        }
        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .auth-brand-logo {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, #4F46E5, #818CF8);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
        }
        .auth-title {
          font-size: 1.65rem;
          margin-bottom: 0.35rem;
        }
        .auth-subtitle {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .auth-error-banner {
          background: var(--danger-bg);
          color: var(--danger);
          border: 1px solid var(--danger-border);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-subtle);
          pointer-events: none;
        }
        .input-with-icon .form-input {
          padding-left: 2.85rem;
          padding-right: 2.85rem;
        }
        .password-toggle-btn {
          position: absolute;
          right: 1rem;
          background: transparent;
          color: var(--text-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .password-toggle-btn:hover {
          color: var(--text-main);
        }
        .btn-submit {
          width: 100%;
          padding: 0.8rem;
          margin-top: 0.5rem;
        }
        .auth-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .auth-link {
          font-weight: 600;
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}
