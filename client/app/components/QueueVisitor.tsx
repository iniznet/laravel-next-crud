'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { QueueAPI } from '@/apis/QueueApi';
import echoClient from '@/lib/Echo';
import { Queue, QueueState } from '@/types/queue';

const QueueVisitor: React.FC = () => {
    const [queues, setQueues] = useState<Queue[]>([]);
    const [active, setActive] = useState<Queue | null>(null);
    const [currentTime, setCurrentTime] = useState<string>('');

    const formatDate = (date: Date) => {
        return date.toLocaleString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const fetchQueueStatus = async () => {
        try {
            const response = await QueueAPI.status();
            setQueues(response.queues);
            setActive(response.active);
        } catch (error) {
            console.error('Error fetching queue status:', error);
        }
    };


    const handleQueueUpdate = (event: any) => {
        console.log('Raw event data received:', event.data);
        const updatedQueues = event.data;

        setQueues(prevQueues =>
            prevQueues.map(queue =>
                updatedQueues.find((updatedQueue: Queue) => updatedQueue.id === queue.id) || queue
            )
        );
    };

    const handleActiveUpdate = (event: any) => {
        console.log('Active queue update event received:', event.data);
        setActive(prevActive => ({ ...prevActive, ...event.data }));
    };

    useEffect(() => {
        fetchQueueStatus();

        echoClient
            .channel('queue')
            .listen('queueUpdate', handleQueueUpdate);
        echoClient
            .channel('queue')
            .listen('activeUpdate', handleActiveUpdate);

        const updateTime = () => {
            setCurrentTime(formatDate(new Date()));
        };

        updateTime();
        const timer = setInterval(updateTime, 1000);

        return () => {
            clearInterval(timer);
            echoClient.leaveChannel('queue');
        };
    }, []);

    const padNumber = (number: number | undefined) => {
        if (number === null || number === undefined) {
            return 'A000';
        }

        return 'A' + number.toString().padStart(3, '0');
    };

    return (
        <div className="grid">
            <div className="col-12 mb-4">
                <div className="surface-card p-4 shadow-2 border-round text-center">
                    <h2 className="">Now Serving</h2>
                    <div className="text-3xl font-bold mb-0">{active?.name}</div>
                    <div className="text-5xl font-bold">{padNumber(active?.number)}</div>
                    <p className="">{currentTime}</p>
                </div>
            </div>
            {queues
                .filter((queue) => queue.state === 'waiting')
                .map((queue) => (
                    <div key={queue.id} className="col-12 md:col-6 lg:col-3">
                        <div className="surface-card p-4 shadow-2 border-round">
                            <h3 className="mb-3">{queue.name}</h3>
                            <div className="text-3xl font-bold">{padNumber(queue.number)}</div>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default QueueVisitor;