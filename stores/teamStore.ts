import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Team {
  _id: string;
  name: string;
  productName: string;
  description?: string;
  memberCount: number;
  stats: {
    totalLinks: number;
    totalNudges: number;
    averageResponseTime: number;
    responseRate: number;
  };
  reputationBadge?: {
    type: string;
    description: string;
  };
  userRole: string;
}

interface TeamStore {
  selectedTeam: Team | null;
  teams: Team[];
  setSelectedTeam: (team: Team | null) => void;
  setTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  removeTeam: (teamId: string) => void;
  clearSelectedTeamIfInvalid: () => void;
  clearAll: () => void;
}

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      selectedTeam: null,
      teams: [],
      
      setSelectedTeam: (team) => set({ selectedTeam: team }),
      
      setTeams: (teams) => set({ teams }),
      
      addTeam: (team) => set((state) => ({
        teams: [...state.teams, team]
      })),
      
      updateTeam: (teamId, updates) => set((state) => ({
        teams: state.teams.map(team => 
          team._id === teamId ? { ...team, ...updates } : team
        ),
        selectedTeam: state.selectedTeam?._id === teamId 
          ? { ...state.selectedTeam, ...updates }
          : state.selectedTeam
      })),
      
      removeTeam: (teamId) => set((state) => ({
        teams: state.teams.filter(team => team._id !== teamId),
        selectedTeam: state.selectedTeam?._id === teamId 
          ? null 
          : state.selectedTeam
      })),

      clearSelectedTeamIfInvalid: () => set((state) => ({
        selectedTeam:
          state.selectedTeam &&
          (!state.selectedTeam._id || !state.teams.find(t => t._id === state.selectedTeam!._id))
            ? null
            : state.selectedTeam
      })),

      clearAll: () => set({
        selectedTeam: null,
        teams: []
      }),
    }),
    {
      name: 'tether-team-store',
      partialize: (state) => ({ 
        selectedTeam: state.selectedTeam,
        teams: state.teams 
      }),
    }
  )
); 