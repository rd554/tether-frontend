'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Link as LinkIcon, 
  TrendingUp, 
  Plus,
  Bell,
  Search,
  Filter,
  LogOut
} from 'lucide-react';
import TeamSelector from '@/components/TeamSelector';
import LinkCard from '@/components/LinkCard';
import StatsCard from '@/components/StatsCard';
import QuickActions from '@/components/QuickActions';
import LinkCanvasModal from '@/components/LinkCanvasModal';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useTeamStore } from '@/stores/teamStore';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import LinkDetailsOverlay from '@/components/LinkDetailsOverlay';
import CreateLinkModal from '@/components/CreateLinkModal';
import { useQueryClient } from 'react-query';

// ===== DUMMY CANVAS DATA BLOCK (for demo/testing only) =====
// Set this flag to true to use dummy data in the Link Canvas
const DUMMY_CANVAS_DATA = true;

// Dummy teams
const dummyTeams = [
  { _id: 'team1', name: 'Design', members: ['UI Dev', 'UX Lead'] },
  { _id: 'team2', name: 'Security', members: ['Sec Eng', 'Sec Lead'] },
  { _id: 'team3', name: 'Legal', members: ['Lawyer', 'Compliance'] },
  { _id: 'team4', name: 'Devs', members: ['Backend', 'Frontend'] },
  { _id: 'team5', name: 'Biz', members: ['BizDev', 'Sales'] },
  { _id: 'team6', name: 'CXO', members: ['CEO', 'COO'] },
  { _id: 'team7', name: 'PM', members: ['Ravi (PM)'] },
];
// Dummy users
const dummyUsers = [
  { _id: 'user1', firstName: 'Ravi', lastName: 'PM' },
  { _id: 'user2', firstName: 'Alice', lastName: 'Designer' },
  { _id: 'user3', firstName: 'Bob', lastName: 'Engineer' },
];
// Dummy links (edges) - source/target match node IDs
const dummyLinks = [
  { _id: 'link1', title: 'Design Sync', status: 'active', lastNudge: '2 days ago', source: 'team-team1', target: 'user-user1' },
  { _id: 'link2', title: 'Security Review', status: 'awaiting_response', lastNudge: '1 day ago', source: 'team-team2', target: 'user-user2' },
  { _id: 'link3', title: 'Legal Approval', status: 'completed', lastNudge: '5 days ago', source: 'team-team3', target: 'user-user3' },
  { _id: 'link4', title: 'Dev Handoff', status: 'ignored', lastNudge: '3 days ago', source: 'team-team4', target: 'team-team5' },
  { _id: 'link5', title: 'Biz Strategy', status: 'active', lastNudge: 'today', source: 'team-team5', target: 'team-team6' },
  { _id: 'link6', title: 'CXO Update', status: 'completed', lastNudge: 'yesterday', source: 'team-team6', target: 'team-team7' },
];
// ===== END DUMMY CANVAS DATA BLOCK =====

// ===== DEBUG: Render Link Canvas directly on dashboard (not in modal) =====
// const DEBUG_CANVAS_ON_PAGE = true;

