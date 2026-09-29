import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ZoomIn, ZoomOut, Info, TrendingUp, AlertTriangle, CheckCircle, Target, RotateCcw } from 'lucide-react';
import { Navbar } from '../components/Layout/Navbar';
import { useApp } from '../context/AppContext';
import { knowledgeGraphNodes, knowledgeGraphEdges } from '../data/mockData';
import './ProgressPage.css';

const STATUS_CONFIG = {
  mastered: { color: '#069494', label: 'Mastered', badge: 'badge-teal' },
  developing: { color: '#c9a800', label: 'Developing', badge: 'badge-yellow' },
  'needs-attention': { color: '#FF8243', label: 'Needs Attention', badge: 'badge-orange' },
  root: { color: '#182222', label: 'Core', badge: 'badge-gray' },
};

export function ProgressPage() {
  const { state } = useApp();
  const { concepts } = state;
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef(null);

  const getNodeStatus = (nodeId) => {
    const concept = concepts.find(c => c.id === nodeId);
    return concept?.status || 'developing';
  };

  const getNodeMastery = (nodeId) => {
    const concept = concepts.find(c => c.id === nodeId);
    return concept?.mastery || 0;
  };

  const selectedConcept = selectedNode
    ? concepts.find(c => c.id === selectedNode) || null
    : null;

  return (
    <div className="page progress-page">
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)' }}>
        {/* Header */}
        <div className="progress-header">
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Your Programming Knowledge</h2>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Click any node to explore your mastery, recent mistakes, and challenges.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Legend */}
            <div className="graph-legend">
              {Object.entries(STATUS_CONFIG).filter(([k]) => k !== 'root').map(([key, cfg]) => (
                <div key={key} className="legend-item">
                  <div className="legend-dot" style={{ background: cfg.color }} />
                  <span>{cfg.label}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost btn-icon" onClick={() => setZoom(z => Math.min(z + 0.2, 2))} title="Zoom in">
              <ZoomIn size={16} />
            </button>
            <button className="btn btn-ghost btn-icon" onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} title="Zoom out">
              <ZoomOut size={16} />
            </button>
            <button className="btn btn-ghost btn-icon" onClick={() => { setZoom(1); setSelectedNode(null); }} title="Reset">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        <div className="graph-main">
          {/* SVG Graph */}
          <div className="graph-container">
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox="0 0 600 600"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s ease' }}
            >
              {/* Edges */}
              {knowledgeGraphEdges.map((edge, i) => {
                const from = knowledgeGraphNodes.find(n => n.id === edge.from);
                const to = knowledgeGraphNodes.find(n => n.id === edge.to);
                if (!from || !to) return null;
                const toStatus = getNodeStatus(edge.to);
                const edgeColor = toStatus === 'needs-attention' ? 'rgba(255,130,67,0.25)'
                  : toStatus === 'mastered' ? 'rgba(6,148,148,0.25)'
                  : 'rgba(252,232,131,0.35)';
                return (
                  <line
                    key={i}
                    x1={from.x} y1={from.y}
                    x2={to.x} y2={to.y}
                    stroke={edgeColor}
                    strokeWidth={selectedNode === edge.from || selectedNode === edge.to ? 2.5 : 1.5}
                    strokeDasharray={toStatus === 'needs-attention' ? '4,4' : 'none'}
                  />
                );
              })}

              {/* Nodes */}
              {knowledgeGraphNodes.map((node, i) => {
                const status = node.id === 'programming' ? 'root' : getNodeStatus(node.id);
                const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.developing;
                const mastery = getNodeMastery(node.id);
                const isSelected = selectedNode === node.id;
                const isCurrent = concepts.find(c => c.id === node.id)?.isCurrent;

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                    style={{ cursor: 'pointer', animation: `nodeAppear 0.4s ease ${i * 0.06}s both` }}
                  >
                    {/* Pulse ring for current bottleneck */}
                    {isCurrent && (
                      <circle
                        cx={node.x} cy={node.y} r={node.size + 10}
                        fill="none"
                        stroke="rgba(255,130,67,0.3)"
                        strokeWidth={2}
                        style={{ animation: 'pulse-orange 2s infinite' }}
                      />
                    )}

                    {/* Selection ring */}
                    {isSelected && (
                      <circle cx={node.x} cy={node.y} r={node.size + 8}
                        fill="none" stroke={cfg.color} strokeWidth={2.5} opacity={0.6} />
                    )}

                    {/* Node circle */}
                    <circle
                      cx={node.x} cy={node.y} r={node.size}
                      fill={`${cfg.color}22`}
                      stroke={cfg.color}
                      strokeWidth={isSelected ? 3 : 2}
                    />

                    {/* Mastery arc (for non-root nodes) */}
                    {node.id !== 'programming' && mastery > 0 && (
                      <circle
                        cx={node.x} cy={node.y} r={node.size - 4}
                        fill="none"
                        stroke={cfg.color}
                        strokeWidth={4}
                        strokeDasharray={`${(mastery / 100) * 2 * Math.PI * (node.size - 4)} ${2 * Math.PI * (node.size - 4)}`}
                        strokeDashoffset={2 * Math.PI * (node.size - 4) * 0.25}
                        opacity={0.5}
                        style={{ transition: 'stroke-dasharray 1s ease' }}
                      />
                    )}

                    {/* Node label */}
                    <text
                      x={node.x} y={node.y + 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={node.id === 'programming' ? 11 : 9.5}
                      fontWeight={isSelected || node.id === 'programming' ? 700 : 600}
                      fill={cfg.color}
                      style={{ userSelect: 'none', fontFamily: 'Inter, sans-serif' }}
                    >
                      {node.label.length > 14 ? node.label.slice(0, 13) + '…' : node.label}
                    </text>

                    {/* Mastery % below label */}
                    {node.id !== 'programming' && (
                      <text
                        x={node.x} y={node.y + node.size + 14}
                        textAnchor="middle"
                        fontSize={8}
                        fontWeight={600}
                        fill={cfg.color}
                        opacity={0.8}
                        style={{ userSelect: 'none' }}
                      >
                        {mastery}%
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Side Panel */}
          <div className="graph-side-panel">
            {selectedConcept ? (
              <ConceptDetail concept={selectedConcept} />
            ) : (
              <GraphSummary concepts={concepts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConceptDetail({ concept }) {
  const statusCfg = STATUS_CONFIG[concept.status] || STATUS_CONFIG.developing;

  return (
    <div className="concept-detail animate-fadeIn">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>{concept.name}</h3>
          <span className={`badge ${statusCfg.badge}`} style={{ marginTop: 6 }}>
            {statusCfg.label}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: statusCfg.color, lineHeight: 1 }}>
            {concept.mastery}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>mastery</div>
        </div>
      </div>

      {/* Mastery bar */}
      <div className="progress-bar" style={{ height: 10, marginBottom: 16 }}>
        <div
          className="progress-fill"
          style={{
            width: `${concept.mastery}%`,
            background: statusCfg.color,
            transition: 'width 1s ease',
          }}
        />
      </div>

      <div className="detail-grid">
        <div className="detail-stat">
          <AlertTriangle size={14} color="var(--orange)" />
          <div>
            <div className="detail-stat-val">{concept.mistakes}</div>
            <div className="detail-stat-lbl">Mistakes</div>
          </div>
        </div>
        <div className="detail-stat">
          <TrendingUp size={14} color="var(--teal)" />
          <div>
            <div className="detail-stat-val">{concept.category}</div>
            <div className="detail-stat-lbl">Category</div>
          </div>
        </div>
      </div>

      {concept.isCurrent && (
        <div className="detail-bottleneck">
          <AlertTriangle size={13} color="var(--orange)" />
          <span>Current learning bottleneck</span>
        </div>
      )}

      <div style={{ fontSize: '0.8rem', color: 'var(--text-faint)', marginBottom: 12 }}>
        Last practiced: {concept.lastAttempted}
      </div>

      <Link to="/ide" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
        <Target size={14} />
        Practice This Concept
      </Link>
    </div>
  );
}

function GraphSummary({ concepts }) {
  const mastered = concepts.filter(c => c.status === 'mastered').length;
  const developing = concepts.filter(c => c.status === 'developing').length;
  const attention = concepts.filter(c => c.status === 'needs-attention').length;
  const bottleneck = concepts.find(c => c.isCurrent);

  return (
    <div className="graph-summary">
      <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Knowledge Overview</h3>

      <div className="summary-stats">
        <div className="summary-stat summary-stat-teal">
          <CheckCircle size={16} />
          <div>
            <div className="summary-stat-val">{mastered}</div>
            <div className="summary-stat-lbl">Mastered</div>
          </div>
        </div>
        <div className="summary-stat summary-stat-yellow">
          <TrendingUp size={16} />
          <div>
            <div className="summary-stat-val">{developing}</div>
            <div className="summary-stat-lbl">Developing</div>
          </div>
        </div>
        <div className="summary-stat summary-stat-orange">
          <AlertTriangle size={16} />
          <div>
            <div className="summary-stat-val">{attention}</div>
            <div className="summary-stat-lbl">Needs Work</div>
          </div>
        </div>
      </div>

      {bottleneck && (
        <div className="summary-bottleneck">
          <div className="summary-bottleneck-label">
            <AlertTriangle size={13} color="var(--orange)" />
            Current Focus
          </div>
          <div className="summary-bottleneck-name">{bottleneck.name}</div>
          <div className="progress-bar" style={{ height: 6 }}>
            <div className="progress-fill progress-fill-orange" style={{ width: `${bottleneck.mastery}%` }} />
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{bottleneck.mastery}% mastery</div>
        </div>
      )}

      <div className="summary-tip">
        <Info size={13} color="var(--teal)" />
        <span>Click any node in the graph to explore details and practice.</span>
      </div>
    </div>
  );
}
