// llmNode.js - Updated to use BaseNode
import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.llmName || id.replace('customLLM-', 'llm_'));

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      nodeType="LLM"
      inputs={['system', 'prompt']}
      outputs={['response']}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label style={{ 
            fontSize: '11px', 
            fontWeight: '600', 
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '4px',
            display: 'block'
          }}>
            Model
          </label>
          <input
            type="text"
            value={currName}
            onChange={handleNameChange}
            style={{ 
              width: '100%', 
              padding: '8px 10px',
              fontSize: '13px',
              border: '1.5px solid #e5e7eb',
              borderRadius: '6px',
              outline: 'none',
              transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#8b5cf6';
              e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <div style={{ 
          fontSize: '11px', 
          color: '#9ca3af',
          fontStyle: 'italic',
          padding: '6px 8px',
          background: '#f9fafb',
          borderRadius: '4px'
        }}>
          Large Language Model processor
        </div>
      </div>
    </BaseNode>
  );
};
