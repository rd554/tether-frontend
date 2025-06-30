import axios from 'axios';
// import { useAuth } from '@clerk/nextjs'; // Removed, not used

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('tether_token');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally, show a toast or error message here
    return Promise.reject(error);
  }
);

// API helper functions
export const apiClient = {
  // Teams
  getTeams: () => api.get('/api/teams'),
  getTeam: (id: string) => api.get(`/api/teams/${id}`),
  createTeam: (data: any) => api.post('/api/teams', data),
  updateTeam: (id: string, data: any) => api.put(`/api/teams/${id}`, data),
  deleteTeam: (id: string) => api.delete(`/api/teams/${id}`),
  getTeamStats: (id: string) => api.get(`/api/teams/${id}/stats`),
  addTeamMember: (teamId: string, data: any) => api.post(`/api/teams/${teamId}/members`, data),
  removeTeamMember: (teamId: string, userId: string) => api.delete(`/api/teams/${teamId}/members/${userId}`),

  // Users
  getUserProfile: () => api.get('/api/users/profile'),
  updateUserProfile: (data: any) => api.put('/api/users/profile', data),
  getUserStats: () => api.get('/api/users/stats'),
  searchUsers: (query: string) => api.get(`/api/users/search?q=${query}`),
  getLeaderboard: () => api.get('/api/users/leaderboard'),

  // Links
  getLinks: (params?: any) => api.get('/api/links', { params }),
  getLink: (id: string) => api.get(`/api/links/${id}`),
  createLink: (data: any) => api.post('/api/links', data),
  updateLink: (id: string, data: any) => api.put(`/api/links/${id}`, data),
  deleteLink: (id: string) => api.delete(`/api/links/${id}`),
  startMeeting: (id: string) => api.post(`/api/links/${id}/start`),
  completeMeeting: (id: string, data: any) => api.post(`/api/links/${id}/complete`, data),
  addOutcome: (id: string, data: any) => api.post(`/api/links/${id}/outcomes`, data),
  getTeamLinks: (teamId: string) => api.get(`/api/links/team/${teamId}`),

  // Nudges
  getNudges: (params?: any) => api.get('/api/nudges', { params }),
  getNudge: (id: string) => api.get(`/api/nudges/${id}`),
  sendNudge: (data: any) => api.post('/api/nudges', data),
  respondToNudge: (id: string, data: any) => api.post(`/api/nudges/${id}/respond`, data),
  deleteNudge: (id: string) => api.delete(`/api/nudges/${id}`),
  getTeamNudges: (teamId: string) => api.get(`/api/nudges/team/${teamId}`),

  // Dashboard
  getDashboardOverview: () => api.get('/api/dashboard/overview'),
  getTeamDashboard: (teamId: string) => api.get(`/api/dashboard/team/${teamId}`),
  getCXODashboard: () => api.get('/api/dashboard/cxo'),
  getAnalytics: (params?: any) => api.get('/api/dashboard/analytics', { params }),

  // Onboarding
  getUserMe: () => api.get('/api/proxy/users/me'),
  markUserOnboarded: (token: string) => api.put('/api/users/onboarded', {}, { headers: { Authorization: `Bearer ${token}` } }),
};

export type ApiClientType = typeof apiClient;

export { api }; 