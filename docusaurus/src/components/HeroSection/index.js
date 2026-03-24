import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

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
          <img src={useBaseUrl('/img/partner-logos/Dignitas-Logo.png')} alt="Dignitas Kenya" className="partner-logo" />
          <img src={useBaseUrl('/img/partner-logos/IBM-Logo.png')} alt="IBM" className="partner-logo" />
          <img src={useBaseUrl('/img/partner-logos/TechToTheRescue-Logo.png')} alt="Tech To The Rescue" className="partner-logo" />
        </div>
      </div>
    </header>
  );
}
