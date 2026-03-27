import React from 'react';

function AssistantIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12 2a3 3 0 0 1 3 3v1.17a6.02 6.02 0 0 1 3.83 4.74l.16 1.09H21a1 1 0 1 1 0 2h-1.01l-.16 1.09A6.02 6.02 0 0 1 14 20h-4a6.02 6.02 0 0 1-5.83-4.91L4.01 14H3a1 1 0 1 1 0-2h1.01l.16-1.09A6.02 6.02 0 0 1 9 6.17V5a3 3 0 0 1 3-3zm-2 9a1 1 0 0 0 0 2h.01a1 1 0 1 0 0-2H10zm4 0a1 1 0 0 0 0 2h.01a1 1 0 1 0 0-2H14zm-2-7a1 1 0 0 0-1 1v1h2V5a1 1 0 0 0-1-1zm-2 11a2 2 0 1 0 4 0h-4z" />
    </svg>
  );
}

function DialogueIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8.41l-3.7 3.7A1 1 0 0 1 3 20v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm1 4a1 1 0 0 0 0 2h10a1 1 0 1 0 0-2H5zm0 4a1 1 0 0 0 0 2h7a1 1 0 1 0 0-2H5z" />
    </svg>
  );
}

function InsightsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M4 20h16a1 1 0 1 0 0-2H4a1 1 0 1 0 0 2zm2-4h2.5a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1V15a1 1 0 0 0 1 1zm4.75 0h2.5a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-2.5a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm4.75 0H18a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1z" />
    </svg>
  );
}

const features = [
  {
    icon: <AssistantIcon />,
    title: 'AI Capability 1',
    description: 'Short description of first AI feature',
  },
  {
    icon: <DialogueIcon />,
    title: 'AI Capability 2',
    description: 'Short description of second AI feature',
  },
  {
    icon: <InsightsIcon />,
    title: 'AI Capability 3',
    description: 'Short description of third AI feature',
  },
];

export default function FeatureCards() {
  return (
    <div className="features-grid">
      {features.map((feature, idx) => (
        <div className="placeholder-card" key={idx}>
          <span className="placeholder-icon">{feature.icon}</span>
          <p className="placeholder-title">{feature.title}</p>
          <p className="placeholder-text">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
