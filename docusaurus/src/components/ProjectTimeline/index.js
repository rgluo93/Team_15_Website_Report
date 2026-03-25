import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function ProjectTimeline() {
  return (
    <div className="placeholder-card" style={{minHeight: '220px'}}>
      <img src={useBaseUrl('/img/gantt-chart.png')} alt="Gantt Chart"/>
    </div>
  );
}
