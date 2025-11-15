import React from 'react';

export const EmployeeInfo = ({ employee }) => (
  <div style={{
    background: '#f5f5f5',
    padding: '20px',
    borderRadius: '10px',
    margin: '20px 0',
    textAlign: 'right'
  }}>
    <p style={{ fontSize: '16px', margin: '10px 0', color: '#666' }}>
      <strong>الاسم الكامل:</strong> {employee.fullName}
    </p>
    <p style={{ fontSize: '16px', margin: '10px 0', color: '#666' }}>
      <strong>الوظيفة:</strong> {employee.position || 'غير محدد'}
    </p>
    <p style={{ fontSize: '16px', margin: '10px 0', color: '#666' }}>
      <strong>البريد الإلكتروني:</strong> {employee.email || 'غير محدد'}
    </p>
    <p style={{ fontSize: '16px', margin: '10px 0', color: '#666' }}>
      <strong>القسم:</strong> {employee.department || 'غير محدد'}
    </p>
    <p style={{ fontSize: '16px', margin: '10px 0', color: '#666' }}>
      <strong>رقم الهاتف:</strong> {employee.phone || 'غير محدد'}
    </p>
  </div>
);