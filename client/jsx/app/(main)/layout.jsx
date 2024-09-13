'use client';
import { AuthProvider } from '../../contexts/AuthContext';
import Layout from '@/layout/layout';
export default function AppLayout({ children }) {
    return <AuthProvider>
        <Layout>{children}</Layout>
    </AuthProvider>;
}
