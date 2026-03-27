import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const teamMembers = [
  {
    name: 'James Loke',
    role: 'AI Engineer — Backend Developer',
    photo: '/img/team-images/JamesLoke.jpeg',
    email: 'jameslokejw@gmail.com',
    github: 'https://github.com/BigBouncyBoii',
    linkedin: 'https://www.linkedin.com/in/james-loke-34a0612bb/',
  },
  {
    name: 'Lincoln Kwan',
    role: 'AI Engineer — Backend Developer',
    photo: '/img/team-images/LincolnKwan.jpeg',
    email: 'lincoln.kwan.24@ucl.ac.uk',
    github: 'https://github.com/carbonf',
    linkedin: 'https://www.linkedin.com/in/lincoln-kwan/',
  },
  {
    name: 'Ronald Luo',
    role: 'AI Engineer — Testing Lead',
    photo: '/img/team-images/RonaldLuo.jpeg',
    email: 'ronaldluo93@gmail.com',
    github: 'https://github.com/rgluo93',
    linkedin: 'https://www.linkedin.com/in/ronald-luo-9839ba31b/',
  },
  {
    name: 'Yi Kang Chai',
    role: 'UI/UX Designer — DevOps Engineer',
    photo: '/img/team-images/YiKangChai.jpeg',
    email: 'yi.chai.24@ucl.ac.uk',
    github: 'https://github.com/Derlic',
    linkedin: 'https://www.linkedin.com/in/yi-kang-chai/',
  },
  {
    name: 'Matthew Mok',
    role: 'UI/UX Designer — DevOps Engineer',
    photo: '/img/team-images/MatthewMok.jpeg',
    email: 'matthew.mok.24@ucl.ac.uk',
    github: 'https://github.com/matthewchmok/',
    linkedin: 'https://www.linkedin.com/in/chinghimmatthewmok/',
  },
];

function EmailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export default function TeamSection() {
  return (
    <div className="team-grid">
      {teamMembers.map((member, idx) => (
        <div className="team-card" key={idx}>
          {member.photo ? (
            <img src={useBaseUrl(member.photo)} alt={member.name} className="team-photo" />
          ) : (
            <div className="team-photo-placeholder">&#128100;</div>
          )}
          <h3 className="team-name">{member.name}</h3>
          {member.role && <p className="team-role">{member.role}</p>}
          <div className="team-links">
            <a href={`mailto:${member.email}`} className="team-link" aria-label={`Email ${member.name}`} title="Email">
              <EmailIcon />
            </a>
            <a href={member.github} className="team-link" target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s GitHub`} title="GitHub">
              <GitHubIcon />
            </a>
            <a href={member.linkedin} className="team-link" target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s LinkedIn`} title="LinkedIn">
              <LinkedInIcon />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
