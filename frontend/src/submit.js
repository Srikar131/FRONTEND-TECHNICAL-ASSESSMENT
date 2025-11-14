// submit.js - Backend Integration (Updated to port 8000)

import { useState } from 'react';
import { useStore } from './store';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Send, Loader2 } from 'lucide-react';

export const SubmitButton = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Analyzing your pipeline...');

    try {
      // Format data for backend
      const pipelineData = {
        nodes: nodes.map(node => ({
          id: node.id
        })),
        edges: edges.map(edge => ({
          source: edge.source,
          target: edge.target
        }))
      };

      // Send POST request to backend
      const response = await fetch('http://localhost:8000/pipelines/parse', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pipelineData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse response
      const data = await response.json();
      
      toast.dismiss(loadingToast);

      // Show success toast with results
      if (data.is_dag) {
        toast.success(
          (t) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>
                ✅ Valid Pipeline!
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                📊 Nodes: {data.num_nodes} | 🔗 Edges: {data.num_edges}
              </div>
              <div>Pipeline is a DAG: {data.is_dag ? 'true' : 'false'}</div>
              <div style={{ fontSize: '12px', color: '#10b981' }}>
                Your pipeline is ready to execute!
              </div>
            </div>
          ),
          {
            duration: 5000,
            style: {
              background: '#f0fdf4',
              border: '1px solid #10b981',
              padding: '16px',
            },
          }
        );
      } else {
        toast.error(
          (t) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>
                ⚠️ Invalid Pipeline
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>
                📊 Nodes: {data.num_nodes} | 🔗 Edges: {data.num_edges}
              </div>
              <div style={{ fontSize: '12px', color: '#ef4444' }}>
                Pipeline contains cycles - cannot execute linearly
              </div>
            </div>
          ),
          {
            duration: 6000,
            style: {
              background: '#fef2f2',
              border: '1px solid #ef4444',
              padding: '16px',
            },
          }
        );
      }

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        (t) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>
              ❌ Connection Error
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {error.message}
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
              Ensure backend is running on http://localhost:8000
            </div>
          </div>
        ),
        {
          duration: 6000,
          style: {
            background: '#fef2f2',
            border: '1px solid #ef4444',
            padding: '16px',
          },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '10px',
            fontSize: '13px',
          },
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          background: 'white',
          borderTop: '1px solid #e5e7eb',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.03)'
        }}
      >
        <motion.button
          onClick={handleSubmit}
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: isSubmitting ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '12px 32px',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: isSubmitting 
              ? '0 2px 6px rgba(156, 163, 175, 0.3)' 
              : '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 size={18} />
              </motion.div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Submit Pipeline</span>
            </>
          )}
        </motion.button>
      </div>
    </>
  );
};
