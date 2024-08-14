'use client';

import QueueAdmin from '@/app/components/QueueAdmin';
import React from 'react';

const AdminQueuePage: React.FC = () => {
    return (
        <div className="container">
            <h1>Queue Management (Admin)</h1>
            <QueueAdmin />
        </div>
    );
};

export default AdminQueuePage;
