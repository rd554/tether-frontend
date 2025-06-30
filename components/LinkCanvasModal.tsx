'use client';

import React, { useState } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  EdgeProps,
  getBezierPath,
  BaseEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X, Maximize2, Minimize2, Users } from 'lucide-react';

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
        <foreignObject width={120} height={32} x={(startX + endX) / 2 - 60} y={(startY + endY) / 2 - 16}>
          <div style={{
            background: style?.stroke || '#333',
            color: '#fff',
            borderRadius: 6,
            padding: '2px 8px',
            fontSize: 13,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            opacity: 0.95,
          }}>{props.label}</div>
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
}

// --- NEW ELEGANT CANVAS DATA (with nodeOffset for hand-drawn effect) ---
const elegantNodes = [
  { id: 'ravi', position: { x: 400, y: 80 }, data: { label: 'Ravi (PM)' }, type: 'default' },
  { id: 'vivek', position: { x: 40, y: 360 }, data: { label: 'Vivek (Dev)' }, type: 'default' },
  { id: 'avinash', position: { x: 200, y: 360 }, data: { label: 'Avinash (Design)' }, type: 'default' },
  { id: 'shraddha', position: { x: 400, y: 400 }, data: { label: 'Shraddha (Legal)' }, type: 'default' },
  { id: 'smruti', position: { x: 600, y: 360 }, data: { label: 'Smruti (Security)' }, type: 'default' },
  { id: 'aparna', position: { x: 760, y: 360 }, data: { label: 'Aparna (Business)' }, type: 'default' },
];
const elegantEdges = [
  // Vivek (Dev)
  { id: 'ravi-vivek-completed', source: 'ravi', target: 'vivek', type: 'hoverLabel', style: { stroke: 'green', strokeWidth: 6 }, label: '5 Completed', data: { offset: -40, nodeOffset: -12 } },
  { id: 'ravi-vivek-active', source: 'ravi', target: 'vivek', type: 'hoverLabel', style: { stroke: 'blue', strokeWidth: 2 }, label: 'Active Link', data: { offset: 40, nodeOffset: 12 } },

  // Avinash (Design)
  { id: 'ravi-avinash-completed', source: 'ravi', target: 'avinash', type: 'hoverLabel', style: { stroke: 'green', strokeWidth: 6 }, label: '4 Completed', data: { offset: -40, nodeOffset: -12 } },
  { id: 'ravi-avinash-active', source: 'ravi', target: 'avinash', type: 'hoverLabel', style: { stroke: 'blue', strokeWidth: 2 }, label: 'Active Link', data: { offset: 40, nodeOffset: 12 } },

  // Shraddha (Legal)
  { id: 'ravi-shraddha-completed', source: 'ravi', target: 'shraddha', type: 'hoverLabel', style: { stroke: 'green', strokeWidth: 2 }, label: '1 Completed', data: { offset: -50, nodeOffset: -16 } },
  { id: 'ravi-shraddha-awaiting', source: 'ravi', target: 'shraddha', type: 'hoverLabel', style: { stroke: 'orange', strokeWidth: 3 }, label: 'Awaiting', data: { offset: 0, nodeOffset: 0 } },
  { id: 'ravi-shraddha-ignored', source: 'ravi', target: 'shraddha', type: 'hoverLabel', style: { stroke: 'red', strokeWidth: 4 }, label: '3 Ignored', data: { offset: 50, nodeOffset: 16 } },

  // Smruti (Security)
  { id: 'ravi-smruti-awaiting', source: 'ravi', target: 'smruti', type: 'hoverLabel', style: { stroke: 'orange', strokeWidth: 3 }, label: 'Awaiting', data: { offset: -30, nodeOffset: -10 } },
  { id: 'ravi-smruti-ignored', source: 'ravi', target: 'smruti', type: 'hoverLabel', style: { stroke: 'red', strokeWidth: 4 }, label: '3 Ignored', data: { offset: 30, nodeOffset: 10 } },
  { id: 'ravi-smruti-completed', source: 'ravi', target: 'smruti', type: 'hoverLabel', style: { stroke: 'green', strokeWidth: 2 }, label: '1 Completed', data: { offset: 0, nodeOffset: 0 } },

  // Aparna (Business)
  { id: 'ravi-aparna-completed', source: 'ravi', target: 'aparna', type: 'hoverLabel', style: { stroke: 'green', strokeWidth: 2 }, label: '2 Completed', data: { offset: -30, nodeOffset: -10 } },
  { id: 'ravi-aparna-active', source: 'ravi', target: 'aparna', type: 'hoverLabel', style: { stroke: 'blue', strokeWidth: 2 }, label: 'Active Link', data: { offset: 30, nodeOffset: 10 } },
];

const LinkCanvasModal: React.FC<LinkCanvasModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(elegantNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(elegantEdges);

  if (!isOpen) return null;

  return (
    <>
      <style>{`.react-flow__wrapper { overflow: visible !important; z-index: 1 !important; }`}</style>
      <div className={`fixed inset-0 z-50 ${isFullScreen ? '' : 'flex items-center justify-center'}`}>
        <div className={`bg-black bg-opacity-50 ${isFullScreen ? 'absolute inset-0' : 'absolute inset-0'}`} onClick={onClose} />
        <div className={`bg-white rounded-lg shadow-xl ${isFullScreen ? 'absolute inset-4' : 'relative w-11/12 h-5/6 max-w-6xl'}`}>
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
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              className="bg-gray-50"
            >
              <Controls />
              <Background color="#e5e7eb" gap={24} />
            </ReactFlow>
          </div>
        </div>
      </div>
    </>
  );
};

export default LinkCanvasModal;