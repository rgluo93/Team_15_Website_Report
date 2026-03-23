import React from 'react';

const teamMembers = [
  {name: 'Team Member 1', role: 'Role / Specialization', bio: 'Click to view full profile'},
  {name: 'Team Member 2', role: 'Role / Specialization', bio: 'Profile and contact information needed'},
  {name: 'Team Member 3', role: 'Role / Specialization', bio: 'Profile and contact information needed'},
  {name: 'Team Member 4', role: 'Role / Specialization', bio: 'Profile and contact information needed'},
];

export default function TeamSection() {
  return (
    <>
      <div className="team-grid">
        {teamMembers.map((member, idx) => (
          <div className="team-card" key={idx}>
            <div className="team-photo-placeholder">&#128100;</div>
            <h3 className="team-name">{member.name}</h3>
            <p className="team-role">{member.role}</p>
            <p className="team-bio">{member.bio}</p>
          </div>
        ))}
      </div>

      <div style={{textAlign: 'center', marginTop: 'var(--spacing-2xl)'}}>
        <div className="placeholder-card" style={{display: 'inline-block', minHeight: 'auto', padding: 'var(--spacing-lg)'}}>
          <p className="placeholder-text">
            &#128203; Need: Profile photos, names, roles, short bios, and contact
            information for all team members
          </p>
        </div>
      </div>
    </>
  );
}
