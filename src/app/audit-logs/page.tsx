"use client";

import React, { useEffect, useState } from 'react';
import {
    History,
    Search,
    Filter,
    Download,
    AlertCircle,
    CheckCircle2,
    Package,
    User,
    Clock,
    Loader2
} from 'lucide-react';
import api from '@/lib/api';

interface AuditLog {
    id: number;
    action: string;
    entity_type: string;
    entity_id: number;
    user?: {
        name: string;
    };
    created_at: string;
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await api.get('/audit-logs');
                setLogs(response.data);
            } catch (error) {
                console.error('Failed to fetch audit logs', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                    <p className="text-muted-foreground">Track all system activities, changes and user actions.</p>
                </div>
                <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-secondary/80 transition-all border border-white/5">
                    <Download className="w-4 h-4" />
                    Export Logs
                </button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search logs by action, user or entity..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-all">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p>Loading system logs...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                        <History className="w-12 h-12 opacity-20" />
                        <p>No activity logs found yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {logs.map((log) => (
                            <div key={log.id} className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${log.action.includes('Created') ? 'bg-emerald-500/10 text-emerald-500' :
                                            log.action.includes('Updated') ? 'bg-primary/10 text-primary' :
                                                'bg-destructive/10 text-destructive'
                                        }`}>
                                        {log.action.includes('Created') ? <CheckCircle2 className="w-6 h-6" /> :
                                            log.action.includes('Updated') ? <AlertCircle className="w-6 h-6" /> :
                                                <History className="w-6 h-6" />}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm">{log.action}</span>
                                            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground border border-white/5">
                                                {log.entity_type}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <User className="w-3 h-3" /> {log.user?.name || 'System'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {new Date(log.created_at).toLocaleString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Package className="w-3 h-3" /> ID: #{log.entity_id}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all hover:underline">
                                    View Changes
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
