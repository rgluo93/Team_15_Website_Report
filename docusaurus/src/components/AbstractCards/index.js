import React from 'react';

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
    label: 'Leaders & Teachers Helped',
    value: 90,
    display: '16,000+',
    color: '#215265',
  },
  {
    label: 'Projected Students by 2028',
    value: 100,
    display: '2 million',
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
          <div className="abstract-card-icon">01</div>
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
          <div className="abstract-card-icon">02</div>
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
          <div className="abstract-card-icon">03</div>
          <h3 className="abstract-card-title">Achievement and Impact</h3>
        </div>
        <div className="abstract-card-content">
          <div className="achievements-list">
            {achievements.map((a, idx) => (
              <AchievementBar key={idx} {...a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
