// textNode.js - Enhanced with dynamic resizing and variable detection
import { useState, useEffect, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();

  // Feature 1: Extract variables from text using regex
  useEffect(() => {
    // Regex to match {{variableName}} pattern
    // \{\{ - matches opening {{
    // \s* - matches optional whitespace
    // ([a-zA-Z_$][a-zA-Z0-9_$]*) - captures valid JavaScript variable names
    // \s* - matches optional whitespace
    // \}\} - matches closing }}
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    
    // Find all matches in the text
    const matches = [...currText.matchAll(regex)];
    
    // Extract variable names (first capture group)
    const extractedVars = matches.map(match => match[1]);
    
    // Remove duplicates using Set
    const uniqueVars = [...new Set(extractedVars)];
    
    // Update state with unique variables
    setVariables(uniqueVars);
  }, [currText]); // Re-run when text changes

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  // Calculate dynamic dimensions based on content
  const calculateDimensions = () => {
    const baseWidth = 240;
    const baseHeight = 120;
    const charWidth = 8; // approximate pixels per character
    const lineHeight = 20; // approximate pixels per line
    
    // Calculate width based on longest line
    const lines = currText.split('\n');
    const maxLineLength = Math.max(...lines.map(line => line.length));
    const calculatedWidth = Math.min(Math.max(baseWidth, maxLineLength * charWidth), 500);
    
    // Calculate height based on number of lines
    const calculatedHeight = Math.max(baseHeight, lines.length * lineHeight + 80);
    
    return {
      width: calculatedWidth,
      height: calculatedHeight
    };
  };

  const dimensions = calculateDimensions();

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, variables.length, dimensions.width, dimensions.height, updateNodeInternals]);

  return (
    <div
      style={{
        width: dimensions.width,
        minHeight: dimensions.height,
        border: '1.5px solid #f59e0b',
        borderRadius: '12px',
        padding: '16px',
        backgroundColor: '#fffbeb',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        fontFamily: 'inherit',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative'
      }}
    >
      {/* Dynamic Input Handles for Variables */}
      {variables.map((variable, idx) => (
        <Handle
          key={`var-${variable}`}
          type="target"
          position={Position.Left}
          id={`${id}-${variable}`}
          style={{
            top: `${((idx + 1) * 100) / (variables.length + 1)}%`,
            left: '-6px',
            transform: 'translate(-50%, -50%)',
            background: '#f59e0b',
            width: '14px',
            height: '14px',
            borderRadius: '999px',
            border: '2px solid white',
            boxShadow: '0 0 0 1px #f59e0b',
            zIndex: 2
          }}
        />
      ))}

      {/* Variable Chips aligned with handles (pointerEvents disabled to avoid blocking connections) */}
      {variables.map((variable, idx) => (
        <div
          key={`var-label-${variable}`}
          style={{
            position: 'absolute',
            left: '18px',
            top: `${((idx + 1) * 100) / (variables.length + 1)}%`,
            transform: 'translateY(-50%)',
            background: '#92400e',
            color: 'white',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '600',
            pointerEvents: 'none',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            zIndex: 1
          }}
        >
          {variable}
        </div>
      ))}

      {/* Node Header */}
      <div
        style={{
          marginBottom: '14px',
          paddingBottom: '10px',
          borderBottom: '1.5px solid #f59e0b30'
        }}
      >
        <span
          style={{
            fontWeight: '700',
            fontSize: '11px',
            color: '#92400e',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}
        >
          TEXT
        </span>
        
        {/* Variable Count Badge */}
        {variables.length > 0 && (
          <span
            style={{
              marginLeft: '8px',
              background: '#f59e0b',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '10px',
              fontWeight: '600'
            }}
          >
            {variables.length} var{variables.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ 
          fontSize: '11px', 
          fontWeight: '600', 
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Text Content
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleTextChange}
            placeholder="Type {{variableName}} to create inputs..."
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '6px',
              minHeight: '80px',
              height: 'auto',
              border: '1.5px solid #e5e7eb',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '12px',
              resize: 'vertical',
              lineHeight: '1.6',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            rows={Math.max(4, currText.split('\n').length)}
            onFocus={(e) => {
              e.target.style.borderColor = '#f59e0b';
              e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
        </label>

        {/* Helper Text */}
        <div
          style={{
            fontSize: '10px',
            color: '#9ca3af',
            fontStyle: 'italic',
            padding: '6px 8px',
            background: '#fef3c7',
            borderRadius: '4px'
          }}
        >
          💡 Use {`{{variableName}}`} to create dynamic inputs
        </div>

        {/* Variable List Display */}
        {variables.length > 0 && (
          <div
            style={{
              marginTop: '4px',
              padding: '10px',
              background: '#fef3c7',
              borderRadius: '6px',
              fontSize: '11px',
              border: '1px solid #fde68a'
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: '6px', color: '#92400e' }}>
              Detected Variables:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {variables.map(variable => (
                <span
                  key={variable}
                  style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '500',
                    fontFamily: 'monospace'
                  }}
                >
                  {variable}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          background: '#667eea',
          width: '10px',
          height: '10px',
          border: '2px solid white'
        }}
      />
    </div>
  );
};
