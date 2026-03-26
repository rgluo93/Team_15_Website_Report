import React from 'react';

export default function VideoDemo() {
  return (
    <div className="video-container">
      <iframe
        src="https://drive.google.com/file/d/1puOfQc6PQopMqGH9nrcTy_XiA7SP8swc/preview"
        title="LeadNow 8-Minute Demo Video"
        allow="autoplay"
        allowFullScreen
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          border: 'none',
        }}
      />
    </div>
  );
}
