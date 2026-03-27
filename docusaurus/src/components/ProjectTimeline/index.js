import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function ProjectTimeline() {
  return (
    <div className="timeline-container">
      <img src={useBaseUrl('/img/gantt-chart.png')} alt="Gantt Chart"/>
    </div>
  );
}
