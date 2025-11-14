import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, ReactFlowProvider } from 'reactflow';
import { useStore } from './store';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { NumberNode } from './nodes/numberNode';
import { FilterNode } from './nodes/filterNode';
import { TransformNode } from './nodes/transformNode';
import { ValidatorNode } from './nodes/validatorNode';
import { DateNode } from './nodes/dateNode';
import { DraggableNode } from './draggableNode';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Menu, X, Layers } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import 'reactflow/dist/style.css';

const gridSize = 5;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  number: NumberNode,
  filter: FilterNode,
  transform: TransformNode,
  validator: ValidatorNode,
  date: DateNode,
};

const FlowComponent = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [palettePosition, setPalettePosition] = useState({ x: 24, y: 24 });
  const [isDraggingPalette, setIsDraggingPalette] = useState(false);
  
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const getNodeID = useStore((state) => state.getNodeID);
  const addNode = useStore((state) => state.addNode);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);

  const getInitNodeData = useCallback((nodeID, type) => {
    return { id: nodeID, nodeType: `${type}` };
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, addNode, getNodeID, getInitNodeData]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Delete functionality - Press Delete or Backspace to remove selected nodes/edges
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== 'Delete' && event.key !== 'Backspace') {
        return;
      }

      const activeElement = document.activeElement;
      const tagName = activeElement?.tagName?.toLowerCase();
      const isEditableElement = Boolean(
        activeElement?.isContentEditable ||
        tagName === 'input' ||
        tagName === 'textarea' ||
        tagName === 'select' ||
        (typeof activeElement?.closest === 'function' &&
          activeElement.closest('input, textarea, [contenteditable="true"]'))
      );

      if (isEditableElement) {
        return; // let form elements handle Delete/Backspace normally
      }

      const selectedNodes = nodes.filter(node => node.selected);
      const selectedEdges = edges.filter(edge => edge.selected);
      
      if (selectedNodes.length > 0 || selectedEdges.length > 0) {
        event.preventDefault();
        
        // Delete selected nodes
        const deletedNodeIds = selectedNodes.map(node => node.id);
        if (deletedNodeIds.length > 0) {
          onNodesChange(
            deletedNodeIds.map(id => ({
              id,
              type: 'remove',
            }))
          );
        }
        
        // Delete selected edges
        const deletedEdgeIds = selectedEdges.map(edge => edge.id);
        if (deletedEdgeIds.length > 0) {
          onEdgesChange(
            deletedEdgeIds.map(id => ({
              id,
              type: 'remove',
            }))
          );
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [nodes, edges, onNodesChange, onEdgesChange]);

  const handleSubmit = async () => {
    // ===== VALIDATION: Check for empty pipeline =====
    if (nodes.length === 0) {
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
      return; // Stop execution here
    }
    // ===== END VALIDATION =====

    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Analyzing pipeline...');

    try {
      const pipelineData = {
        nodes: nodes.map(node => ({ id: node.id })),
        edges: edges.map(edge => ({ source: edge.source, target: edge.target }))
      };

      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pipelineData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      toast.dismiss(loadingToast);

      if (data.is_dag) {
        toast.success(
          (t) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎉 Pipeline Analysis Complete!
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <span>🔢</span>
                <span style={{ fontWeight: '600' }}>Number of Nodes:</span>
                <span>{data.num_nodes}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <span>🔗</span>
                <span style={{ fontWeight: '600' }}>Number of Edges:</span>
                <span>{data.num_edges}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <span>✅</span>
                <span style={{ fontWeight: '600' }}>Is DAG:</span>
                <span style={{ color: '#10b981', fontWeight: '700' }}>✓ Yes (Valid Pipeline)</span>
              </div>
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #d1fae5', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✨</span>
                <span style={{ fontWeight: '600' }}>Your pipeline is valid and can be executed!</span>
              </div>
            </div>
          ),
          { 
            duration: 8000,
            style: { 
              background: '#f0fdf4', 
              border: '2px solid #10b981',
              padding: '16px',
              minWidth: '350px',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)'
            }
          }
        );
      } else {
        toast.error(
          (t) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚠️ Pipeline Analysis Complete!
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <span>🔢</span>
                <span style={{ fontWeight: '600' }}>Number of Nodes:</span>
                <span>{data.num_nodes}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <span>🔗</span>
                <span style={{ fontWeight: '600' }}>Number of Edges:</span>
                <span>{data.num_edges}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <span>❌</span>
                <span style={{ fontWeight: '600' }}>Is DAG:</span>
                <span style={{ color: '#ef4444', fontWeight: '700' }}>✗ No (Invalid Pipeline)</span>
              </div>
              <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #fecaca', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🔄</span>
                <span style={{ fontWeight: '600' }}>Your pipeline contains cycles and cannot be executed!</span>
              </div>
            </div>
          ),
          { 
            duration: 8000,
            style: { 
              background: '#fef2f2', 
              border: '2px solid #ef4444',
              padding: '16px',
              minWidth: '350px',
              boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)'
            }
          }
        );
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`❌ Connection Error\n${error.message}`, {
        duration: 6000,
        style: { background: '#fef2f2', border: '1px solid #ef4444' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          height: '70px',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 30px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
          zIndex: 100,
          position: 'relative'
        }}
      >
        {/* Company Branding */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            borderRadius: '10px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}>
            <Layers size={24} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}>
              VectorShift
            </h1>
            <p style={{
              margin: 0,
              fontSize: '11px',
              color: '#6b7280',
              fontWeight: '600',
              letterSpacing: '0.02em'
            }}>
              Visual Pipeline Builder
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: isSubmitting ? 1 : 1.05, boxShadow: isSubmitting ? '0 4px 12px rgba(156, 163, 175, 0.2)' : '0 6px 20px rgba(139, 92, 246, 0.4)' }}
          whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            background: isSubmitting 
              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
              : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 28px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: isSubmitting 
              ? '0 4px 12px rgba(156, 163, 175, 0.2)'
              : '0 4px 16px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            letterSpacing: '0.01em'
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Validating...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Submit Pipeline</span>
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Main Canvas Area */}
      <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
      <Toaster position="top-right" />
      
      {/* Welcome Message - Shows only when canvas is empty */}
      {nodes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 1,
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <h2 style={{
            fontSize: '45px',
            fontWeight: '600',
            color: 'rgba(139, 92, 246, 0.25)',
            marginBottom: '16px',
            letterSpacing: '0.02em',
            lineHeight: '1.4'
          }}>
            Build Your Pipeline Visually
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'rgba(167, 139, 250, 0.35)',
            fontWeight: '500',
            letterSpacing: '0.01em'
          }}>
            Drag and drop nodes from the palette to get started
          </p>
        </motion.div>
      )}
      
      {/* Nodes Toggle Button - Below Header */}
      {!isPaletteOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(139, 92, 246, 0.35)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPaletteOpen(true)}
          style={{
            position: 'absolute',
            top: '24px',
            left: '30px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 20px',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(139, 92, 246, 0.3)',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'white',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <Menu size={18} />
          <span>Nodes</span>
          <div style={{
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '6px',
            padding: '2px 8px',
            fontSize: '10px',
            fontWeight: '700'
          }}>
            9
          </div>
        </motion.button>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapToGrid={false}
        connectionLineType="smoothstep"
        deleteKeyCode="Delete"
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        autoPanOnNodeDrag={true}
        panOnScroll={true}
        panOnDrag={[1, 2]}
        zoomOnScroll={true}
        zoomOnDoubleClick={false}
        minZoom={0.5}
        maxZoom={2}
        selectNodesOnDrag={false}
        onEdgeDoubleClick={(event, edge) => {
          event.stopPropagation();
          onEdgesChange([{ id: edge.id, type: 'remove' }]);
        }}
      >
        <Background color="#e2e8f0" gap={gridSize} size={1.5} />
        <Controls 
          position="bottom-right"
          style={{
            bottom: '24px',
            right: '24px',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />
      </ReactFlow>

      {/* Draggable Icon-Based Node Palette */}
      <AnimatePresence>
        {isPaletteOpen && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: palettePosition.x, y: palettePosition.y }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => setIsDraggingPalette(true)}
            onDragEnd={(event, info) => {
              setIsDraggingPalette(false);
              setPalettePosition({
                x: palettePosition.x + info.offset.x,
                y: palettePosition.y + info.offset.y
              });
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(16px)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: isDraggingPalette 
                ? '0 30px 80px rgba(0, 0, 0, 0.25), 0 12px 24px rgba(0, 0, 0, 0.15)'
                : '0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)',
              zIndex: 50,
              width: '320px',
              border: '1px solid rgba(209, 213, 219, 0.5)',
              cursor: isDraggingPalette ? 'grabbing' : 'grab',
              userSelect: 'none'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '2px solid #e5e7eb',
              cursor: 'grab',
              userSelect: 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  borderRadius: '10px',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)'
                }}>
                  <Layers size={20} color="white" />
                </div>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#111827',
                    letterSpacing: '-0.01em'
                  }}>
                    Nodes
                  </h3>
                  <p style={{
                    margin: '2px 0 0 0',
                    fontSize: '11px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    9 components
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaletteOpen(false);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#6b7280',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e5e7eb';
                  e.currentTarget.style.color = '#111827';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                <X size={18} />
              </motion.button>
            </div>
            
            {/* Icon Grid Layout */}
            <div 
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '14px',
                marginBottom: '16px'
              }}>
              <DraggableNode type='customInput' label='Input' />
              <DraggableNode type='customOutput' label='Output' />
              <DraggableNode type='llm' label='LLM' />
              <DraggableNode type='text' label='Text' />
              <DraggableNode type='number' label='Number' />
              <DraggableNode type='date' label='Date' />
              <DraggableNode type='filter' label='Filter' />
              <DraggableNode type='transform' label='Transform' />
              <DraggableNode type='validator' label='Validator' />
            </div>
            
            {/* Hint Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                borderRadius: '12px',
                fontSize: '10px',
                color: '#1e40af',
                border: '1px solid #bfdbfe',
                lineHeight: '1.5',
                textAlign: 'center'
              }}
            >
              <div style={{ fontWeight: '700', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <span style={{ fontSize: '14px' }}>💡</span>
                <span>Drag to canvas</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export const PipelineUI = () => {
  return (
    <ReactFlowProvider>
      <FlowComponent />
    </ReactFlowProvider>
  );
};
