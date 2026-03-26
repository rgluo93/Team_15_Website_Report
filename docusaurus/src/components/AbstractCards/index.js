import React from 'react';

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

      {/* Our Solution Card (Placeholder) */}
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

      {/* Achievement and Impact Card (Placeholder) */}
      <div className="abstract-card abstract-card--full">
        <div className="abstract-card-header">
          <div className="abstract-card-icon">03</div>
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
            were fully implemented and deployed.
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
