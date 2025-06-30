'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'primary' | 'success' | 'warning' | 'error' | 'info';
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  trendDirection = 'neutral' 
}: StatsCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary-50',
          icon: 'text-primary-600',
          value: 'text-primary-900'
        };
      case 'success':
        return {
          bg: 'bg-success-50',
          icon: 'text-success-600',
          value: 'text-success-900'
        };
      case 'warning':
        return {
          bg: 'bg-warning-50',
          icon: 'text-warning-600',
          value: 'text-warning-900'
        };
      case 'error':
        return {
          bg: 'bg-error-50',
          icon: 'text-error-600',
          value: 'text-error-900'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          icon: 'text-blue-600',
          value: 'text-blue-900'
        };
      default:
        return {
          bg: 'bg-gray-50',
          icon: 'text-gray-600',
          value: 'text-gray-900'
        };
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-error-600" />;
      default:
        return null;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-success-600';
      case 'down':
        return 'text-error-600';
      default:
        return 'text-gray-600';
    }
  };

  const colors = getColorClasses(color);

  return (
    <div className={`${colors.bg} rounded-xl p-6 border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${colors.value}`}>{value}</p>
          {trend && (
            <div className={`flex items-center space-x-1 mt-2 text-sm ${getTrendColor(trendDirection)}`}>
              {getTrendIcon(trendDirection)}
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-white ${colors.icon}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
} 