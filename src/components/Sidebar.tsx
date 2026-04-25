import React from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    Package,
    MapPin,
    History,
    ArrowLeftRight,
    Settings,
    LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Package, label: 'Items', href: '/items' },
    { icon: MapPin, label: 'Places', href: '/places' },
    { icon: ArrowLeftRight, label: 'Borrowings', href: '/borrowings' },
    { icon: History, label: 'Audit Logs', href: '/audit-logs' },
];

export default function Sidebar() {
    return (
        <aside className="w-64 sidebar-gradient border-r border-white/5 h-screen sticky top-0 flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold gold-gradient-text uppercase tracking-wider">
                    Ceyntics
                </h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">
                    Inventory System
                </p>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
                            "text-muted-foreground hover:text-primary hover:bg-white/5 group"
                        )}
                    >
                        <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-2">
                <button className="flex items-center gap-3 px-4 py-3 w-full text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </button>
                <button className="flex items-center gap-3 px-4 py-3 w-full text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-all">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
