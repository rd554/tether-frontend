'use client';
import React, { useState, useEffect } from 'react';
import LinkCanvasModal from '@/components/LinkCanvasModal';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function LinkCanvasPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { data: dashboardData, isLoading, error, refetch } = useDashboardData({
    refetchInterval: 10000, // auto-refresh every 10 seconds
  });
  
  // Extract data for the canvas
  const teams = dashboardData?.teams || [];
  const users = dashboardData?.users || [];
  const links = dashboardData?.recentLinks || [];

  const handleClose = () => {
    // Navigate back to dashboard
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading Link Canvas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-end p-4 max-w-6xl mx-auto">
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          Refresh
        </button>
      </div>
      <LinkCanvasModal
        isOpen={isModalOpen}
        onClose={handleClose}
        teams={teams}
        users={users}
        links={links}
      />
    </div>
  );
} 