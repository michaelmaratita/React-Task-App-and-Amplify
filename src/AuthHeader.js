import React from 'react';

export default function AuthHeader() {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <img
        src="/logo192.png"
        alt="React"
        style={{
          width: '80px',
          height: 'auto',
          marginBottom: '1rem',
          filter: 'drop-shadow(0 0 6px rgba(0, 0, 0, 0.6))'
        }}
      />
      <h2 style={{ color: '#f1f1f1', fontWeight: 600, fontSize: '24px' }}>
        Mike's Task Login Page
      </h2>
    </div>
  );
}
