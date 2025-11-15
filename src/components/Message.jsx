import React from 'react';

export const Message = ({ type, text, visible }) => {
  if (!visible) return null;
  
  const styles = {
    error: {
      backgroundColor: '#ffe5e5',
      color: '#d32f2f',
      border: '1px solid #ffcdd2'
    },
    success: {
      backgroundColor: '#e8f5e9',
      color: '#388e3c',
      border: '1px solid #c8e6c9'
    },
    loading: {
      backgroundColor: '#e3f2fd',
      color: '#1976d2',
      border: '1px solid #bbdefb'
    }
  };

  return (
    <div style={{
      padding: '12px',
      borderRadius: '8px',
      marginTop: '15px',
      fontSize: '14px',
      textAlign: 'center',
      ...styles[type]
    }}>
      {text}
    </div>
  );
};