export default function DashboardPage() {
  const { selectedTeam, setSelectedTeam, clearAll } = useTeamStore();
  const { data, isLoading, error, refetch } = useDashboardData();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showCanvasModal, setShowCanvasModal] = useState(false);
  const [recentLinks, setRecentLinks] = useState<any[]>(data?.recentLinks || []);

  // Simple authentication check
  useEffect(() => {
    if (!localStorage.getItem('tether_token')) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    setRecentLinks(data?.recentLinks || []);
  }, [data?.recentLinks]);

  // Add click-away handler for user menu
  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(e: MouseEvent) {
      const btn = document.getElementById('user-menu-button');
      if (btn && !btn.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  // Simple sign out function
  const handleSignOut = () => {
    try {
      console.log('Sign out button clicked!');
      localStorage.clear();
      sessionStorage.clear();
      queryClient.clear();
      clearAll();
      console.log('All storage cleared, redirecting to home...');
      window.location.href = '/';
    } catch (err) {
      console.error('Error during sign out:', err);
      alert('Sign out error: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{String(error)}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredLinks = recentLinks.filter(link => 
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredNudges = data?.pendingNudges?.filter(nudge => 
    nudge.message.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Group links by date
  const groupedLinks = filteredLinks.reduce((acc: Record<string, any[]>, link) => {
    const date = link.scheduledAt ? format(new Date(link.scheduledAt), 'yyyy-MM-dd') : 'No Date';
    if (!acc[date]) acc[date] = [];
    acc[date].push(link);
    return acc;
  }, {});
  const sortedDates = Object.keys(groupedLinks).sort((a, b) => b.localeCompare(a));

  // When a new link is created, prepend it to recentLinks
  const handleLinkCreated = (newLink: any) => {
    setRecentLinks((prev) => [newLink, ...prev]);
  };

  // Combine recentLinks and fetched links, deduplicating by _id
  const allLinks = [
    ...recentLinks,
    ...data?.recentLinks.filter((l: any) => !recentLinks.some((r: any) => r._id === l._id)),
  ];

  // Group links by date
  const groupLinksByDate = (links: any[]) => {
    return links.reduce((acc: Record<string, any[]>, link) => {
      const date = link.scheduledAt ? format(new Date(link.scheduledAt), 'yyyy-MM-dd') : 'No Date';
      if (!acc[date]) acc[date] = [];
      acc[date].push(link);
      return acc;
    }, {});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 flex items-center">
                <img src="/tether_logo.png" alt="Tether Logo" className="h-12 w-12 mr-px align-middle" />
                <h1 className="text-3xl font-bold text-primary-600 align-middle">Tether</h1>
              </div>
              <TeamSelector />
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search links, nudges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              
              {/* User Menu */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  id="user-menu-button"
                >
                  {data?.user?.avatar ? (
                    <img
                      src={data.user.avatar}
                      alt={data.user.name || data.user.email || 'User'}
                      className="h-8 w-8 rounded-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                      {data?.user?.name
                        ? data.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                        : data?.user?.email
                          ? data.user.email[0].toUpperCase()
                          : '?'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {data?.user?.name || data?.user?.email || 'User'}
                  </span>
                </button>
                {userMenuOpen && (
                  <div className="absolute left-0 right-auto mt-2 min-w-[8rem] bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 flex flex-col items-stretch">
                    {/* Caret/arrow */}
                    <div className="absolute -top-2 left-4 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45 z-10"></div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, User! 👋
          </h2>
          <p className="text-gray-600">
            {selectedTeam ? `Working on ${selectedTeam.name}` : 'Select a team to get started'}
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <StatsCard
            title="Total Teams"
            value={data?.summary?.totalTeams || 0}
            icon={Users}
            color="primary"
            trend="+2 this week"
          />
          <StatsCard
            title="Active Links"
            value={data?.summary?.totalLinks || 0}
            icon={LinkIcon}
            color="success"
            trend="+5 today"
          />
          <StatsCard
            title="Response Rate"
            value={`${data?.summary?.responseRate || 0}%`}
            icon={TrendingUp}
            color="info"
            trend="+12% this month"
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <QuickActions />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Links</h3>
                <div className="flex space-x-2">
                  <button 
                    className="btn-secondary text-sm" 
                    onClick={() => setShowCanvasModal(true)}
                  >
                    🗺️ Link Canvas
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800 text-xs font-semibold align-middle">Beta</span>
                  </button>
                  <button className="btn-primary text-sm" onClick={() => setShowLinkModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Link
                  </button>
                </div>
              </div>
              {allLinks.length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(groupLinksByDate(allLinks)).map(([date, links]) => (
                    <div key={date}>
                      <div className="text-xs text-gray-500 font-semibold mb-2">
                        {date === 'No Date' ? 'Unscheduled' : format(new Date(date), 'EEE, MMM d, yyyy')}
                      </div>
                      <div className="space-y-4">
                        {(links as any[]).map((link) => (
                          <LinkCard key={link._id} link={link} onViewDetails={() => setSelectedLink(link)} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <LinkIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No links found</p>
                  <button className="btn-primary mt-4" onClick={() => setShowLinkModal(true)}>
                    Create your first link
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Team Performance (moved here, replaces Pending Nudges) */}
          {selectedTeam && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 mb-2">
                      {data?.summary?.responseRate || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Response Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success-600 mb-2">
                      {Number(data?.summary?.averageResponseTime || 0).toFixed(1)}h
                    </div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning-600 mb-2">
                      {data?.summary?.activeTeams || 0}
                    </div>
                    <div className="text-sm text-gray-600">Active Teams</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      {/* Link Details Overlay */}
      <LinkDetailsOverlay
        link={selectedLink}
        isOpen={!!selectedLink}
        onClose={() => setSelectedLink(null)}
      />

      <CreateLinkModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onSuccess={handleLinkCreated}
      />

      <LinkCanvasModal
        isOpen={showCanvasModal}
        onClose={() => setShowCanvasModal(false)}
      />
    </div>
  );
} 