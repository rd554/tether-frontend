// User Roles
export const USER_ROLES = {
  PM: 'PM',
  DEV: 'DEV',
  DESIGN: 'DESIGN',
  LEGAL: 'LEGAL',
  SECURITY: 'SECURITY',
  BIZ_OPS: 'BIZ_OPS',
  CXO: 'CXO',
  STAKEHOLDER: 'STAKEHOLDER'
};

// Team Member Roles
export const TEAM_ROLES = {
  OWNER: 'OWNER',
  MEMBER: 'MEMBER',
  VIEWER: 'VIEWER'
};

// Nudge Types
export const NUDGE_TYPES = {
  QUICK_SYNC: 'QUICK_SYNC',
  POST_LUNCH: 'POST_LUNCH',
  TOMORROW: 'TOMORROW',
  URGENT: 'URGENT',
  WEEKLY_CHECK: 'WEEKLY_CHECK'
};

// Nudge Responses
export const NUDGE_RESPONSES = {
  ACCEPT: 'ACCEPT',
  DECLINE: 'DECLINE',
  RESCHEDULE: 'RESCHEDULE',
  PENDING: 'PENDING'
};

// Nudge Status
export const NUDGE_STATUS = {
  SENT: 'SENT',
  RESPONDED: 'RESPONDED',
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED'
};

// Link Status
export const LINK_STATUS = {
  PENDING: 'PENDING',
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW'
};

// Meeting Types
export const MEETING_TYPES = {
  QUICK_SYNC: 'QUICK_SYNC',
  REVIEW: 'REVIEW',
  PLANNING: 'PLANNING',
  DECISION: 'DECISION',
  BRAINSTORM: 'BRAINSTORM',
  STATUS_UPDATE: 'STATUS_UPDATE'
};

// Outcome Types
export const OUTCOME_TYPES = {
  DECISION: 'DECISION',
  ACTION_ITEM: 'ACTION_ITEM',
  BLOCKER: 'BLOCKER',
  INSIGHT: 'INSIGHT',
  NEXT_STEPS: 'NEXT_STEPS'
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

// Reputation Badges
export const REPUTATION_BADGES = {
  SUPER_RESPONDER: 'SUPER_RESPONDER',
  POWER_CONNECTOR: 'POWER_CONNECTOR',
  LINK_HERO: 'LINK_HERO',
  TEAM_MAGNET: 'TEAM_MAGNET',
  GHOST_MODE: 'GHOST_MODE',
  SILENT_WITNESS: 'SILENT_WITNESS'
};

// Team Reputation Badges
export const TEAM_REPUTATION_BADGES = {
  SUPER_RESPONDERS: 'SUPER_RESPONDERS',
  SLOW_STEADY: 'SLOW_STEADY',
  GHOST_MODE: 'GHOST_MODE',
  CLEAR_COMMUNICATORS: 'CLEAR_COMMUNICATORS'
};

// API Endpoints
export const API_ENDPOINTS = {
  // Teams
  TEAMS: '/api/teams',
  TEAM_DETAILS: (id) => `/api/teams/${id}`,
  TEAM_MEMBERS: (id) => `/api/teams/${id}/members`,
  TEAM_STATS: (id) => `/api/teams/${id}/stats`,
  
  // Users
  USERS: '/api/users',
  USER_PROFILE: '/api/users/profile',
  USER_STATS: '/api/users/stats',
  USER_SEARCH: '/api/users/search',
  LEADERBOARD: '/api/users/leaderboard',
  
  // Links
  LINKS: '/api/links',
  LINK_DETAILS: (id) => `/api/links/${id}`,
  TEAM_LINKS: (teamId) => `/api/links/team/${teamId}`,
  
  // Nudges
  NUDGES: '/api/nudges',
  NUDGE_DETAILS: (id) => `/api/nudges/${id}`,
  NUDGE_RESPOND: (id) => `/api/nudges/${id}/respond`,
  TEAM_NUDGES: (teamId) => `/api/nudges/team/${teamId}`,
  
  // Dashboard
  DASHBOARD_OVERVIEW: '/api/dashboard/overview',
  DASHBOARD_TEAM: (teamId) => `/api/dashboard/team/${teamId}`,
  DASHBOARD_CXO: '/api/dashboard/cxo',
  DASHBOARD_ANALYTICS: '/api/dashboard/analytics'
};

// UI Constants
export const UI_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Timeouts
  TOAST_DURATION: 4000,
  LOADING_TIMEOUT: 3000,
  
  // Animation
  FADE_DURATION: 300,
  SLIDE_DURATION: 200,
  
  // Colors
  COLORS: {
    PRIMARY: '#0ea5e9',
    SUCCESS: '#22c55e',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#3b82f6'
  }
};

