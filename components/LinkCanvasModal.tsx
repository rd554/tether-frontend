'use client';

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  EdgeProps,
  getBezierPath,
  BaseEdge,
  Node,
  Edge,
  Connection,
  addEdge,
  useReactFlow,
  Panel,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, Users, RefreshCw, Smartphone, Monitor } from 'lucide-react';

// --- Custom HoverLabelEdge for hover-only labels and offset ---
const HoverLabelEdge = (props: EdgeProps) => {
  const [hovered, setHovered] = useState(false);
  const { sourceX, sourceY, targetX, targetY, style, markerEnd, data } = props;
  // Offset for parallel edges
  const offset = data?.offset || 0;
  // Offset the start/end points so lines don't overlap at the node
  const nodeOffset = data?.nodeOffset || 0;
  // Calculate new start/end points
  const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
  const startX = sourceX + Math.cos(angle - Math.PI / 2) * nodeOffset;
  const startY = sourceY + Math.sin(angle - Math.PI / 2) * nodeOffset;
  const endX = targetX + Math.cos(angle - Math.PI / 2) * nodeOffset;
  const endY = targetY + Math.sin(angle - Math.PI / 2) * nodeOffset;
  // Calculate control points for Bezier curve with offset
  const midX = (startX + endX) / 2 + offset;
  const midY = (startY + endY) / 2 - Math.abs(offset) * 0.5;
  const path = `M${startX},${startY} Q${midX},${midY} ${endX},${endY}`;
  
  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      <BaseEdge path={path} markerEnd={markerEnd} style={style} />
      {hovered && props.label && (
        <foreignObject width={70} height={18} x={(startX + endX) / 2 - 35} y={(startY + endY) / 2 - 9}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: style?.stroke || '#333',
              color: '#fff',
              borderRadius: 4,
              padding: '1px 4px',
              fontSize: 8,
              textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
              opacity: 0.95,
              minWidth: 0,
              minHeight: 0,
              maxWidth: 70,
              maxHeight: 18,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {props.label}
          </motion.div>
        </foreignObject>
      )}
    </g>
  );
};

// Register custom edge type
const edgeTypes = { hoverLabel: HoverLabelEdge };

interface LinkCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams?: any[];
  users?: any[];
  links?: any[];
}

// Auto-layout function using force-directed algorithm
const generateAutoLayout = (_teams: any[], users: any[], links: any[]) => {
  console.log('LinkCanvasModal DEBUG: users:', users, 'links:', links);
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  if (!Array.isArray(users) || users.length < 2 || !Array.isArray(links) || links.length === 0) return { nodes, edges };

  // PM is always first, others are participants
  const pmUser = users[0];
  const participants = users.slice(1); // All other users are participants
  const centerX = 400;
  const centerY = 60; // More compact vertically

  // PM node
  nodes.push({
    id: pmUser._id,
    position: { x: centerX, y: centerY },
    data: {
      label: `${pmUser.name || pmUser.firstName || ''} (PM)`,
      type: 'user',
      role: 'PM',
    },
    type: 'default',
    style: {
      background: '#9ca3af', // grey for PM
      color: 'white',
      border: '2px solid #1f2937',
      borderRadius: '6px',
      padding: '1px 3px',
      fontSize: '10px',
      fontWeight: '600',
      minWidth: '60px',
      minHeight: '18px',
      maxWidth: '100px',
      textAlign: 'center',
    }
  });

  // Position participants in a horizontal row below PM
  const participantSpacing = 160; // More spacing horizontally
  const startX = centerX - ((participants.length - 1) * participantSpacing) / 2;
  const participantY = centerY + 140; // More vertical space

  // Build a map: participantId -> { COMPLETE: [], PENDING: [], DELAYED: [] }
  const statusMap: Record<string, Record<string, any[]>> = {};
  links.forEach(link => {
    // Find the PM and all participants for this link
    const pm = link.participants.find((p: any) => p.role === 'INITIATOR');
    if (!pm || !pm.userId || pm.userId._id !== pmUser._id) return; // Only links for this PM
    link.participants.forEach((p: any) => {
      if (p.role !== 'INITIATOR' && p.userId && p.userId._id) {
        const pid = p.userId._id;
        if (!statusMap[pid]) statusMap[pid] = { COMPLETE: [], PENDING: [], DELAYED: [] };
        const s = (link.status || 'PENDING').toUpperCase();
        if (s === 'COMPLETE' || s === 'COMPLETED') statusMap[pid].COMPLETE.push(link);
        else if (s === 'DELAYED') statusMap[pid].DELAYED.push(link);
        else statusMap[pid].PENDING.push(link);
      }
    });
  });

  participants.forEach((participant, index) => {
    const x = startX + (index * participantSpacing);
    const pid = participant._id;
    const stat = statusMap[pid] || { COMPLETE: [], PENDING: [], DELAYED: [] };
    // Node color logic
    const colorKey = participant.department || participant.role || participant.name || participant.email || participant._id || '';
    const nodeColor = getDepartmentColor(colorKey);
    // Node
    nodes.push({
      id: pid,
      position: { x, y: participantY },
      data: {
        label: `${participant.name || participant.firstName || ''} (${participant.department || participant.role || ''})`,
        type: 'user',
        role: participant.role || '',
      },
      type: 'default',
      style: {
        background: nodeColor,
        color: 'white',
        border: '2px solid #1f2937',
        borderRadius: '6px',
        padding: '1px 3px',
        fontSize: '10px',
        fontWeight: '500',
        minWidth: '60px',
        minHeight: '18px',
        maxWidth: '100px',
        textAlign: 'center',
      }
    });
    // Edges: one per status, spaced out as arcs
    const edgeTypesArr = [
      { key: 'COMPLETE', color: '#22c55e' },
      { key: 'PENDING', color: '#f59e42' },
      { key: 'DELAYED', color: '#ef4444' }
    ];
    // Calculate symmetrical offsets for arcs
    const presentEdges = edgeTypesArr.filter(({ key }) => (stat[key] && stat[key].length > 0));
    const n = presentEdges.length;
    const offsets = presentEdges.map((_, i) => (i - (n - 1) / 2) * 40); // Increased offset for more separation
    presentEdges.forEach(({ key, color }, i) => {
      const arr = stat[key];
      if (arr && arr.length > 0) {
        const latest = arr[arr.length - 1];
        edges.push({
          id: `edge-${pid}-${key}`,
          source: pmUser._id,
          target: pid,
          type: 'hoverLabel',
          label: latest.title,
          style: {
            stroke: color,
            strokeWidth: key === 'COMPLETE' ? 4 + arr.length : 2
          },
          data: {
            offset: offsets[i],
            nodeOffset: 8,
            status: key,
            lastNudge: latest.lastNudge
          }
        });
      }
    });
  });

  return { nodes, edges };
};

