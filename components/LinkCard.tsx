'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Users, MoreVertical, Clock, Calendar, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { apiClient } from '@/lib/api';

interface LinkCardProps {
  link: any;
  onEdit?: (link: any) => void;
  onDelete?: (link: any) => void;
  onViewDetails?: (link: any) => void;
}

// Fallback avatars array
const fallbackAvatars = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
  '/avatars/avatar6.png',
  '/avatars/avatar7.png',
  '/avatars/avatar8.png',
  '/avatars/avatar9.png',
  '/avatars/avatar10.png',
];

function getFallbackAvatar(user) {
  const key = user?._id || user?.email || user?.name || '';
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % fallbackAvatars.length;
  return fallbackAvatars[index];
}

function getInitials(name = '') {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
  return '?';
}

// Simple tooltip component
function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute z-20 left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap">
          {content}
        </span>
      )}
    </span>
  );
}

export default function LinkCard({ link, onEdit, onDelete, onViewDetails }: LinkCardProps) {
  // Debug: log participants data
  console.log('LinkCard participants:', link.participants);
  // Dropdown state and ref
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState(link.status);
  const [isUpdating, setIsUpdating] = useState(false);

  // Only PMs can change status
  let isPM = false;
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('tetherUser');
    try {
      const user = userStr ? JSON.parse(userStr) : null;
      isPM = user && user.role === 'PM';
    } catch {}
  }

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-200 text-yellow-900 border-2 border-yellow-400 shadow-md';
      case 'COMPLETE':
        return 'bg-green-200 text-green-900 border-2 border-green-500 shadow-md';
      case 'DELAYED':
        return 'bg-red-200 text-red-900 border-2 border-red-500 shadow-md';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300 shadow-sm';
    }
  };

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case 'QUICK_SYNC':
        return 'bg-blue-100 text-blue-800';
      case 'REVIEW':
        return 'bg-purple-100 text-purple-800';
      case 'PLANNING':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    setStatus(newStatus); // Optimistic update
    try {
      await apiClient.updateLink(link._id, { status: newStatus });
    } catch (err) {
      alert('Failed to update status');
      setStatus(link.status); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-medium transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{link.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{link.purpose}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(status)}`}>
            {status}
          </div>
          {isPM && (
            <select
              className="ml-2 px-2 py-1 rounded text-xs border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={status}
              onChange={handleStatusChange}
              disabled={isUpdating}
              style={{ minWidth: 90 }}
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETE">Complete</option>
              <option value="DELAYED">Delayed</option>
            </select>
          )}
          <div className="relative" ref={menuRef}>
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete && onDelete(link);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMeetingTypeColor(link.meetingType)}`}>
            {link.meetingType}
          </div>
          {link.priority && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium`}>
              {link.priority}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      {/* Participants */}
      <div className="flex items-center justify-between mb-3">
        <Tooltip
          content={
            link.participants && link.participants.length > 0
              ? link.participants.map((p: any) => {
                  const user = p.userId;
                  const name = user.name || user.email || 'Unknown';
                  // Show PM as (PM), others as (DEPARTMENT)
                  let label = '';
                  if (p.role === 'INITIATOR' || (user.department === 'PM')) {
                    label = `${name} (PM)`;
                  } else {
                    label = `${name} (${user.department || p.role || 'PARTICIPANT'})`;
                  }
                  return label;
                }).join(', ')
              : 'No participants'
          }
        >
          <div className="flex items-center space-x-2 cursor-pointer">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {link.participants?.length || 0} participants
            </span>
          </div>
        </Tooltip>
        {link.scheduledAt && (
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{formatDistanceToNow(new Date(link.scheduledAt), { addSuffix: true })}</span>
          </div>
        )}
      </div>

      {/* Participant Avatars with Initials Fallback */}
      {link.participants && link.participants.length > 0 && (
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex -space-x-2">
            {link.participants.slice(0, 3).map((participant: any, index: number) => {
              const user = participant.userId;
              const avatarSrc = user.avatar || getFallbackAvatar(user);
              return user.avatar || avatarSrc ? (
                <img
                  key={user._id || index}
                  src={avatarSrc}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover border-2 border-white -ml-2"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div
                  key={user._id || index}
                  className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 border-2 border-white -ml-2"
                >
                  {getInitials(user.name)}
                </div>
              );
            })}
          </div>
          {link.participants.length > 3 && (
            <span className="text-xs text-gray-500">
              +{link.participants.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* AI Summary */}
      {link.aiSummary?.content && (
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-700">{link.aiSummary.content}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100 mt-2">
        {onEdit && (
          <button
            onClick={() => onEdit(link)}
            className="flex items-center px-3 py-1 text-sm text-primary-600 hover:text-primary-800 rounded transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(link)}
            className="flex items-center px-3 py-1 text-sm text-error-600 hover:text-error-800 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </button>
        )}
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(link)}
            className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800 rounded transition-colors"
            title="View Details"
          >
            Details
          </button>
        )}
      </div>
    </div>
  );
}