import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Target, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { Navbar } from '../components/Layout/Navbar';
import { ProgressBar } from '../components/UI/ProgressBar';
import { useApp } from '../context/AppContext';
import './LearnPage.css';

const CATEGORIES = ['All', 'Fundamentals', 'Control Flow', 'Data Structures', 'Abstractions', 'Advanced'];

export function LearnPage() {
  const { state } = useApp();
  const { concepts } = state;
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = concepts.filter(c => {
    const matchCat = activeCategory === 'All' || c.category === activeCategory;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const mastered = concepts.filter(c => c.status === 'mastered').length;
  const totalMastery = Math.round(concepts.reduce((a, c) => a + c.mastery, 0) / concepts.length);

  return (
    <div className="learn-page page">
      <Navbar />
      <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-12)' }}>
        {/* Header */}
        <div className="learn-header animate-fadeIn">
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '1.75rem', fontWeight: 800 }}>Concept Library</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>
              Explore all programming concepts, your mastery level, and common misconceptions.
            </p>
          </div>
          <div className="learn-summary">
            <div className="learn-summary-item">
              <span className="learn-summary-val">{mastered}/{concepts.length}</span>
              <span className="learn-summary-lbl">Mastered</span>
            </div>
            <div className="learn-summary-sep" />
            <div className="learn-summary-item">
              <span className="learn-summary-val" style={{ color: 'var(--teal)' }}>{totalMastery}%</span>
              <span className="learn-summary-lbl">Avg Mastery</span>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="learn-controls animate-slideUp">
          <div className="learn-search-wrapper">
            <Search size={15} color="var(--text-faint)" />
            <input
              className="learn-search"
              placeholder="Search concepts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="learn-categories">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Concept Grid */}
        <div className="concepts-grid animate-slideUp" style={{ animationDelay: '0.1s' }}>
          {filtered.map((concept, i) => (
            <ConceptCard key={concept.id} concept={concept} delay={i * 0.05} />
          ))}
          {filtered.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <div className="empty-state-icon"><BookOpen size={24} /></div>
              <h3>No concepts found</h3>
              <p>Try a different search or category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConceptCard({ concept, delay }) {
  const statusColors = {
    mastered: { accent: 'teal', badge: 'badge-teal', icon: CheckCircle },
    developing: { accent: 'yellow', badge: 'badge-yellow', icon: TrendingUp },
    'needs-attention': { accent: 'orange', badge: 'badge-orange', icon: AlertTriangle },
  };
  const cfg = statusColors[concept.status] || statusColors.developing;
  const Icon = cfg.icon;

  return (
    <div className={`concept-card card card-${concept.status === 'needs-attention' ? 'orange' : concept.status === 'developing' ? 'yellow' : 'teal'} animate-fadeIn`}
      style={{ animationDelay: `${delay}s` }}>
      <div className="concept-card-header">
        <div className={`concept-card-icon concept-icon-${cfg.accent}`}>
          <Icon size={16} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 className="concept-card-name">{concept.name}</h3>
          <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>{concept.category}</span>
        </div>
        <span className={`badge ${cfg.badge}`}>
          {concept.status === 'mastered' ? '✓ Mastered' : concept.status === 'developing' ? 'Developing' : 'Needs Work'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ProgressBar
          value={concept.mastery}
          color={cfg.accent}
          height={6}
        />
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: `var(--${cfg.accent})`, minWidth: 36 }}>
          {concept.mastery}%
        </span>
      </div>

      <div className="concept-card-stats">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
          <AlertTriangle size={11} style={{ verticalAlign: 'middle' }} /> {concept.mistakes} mistakes
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
          Last: {concept.lastAttempted}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <Link to="/ide" className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
          <Target size={12} /> Practice
        </Link>
        {concept.isCurrent && (
          <span className="badge badge-orange" style={{ alignSelf: 'center' }}>Active</span>
        )}
      </div>
    </div>
  );
}
