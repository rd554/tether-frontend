'use client';

import React, { useState } from 'react';
import { 
  Link as LinkIcon, 
  Users, 
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useTeamStore } from '@/stores/teamStore';
import CreateLinkModal from './CreateLinkModal';
import AddMemberModal from './AddMemberModal';

export default function QuickActions() {
  const { selectedTeam } = useTeamStore();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const actions = [
    {
      title: 'Create Link',
      description: 'Log a new collaboration or meeting',
      icon: LinkIcon,
      color: 'success',
      onClick: () => setShowLinkModal(true),
      disabled: !selectedTeam
    },
    {
      title: 'Add Member',
      description: 'Invite someone to your team',
      icon: Users,
      color: 'warning',
      onClick: () => setShowAddMemberModal(true),
      disabled: !selectedTeam
    },
    {
      title: 'Schedule Meeting',
      description: 'Plan a future collaboration',
      icon: Calendar,
      color: 'info',
      onClick: () => {/* TODO: Schedule modal */},
      disabled: !selectedTeam
    },
    {
      title: 'View Analytics',
      description: 'Check team performance metrics',
      icon: TrendingUp,
      color: 'purple',
      onClick: () => {/* TODO: Analytics page */},
      disabled: false
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100';
      case 'purple':
        return 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`
                flex flex-col items-center justify-center h-40 rounded-2xl border-2 transition-all duration-200
                ${action.disabled 
                  ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200' 
                  : getColorClasses(action.color)
                }
                hover:scale-[1.03] hover:shadow-lg
              `}
              style={{ minWidth: 0 }}
            >
              <Icon className="h-9 w-9 mb-3" />
              <span className="font-bold text-base mb-1">{action.title}</span>
              <span className="text-sm text-center font-normal opacity-80">{action.description}</span>
            </button>
          );
        })}
      </div>

      {!selectedTeam && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
            <span className="text-sm text-yellow-800">
              Select a team to access quick actions
            </span>
          </div>
        </div>
      )}

      <CreateLinkModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
      />

      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
      />
    </div>
  );
}