import React from 'react';
import Layout from '@theme/Layout';
import HeroSection from '@site/src/components/HeroSection';
import MissionBox from '@site/src/components/MissionBox';
import AbstractCards from '@site/src/components/AbstractCards';
import VideoDemo from '@site/src/components/VideoDemo';
import TeamSection from '@site/src/components/TeamSection';
import ProjectTimeline from '@site/src/components/ProjectTimeline';

function Section({title, subtitle, alt, children}) {
  return (
    <section className={alt ? 'content-section--alt' : 'content-section'}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="LeadNow Project Overview"
      description="AI Coaching for Educator Development - LeadNow by Dignitas Kenya">
      <main>
        <HeroSection />

        <Section title="Our Mission">
          <MissionBox />
        </Section>

        <Section
          title="Abstract"
          subtitle="Addressing the education crisis in Kenya through AI-powered coaching"
          alt>
          <AbstractCards />
        </Section>

        <Section
          title="Project Demo"
          subtitle="Watch our 8-minute demonstration of LeadNow in action">
          <VideoDemo />
        </Section>

        <Section
          title="Project Timeline"
          subtitle="Our journey from conception to implementation">
          <ProjectTimeline />
        </Section>

        <Section title="Our Team" alt>
          <TeamSection />
        </Section>
      </main>
    </Layout>
  );
}
