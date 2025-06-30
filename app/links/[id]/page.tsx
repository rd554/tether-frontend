'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Users, CheckCircle, AlertCircle, MessageSquare, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { apiClient } from '@/lib/api';
import { LINK_STATUS, MEETING_TYPES } from '@/shared/constants';

export default function LinkDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [link, setLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLink = async () => {
      if (!params?.id || Array.isArray(params.id)) return;
      
      try {
        setLoading(true);
        const linkData = await apiClient.getLink(params.id as string);
        setLink(linkData);
      } catch (err) {
        setError('Failed to load link details');
        console.error('Error fetching link:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [params?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case LINK_STATUS.COMPLETED:
        return 'text-success-600 bg-success-50';
      case LINK_STATUS.IN_PROGRESS:
        return 'text-primary-600 bg-primary-50';
      case LINK_STATUS.SCHEDULED:
        return 'text-warning-600 bg-warning-50';
      case LINK_STATUS.PENDING:
        return 'text-gray-600 bg-gray-50';
      case LINK_STATUS.CANCELLED:
        return 'text-error-600 bg-error-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case LINK_STATUS.COMPLETED:
        return <CheckCircle className="h-4 w-4" />;
      case LINK_STATUS.IN_PROGRESS:
        return <Clock className="h-4 w-4" />;
      case LINK_STATUS.SCHEDULED:
        return <Calendar className="h-4 w-4" />;
      case LINK_STATUS.CANCELLED:
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case MEETING_TYPES.QUICK_SYNC:
        return 'bg-blue-100 text-blue-800';
      case MEETING_TYPES.REVIEW:
        return 'bg-purple-100 text-purple-800';
      case MEETING_TYPES.PLANNING:
        return 'bg-green-100 text-green-800';
      case MEETING_TYPES.DECISION:
        return 'bg-orange-100 text-orange-800';
      case MEETING_TYPES.BRAINSTORM:
        return 'bg-pink-100 text-pink-800';
      case MEETING_TYPES.STATUS_UPDATE:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading link details...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Link</h2>
          <p className="text-gray-600 mb-4">{error || 'Link not found'}</p>
          <button 
            onClick={() => router.back()}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">{link.title}</h1>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(link.status)}`}>
                  {getStatusIcon(link.status)}
                  <span className="ml-1">{link.status.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Purpose */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Purpose</h2>
          <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{link.purpose}</p>
        </div>

        {/* Meeting Details */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Meeting Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMeetingTypeColor(link.meetingType)}`}>
                  {link.meetingType.replace('_', ' ')}
                </div>
                {link.priority && (
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    link.priority === 'HIGH' ? 'bg-error-100 text-error-800' :
                    link.priority === 'MEDIUM' ? 'bg-warning-100 text-warning-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {link.priority}
                  </div>
                )}
              </div>
              
              {link.scheduledAt && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Scheduled: {format(new Date(link.scheduledAt), 'PPP p')}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Created: {format(new Date(link.createdAt), 'PPP p')}</span>
              </div>
            </div>

            {/* Participants */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Participants</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{link.participants?.length || 0} participants</span>
                </div>
                
                {link.participants && link.participants.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {link.participants.map((participant: any, index: number) => (
                      <div key={participant.userId._id || index} className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                        <img
                          src={participant.userId.avatar || '/default-avatar.png'}
                          alt={participant.userId.firstName}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="text-sm text-gray-700">
                          {participant.userId.firstName} {participant.userId.lastName}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        {link.aiSummary?.content && (
          <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Summary</h2>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{link.aiSummary.content}</p>
              </div>
            </div>
          </div>
        )}

        {/* Outcomes */}
        {link.outcomes && link.outcomes.length > 0 && (
          <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Outcomes</h2>
            <div className="space-y-2">
              {link.outcomes.map((outcome: any, index: number) => (
                <div key={index} className="flex items-start space-x-2 bg-gray-50 rounded-lg p-3">
                  <CheckCircle className="h-4 w-4 text-success-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {link.notes && (
          <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{link.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {link.status === LINK_STATUS.PENDING && (
                <button className="btn-primary">
                  Start Meeting
                </button>
              )}
              
              {link.status === LINK_STATUS.IN_PROGRESS && (
                <button className="btn-success">
                  Complete Meeting
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {link.outcomes && link.outcomes.length > 0 && (
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>{link.outcomes.length} outcomes</span>
                </div>
              )}
              
              {link.notes && (
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Has notes</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 