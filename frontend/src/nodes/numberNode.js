// numberNode.js - Custom node for number operations
import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const NumberNode = ({ id, data }) => {
  const [value, setValue] = useState(data?.value || 0);
  const [operation, setOperation] = useState(data?.operation || 'add');

  return (
    <BaseNode
      id={id}
      data={data}
      nodeType="Number"
      backgroundColor="#fff9c4"
      inputs={['num1', 'num2']}
      outputs={['result']}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '12px' }}>
          Value:
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ width: '100%', padding: '4px', marginTop: '2px' }}
          />
        </label>
        <label style={{ fontSize: '12px' }}>
          Operation:
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            style={{ width: '100%', padding: '4px', marginTop: '2px' }}
          >
            <option value="add">Add (+)</option>
            <option value="subtract">Subtract (-)</option>
            <option value="multiply">Multiply (×)</option>
            <option value="divide">Divide (÷)</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
