// BaseNode.js - Modern reusable base component for all nodes
import { Handle, Position, useReactFlow } from 'reactflow';
import { Trash2 } from 'lucide-react';

const nodeColors = {
  'Input': { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
  'Output': { bg: '#f0fdf4', border: '#10b981', text: '#065f46' },
  'LLM': { bg: '#faf5ff', border: '#8b5cf6', text: '#6b21a8' },
  'Text': { bg: '#eef2ff', border: '#6366f1', text: '#4338ca' },
  'Number': { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
  'Filter': { bg: '#fdf2f8', border: '#ec4899', text: '#9f1239' },
  'Transform': { bg: '#ecfeff', border: '#06b6d4', text: '#164e63' },
  'Validator': { bg: '#f7fee7', border: '#84cc16', text: '#3f6212' },
  'Date': { bg: '#fff7ed', border: '#f97316', text: '#9a3412' }
};

export const BaseNode = ({ 
  id, 
  data, 
  nodeType,
  backgroundColor,
  inputs = [],
  outputs = [],
  children 
}) => {
  const colors = nodeColors[nodeType] || nodeColors['Text'];
  const bg = backgroundColor || colors.bg;
  const { deleteElements } = useReactFlow();

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div 
      style={{
        width: 280,
        minHeight: 120,
        border: `1.5px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '16px',
        backgroundColor: bg,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        fontFamily: 'inherit',
        position: 'relative',
        overflow: 'visible',
        cursor: 'move'
      }}>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.backgroundColor = '#fee2e2';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = 'white';
        }}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          border: '1.5px solid #ef4444',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)',
          zIndex: 10,
          transition: 'all 0.2s',
          transform: 'scale(1)'
        }}
        title="Delete node"
      >
        <Trash2 size={12} color="#ef4444" strokeWidth={2.5} />
      </button>

      {/* Input Handles */}
      {inputs.map((input, idx) => (
        <Handle
          key={`input-${idx}`}
          type="target"
          position={Position.Left}
          id={`${id}-${input}`}
          style={{ 
            top: `${((idx + 1) * 100) / (inputs.length + 1)}%`,
            background: colors.border,
            width: '10px',
            height: '10px',
            border: '2px solid white',
            boxShadow: `0 0 0 1px ${colors.border}`
          }}
        />
      ))}
      
      {/* Node Header */}
      <div style={{ 
        marginBottom: '14px',
        paddingBottom: '10px',
        borderBottom: `1.5px solid ${colors.border}30`
      }}>
        <span style={{ 
          fontWeight: '700', 
          fontSize: '11px',
          color: colors.text,
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          {nodeType}
        </span>
      </div>
      
      {/* Node Content */}
      <div>
        {children}
      </div>
      
      {/* Output Handles */}
      {outputs.map((output, idx) => (
        <Handle
          key={`output-${idx}`}
          type="source"
          position={Position.Right}
          id={`${id}-${output}`}
          style={{ 
            top: `${((idx + 1) * 100) / (outputs.length + 1)}%`,
            background: colors.border,
            width: '10px',
            height: '10px',
            border: '2px solid white',
            boxShadow: `0 0 0 1px ${colors.border}`
          }}
        />
      ))}
    </div>
  );
};
