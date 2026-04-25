"use client";

import React, { useEffect, useState } from 'react';
import {
  Package,
  ArrowLeftRight,
  MapPin,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';

interface Stat {
  label: string;
  value: string;
  icon: string;
  trend: string;
  trendUp: boolean;
  color?: string;
}

interface Movement {
  item: string;
  borrower: string;
  time: string;
  status: string;
  type: string;
}

const iconMap = {
  Package,
  ArrowLeftRight,
  MapPin,
  AlertCircle,
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentMovements, setRecentMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data.stats);
        setRecentMovements(response.data.recentMovements);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground animate-in fade-in duration-500">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-lg font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your inventory today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = iconMap[stat.icon as keyof typeof iconMap] || Package;
          return (
            <div key={i} className="glass-card p-6 flex flex-col gap-4 group hover:bg-white/[0.05] transition-all cursor-default">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? 'text-emerald-500' : 'text-primary'}`}>
                  {stat.trend}
                  {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color || ''}`}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="glass-card flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Movements
            </h2>
            <button className="text-xs text-primary hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {recentMovements.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">
                <p>No recent movements recorded.</p>
              </div>
            ) : (
              recentMovements.map((item, i) => (
                <div key={i} className="p-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${item.type === 'BO' ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                      {item.type}
                    </div>
                    <div>
                      <p className="text-sm font-semibold group-hover:text-primary transition-colors">{item.item}</p>
                      <p className="text-xs text-muted-foreground">{item.borrower} • {item.time}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${item.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions / Summary */}
        <div className="glass-card p-6 space-y-6">
          <h2 className="text-lg font-semibold">Inventory Distribution</h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Live distribution of items across storage sites.</p>
            <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
              <div className="text-center space-y-2">
                <MapPin className="w-8 h-8 mx-auto opacity-20" />
                <p className="text-xs uppercase tracking-widest font-bold opacity-50">Distribution Chart Placeholder</p>
                <p className="text-[10px]">Real chart will be integrated in next update</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
