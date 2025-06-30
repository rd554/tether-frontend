'use client';

import React from 'react';
import { Users, TrendingUp, Settings, Crown, User } from 'lucide-react';

interface TeamCardProps {
  team: any;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function TeamCard({ team, isSelected, onSelect }: TeamCardProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="h-4 w-4 text-warning-600" />;
      case 'ADMIN':
        return <Settings className="h-4 w-4 text-primary-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-warning-100 text-warning-800';
      case 'ADMIN':
        return 'bg-primary-100 text-primary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBadgeColor = (badge: string) => {
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

  return (
    <div 
      className={`bg-white border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-primary-500 shadow-lg ring-2 ring-primary-100' 
          : 'border-gray-200 hover:shadow-medium hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{team.name}</h3>
          <p className="text-sm text-gray-600">{team.productName}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(team.userRole)}`}>
            {getRoleIcon(team.userRole)}
            <span className="ml-1">{team.userRole}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {team.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{team.description}</p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{team.memberCount}</div>
          <div className="text-xs text-gray-500">Members</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{team.stats?.totalLinks || 0}</div>
          <div className="text-xs text-gray-500">Links</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Response Rate</span>
          <span className="font-medium text-gray-900">{team.stats?.responseRate || 0}%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Avg Response Time</span>
          <span className="font-medium text-gray-900">{team.stats?.averageResponseTime || 0}h</span>
        </div>
      </div>

      {/* Reputation Badge */}
      {team.reputationBadge && (
        <div className="mb-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(team.reputationBadge.type)}`}>
            <TrendingUp className="h-3 w-3 mr-1" />
            {team.reputationBadge.type.replace('_', ' ')}
          </div>
          <p className="text-xs text-gray-500 mt-1">{team.reputationBadge.description}</p>
        </div>
      )}

      {/* Product Stage */}
      {team.productStage && (
        <div className="mb-4">
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {team.productStage}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Users className="h-4 w-4" />
          <span>{team.memberCount} members</span>
        </div>
        
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View Details
        </button>
      </div>
    </div>
  );
} 