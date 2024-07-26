'use client';

import { AuthProvider } from '../../contexts/AuthContext';
import Layout from '@/layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return <AuthProvider>
        <Layout>{children}</Layout>
    </AuthProvider>;
}