'use client';
import React from 'react';
import LinkCanvasModal from '@/components/LinkCanvasModal';

// Import the same dummy data as dashboard for demo
// (In real use, fetch real data or use context/store)
const DUMMY_CANVAS_DATA = true;
const dummyTeams = [
  { _id: 'team1', name: 'Design', members: ['UI Dev', 'UX Lead'] },
  { _id: 'team2', name: 'Security', members: ['Sec Eng', 'Sec Lead'] },
  { _id: 'team3', name: 'Legal', members: ['Lawyer', 'Compliance'] },
  { _id: 'team4', name: 'Devs', members: ['Backend', 'Frontend'] },
  { _id: 'team5', name: 'Biz', members: ['BizDev', 'Sales'] },
  { _id: 'team6', name: 'CXO', members: ['CEO', 'COO'] },
  { _id: 'team7', name: 'PM', members: ['Ravi (PM)'] },
];
const dummyUsers = [
  { _id: 'user1', firstName: 'Ravi', lastName: 'PM' },
  { _id: 'user2', firstName: 'Alice', lastName: 'Designer' },
  { _id: 'user3', firstName: 'Bob', lastName: 'Engineer' },
];
const dummyLinks = [
  { _id: 'link1', title: 'Design Sync', status: 'active', lastNudge: '2 days ago', source: 'team-team1', target: 'user-user1' },
  { _id: 'link2', title: 'Security Review', status: 'awaiting_response', lastNudge: '1 day ago', source: 'team-team2', target: 'user-user2' },
  { _id: 'link3', title: 'Legal Approval', status: 'completed', lastNudge: '5 days ago', source: 'team-team3', target: 'user-user3' },
  { _id: 'link4', title: 'Dev Handoff', status: 'ignored', lastNudge: '3 days ago', source: 'team-team4', target: 'team-team5' },
  { _id: 'link5', title: 'Biz Strategy', status: 'active', lastNudge: 'today', source: 'team-team5', target: 'team-team6' },
  { _id: 'link6', title: 'CXO Update', status: 'completed', lastNudge: 'yesterday', source: 'team-team6', target: 'team-team7' },
];

export default function LinkCanvasPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl">
        <LinkCanvasModal
          isOpen={true}
          onClose={() => {}}
        />
      </div>
    </div>
  );
} 