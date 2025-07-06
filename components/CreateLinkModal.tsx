'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { useTeamStore } from '@/stores/teamStore';
import { MEETING_TYPES } from '@/shared/constants';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { apiClient } from '@/lib/api';
import Select from 'react-select';

interface CreateLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newLink: any) => void;
}

// Helper to get current test user from localStorage
function getCurrentTestUser() {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('tetherUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {}
    }
  }
  return null;
}

export default function CreateLinkModal({ isOpen, onClose, onSuccess }: CreateLinkModalProps) {
  const { selectedTeam } = useTeamStore();
  const { data: members = [], refetch } = useTeamMembers(selectedTeam?._id);
  const currentUser = typeof window !== 'undefined' ? getCurrentTestUser() : null;

  const [formData, setFormData] = useState({
    title: '',
    purpose: '',
    meetingType: MEETING_TYPES.QUICK_SYNC,
    priority: 'MEDIUM',
    scheduledAt: '',
    duration: 30,
    participants: [] as string[]
  });

  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  // Auto-select PM as participant on open
  useEffect(() => {
    if (isOpen && currentUser && members.length > 0) {
      const pmMember = members.find((m: any) => m.userId && (m.userId._id === currentUser._id || m.userId.email === currentUser.email));
      if (pmMember) {
        setSelectedParticipants((prev) => prev.includes(pmMember.userId._id) ? prev : [pmMember.userId._id, ...prev]);
      }
    }
  }, [isOpen, currentUser, members]);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  // Map members to react-select options with fallback for missing names
  const memberOptions = members.map((member: any) => {
    const user = member.userId;
    let label = '';
    if (currentUser && (user._id === currentUser._id || user.email === currentUser.email)) {
      // Always use currentUser's latest firstName/lastName for PM label
      label = `${currentUser.firstName || ''} ${currentUser.lastName || ''} (You, PM)`;
    } else if (user.name && user.email) {
      label = `${user.name} (${user.email})`;
    } else if (user.name) {
      label = user.name;
    } else if (user.email) {
      label = user.email;
    } else {
      label = user._id || user;
    }
    return {
      value: user._id || user,
      label,
      isPM: currentUser && (user._id === currentUser._id || user.email === currentUser.email)
    };
  });

  // For react-select
  const selectedOptions = memberOptions.filter(opt => selectedParticipants.includes(opt.value));

  const handleParticipantsChange = (selected: any) => {
    // Always keep PM in the list
    if (currentUser) {
      const pmOption = memberOptions.find(opt => opt.isPM);
      const pmId = pmOption?.value;
      const newIds = selected ? selected.map((opt: any) => opt.value) : [];
      if (pmId && !newIds.includes(pmId)) {
        setSelectedParticipants([pmId, ...newIds]);
      } else {
        setSelectedParticipants(newIds);
      }
    } else {
      setSelectedParticipants(selected ? selected.map((opt: any) => opt.value) : []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;
    if (selectedParticipants.length === 0) {
      alert('Please select at least one participant.');
      return;
    }
    try {
      // Remove duration from payload
      const { duration, ...rest } = formData;
      const response = await apiClient.createLink({
        ...rest,
        participants: selectedParticipants,
        teamId: selectedTeam._id
      });
      const newLink = response.data.data;
      setFormData({
        title: '',
        purpose: '',
        meetingType: MEETING_TYPES.QUICK_SYNC,
        priority: 'MEDIUM',
        scheduledAt: '',
        duration: 30,
        participants: []
      });
      setSelectedParticipants([]);
      onClose();
      // Call onSuccess callback to update dashboard instantly
      if (onSuccess) {
        onSuccess(newLink);
      }
    } catch (error) {
      console.error('Error creating link:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getMeetingTypeInfo = (type: string) => {
    switch (type) {
      case MEETING_TYPES.QUICK_SYNC:
        return { color: 'text-blue-600', description: 'Quick 15-30 minute sync' };
      case MEETING_TYPES.REVIEW:
        return { color: 'text-purple-600', description: 'Code or design review' };
      case MEETING_TYPES.PLANNING:
        return { color: 'text-green-600', description: 'Sprint or project planning' };
      case MEETING_TYPES.DECISION:
        return { color: 'text-orange-600', description: 'Important decision making' };
      case MEETING_TYPES.BRAINSTORM:
        return { color: 'text-pink-600', description: 'Creative brainstorming session' };
      case MEETING_TYPES.STATUS_UPDATE:
        return { color: 'text-gray-600', description: 'Regular status update' };
      default:
        return { color: 'text-gray-600', description: '' };
    }
  };

  if (!isOpen) return null;

  // Only allow PMs to create a link
  if (currentUser && currentUser.role !== 'PM') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create Link</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {!selectedTeam && (
            <div className="mb-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-warning-600" />
                <span className="text-sm text-warning-800">
                  Please select a team first
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Sprint Planning Meeting"
              />
            </div>

            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                Purpose *
              </label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="What is the purpose of this meeting?"
              />
            </div>

            <div>
              <label htmlFor="meetingType" className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Type
              </label>
              <select
                id="meetingType"
                name="meetingType"
                value={formData.meetingType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={MEETING_TYPES.QUICK_SYNC}>Quick Sync</option>
                <option value={MEETING_TYPES.REVIEW}>Review</option>
                <option value={MEETING_TYPES.PLANNING}>Planning</option>
                <option value={MEETING_TYPES.DECISION}>Decision</option>
                <option value={MEETING_TYPES.BRAINSTORM}>Brainstorm</option>
                <option value={MEETING_TYPES.STATUS_UPDATE}>Status Update</option>
              </select>
              {formData.meetingType && (
                <p className={`mt-1 text-xs ${getMeetingTypeInfo(formData.meetingType).color}`}>
                  {getMeetingTypeInfo(formData.meetingType).description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Time (Optional)
              </label>
              <input
                type="datetime-local"
                id="scheduledAt"
                name="scheduledAt"
                value={formData.scheduledAt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Participants Multi-Select */}
            {selectedTeam && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
                <Select
                  isMulti
                  options={memberOptions}
                  value={selectedOptions}
                  onChange={handleParticipantsChange}
                  classNamePrefix="react-select"
                  placeholder="Select participants..."
                  isOptionDisabled={option => option.isPM}
                />
              </div>
            )}

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.title || !formData.purpose || !selectedTeam}
                className="flex-1 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}