import React from 'react';

export default function AbstractCards() {
  return (
    <div className="abstract-grid">
      {/* Problem Statement Card */}
      <div className="abstract-card">
        <div className="abstract-card-header">
          <div className="abstract-card-icon">&#127919;</div>
          <h3 className="abstract-card-title">Problem Statement</h3>
        </div>
        <div className="abstract-card-content">
          <p>
            Less than 50% of Grade 4 children in Kenya are learning at the
            expected level. One of the root causes is
            teaching quality.
          </p>
          <p>
            Teachers often lack access to adequate professional
            development opportunities, and some are rushed into a job without proper training.
            This can lead to stunted student development and long-term educational inequality.
          </p>
        </div>
      </div>

      {/* Our Solution Card (Placeholder) */}
      <div className="abstract-card">
        <div className="abstract-card-header">
          <div className="abstract-card-icon">&#128161;</div>
          <h3 className="abstract-card-title">Our Solution</h3>
        </div>
        <div className="abstract-card-content">
            <p>Our project is aimed at developing
            software, LeadNow, to help coach educators in Kenya. Our project
            incorporates AI features into the software to improve the experience
            and impact of LeadNow.</p>
            <p>Using RAG, MCP, LangGraph, Azure, and other tools, we have implemented a variety of AI features into the software, including an education officer agent, a general chatbot, a user summary generator, a scenario feedback generator, translation, speech-to-text, and WhatsApp messaging.</p>
        </div>
      </div>

      {/* Achievement and Impact Card (Placeholder) */}
      <div className="abstract-card abstract-card--full">
        <div className="abstract-card-header">
          <div className="abstract-card-icon">&#127942;</div>
          <h3 className="abstract-card-title">Achievement and Impact</h3>
        </div>
        <div className="abstract-card-content">
          <div className="placeholder-card" style={{margin: 0, minHeight: '150px'}}>
            <span className="placeholder-icon">&#128202;</span>
            <p className="placeholder-title">Real Data Needed</p>
            <p className="placeholder-text">
              Current achievements with real data + future extensions and impact
              projections
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