// Validation Rules
export const VALIDATION_RULES = {
  // Team
  TEAM_NAME_MIN: 3,
  TEAM_NAME_MAX: 100,
  TEAM_DESCRIPTION_MAX: 500,
  
  // Nudge
  NUDGE_MESSAGE_MAX: 500,
  
  // Link
  LINK_TITLE_MIN: 3,
  LINK_TITLE_MAX: 200,
  LINK_PURPOSE_MAX: 1000,
  
  // User
  USER_NAME_MIN: 2,
  USER_NAME_MAX: 50
};

// Default Settings
export const DEFAULT_SETTINGS = {
  NOTIFICATIONS: {
    email: true,
    push: true,
    inApp: true
  },
  TIMEZONE: 'UTC',
  LANGUAGE: 'en'
};

// Error Messages
export const ERROR_MESSAGES = {
  // Authentication
  UNAUTHORIZED: 'You must be logged in to perform this action',
  FORBIDDEN: 'You do not have permission to perform this action',
  
  // Validation
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: (field, min) => `${field} must be at least ${min} characters`,
  MAX_LENGTH: (field, max) => `${field} must be no more than ${max} characters`,
  
  // Network
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  SERVER_ERROR: 'Server error. Please try again later',
  
  // Business Logic
  TEAM_NOT_FOUND: 'Team not found',
  USER_NOT_FOUND: 'User not found',
  LINK_NOT_FOUND: 'Link not found',
  NUDGE_NOT_FOUND: 'Nudge not found',
  ALREADY_MEMBER: 'User is already a member of this team',
  NOT_TEAM_MEMBER: 'User is not a member of this team'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  TEAM_CREATED: 'Team created successfully',
  TEAM_UPDATED: 'Team updated successfully',
  MEMBER_ADDED: 'Member added successfully',
  MEMBER_REMOVED: 'Member removed successfully',
  NUDGE_SENT: 'Nudge sent successfully',
  NUDGE_RESPONDED: 'Response recorded successfully',
  LINK_CREATED: 'Link created successfully',
  LINK_UPDATED: 'Link updated successfully',
  PROFILE_UPDATED: 'Profile updated successfully'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  SELECTED_TEAM: 'tether_selected_team',
  USER_PREFERENCES: 'tether_user_preferences',
  THEME: 'tether_theme',
  SIDEBAR_COLLAPSED: 'tether_sidebar_collapsed'
};

// Feature Flags
export const FEATURE_FLAGS = {
  AI_SUMMARIES: true,
  GAMIFICATION: true,
  ADVANCED_ANALYTICS: true,
  TEAM_TEMPLATES: false,
  INTEGRATIONS: false
};

export default {
  USER_ROLES,
  TEAM_ROLES,
  NUDGE_TYPES,
  NUDGE_RESPONSES,
  NUDGE_STATUS,
  LINK_STATUS,
  MEETING_TYPES,
  OUTCOME_TYPES,
  PRIORITY_LEVELS,
  REPUTATION_BADGES,
  TEAM_REPUTATION_BADGES,
  API_ENDPOINTS,
  UI_CONSTANTS,
  VALIDATION_RULES,
  DEFAULT_SETTINGS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  FEATURE_FLAGS
}; 