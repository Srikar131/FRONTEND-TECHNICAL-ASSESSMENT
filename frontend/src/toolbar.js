// toolbar.js

import { DraggableNode } from './draggableNode';
import { motion } from 'framer-motion';


export const PipelineToolbar = () => {

   return (
  <motion.div 
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    style={{ 
      padding: '20px 28px',
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)'
    }}>
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: '700',
            color: '#111827',
            letterSpacing: '-0.02em'
          }}>
            Pipeline Builder
          </h1>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '13px',
            color: '#6b7280',
            fontWeight: '400'
          }}>
            Drag and drop nodes to create your workflow
          </p>
        </div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          style={{
            padding: '8px 14px',
            background: '#eff6ff',
            borderRadius: '6px',
            border: '1px solid #bfdbfe'
          }}>
          <span style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#1e40af'
          }}>
            {9} Node Types
          </span>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '10px',
          alignItems: 'center'
        }}>
        <DraggableNode type='customInput' label='Input' />
        <DraggableNode type='llm' label='LLM' />
        <DraggableNode type='customOutput' label='Output' />
        <DraggableNode type='text' label='Text' />
        <DraggableNode type='number' label='Number' />
        <DraggableNode type='filter' label='Filter' />
        <DraggableNode type='transform' label='Transform' />
        <DraggableNode type='validator' label='Validator' />
        <DraggableNode type='date' label='Date' />
      </motion.div>
    </div>
  </motion.div>
);
}

