'use client';

import React from 'react';
import { 
  Users, 
  Building2, 
  Briefcase,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function InternalDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: Just now</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Clients"
          value="28"
          change="+12%"
          trend="up"
          icon={Briefcase}
        />
        <StatCard 
          title="Active Businesses"
          value="156"
          change="+8%"
          trend="up"
          icon={Building2}
        />
        <StatCard 
          title="Registered Users"
          value="1,204"
          change="-3%"
          trend="down"
          icon={Users}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { user: 'John Smith', action: 'created a new business', time: '2 hours ago' },
            { user: 'Sarah Wilson', action: 'updated client details', time: '4 hours ago' },
            { user: 'Mike Johnson', action: 'added new user', time: '6 hours ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <span className="font-medium text-gray-900">{activity.user}</span>
                <span className="text-gray-500"> {activity.action}</span>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
}

function StatCard({ title, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-2">{value}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <Icon className="w-6 h-6 text-gray-400" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {trend === 'up' ? (
          <ArrowUpRight className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-500" />
        )}
        <span className={`ml-1 text-sm font-medium ${
          trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {change}
        </span>
      </div>
    </div>
  );
}
