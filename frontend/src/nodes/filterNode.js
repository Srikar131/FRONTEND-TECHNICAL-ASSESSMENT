// filterNode.js - Custom node for filtering data
import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || 'contains');
  const [filterValue, setFilterValue] = useState(data?.filterValue || '');

  return (
    <BaseNode
      id={id}
      data={data}
      nodeType="Filter"
      backgroundColor="#e1f5fe"
      inputs={['input']}
      outputs={['passed', 'failed']}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '12px' }}>
          Condition:
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            style={{ width: '100%', padding: '4px', marginTop: '2px' }}
          >
            <option value="contains">Contains</option>
            <option value="equals">Equals</option>
            <option value="startsWith">Starts With</option>
            <option value="endsWith">Ends With</option>
          </select>
        </label>
        <label style={{ fontSize: '12px' }}>
          Value:
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Filter value..."
            style={{ width: '100%', padding: '4px', marginTop: '2px' }}
          />
        </label>
      </div>
    </BaseNode>
  );
};
