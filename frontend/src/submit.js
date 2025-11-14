// submit.js - Backend Integration with Enhanced Validation + Debug

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
    // ===== DEBUG: MUST SEE THIS IN CONSOLE =====
    console.log('🚀🚀🚀 SUBMIT BUTTON CLICKED! 🚀🚀🚀');
    console.log('📊 Current Nodes:', nodes.length);
    console.log('🔗 Current Edges:', edges.length);
    
    if (isSubmitting) {
      console.log('⏸️ Already submitting, returning early');
      return;
    }

    // ===== VALIDATION: Check for empty pipeline =====
    if (nodes.length === 0) {
      console.log('❌❌❌ VALIDATION FAILED: EMPTY PIPELINE ❌❌❌');
      
      toast.error(
        (t) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>
              ❌ Cannot Submit Empty Pipeline
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Please add at least one node to get started.
            </div>
          </div>
        ),
        {
          duration: 4000,
          style: {
            background: '#fef2f2',
            border: '1px solid #ef4444',
            padding: '16px',
          },
        }
      );
      return; // ← THIS STOPS THE FUNCTION
    }

    console.log('✅✅✅ VALIDATION PASSED - SENDING TO BACKEND ✅✅✅');
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Analyzing your pipeline...');

    try {
      const pipelineData = {
        nodes: nodes.map(node => ({ id: node.id })),
        edges: edges.map(edge => ({ source: edge.source, target: edge.target }))
      };

      console.log('📤 Sending data to backend:', pipelineData);

      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pipelineData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 Backend response:', data);
      
      toast.dismiss(loadingToast);

      if (data.is_dag) {
        toast.success(
          (t) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#059669' }}>
                🎉 Pipeline Analysis Complete!
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#374151' }}>
                <div><span style={{ fontWeight: '600' }}>📊 Nodes:</span> {data.num_nodes}</div>
                <div><span style={{ fontWeight: '600' }}>🔗 Edges:</span> {data.num_edges}</div>
                <div><span style={{ fontWeight: '600' }}>✨ Is DAG:</span> <span style={{ color: '#059669', fontWeight: '600' }}>✅ Yes</span></div>
              </div>
              <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid #d1fae5' }}>
                ✨ Your pipeline is valid!
              </div>
            </div>
          ),
          { duration: 6000, style: { background: '#f0fdf4', border: '1px solid #10b981', padding: '16px', maxWidth: '400px' } }
        );
      } else {
        toast.error(
          (t) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#dc2626' }}>
                ⚠️ Invalid Pipeline
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#374151' }}>
                <div><span style={{ fontWeight: '600' }}>📊 Nodes:</span> {data.num_nodes}</div>
                <div><span style={{ fontWeight: '600' }}>🔗 Edges:</span> {data.num_edges}</div>
                <div><span style={{ fontWeight: '600' }}>✨ Is DAG:</span> <span style={{ color: '#dc2626', fontWeight: '600' }}>❌ No</span></div>
              </div>
              <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid #fee' }}>
                ⚠️ Contains circular dependencies
              </div>
            </div>
          ),
          { duration: 7000, style: { background: '#fef2f2', border: '1px solid #ef4444', padding: '16px', maxWidth: '400px' } }
        );
      }

    } catch (error) {
      console.error('❌ Backend error:', error);
      toast.dismiss(loadingToast);
      toast.error(
        (t) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>❌ Connection Error</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>{error.message}</div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
              Ensure backend is running on http://localhost:8000
            </div>
          </div>
        ),
        { duration: 6000, style: { background: '#fef2f2', border: '1px solid #ef4444', padding: '16px' } }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '10px', fontSize: '13px' } }} />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', background: 'white', borderTop: '1px solid #e5e7eb', boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.03)' }}>
        <motion.button
          onClick={handleSubmit}
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: isSubmitting ? '#9ca3af' : '#3b82f6', color: 'white', border: 'none',
            padding: '12px 32px', fontSize: '14px', fontWeight: '600', borderRadius: '8px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: isSubmitting ? '0 2px 6px rgba(156, 163, 175, 0.3)' : '0 4px 12px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.2s', outline: 'none'
          }}
        >
          {isSubmitting ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
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
        