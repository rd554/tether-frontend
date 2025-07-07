"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, Users, MessageSquare, Link as LinkIcon, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LoginModal from '../components/LoginModal';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  onboarded?: boolean;
  role?: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [tokenPresent, setTokenPresent] = useState(false);
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTokenPresent(!!localStorage.getItem('tether_token'));
    }
  }, []);

  // Remove handleGoogleSuccess and any Google login logic

  const handleSignOut = () => {
    try {
      console.log("Sign out button clicked");
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setTokenPresent(false);
      console.log("localStorage and sessionStorage cleared");
      window.location.reload();
      // If reload doesn't work, try redirect:
      // window.location.href = "/";
    } catch (err) {
      console.error("Error during sign out:", err);
      alert("Sign out error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img src="/tether_logo.png" alt="Tether Logo" className="h-12 w-12 mr-px align-middle" />
                <h1 className="text-3xl font-bold text-primary-600 align-middle">Tether</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!user ? (
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="bg-primary-600 text-white rounded-lg px-4 py-2 hover:bg-primary-700 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user?.firstName || user?.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Purpose-driven
              <span className="text-primary-600"> team coordination</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Replace chaotic Slack threads with structured nudges. Log every meaningful collaboration. 
              Give CXOs the bird's-eye view they need.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {user && (
                <button className="btn-primary text-lg px-8 py-3 flex items-center">
                  Start Coordinating
                </button>
              )}
              <div style={{ width: '100%', maxWidth: 600 }}>
                <div style={{ position: 'relative', boxSizing: 'content-box', maxHeight: '80vh', width: '100%', aspectRatio: '1.8274111675126903', padding: '40px 0 40px 0' }}>
                  <iframe src="https://app.supademo.com/embed/cmcsfqg1t0bv99st8soigyd1b?embed_v=2" loading="lazy" title="Tether Demo" allow="clipboard-write" frameBorder="0" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></iframe>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="card text-center"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Structured Nudges</h3>
              <p className="text-gray-600">
                Send respectful, traceable collaboration requests instead of chaotic messages.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card text-center"
            >
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="h-6 w-6 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Traceable Links</h3>
              <p className="text-gray-600">
                Log every meaningful meeting and decision with AI-powered summaries.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card text-center"
            >
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Insights</h3>
              <p className="text-gray-600">
                Gamified performance tracking with reputation badges and response ratings.
              </p>
            </motion.div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary-600 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to transform your team coordination?
            </h2>
            <p className="text-primary-100 mb-8 text-lg">
              Join Product Managers who are already using Tether to streamline their workflows.
            </p>
            {!user && (
              <button className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200" onClick={() => router.push('/onboarding')}>
                Get Started Free
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">🎯 Tether</h3>
            <p className="text-gray-400 mb-6">
              Purpose-driven team coordination platform
            </p>
            <div className="text-gray-500 text-sm">
              © 2024 Tether. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
} 