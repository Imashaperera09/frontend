"use client";

import React, { useEffect, useState } from 'react';
import {
    ArrowLeftRight,
    Search,
    Plus,
    Filter,
    CheckCircle2,
    Clock,
    User,
    Package,
    Loader2
} from 'lucide-react';
import api from '@/lib/api';

interface Borrowing {
    id: number;
    borrower_name: string;
    borrow_date: string;
    expected_return_date: string;
    returned_date: string | null;
    status: string;
    item: {
        name: string;
        code: string;
    }
}

export default function BorrowingsPage() {
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBorrowings = async () => {
            try {
                const response = await api.get('/borrowings');
                setBorrowings(response.data);
            } catch (error) {
                console.error('Failed to fetch borrowings', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBorrowings();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Borrowings Management</h1>
                    <p className="text-muted-foreground">Track items currently assigned to staff and handle returns.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    New Borrowing
                </button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search borrowings by borrower name or item..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl text-xs font-bold text-primary uppercase tracking-wider">Active</button>
                    <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-muted-foreground uppercase tracking-wider hover:bg-white/10 transition-all">Returned</button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p>Loading borrowings...</p>
                </div>
            ) : borrowings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground glass-card">
                    <ArrowLeftRight className="w-12 h-12 opacity-20" />
                    <p>No active borrowings found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {borrowings.map((borrowing) => (
                        <div key={borrowing.id} className="glass-card p-6 flex flex-col gap-6 group hover:bg-white/[0.04] transition-all">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                                        <User className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">{borrowing.borrower_name}</h3>
                                        <p className="text-xs text-muted-foreground">Department: General</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${borrowing.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-emerald-500/10 text-emerald-500'
                                    }`}>
                                    {borrowing.status}
                                </span>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white/5">
                                        <Package className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{borrowing.item.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{borrowing.item.code}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Qty</p>
                                    <p className="text-sm font-bold">1</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Borrowed On
                                    </p>
                                    <p className="text-xs font-semibold">{borrowing.borrow_date}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Expected Return
                                    </p>
                                    <p className="text-xs font-semibold text-primary">{borrowing.expected_return_date}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                                <button className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-all">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Mark as Returned
                                </button>
                                <button className="px-4 py-2 bg-white/5 rounded-lg text-sm font-bold hover:bg-white/10 transition-all">
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
