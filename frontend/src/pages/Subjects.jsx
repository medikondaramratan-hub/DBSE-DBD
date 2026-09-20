import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { 
  Database, 
  Code, 
  Layers, 
  Cpu, 
  Globe, 
  CheckCircle, 
  BookOpen, 
  ArrowRight,
  Search
} from 'lucide-react';

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/subjects');
        setSubjects(res.data);
      } catch (err) {
        console.error('Failed to load subjects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const getSubjectIcon = (iconName) => {
    const icons = {
      database: <Database size={28} />,
      code: <Code size={28} />,
      layers: <Layers size={28} />,
      cpu: <Cpu size={28} />,
      globe: <Globe size={28} />,
      'check-circle': <CheckCircle size={28} />,
    };
    return icons[iconName] || <BookOpen size={28} />;
  };

  const filteredSubjects = subjects.filter(s =>
    s.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="subjects-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Curriculum Subjects</h1>
          <p className="page-subtitle">Select a subject discipline to explore modular curriculum topics and launch an adaptive quiz session.</p>
        </div>

        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading course modules...</p>
        </div>
      ) : (
        <div className="subjects-grid">
          {filteredSubjects.map((sub) => (
            <div key={sub.subjectId} className="card card-hover subject-card">
              <div className="subject-icon-box">
                {getSubjectIcon(sub.icon)}
              </div>
              <div className="subject-body">
                <h3 className="subject-name">{sub.subjectName}</h3>
                <p className="subject-description">{sub.description}</p>
              </div>
              <div className="subject-footer">
                <span className="topic-count-pill">
                  {sub.topicCount} Knowledge Topics
                </span>
                <Link
                  to={`/topics/${sub.subjectId}`}
                  className="btn btn-primary btn-sm"
                >
                  <span>Explore Topics</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .subjects-page {
          padding-bottom: 2rem;
        }
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .page-title {
          font-size: 1.85rem;
          margin-bottom: 0.35rem;
        }
        .page-subtitle {
          color: var(--text-muted);
          font-size: 0.95rem;
          max-width: 650px;
        }
        .search-box {
          position: relative;
          min-width: 280px;
        }
        .search-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-subtle);
        }
        .search-input {
          padding-left: 2.5rem;
        }
        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        .subject-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.75rem;
        }
        .subject-icon-box {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          background: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .subject-name {
          font-size: 1.25rem;
          margin-bottom: 0.65rem;
        }
        .subject-description {
          color: var(--text-muted);
          font-size: 0.925rem;
          line-height: 1.55;
          margin-bottom: 1.5rem;
          flex: 1;
        }
        .subject-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--card-border);
          padding-top: 1.25rem;
        }
        .topic-count-pill {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          background: #F1F5F9;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
        }
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 2rem;
          color: var(--text-muted);
          gap: 1rem;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #E2E8F0;
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .search-box {
            width: 100%;
          }
          .subjects-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
