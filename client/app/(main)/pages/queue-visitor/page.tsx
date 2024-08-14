'use client';

import QueueVisitor from '@/app/components/QueueVisitor';
import React from 'react';

const VisitorQueuePage: React.FC = () => {
    return (
        <div className="container">
            <h1>Queue</h1>
            <QueueVisitor />
        </div>
    );
};

export default VisitorQueuePage;
