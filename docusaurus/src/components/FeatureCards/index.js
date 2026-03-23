import React from 'react';

const features = [
  {
    icon: '\u{1F916}',
    title: 'AI Capability 1',
    description: 'Short description of first AI feature',
  },
  {
    icon: '\u{1F4AC}',
    title: 'AI Capability 2',
    description: 'Short description of second AI feature',
  },
  {
    icon: '\u{1F4C8}',
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
