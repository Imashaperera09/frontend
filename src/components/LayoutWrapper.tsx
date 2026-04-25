import React from 'react';
import Sidebar from './Sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 flex flex-col">
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 glass-card sticky top-0 z-10 rounded-none border-t-0 border-l-0 border-r-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-medium text-muted-foreground">Welcome back, <span className="text-white">Admin</span></h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary text-xs font-bold">
                            AD
                        </div>
                    </div>
                </header>
                <div className="p-8 flex-1 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
