import React from 'react';

export default function HeroSection() {
  return (
    <header className="hero hero--primary">
      <div className="container">
        <h1 className="hero__title">AI Coaching for Educator Development</h1>
        <p className="hero__subtitle">LeadNow by Dignitas Kenya</p>
        <p className="hero-tagline">
          Improve access to tailored, high-quality professional development for
          educators by automating content delivery and performance feedback for
          scalable coaching.
        </p>

        <div className="partner-logos">
          <div className="placeholder-card" style={{padding: 'var(--spacing-lg)', minHeight: 'auto'}}>
            <p className="placeholder-title">Partner Logos</p>
            <p className="placeholder-text" style={{fontSize: 'var(--font-size-sm)'}}>
              Dignitas Kenya and project partner logos
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
