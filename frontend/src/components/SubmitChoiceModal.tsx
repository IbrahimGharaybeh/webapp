import React from 'react';

interface SubmitChoiceModalProps {
  open: boolean;
  onCancel: () => void;
  onChoose: (isDraft: boolean) => void;
}

export default function SubmitChoiceModal({
  open,
  onCancel,
  onChoose
}: SubmitChoiceModalProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        style={{
          backgroundColor: '#0b1224',
          border: '1px solid #1f2937',
          borderRadius: '16px',
          padding: '20px',
          width: 'min(420px, 90vw)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          display: 'grid',
          gap: '12px'
        }}
      >
        <h2 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>
          Choose action
        </h2>
        <p style={{ margin: 0, color: '#cbd5f5', fontSize: '14px' }}>
          Save as draft or print now.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: '1px solid #334155',
              color: '#cbd5f5',
              padding: '10px 14px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onChoose(true)}
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              color: '#e2e8f0',
              padding: '10px 14px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={() => onChoose(false)}
            style={{
              background: '#2563eb',
              border: '1px solid #2563eb',
              color: '#ffffff',
              padding: '10px 14px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
