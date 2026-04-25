"use client";

import React, { useEffect, useState } from 'react';
import {
    Package,
    Search,
    Plus,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    ExternalLink,
    Loader2
} from 'lucide-react';
import api from '@/lib/api';

interface Item {
    id: number;
    name: string;
    code: string;
    quantity: number;
    status: string;
    category?: string;
    place?: {
        name: string;
        cupboard?: {
            name: string;
        }
    }
}

export default function ItemsPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await api.get('/items');
                setItems(response.data);
            } catch (err) {
                setError('Failed to fetch items');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [places, setPlaces] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        quantity: 0,
        place_id: '',
        status: 'In-Store'
    });

    useEffect(() => {
        if (showModal) {
            api.get('/places').then(res => setPlaces(res.data)).catch(console.error);
        }
    }, [showModal]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/items', formData);
            setItems([...items, response.data.item]);
            setShowModal(false);
            setFormData({
                name: '',
                code: '',
                quantity: 0,
                place_id: '',
                status: 'In-Store'
            });
        } catch (err) {
            alert('Failed to add item. Please check the inputs.');
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            await api.delete(`/items/${id}`);
            setItems(items.filter(item => item.id !== id));
        } catch (err) {
            alert('Failed to delete item');
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Items Management</h1>
                    <p className="text-muted-foreground">Manage your inventory items, stock levels and locations.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Add New Item
                </button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search items by name, SKU or category..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-all">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p>Fetching inventory items...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-destructive">
                            <p>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="text-sm bg-destructive/10 px-4 py-2 rounded-lg hover:bg-destructive/20 transition-all"
                            >
                                Retry
                            </button>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                            <Package className="w-12 h-12 opacity-20" />
                            <p>No items found in the database.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Item Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                                                    <Package className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">{item.code}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{item.category || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{item.place?.name || 'Unknown'}</span>
                                                <span className="text-[10px] text-muted-foreground">{item.place?.cupboard?.name || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold">{item.quantity}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold ${item.status === 'In-Store'
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : item.status === 'Borrowed'
                                                    ? 'bg-primary/10 text-primary'
                                                    : 'bg-destructive/10 text-destructive'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button title="Edit" className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    title="Delete"
                                                    className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button title="View Details" className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-primary transition-colors">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-muted-foreground">
                    <p>Showing {items.length} items</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* Add Item Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="glass-card w-full max-w-lg p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h2 className="text-xl font-bold">Add New Item</h2>
                            <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-white transition-colors">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">Item Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Test Laptop"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">Item Code</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                        placeholder="e.g. ITM-001"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">Quantity</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        value={formData.quantity || ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setFormData({ ...formData, quantity: val === '' ? 0 : parseInt(val) });
                                        }}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                                    >
                                        <option value="In-Store" className="bg-[#1a1c1e] text-white">In-Store</option>
                                        <option value="Borrowed" className="bg-[#1a1c1e] text-white">Borrowed</option>
                                        <option value="Damaged" className="bg-[#1a1c1e] text-white">Damaged</option>
                                        <option value="Missing" className="bg-[#1a1c1e] text-white">Missing</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase">Storage Location (Shelf/Place)</label>
                                <select
                                    required
                                    value={formData.place_id}
                                    onChange={(e) => setFormData({ ...formData, place_id: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                                >
                                    <option value="">Select a location...</option>
                                    {places.map(p => (
                                        <option key={p.id} value={p.id}>{p.cupboard?.name} - {p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-3 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                >
                                    Save Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
