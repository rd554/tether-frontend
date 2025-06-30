'use client';

import React, { useState } from 'react';
import { ChevronDown, Plus, Settings, Trash2 } from 'lucide-react';
import { useTeamStore } from '@/stores/teamStore';
import { useTeams } from '@/hooks/useTeams';
import CreateTeamModal from './CreateTeamModal';

export default function TeamSelector() {
  const { selectedTeam, setSelectedTeam } = useTeamStore();
  const { teams, loading } = useTeams();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleTeamSelect = (team: any) => {
    setSelectedTeam(team);
    setIsOpen(false);
  };

  const handleDeleteTeam = async (team: any) => {
    if (!window.confirm(`Are you sure you want to delete the project "${team.productName}"? This cannot be undone.`)) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/teams/${team._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tether_token')}`,
        },
      });
      if (selectedTeam?._id === team._id) setSelectedTeam(null);
      window.location.reload(); // Or trigger a refetch if you want a smoother UX
    } catch (err) {
      alert('Failed to delete project.');
    }
  };

  const getTeamBadgeColor = (badge: string) => {
    switch (badge) {
      case 'SUPER_RESPONDERS':
        return 'bg-success-100 text-success-800';
      case 'CLEAR_COMMUNICATORS':
        return 'bg-primary-100 text-primary-800';
      case 'SLOW_STEADY':
        return 'bg-warning-100 text-warning-800';
      case 'GHOST_MODE':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
        <div className="animate-pulse h-4 w-4 bg-gray-300 rounded"></div>
        <div className="animate-pulse h-4 w-20 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              {selectedTeam ? selectedTeam.name : 'Select Team'}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Your Teams</h3>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Team
                </button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {teams && teams.length > 0 ? (
                teams.map((team) => (
                  <div key={team._id} className="group">
                    <button
                      onClick={() => handleTeamSelect(team)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                        selectedTeam?._id === team._id ? 'bg-primary-50 border-r-2 border-primary-600' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{team.name}</div>
                          <div className="text-sm text-gray-500">{team.productName}</div>
                          {team.reputationBadge && (
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getTeamBadgeColor(team.reputationBadge.type)}`}>
                              {team.reputationBadge.type.replace('_', ' ')}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className="text-xs text-gray-400">
                            {team.memberCount} members
                          </span>
                          <Settings className="h-3 w-3 text-gray-400" />
                          {/* Delete button for OWNER only, just below members */}
                          {team.userRole === 'OWNER' && (
                            <button
                              onClick={e => { e.stopPropagation(); handleDeleteTeam(team); }}
                              title="Delete Project"
                              className="mt-1 text-error-600 hover:text-error-800 flex items-center text-xs"
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <div className="text-gray-400 mb-2">No teams yet</div>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary text-sm"
                  >
                    Create your first team
                  </button>
                </div>
              )}
            </div>

            {teams && teams.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full btn-secondary text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Team
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
} 