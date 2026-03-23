import React from 'react';

export default function VideoDemo() {
  return (
    <div className="video-container">
      <div className="video-placeholder">
        <div className="video-placeholder-content">
          <div className="video-placeholder-icon">&#127916;</div>
          <p className="video-placeholder-text">8-Minute Video Demo</p>
          <p style={{marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-base)', opacity: 0.9}}>
            Video embed or file will be placed here
          </p>
        </div>
      </div>
    </div>
  );
}
