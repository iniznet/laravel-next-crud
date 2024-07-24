// client/app/(main)/layout.tsx
'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '../../contexts/AuthContext'; // Adjust the import path as needed

interface AppLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/auth');
        }
    }, [loading, isAuthenticated, router]);

    if (loading) return <div>Loading...</div>;

    return <>{children}</>;
};

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <AuthProvider>
            <DashboardLayout>{children}</DashboardLayout>
        </AuthProvider>
    );
}
