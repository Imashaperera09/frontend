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
        id: number;
        name: string;
        code: string;
    }
}

interface Item {
    id: number;
    name: string;
    code: string;
    quantity: number;
}

export default function BorrowingsPage() {
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        item_id: '',
        borrower_name: '',
        contact_details: '',
        borrow_date: new Date().toISOString().split('T')[0],
        expected_return_date: '',
        quantity: 1
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [borrowingsRes, itemsRes] = await Promise.all([
                    api.get('/borrowings'),
                    api.get('/items')
                ]);
                setBorrowings(borrowingsRes.data);
                // Filter items that have stock
                setItems(itemsRes.data.filter((i: Item) => i.quantity > 0));
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/borrow', formData);
            const response = await api.get('/borrowings');
            setBorrowings(response.data);
            setShowModal(false);
            setFormData({
                item_id: '',
                borrower_name: '',
                contact_details: '',
                borrow_date: new Date().toISOString().split('T')[0],
                expected_return_date: '',
                quantity: 1
            });
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create borrowing');
            console.error(err);
        }
    };

    const handleReturn = async (id: number) => {
        if (!window.confirm('Are you sure you want to mark this item as returned?')) return;
        try {
            await api.post(`/return/${id}`);
            const response = await api.get('/borrowings');
            setBorrowings(response.data);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to mark as returned');
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Borrowings Management</h1>
                    <p className="text-muted-foreground">Track items currently assigned to staff and handle returns.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
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
                                {borrowing.status === 'Active' && (
                                    <button
                                        onClick={() => handleReturn(borrowing.id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-2 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-all"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Mark as Returned
                                    </button>
                                )}
                                <button className="px-4 py-2 bg-white/5 rounded-lg text-sm font-bold hover:bg-white/10 transition-all">
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* New Borrowing Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
                    <div className="glass-card w-full max-w-lg p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-300 my-8">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ArrowLeftRight className="w-5 h-5 text-primary" />
                                Create New Borrowing
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-white transition-colors">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Item to Borrow</label>
                                <select
                                    required
                                    value={formData.item_id}
                                    onChange={(e) => setFormData({ ...formData, item_id: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none text-white"
                                >
                                    <option value="" className="bg-[#1a1c1e]">Select an item...</option>
                                    {items.map(item => (
                                        <option key={item.id} value={item.id} className="bg-[#1a1c1e]">
                                            {item.name} ({item.code}) - {item.quantity} available
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">Borrower Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.borrower_name}
                                        onChange={(e) => setFormData({ ...formData, borrower_name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">Contact Details</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.contact_details}
                                        onChange={(e) => setFormData({ ...formData, contact_details: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white"
                                        placeholder="Phone or Email"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">Borrow Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.borrow_date}
                                        onChange={(e) => setFormData({ ...formData, borrow_date: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white custom-date-input"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">Expected Return</label>
                                    <input
                                        required
                                        type="date"
                                        min={formData.borrow_date}
                                        value={formData.expected_return_date}
                                        onChange={(e) => setFormData({ ...formData, expected_return_date: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white custom-date-input"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Quantity</label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white"
                                />
                            </div>

                            <div className="pt-4 flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-[2] px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                                    Confirm Borrowing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