const LinkCanvasModal: React.FC<LinkCanvasModalProps> = ({
  isOpen,
  onClose,
  teams = [],
  users = [],
  links = []
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoLayout, setIsAutoLayout] = useState(true);
  
  // Generate nodes and edges with auto-layout
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    return generateAutoLayout([], users, links);
  }, [users, links]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Handle new connections
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);
  
  // Auto-layout function
  const handleAutoLayout = useCallback(() => {
    const { nodes: newNodes, edges: newEdges } = generateAutoLayout([], users, links);
    setNodes(newNodes);
    setEdges(newEdges);
    // Removed fitView call from here
  }, [users, links, setNodes, setEdges]);
  
  // Check if mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .react-flow__wrapper { overflow: visible !important; z-index: 1 !important; }
        .react-flow__node { transition: all 0.3s ease; }
        .react-flow__edge { transition: all 0.3s ease; }
        @media (max-width: 768px) {
          .react-flow__controls { transform: scale(0.8); }
        }
      `}</style>
      <AnimatePresence>
        <motion.div 
          className={`fixed inset-0 z-50 ${isFullScreen ? '' : 'flex items-center justify-center'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={`bg-black bg-opacity-50 ${isFullScreen ? 'absolute inset-0' : 'absolute inset-0'}`} onClick={onClose} />
          <motion.div 
            className={`bg-white rounded-lg shadow-xl ${isFullScreen ? 'absolute inset-4' : 'relative w-11/12 h-5/6 max-w-6xl'}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Link Canvas</h2>
                  <p className="text-sm text-gray-500">Visual coordination space</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Mobile indicator */}
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  {isMobile ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                  <span>{isMobile ? 'Mobile' : 'Desktop'}</span>
                </div>
                
                {/* Auto-layout toggle */}
                <button
                  onClick={handleAutoLayout}
                  className={`p-2 rounded-lg transition-colors ${
                    isAutoLayout 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Auto Layout"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                >
                  {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 h-full min-h-[500px] border border-dashed border-blue-400">
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  edgeTypes={edgeTypes}
                  className="bg-gray-50"
                  fitView
                  fitViewOptions={{ padding: 0.1 }}
                  minZoom={0.1}
                  maxZoom={2}
                  defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                  panOnScroll={isMobile}
                  zoomOnScroll={!isMobile}
                  panOnDrag={true}
                  zoomOnPinch={true}
                  zoomOnDoubleClick={false}
                  preventScrolling={!isMobile}
                >
                  {/* Auto-fit view on layout change */}
                  <AutoFitView trigger={nodes.length + edges.length + (isOpen ? 1 : 0)} />
                  <Controls 
                    showZoom={true}
                    showFitView={true}
                    showInteractive={false}
                    position={isMobile ? 'bottom-left' : 'bottom-right'}
                  />
                  <Background color="#e5e7eb" gap={24} />
                  
                  {/* Legend Panel */}
                  <Panel position="top-left" className="bg-white rounded-lg shadow-lg p-4 m-5">
                    <div className="text-sm font-semibold text-gray-700 mb-3">Link Status</div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-2 bg-green-600 rounded"></div>
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-2" style={{ background: '#ff9100', borderRadius: '4px' }}></div>
                        <span className="text-sm font-medium">Pending</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-2 bg-red-600 rounded"></div>
                        <span className="text-sm font-medium">Delayed</span>
                      </div>
                    </div>
                  </Panel>
                </ReactFlow>
              </ReactFlowProvider>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

// Helper component to call fitView inside ReactFlow context
const AutoFitView: React.FC<{ trigger: any }> = ({ trigger }) => {
  const { fitView } = useReactFlow();
  React.useEffect(() => {
    fitView({ padding: 0.18 }); // Slightly more padding for elegance
  }, [trigger, fitView]);
  return null;
};

// Department color palette (up to 8)
const departmentColors = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#f59e42', // orange
  '#ef4444', // red
  '#a855f7', // purple
  '#eab308', // yellow
  '#14b8a6', // teal
  '#6366f1', // indigo
];
// Helper to get color by department
const getDepartmentColor = (dept: string) => {
  if (!dept) return departmentColors[0];
  let hash = 0;
  for (let i = 0; i < dept.length; i++) {
    hash = dept.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % departmentColors.length;
  return departmentColors[idx];
};

export default LinkCanvasModal;