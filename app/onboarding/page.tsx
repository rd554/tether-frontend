"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { apiClient } from '@/lib/api';

interface Teammate {
  name: string;
  email: string;
  designation: string;
  team: string;
}

export default function OnboardingPage() {
  const [teamName, setTeamName] = useState("");
  const [teammates, setTeammates] = useState<Teammate[]>([{ name: "", email: "", designation: "", team: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [description, setDescription] = useState("");
  const [productVersion, setProductVersion] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [settings, setSettings] = useState({ visibility: 'PRIVATE', allowMemberInvites: true, requireApproval: false });
  const router = useRouter();
  // Remove useSession from NextAuth
  // Get token from localStorage (or global state if you use Zustand/Context)
  const token = typeof window !== 'undefined' ? localStorage.getItem('tether_token') || '' : '';

  const handleTeammateChange = (idx: number, field: keyof Teammate, value: string) => {
    setTeammates((prev) => prev.map((tm, i) => i === idx ? { ...tm, [field]: value } : tm));
  };

  const addTeammate = () => setTeammates([...teammates, { name: "", email: "", designation: "", team: "" }]);
  const removeTeammate = (idx: number) => setTeammates(teammates.filter((_, i) => i !== idx));

  const validateForm = () => {
    if (!teamName.trim()) {
      setValidationError("Product/Team Name is required.");
      return false;
    }
    for (let i = 0; i < teammates.length; i++) {
      const tm = teammates[i];
      if (!tm.name.trim() || !tm.email.trim() || !tm.designation.trim() || !tm.team.trim()) {
        setValidationError(`All fields are required for teammate #${i + 1}.`);
        return false;
      }
      // Simple email regex
      if (!/^\S+@\S+\.\S+$/.test(tm.email)) {
        setValidationError(`Invalid email for teammate #${i + 1}.`);
        return false;
      }
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      // Build payload with only non-empty optional fields
      const payload: any = {
        name: teamName,
        productName: teamName,
        settings,
      };
      if (description.trim()) payload.description = description;
      if (productVersion.trim()) payload.productVersion = productVersion;
      if (tags.length > 0) payload.tags = tags;

      // Create the team (only allowed fields)
      const createRes = await api.post(
        process.env.NEXT_PUBLIC_API_URL + '/api/teams',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const teamId = createRes.data.data._id;
      // Add teammates (add all teammates as members; backend will handle owner duplication)
      for (const tm of teammates) {
        if (tm.email) {
          await api.post(
            process.env.NEXT_PUBLIC_API_URL + `/api/teams/${teamId}/members`,
            { email: tm.email, role: tm.designation },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
      // Mark user as onboarded
      await apiClient.markUserOnboarded(token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create team. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Your Product Team</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Product/Team Name</label>
            <input
              type="text"
              className="input-field"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Add Teammates</label>
            {teammates.map((tm, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Name"
                  className="input-field flex-1"
                  value={tm.name}
                  onChange={(e) => handleTeammateChange(idx, "name", e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="input-field flex-1"
                  value={tm.email}
                  onChange={(e) => handleTeammateChange(idx, "email", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Designation"
                  className="input-field flex-[1.5]"
                  value={tm.designation}
                  onChange={(e) => handleTeammateChange(idx, "designation", e.target.value)}
                  required
                />
                <select
                  className="input-field flex-1"
                  value={tm.team}
                  onChange={(e) => handleTeammateChange(idx, "team", e.target.value)}
                  required
                >
                  <option value="" disabled>Select Department</option>
                  <option value="Product">Product</option>
                  <option value="Dev">Dev</option>
                  <option value="Design">Design</option>
                  <option value="Legal">Legal</option>
                  <option value="Security">Security</option>
                  <option value="Biz Ops">Biz Ops</option>
                  <option value="Stakeholder">Stakeholder</option>
                </select>
                {teammates.length > 1 && (
                  <button type="button" onClick={() => removeTeammate(idx)} className="btn-error px-2 py-1">&times;</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addTeammate} className="btn-secondary mt-2">+ Add Teammate</button>
          </div>
          {validationError && <div className="text-error-600 text-sm mb-2">{validationError}</div>}
          {error && <div className="text-error-600 text-sm mb-2">{error}</div>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Team & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
} 