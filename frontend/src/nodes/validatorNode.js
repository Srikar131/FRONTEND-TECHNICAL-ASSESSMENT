// validatorNode.js - Custom node for validation
import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const ValidatorNode = ({ id, data }) => {
  const [validationType, setValidationType] = useState(data?.validationType || 'email');

  return (
    <BaseNode
      id={id}
      data={data}
      nodeType="Validator"
      backgroundColor="#fce4ec"
      inputs={['input']}
      outputs={['valid', 'invalid']}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '12px' }}>
          Validation Type:
          <select
            value={validationType}
            onChange={(e) => setValidationType(e.target.value)}
            style={{ width: '100%', padding: '4px', marginTop: '2px' }}
          >
            <option value="email">Email</option>
            <option value="url">URL</option>
            <option value="phone">Phone Number</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
          </select>
        </label>
        <div style={{ fontSize: '10px', color: '#666' }}>
          Validates input data
        </div>
      </div>
    </BaseNode>
  );
};
