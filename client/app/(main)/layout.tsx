'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '../../contexts/AuthContext'; // Adjust the import path as needed
import Layout from '@/layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return <AuthProvider>
        <Layout>{children}</Layout>
    </AuthProvider>;
}