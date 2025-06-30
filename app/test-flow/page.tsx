'use client';
import React from 'react';
import LinkCanvasTest from '@/components/LinkCanvasTest';

export default function TestFlowPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">ReactFlow Minimal Test</h1>
        <LinkCanvasTest />
      </div>
    </div>
  );
} 