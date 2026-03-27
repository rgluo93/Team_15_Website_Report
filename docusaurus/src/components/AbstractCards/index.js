import React from 'react';

function ProblemIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12 2a1 1 0 0 1 .894.553l2.04 4.13 4.56.662a1 1 0 0 1 .554 1.705l-3.3 3.217.779 4.543a1 1 0 0 1-1.45 1.054L12 15.72l-4.078 2.144a1 1 0 0 1-1.45-1.054l.779-4.543-3.3-3.217a1 1 0 0 1 .554-1.705l4.56-.662 2.04-4.13A1 1 0 0 1 12 2z" />
    </svg>
  );
}

function SolutionIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M9 21h6a1 1 0 0 0 0-2h-6a1 1 0 0 0 0 2zm3-19a7 7 0 0 0-4.9 12c.73.71 1.3 1.57 1.67 2.5a1 1 0 0 0 .93.63h4.6a1 1 0 0 0 .93-.63c.37-.93.94-1.79 1.67-2.5A7 7 0 0 0 12 2zm3.5 10.57c-.77.75-1.42 1.63-1.91 2.61h-3.18c-.49-.98-1.14-1.86-1.91-2.61A5 5 0 1 1 15.5 12.57z" />
    </svg>
  );
}

function ImpactIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M4 20h16a1 1 0 1 0 0-2H4a1 1 0 1 0 0 2zm2-4h2.5a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1V15a1 1 0 0 0 1 1zm4.75 0h2.5a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-2.5a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm4.75 0H18a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1z" />
    </svg>
  );
}

const achievements = [
  {
    label: 'Coaching Feedback Speed',
    value: 100,
    display: 'Up to 3x faster',
    color: '#215265',
  },
  {
    label: 'Teacher AI Adoption',
    value: 76,
    display: '76%',
    color: '#215265',
  },
  {
    label: 'Positive Student Behaviour',
    value: 65,
    display: '65%',
    color: '#215265',
  },
  {
    label: 'Projected Leaders & Teachers Impacted',
    value: 90,
    display: '16,000+',
    color: '#215265',
  },
];

function AchievementBar({label, value, display, color}) {
  return (
    <div className="achievement-item">
      <div className="achievement-label">
        <span>{label}</span>
        <strong>{display}</strong>
      </div>
      <div className="achievement-bar-track">
        <div
          className="achievement-bar-fill"
          style={{width: `${value}%`, backgroundColor: color}}
        />
      </div>
    </div>
  );
}

export default function AbstractCards() {
  return (
    <div className="abstract-grid">
      {/* Problem Statement Card */}
      <div className="abstract-card">
        <div className="abstract-card-header">
          <div className="abstract-card-icon">
            <ProblemIcon />
          </div>
          <h3 className="abstract-card-title">Problem Statement</h3>
        </div>
        <div className="abstract-card-content">
          <p>
            Learning outcomes in Kenya remain a major concern, with fewer than
            half of Grade 4 pupils meeting expected competency levels. A key
            contributing factor is inconsistent teaching quality across schools.
          </p>
          <p>
            Many educators have limited access to continuous, practical
            professional development and context-specific coaching. Without
            timely support and feedback, teachers can struggle to improve
            classroom practice, which reinforces long-term educational
            inequality.
          </p>
        </div>
      </div>

      {/* Our Solution Card */}
      <div className="abstract-card">
        <div className="abstract-card-header">
          <div className="abstract-card-icon">
            <SolutionIcon />
          </div>
          <h3 className="abstract-card-title">Our Solution</h3>
        </div>
        <div className="abstract-card-content">
            <p>
              An AI-enhanced coaching platform designed to strengthen
              educator development at scale. It supports teachers and education
              officers through guided learning, personalised feedback, and
              practical recommendations based on real usage and performance
              data.
            </p>
            <p>
              Built on a robust cloud architecture using RAG, MCP, LangGraph,
              and Azure services, the platform delivers key capabilities:
              educator and officer assistants, progress summaries,
              scenario-specific feedback, translation (English/Swahili),
              speech-to-text, and WhatsApp-based communication.
            </p>
        </div>
      </div>

      {/* Achievement and Impact Card */}
      <div className="abstract-card abstract-card--full">
        <div className="abstract-card-header">
          <div className="abstract-card-icon">
            <ImpactIcon />
          </div>
          <h3 className="abstract-card-title">Achievement and Impact</h3>
        </div>
        <div className="abstract-card-content">
          <div className="achievements-list">
            {achievements.map((a, idx) => (
              <AchievementBar key={idx} {...a} />
            ))}
          </div>
          <p className="citation" style={{fontSize: '0.8rem', color: '#6b7280', marginTop: '1rem', fontStyle: 'italic'}}>
            [1] Team4Tech, Dignitas, "Kenya: Strengthening Teacher Practices Through AI-Powered Teacher Coaching," <span style={{fontStyle: 'italic'}}>Generative AI Cohort Case Study</span>, 2025.
          </p>
        </div>
      </div>
    </div>
  );
}
