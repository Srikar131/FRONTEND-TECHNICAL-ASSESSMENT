// transformNode.js - Custom node for data transformation
import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const TransformNode = ({ id, data }) => {
  const [transformType, setTransformType] = useState(data?.transformType || 'uppercase');

  return (
    <BaseNode
      id={id}
      data={data}
      nodeType="Transform"
      backgroundColor="#f1f8e9"
      inputs={['input']}
      outputs={['output']}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '12px' }}>
          Transform Type:
          <select
            value={transformType}
            onChange={(e) => setTransformType(e.target.value)}
            style={{ width: '100%', padding: '4px', marginTop: '2px' }}
          >
            <option value="uppercase">UPPERCASE</option>
            <option value="lowercase">lowercase</option>
            <option value="capitalize">Capitalize</option>
            <option value="reverse">Reverse</option>
            <option value="trim">Trim Spaces</option>
          </select>
        </label>
        <div style={{ fontSize: '10px', color: '#666' }}>
          Transforms text data
        </div>
      </div>
    </BaseNode>
  );
};
