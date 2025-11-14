// dateNode.js - Custom node for date operations
import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const DateNode = ({ id, data }) => {
  const [dateFormat, setDateFormat] = useState(data?.dateFormat || 'YYYY-MM-DD');
  const [currentDate, setCurrentDate] = useState(data?.currentDate || new Date().toISOString().split('T')[0]);

  return (
    <BaseNode
      id={id}
      data={data}
      nodeType="Date"
      backgroundColor="#ede7f6"
      outputs={['date']}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '12px' }}>
          Date:
          <input
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            style={{ width: '100%', padding: '4px', marginTop: '2px' }}
          />
        </label>
        <label style={{ fontSize: '12px' }}>
          Format:
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            style={{ width: '100%', padding: '4px', marginTop: '2px' }}
          >
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="timestamp">Timestamp</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};
