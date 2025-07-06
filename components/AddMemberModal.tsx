import React, { useState } from 'react';
import { X } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useTeams } from '@/hooks/useTeams';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemberAdded?: () => void;
}

export default function AddMemberModal({ isOpen, onClose, onMemberAdded }: AddMemberModalProps) {
  const { teams = [], loading: teamsLoading } = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [teammates, setTeammates] = useState([
    { name: '', email: '', designation: '', department: '' }
  ]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTeammateChange = (idx: number, field: string, value: string) => {
    setTeammates(prev => prev.map((tm, i) => i === idx ? { ...tm, [field]: value } : tm));
  };

  const addTeammate = () => setTeammates([...teammates, { name: '', email: '', designation: '', department: '' }]);
  const removeTeammate = (idx: number) => setTeammates(teammates.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!selectedTeamId) {
      setError('Please select a team.');
      return;
    }
    setLoading(true);
    try {
      console.log('DEBUG: teammates array:', teammates);
      for (const tm of teammates) {
        if (tm.email && tm.department) {
          const payload: any = {
            email: tm.email,
            name: tm.name,
            department: tm.department, // send department as required by backend
            designation: tm.designation // send designation as free text
          };
          console.log('DEBUG: Adding member payload:', payload);
          await apiClient.addTeamMember(selectedTeamId, payload);
        }
      }
      setSuccess(true);
      setTeammates([{ name: '', email: '', designation: '', department: '' }]);
      if (onMemberAdded) onMemberAdded();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to add member(s)');
    } finally {
      setLoading(false);
    }
  };

  const allDepartmentsSelected = teammates.every(tm => tm.department && tm.department !== '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add Team Members</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
                Team
              </label>
              <select
                id="team"
                name="team"
                value={selectedTeamId}
                onChange={e => setSelectedTeamId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="" disabled>Select Team</option>
                {teams.map((team: any) => (
                  <option key={team._id} value={team._id}>{team.name || team.productName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Teammates</label>
              {teammates.map((tm, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <input
                    type="text"
                    placeholder="Name"
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
                    value={tm.designation}
                    onChange={(e) => handleTeammateChange(idx, 'designation', e.target.value)}
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
            </div>
            {error && (
              <div className="p-2 bg-error-50 border border-error-200 rounded text-error-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-2 bg-success-50 border border-success-200 rounded text-success-700 text-sm">
                Member(s) added successfully!
              </div>
            )}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedTeamId || !allDepartmentsSelected}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Adding...' : 'Add Member(s)'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 