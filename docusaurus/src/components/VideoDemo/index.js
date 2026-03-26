import React from 'react';

export default function VideoDemo() {
  return (
    <div className="video-container">
      <iframe
        src="https://drive.google.com/file/d/1qiT0Kck_Mqn-2NK_QkYkOMr0MMc4W1T_/preview"
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
