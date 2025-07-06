'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateTeam } from '@/hooks/useTeams';
import { apiClient } from '@/lib/api';
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

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
  const currentUser = typeof window !== 'undefined' ? getCurrentTestUser() : null;
  const [pmName, setPmName] = useState(currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() : '');
  const [pmEmail, setPmEmail] = useState(currentUser ? currentUser.email || '' : '');
  const [formData, setFormData] = useState({
    name: '',
    productName: '',
    description: ''
  });
  const [teammates, setTeammates] = useState([
    { name: '', email: '', role: '', department: '' }
  ]);
  const [teammateError, setTeammateError] = useState('');

  const createTeam = useCreateTeam();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeammateError('');
    try {
      // Update PM's global profile with new name and email (required)
      const [firstName, ...rest] = pmName.trim().split(' ');
      const lastName = rest.length > 0 ? rest.join(' ') : 'PM';
      await apiClient.updateUserProfile({ firstName, lastName, role: 'PM' });
      // Also update localStorage for immediate UI consistency
      if (currentUser) {
        const updatedUser = { ...currentUser, firstName, lastName, email: pmEmail, role: 'PM' };
        localStorage.setItem('tetherUser', JSON.stringify(updatedUser));
      }
      // Ensure name is set for backend compatibility
      const payload = { ...formData, name: formData.productName };
      // Create team (without productStage)
      const team = await createTeam.mutateAsync(payload);
      // Add teammates
      for (const tm of teammates) {
        if (tm.email && tm.department) {
          try {
            await apiClient.addTeamMember(team._id, {
              email: tm.email,
              name: tm.name,
              department: tm.department,
              designation: tm.role // designation is stored in tm.role input
            });
          } catch (err) {
            setTeammateError(`Failed to add teammate: ${tm.email}`);
          }
        }
      }
      setFormData({ name: '', productName: '', description: '' });
      setTeammates([{ name: '', email: '', role: '', department: '' }]);
      onClose();
    } catch (error) {
      console.error('Error creating team:', error instanceof Error ? error.message : String(error));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTeammateChange = (idx: number, field: string, value: string) => {
    setTeammates(prev => prev.map((tm, i) => i === idx ? { ...tm, [field]: value } : tm));
  };

  const addTeammate = () => setTeammates([...teammates, { name: '', email: '', role: '', department: '' }]);
  const removeTeammate = (idx: number) => setTeammates(teammates.filter((_, i) => i !== idx));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create New Team</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* PM Rename Section */}
            <div>
              <label htmlFor="pmName" className="block text-sm font-medium text-gray-700 mb-1">
                Rename PM (You) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="pmName"
                name="pmName"
                value={pmName}
                onChange={e => setPmName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your name as PM"
              />
            </div>
            {/* PM Email Section */}
            <div>
              <label htmlFor="pmEmail" className="block text-sm font-medium text-gray-700 mb-1">
                PM Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="pmEmail"
                name="pmEmail"
                value={pmEmail}
                onChange={e => setPmEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your email as PM"
              />
            </div>

            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Tether Mobile App"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Brief description of the project's purpose..."
              />
            </div>

            {/* Teammates Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Teammates</label>
              {teammates.map((tm, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="input-field flex-1"
                    value={tm.name}
                    onChange={(e) => handleTeammateChange(idx, 'name', e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="input-field flex-1"
                    value={tm.email}
                    onChange={(e) => handleTeammateChange(idx, 'email', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Designation"
                    className="input-field flex-1"
                    value={tm.role}
                    onChange={(e) => handleTeammateChange(idx, 'role', e.target.value)}
                  />
                  <select
                    className="input-field flex-1"
                    value={tm.department || ''}
                    onChange={(e) => handleTeammateChange(idx, 'department', e.target.value)}
                  >
                    <option value="" disabled>Select Department</option>
                    <option value="PM">PM</option>
                    <option value="DEV">DEV</option>
                    <option value="DESIGN">DESIGN</option>
                    <option value="LEGAL">LEGAL</option>
                    <option value="SECURITY">SECURITY</option>
                    <option value="BIZ_OPS">BIZ_OPS</option>
                    <option value="STAKEHOLDER">STAKEHOLDER</option>
                  </select>
                  {teammates.length > 1 && (
                    <button type="button" onClick={() => removeTeammate(idx)} className="btn-error px-2 py-1">&times;</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addTeammate} className="btn-secondary mt-2">+ Add Teammate</button>
              {teammateError && <div className="text-error-600 text-sm mt-2">{teammateError}</div>}
            </div>

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
                disabled={createTeam.isLoading || !formData.productName}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createTeam.isLoading ? 'Creating...' : 'Create Team'}
              </button>
            </div>
          </form>

          {!!createTeam.error && (
            <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-sm text-error-700">
                Error creating team. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}