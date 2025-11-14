// outputNode.js - Updated to use BaseNode
import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      nodeType="Output"
      inputs={['value']}
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
            Name
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
              e.target.style.borderColor = '#10b981';
              e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
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
            Type
          </label>
          <select
            value={outputType}
            onChange={handleTypeChange}
            style={{ 
              width: '100%', 
              padding: '8px 10px',
              fontSize: '13px',
              border: '1.5px solid #e5e7eb',
              borderRadius: '6px',
              outline: 'none',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              cursor: 'pointer',
              background: 'white'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#10b981';
              e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
            <option value="Image">Image</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
};
