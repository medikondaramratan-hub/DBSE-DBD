import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  BarChart3, 
  User, 
  Sparkles, 
  Award,
  HelpCircle
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <Sparkles size={22} className="brand-icon" />
        </div>
        <div className="brand-text">
          <span className="brand-title">AdaptivePrep</span>
          <span className="brand-tagline">Adaptive Platform</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Navigation</div>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Student Dashboard</span>
        </NavLink>

        <NavLink 
          to="/subjects" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Layers size={20} />
          <span>Curriculum & Subjects</span>
        </NavLink>

        <NavLink 
          to="/performance" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <BarChart3 size={20} />
          <span>Performance Analytics</span>
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <User size={20} />
          <span>My Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="adaptive-engine-pill">
          <div className="pulse-indicator"></div>
          <div className="pill-text">
            <span className="pill-title">Adaptive Engine</span>
            <span className="pill-desc">Real-time Difficulty Active</span>
          </div>
        </div>
      </div>

      <style>{`
        .sidebar {
          width: var(--sidebar-width);
          background: var(--sidebar-bg);
          color: var(--sidebar-text);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          min-height: 100vh;
          border-right: 1px solid #1E293B;
          user-select: none;
        }
        .sidebar-brand {
          padding: 1.5rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .brand-icon-wrapper {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #4F46E5, #818CF8);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
        }
        .brand-title {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }
        .brand-tagline {
          font-size: 0.72rem;
          color: #818CF8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .sidebar-nav {
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
        }
        .nav-section-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #64748B;
          font-weight: 700;
          padding: 0.5rem 0.85rem;
          margin-top: 0.25rem;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 1rem;
          color: var(--sidebar-text);
          border-radius: var(--radius-md);
          font-weight: 500;
          font-size: 0.925rem;
          transition: all var(--transition-fast);
        }
        .nav-link:hover {
          color: #FFFFFF;
          background: var(--sidebar-hover);
        }
        .nav-link.active {
          color: #FFFFFF;
          background: var(--primary);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
          font-weight: 600;
        }
        .sidebar-footer {
          padding: 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }
        .adaptive-engine-pill {
          background: rgba(79, 70, 229, 0.15);
          border: 1px solid rgba(129, 140, 248, 0.25);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .pulse-indicator {
          width: 10px;
          height: 10px;
          background: #10B981;
          border-radius: 50%;
          box-shadow: 0 0 8px #10B981;
          animation: pulseAnim 2s infinite;
        }
        @keyframes pulseAnim {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .pill-title {
          display: block;
          font-size: 0.825rem;
          font-weight: 700;
          color: #FFFFFF;
        }
        .pill-desc {
          font-size: 0.72rem;
          color: #94A3B8;
        }
      `}</style>
    </aside>
  );
}
