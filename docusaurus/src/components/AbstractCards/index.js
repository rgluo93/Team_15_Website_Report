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
          <p>
            Through this project, we developed new AI-powered features to make the platform more accessible and 
            personalised for educators, improving how teachers in Kenya engage with professional teacher training.
          </p>
          <p>
            The project successfully delivered all MoSCoW requirements, including all Must Have and Should
            Have items, and went beyond the original scope by proactively identifying and addressing
            additional client needs. All AI features: teacher chatbot, progress summaries,
            scenario feedback, the Education Officer agent, speech-to-text and translation from English to Swahili, 
            are fully implemented and deployed.
          </p>
          <p>
            The system is stable and cloud-hosted on Azure Container Apps, with a comprehensive
            three-layer test suite providing strong regression resistance. API response times average
            1.52s for the chatbot and 2.74s for progress summaries, well within acceptable limits.
            The microservice architecture ensures full backward compatibility with the client's existing
            system, requiring no changes to pre-existing functionality.
          </p>
          <p>
            The interface maintains a consistent design across web and mobile, and the system is designed
            for extensibility. Additional features and integrations can be introduced with minimal effort
            as the platform scales.
          </p>
          <p>
            By integrating AI into the LeadNow platform, we have given educators personalised feedback, intelligent support, the ability to track
            their own progress and more, which directly addresses the barriers that limit teaching quality.
          </p>
        </div>
      </div>
    </div>
  );
}
