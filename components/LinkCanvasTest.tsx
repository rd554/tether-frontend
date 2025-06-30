'use client';
import React from 'react';
import ReactFlow, { Background } from 'reactflow';
import 'reactflow/dist/style.css';

const nodes = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 400, y: 100 }, data: { label: 'Node 2' } },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2', type: 'default', style: { stroke: '#ff00ff', strokeWidth: 6 } },
];

export default function LinkCanvasTest() {
  return (
    <div style={{ width: '100%', height: 500, border: '2px solid green' }}>
      <ReactFlow nodes={nodes} edges={edges} className="bg-gray-50" >
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
} 