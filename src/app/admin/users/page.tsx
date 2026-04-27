"use client";

import React, { useState } from "react";
import api from "@/lib/api";
import { UserPlus, Shield, User as UserIcon } from "lucide-react";

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

export default function AdminUsersPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'staff'
    });
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    React.useEffect(() => {
        fetchUsers();
    }, []);

    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/users', formData);
            setMessage({ type: 'success', text: 'User created successfully!' });
            setFormData({ name: '', email: '', password: '', role: 'staff' });
            fetchUsers();
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || err.response?.data?.error || 'Failed to create user'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-[#1a1c1e] p-6 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-opacity opacity-50 group-hover:opacity-100" />
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <UsersIcon />
                        User Management
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Create and manage internal system users.</p>
                </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 shadow-xl">
                <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-primary" />
                    Create New User
                </h2>

                {message.text && (
                    <div className={`p-4 rounded-lg text-sm mb-6 ${message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white"
                                placeholder="E.g. John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white"
                                placeholder="john@ceyntics.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Password</label>
                            <input
                                type="text"
                                required
                                minLength={8}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-white"
                                placeholder="At least 8 characters"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">System Role</label>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${formData.role === 'staff' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="staff"
                                        className="hidden"
                                        checked={formData.role === 'staff'}
                                        onChange={(e) => setFormData({ ...formData, role: 'staff' })}
                                    />
                                    <UserIcon className="w-4 h-4 mr-2" />
                                    Staff
                                </label>
                                <label className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${formData.role === 'admin' ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="admin"
                                        className="hidden"
                                        checked={formData.role === 'admin'}
                                        onChange={(e) => setFormData({ ...formData, role: 'admin' })}
                                    />
                                    <Shield className="w-4 h-4 mr-2" />
                                    Admin
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Create User
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <div className="glass-card p-6 rounded-2xl border border-white/5 shadow-xl">
                <h2 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                    <UsersIcon />
                    Registered Users
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase text-gray-300">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3 rounded-tr-lg">Joined At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-6 text-muted-foreground">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : (
                                users.map(u => (
                                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-medium text-white">{u.name}</td>
                                        <td className="px-4 py-3">{u.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{new Date(u.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

