// draggableNode.js

import { motion } from 'framer-motion';
import { 
  FileInput, Cpu, FileOutput, Type, Hash, 
  Filter, Sparkles, CheckCircle, Calendar 
} from 'lucide-react';

const getNodeIcon = (type) => {
  const icons = {
    customInput: FileInput,
    llm: Cpu,
    customOutput: FileOutput,
    text: Type,
    number: Hash,
    filter: Filter,
    transform: Sparkles,
    validator: CheckCircle,
    date: Calendar
  };
  return icons[type] || Type;
};

const getNodeColor = (type) => {
  const colors = {
    customInput: '#3b82f6',
    llm: '#8b5cf6',
    customOutput: '#10b981',
    text: '#6366f1',
    number: '#f59e0b',
    filter: '#ec4899',
    transform: '#06b6d4',
    validator: '#84cc16',
    date: '#f97316'
  };
  return colors[type] || '#3b82f6';
};

export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const Icon = getNodeIcon(type);
  const color = getNodeColor(type);

  return (
    <motion.div
      className={type}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      whileHover={{ 
        scale: 1.05,
        boxShadow: `0 6px 16px ${color}40`,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        cursor: 'grab',
        width: '100%',
        aspectRatio: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        borderRadius: '12px',
        background: 'white',
        color: color,
        border: `2px solid ${color}30`,
        padding: '8px',
        fontSize: '8px',
        fontWeight: '700',
        boxShadow: `0 2px 8px ${color}15`,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        userSelect: 'none',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        overflow: 'hidden'
      }}
      draggable
    >
      <div style={{
        background: `${color}15`,
        borderRadius: '8px',
        padding: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <span style={{ lineHeight: '1.1', wordBreak: 'break-word' }}>{label}</span>
    </motion.div>
  );
};
