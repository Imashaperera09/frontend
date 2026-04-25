"use client";

import React, { useEffect, useState } from 'react';
import {
    MapPin,
    Search,
    Plus,
    Filter,
    Edit,
    Trash2,
    ExternalLink,
    ChevronRight,
    Database,
    Loader2
} from 'lucide-react';
import api from '@/lib/api';

interface Place {
    id: number;
    name: string;
    cupboard?: {
        name: string;
        location: string;
    }
}

export default function PlacesPage() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await api.get('/places');
                setPlaces(response.data);
            } catch (err) {
                setError('Failed to fetch places');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this place? This will also delete all items assigned to it.')) return;

        try {
            await api.delete(`/places/${id}`);
            setPlaces(places.filter(p => p.id !== id));
        } catch (err) {
            alert('Failed to delete place');
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Storage Management</h1>
                    <p className="text-muted-foreground">Manage your physical storage locations, cupboards and shelves.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-secondary/80 transition-all border border-white/5">
                        <Plus className="w-4 h-4" />
                        Add Cupboard
                    </button>
                    <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" />
                        Add Shelf/Place
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search storage locations or shelves..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-all">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p>Loading storage sites...</p>
                </div>
            ) : places.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground glass-card">
                    <MapPin className="w-12 h-12 opacity-20" />
                    <p>No storage locations found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {places.map((place) => (
                        <div key={place.id} className="glass-card p-6 flex flex-col gap-6 group hover:bg-white/[0.04] transition-all cursor-default">
                            <div className="flex items-start justify-between">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                    <button title="Edit" className="p-2 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(place.id)}
                                        title="Delete"
                                        className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{place.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Database className="w-3 h-3" />
                                        <span>{place.cupboard?.name || 'No Cupboard'}</span>
                                        <ChevronRight className="w-3 h-3" />
                                        <span>{place.cupboard?.location || 'Unknown'}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
                                                P{i + 1}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                                        Manage Items <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
