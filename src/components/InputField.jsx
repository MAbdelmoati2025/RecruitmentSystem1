import React from 'react';

export const InputField = ({ 
  label, 
  type, 
  id, 
  placeholder, 
  value, 
  onChange, 
  onKeyPress 
}) => (
  <div style={{ marginBottom: '20px' }}>
    <label 
      htmlFor={id} 
      style={{
        display: 'block',
        marginBottom: '8px',
        color: '#555',
        fontWeight: 500
      }}
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      style={{
        width: '100%',
        padding: '12px 15px',
        border: '2px solid #e0e0e0',
        borderRadius: '10px',
        fontSize: '16px',
        transition: 'all 0.3s ease'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = '#667eea';
        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#e0e0e0';
        e.target.style.boxShadow = 'none';
      }}
    />
  </div>
);
